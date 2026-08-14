import { t as sql } from "./dist_D4nVBoqy.mjs";
import { b as validateIdentifier, c as resolveConfiguredLocale, h as isSqlite, o as getI18nConfig, s as isI18nEnabled, x as validatePluginIdentifier } from "./runner-BsI18UgP_DY3LBvkk.mjs";
import { o as invalidateCollectionCache } from "./object-cache-Bok5j2ae_D6Qn5mkk.mjs";
import { i as encodeBase64, t as decodeBase64 } from "./base64-B-PsqheR_CqpGr57O.mjs";
import { n as InvalidCursorError, r as ScheduledNotDueError, t as EmDashValidationError } from "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { t as CommentRepository } from "./comment-DnTxxVHv__NAQiWHX.mjs";
import { t as OptionsRepository } from "./options-BlmBHTvX_UAvxM4cG.mjs";
import { t as chunks } from "./chunks-D5dlPeRb_ZNPg27dD.mjs";
import { n as isMissingTableError, t as isMissingColumnError } from "./db-errors-CcWLaRiR_Bz5UsdxN.mjs";
import { n as RevisionRepository, t as ContentRepository } from "./content-CpfKV9QE_DeIsRghk.mjs";
import { t as MediaRepository } from "./media-tQDZEdu7_D9hYcuMC.mjs";
import { t as UserRepository } from "./user-BAumEmpA_79fxFfjA.mjs";
import { t as TaxonomyRepository } from "./taxonomy-DvwWAPvA_9icPwnll.mjs";
import { t as withTransaction } from "./transaction-D0FOsb3X_huCh3mhl.mjs";
import { i as matchesMimeAllowlist, o as parseAllowedMimeTypes } from "./hash-Cb7U1b5M_CHUcNDr6.mjs";
import { r as requestCached } from "./request-cache-BSUptuJR_D0VqgZlt.mjs";
import "./loader-C1XOLV5b_C3i6HyEe.mjs";
import { n as resolveAndValidateExternalUrl, t as SsrfError } from "./ssrf-CviKqWmq_Bm-KV_Vo.mjs";
import { a as reconcileManifestAccess, i as pluginManifestSchema, o as declaredAccessToCapabilities, r as normalizeManifestRoute, s as normalizeCapabilities } from "./manifest-schema-bCq54i7F_oDiktgui.mjs";
import { t as RedirectRepository } from "./redirect-BJ6d1yHh_Bhxbmzv-.mjs";
import { t as BylineRepository } from "./byline-C5TAqs8N_UXuC5WkK.mjs";
import { t as FTSManager } from "./fts-manager-vncsZIJm_B2PuZ3wM.mjs";
import { d as invalidateTermCache } from "./taxonomies-B61CRSha_D_3qZCRf.mjs";
import { r as invalidateRedirectCache } from "./cache-B26cufFd_FubCBUTM.mjs";
import { t as ErrorCode } from "./errors-DtEXIQQV_DXdZZdDL.mjs";
import { n as SchemaRegistry, t as SchemaError } from "./registry-BP1JK2xh_C4nDpLUe.mjs";
import { t as PluginStateRepository } from "./state-xxv6ZTMv_CY4fwMam.mjs";
import { n as ClientResponseError, r as ClientValidationError } from "./client_DNyJW6Ij.mjs";
//#region self-essentials/emdash-main/packages/core/dist/seo-BAPKiED8.mjs
/** Default SEO values for content without an explicit SEO row */
var SEO_DEFAULTS$1 = {
	title: null,
	description: null,
	image: null,
	canonical: null,
	noIndex: false
};
/**
* Returns true if the input has at least one explicitly-set SEO field.
* Used to skip no-op upserts when callers pass `{ seo: {} }`.
*/
function hasAnyField(input) {
	return input.title !== void 0 || input.description !== void 0 || input.image !== void 0 || input.canonical !== void 0 || input.noIndex !== void 0;
}
/**
* Repository for SEO metadata stored in `_emdash_seo`.
*
* SEO data lives in a separate table keyed by (collection, content_id).
* Only collections with `has_seo = 1` should use this — callers are
* responsible for checking the flag before reading/writing.
*/
var SeoRepository = class {
	constructor(db) {
		this.db = db;
	}
	/**
	* Check whether a collection has SEO enabled (`has_seo = 1`).
	* Returns `false` if the collection does not exist.
	*/
	async isEnabled(collection) {
		return (await this.db.selectFrom("_emdash_collections").select("has_seo").where("slug", "=", collection).executeTakeFirst())?.has_seo === 1;
	}
	/**
	* Get SEO data for a content item. Returns null defaults if no row exists.
	*/
	async get(collection, contentId) {
		const row = await this.db.selectFrom("_emdash_seo").selectAll().where("collection", "=", collection).where("content_id", "=", contentId).executeTakeFirst();
		if (!row) return { ...SEO_DEFAULTS$1 };
		return {
			title: row.seo_title ?? null,
			description: row.seo_description ?? null,
			image: row.seo_image ?? null,
			canonical: row.seo_canonical ?? null,
			noIndex: row.seo_no_index === 1
		};
	}
	/**
	* Get SEO data for multiple content items.
	* Returns a Map keyed by content_id. Items without SEO rows get defaults.
	*
	* Chunks the `content_id IN (…)` clause so the total bound-parameter count
	* per statement (ids + the `collection = ?` filter) stays within Cloudflare
	* D1's 100-variable limit regardless of how many content items are passed.
	*/
	async getMany(collection, contentIds) {
		const result = /* @__PURE__ */ new Map();
		if (contentIds.length === 0) return result;
		for (const id of contentIds) result.set(id, { ...SEO_DEFAULTS$1 });
		const uniqueContentIds = [...new Set(contentIds)];
		for (const chunk of chunks(uniqueContentIds, 50)) {
			const rows = await this.db.selectFrom("_emdash_seo").selectAll().where("collection", "=", collection).where("content_id", "in", chunk).execute();
			for (const row of rows) result.set(row.content_id, {
				title: row.seo_title ?? null,
				description: row.seo_description ?? null,
				image: row.seo_image ?? null,
				canonical: row.seo_canonical ?? null,
				noIndex: row.seo_no_index === 1
			});
		}
		return result;
	}
	/**
	* Upsert SEO data for a content item using INSERT ON CONFLICT DO UPDATE
	* for atomicity. Skips no-op writes when input has no fields set.
	*/
	async upsert(collection, contentId, input) {
		if (!hasAnyField(input)) return this.get(collection, contentId);
		const now = (/* @__PURE__ */ new Date()).toISOString();
		await sql`
			INSERT INTO _emdash_seo (
				collection, content_id,
				seo_title, seo_description, seo_image, seo_canonical, seo_no_index,
				created_at, updated_at
			) VALUES (
				${collection}, ${contentId},
				${input.title ?? null}, ${input.description ?? null},
				${input.image ?? null}, ${input.canonical ?? null},
				${input.noIndex ? 1 : 0},
				${now}, ${now}
			)
			ON CONFLICT (collection, content_id) DO UPDATE SET
				seo_title = ${input.title !== void 0 ? sql`${input.title}` : sql`_emdash_seo.seo_title`},
				seo_description = ${input.description !== void 0 ? sql`${input.description}` : sql`_emdash_seo.seo_description`},
				seo_image = ${input.image !== void 0 ? sql`${input.image}` : sql`_emdash_seo.seo_image`},
				seo_canonical = ${input.canonical !== void 0 ? sql`${input.canonical}` : sql`_emdash_seo.seo_canonical`},
				seo_no_index = ${input.noIndex !== void 0 ? sql`${input.noIndex ? 1 : 0}` : sql`_emdash_seo.seo_no_index`},
				updated_at = ${now}
		`.execute(this.db);
		invalidateCollectionCache(collection);
		return this.get(collection, contentId);
	}
	/**
	* Delete SEO data for a content item.
	*/
	async delete(collection, contentId) {
		await this.db.deleteFrom("_emdash_seo").where("collection", "=", collection).where("content_id", "=", contentId).execute();
		invalidateCollectionCache(collection);
	}
	/**
	* Copy SEO data from one content item to another.
	* Used by duplicate. Clears canonical (it pointed to the original).
	*/
	async copyForDuplicate(collection, sourceId, targetId) {
		const source = await this.get(collection, sourceId);
		if (source.title !== null || source.description !== null || source.image !== null || source.noIndex) await this.upsert(collection, targetId, {
			title: source.title,
			description: source.description,
			image: source.image,
			canonical: null,
			noIndex: source.noIndex
		});
	}
};
//#endregion
//#region self-essentials/emdash-main/packages/core/dist/types-BD40g7zz.mjs
/**
* Storage error with additional context
*/
var EmDashStorageError = class extends Error {
	constructor(message, code, cause) {
		super(message);
		this.code = code;
		this.cause = cause;
		this.name = "EmDashStorageError";
	}
};
//#endregion
//#region node_modules/.pnpm/modern-tar@0.7.7/node_modules/modern-tar/dist/packer-BtsuoKCV.js
var FILE = "file";
var LINK = "link";
var SYMLINK = "symlink";
var DIRECTORY = "directory";
var FLAGTYPE = {
	"0": FILE,
	"1": LINK,
	"2": SYMLINK,
	"3": "character-device",
	"4": "block-device",
	"5": DIRECTORY,
	"6": "fifo",
	x: "pax-header",
	g: "pax-global-header",
	L: "gnu-long-name",
	K: "gnu-long-link-name"
};
var EMPTY = /* @__PURE__ */ new Uint8Array(0);
new TextEncoder();
var decoder = new TextDecoder();
function readString(view, offset, size) {
	const end = view.indexOf(0, offset);
	const sliceEnd = end === -1 || end > offset + size ? offset + size : end;
	return decoder.decode(view.subarray(offset, sliceEnd));
}
function readOctal(view, offset, size) {
	let value = 0;
	const end = offset + size;
	for (let i = offset; i < end; i++) {
		const charCode = view[i];
		if (charCode === 0) break;
		if (charCode === 32) continue;
		value = value * 8 + (charCode - 48);
	}
	return value;
}
function readNumeric(view, offset, size) {
	if (view[offset] & 128) {
		let result = 0;
		result = view[offset] & 127;
		for (let i = 1; i < size; i++) result = result * 256 + view[offset + i];
		if (!Number.isSafeInteger(result)) throw new Error("TAR number too large");
		return result;
	}
	return readOctal(view, offset, size);
}
var isBodyless = (header) => header.type === "directory" || header.type === "symlink" || header.type === "link" || header.type === "character-device" || header.type === "block-device" || header.type === "fifo";
var stripPath = (p, n) => {
	const parts = p.split("/").filter(Boolean);
	return n >= parts.length ? "" : parts.slice(n).join("/");
};
function transformHeader(header, options) {
	const { strip, filter, map } = options;
	if (!strip && !filter && !map) return header;
	const h = { ...header };
	if (strip && strip > 0) {
		const newName = stripPath(h.name, strip);
		if (!newName) return null;
		h.name = h.type === "directory" && !newName.endsWith("/") ? `${newName}/` : newName;
		if (h.linkname) {
			const isAbsolute = h.linkname.startsWith("/");
			if (isAbsolute || h.type === "link") {
				const stripped = stripPath(h.linkname, strip);
				h.linkname = isAbsolute ? `/${stripped}` || "/" : stripped;
			}
		}
	}
	if (filter?.(h) === false) return null;
	const result = map ? map(h) : h;
	if (result && (!result.name || !result.name.trim() || result.name === "." || result.name === "/")) return null;
	return result;
}
var INITIAL_CAPACITY = 256;
function createChunkQueue() {
	let chunks = new Array(INITIAL_CAPACITY);
	let capacityMask = chunks.length - 1;
	let head = 0;
	let tail = 0;
	let totalAvailable = 0;
	const consumeFromHead = (count) => {
		const chunk = chunks[head];
		if (count === chunk.length) {
			chunks[head] = EMPTY;
			head = head + 1 & capacityMask;
		} else chunks[head] = chunk.subarray(count);
		totalAvailable -= count;
		if (totalAvailable === 0 && chunks.length > INITIAL_CAPACITY) {
			chunks = new Array(INITIAL_CAPACITY);
			capacityMask = 255;
			head = 0;
			tail = 0;
		}
	};
	function pull(bytes, callback) {
		if (callback) {
			let fed = 0;
			let remaining = Math.min(bytes, totalAvailable);
			while (remaining > 0) {
				const chunk = chunks[head];
				const toFeed = Math.min(remaining, chunk.length);
				const segment = toFeed === chunk.length ? chunk : chunk.subarray(0, toFeed);
				consumeFromHead(toFeed);
				remaining -= toFeed;
				fed += toFeed;
				if (!callback(segment)) break;
			}
			return fed;
		}
		if (totalAvailable < bytes) return null;
		if (bytes === 0) return EMPTY;
		const firstChunk = chunks[head];
		if (firstChunk.length >= bytes) {
			const view = firstChunk.length === bytes ? firstChunk : firstChunk.subarray(0, bytes);
			consumeFromHead(bytes);
			return view;
		}
		const result = new Uint8Array(bytes);
		let copied = 0;
		let remaining = bytes;
		while (remaining > 0) {
			const chunk = chunks[head];
			const toCopy = Math.min(remaining, chunk.length);
			result.set(toCopy === chunk.length ? chunk : chunk.subarray(0, toCopy), copied);
			copied += toCopy;
			remaining -= toCopy;
			consumeFromHead(toCopy);
		}
		return result;
	}
	return {
		push: (chunk) => {
			if (chunk.length === 0) return;
			let nextTail = tail + 1 & capacityMask;
			if (nextTail === head) {
				const oldLen = chunks.length;
				const newLen = oldLen * 2;
				const newChunks = new Array(newLen);
				const count = tail - head + oldLen & oldLen - 1;
				if (head < tail) for (let i = 0; i < count; i++) newChunks[i] = chunks[head + i];
				else if (count > 0) {
					const firstPart = oldLen - head;
					for (let i = 0; i < firstPart; i++) newChunks[i] = chunks[head + i];
					for (let i = 0; i < tail; i++) newChunks[firstPart + i] = chunks[i];
				}
				chunks = newChunks;
				capacityMask = newLen - 1;
				head = 0;
				tail = count;
				nextTail = tail + 1 & capacityMask;
			}
			chunks[tail] = chunk;
			tail = nextTail;
			totalAvailable += chunk.length;
		},
		available: () => totalAvailable,
		peek: (bytes) => {
			if (totalAvailable < bytes) return null;
			if (bytes === 0) return EMPTY;
			const firstChunk = chunks[head];
			if (firstChunk.length >= bytes) return firstChunk.length === bytes ? firstChunk : firstChunk.subarray(0, bytes);
			const result = new Uint8Array(bytes);
			let copied = 0;
			let index = head;
			while (copied < bytes) {
				const chunk = chunks[index];
				const toCopy = Math.min(bytes - copied, chunk.length);
				if (toCopy === chunk.length) result.set(chunk, copied);
				else result.set(chunk.subarray(0, toCopy), copied);
				copied += toCopy;
				index = index + 1 & capacityMask;
			}
			return result;
		},
		discard: (bytes) => {
			if (bytes > totalAvailable) throw new Error("Too many bytes consumed");
			if (bytes === 0) return;
			let remaining = bytes;
			while (remaining > 0) {
				const chunk = chunks[head];
				const toConsume = Math.min(remaining, chunk.length);
				consumeFromHead(toConsume);
				remaining -= toConsume;
			}
		},
		pull
	};
}
var CHECKSUM_SPACE = 32;
function validateChecksum(block) {
	const stored = readOctal(block, 148, 8);
	let sum = 0;
	for (let i = 0; i < block.length; i++) if (i >= 148 && i < 156) sum += CHECKSUM_SPACE;
	else sum += block[i];
	return stored === sum;
}
function parseUstarHeader(block, strict) {
	if (strict && !validateChecksum(block)) throw new Error("Invalid tar header checksum.");
	const typeflag = readString(block, 156, 1);
	const header = {
		name: readString(block, 0, 100),
		mode: readOctal(block, 100, 8),
		uid: readNumeric(block, 108, 8),
		gid: readNumeric(block, 116, 8),
		size: readNumeric(block, 124, 12),
		mtime: /* @__PURE__ */ new Date(readNumeric(block, 136, 12) * 1e3),
		type: FLAGTYPE[typeflag] || "file",
		linkname: readString(block, 157, 100)
	};
	const magic = readString(block, 257, 6);
	if (magic.trim() === "ustar") {
		header.uname = readString(block, 265, 32);
		header.gname = readString(block, 297, 32);
	}
	if (magic === "ustar") header.prefix = readString(block, 345, 155);
	return header;
}
var PAX_MAPPING = {
	path: ["name", (v) => v],
	linkpath: ["linkname", (v) => v],
	size: ["size", (v) => /^\d+$/.test(v) && Number.isSafeInteger(+v) ? +v : NaN],
	mtime: ["mtime", parseFloat],
	uid: ["uid", (v) => parseInt(v, 10)],
	gid: ["gid", (v) => parseInt(v, 10)],
	uname: ["uname", (v) => v],
	gname: ["gname", (v) => v]
};
function parsePax(buffer) {
	const overrides = Object.create(null);
	const pax = Object.create(null);
	let isPax = false;
	let offset = 0;
	while (offset < buffer.length) {
		const spaceIndex = buffer.indexOf(32, offset);
		if (spaceIndex === -1) break;
		const length = parseInt(decoder.decode(buffer.subarray(offset, spaceIndex)), 10);
		if (!(length > 0)) break;
		const recordEnd = offset + length;
		const recordStr = decoder.decode(buffer.subarray(spaceIndex + 1, recordEnd - 1));
		const equalsIndex = recordStr.indexOf("=");
		if (equalsIndex > 0) {
			const key = recordStr.slice(0, equalsIndex);
			const value = recordStr.slice(equalsIndex + 1);
			pax[key] = value;
			isPax = true;
			if (Object.hasOwn(PAX_MAPPING, key)) {
				const [targetKey, parser] = PAX_MAPPING[key];
				const parsedValue = parser(value);
				if (typeof parsedValue === "string" || !Number.isNaN(parsedValue)) overrides[targetKey] = parsedValue;
			}
		}
		offset = recordEnd;
	}
	if (isPax) overrides.pax = pax;
	return overrides;
}
function applyOverrides(header, overrides) {
	if (overrides.name !== void 0) header.name = overrides.name;
	if (overrides.linkname !== void 0) header.linkname = overrides.linkname;
	if (overrides.size !== void 0) header.size = overrides.size;
	if (overrides.mtime !== void 0) header.mtime = /* @__PURE__ */ new Date(overrides.mtime * 1e3);
	if (overrides.uid !== void 0) header.uid = overrides.uid;
	if (overrides.gid !== void 0) header.gid = overrides.gid;
	if (overrides.uname !== void 0) header.uname = overrides.uname;
	if (overrides.gname !== void 0) header.gname = overrides.gname;
	if (overrides.pax) header.pax = Object.assign({}, header.pax ?? {}, overrides.pax);
}
function getMetaParser(type) {
	switch (type) {
		case "pax-global-header":
		case "pax-header": return parsePax;
		case "gnu-long-name": return (data) => ({ name: readString(data, 0, data.length) });
		case "gnu-long-link-name": return (data) => ({ linkname: readString(data, 0, data.length) });
		default: return;
	}
}
var STATE_HEADER = 0;
var STATE_BODY = 1;
var MAX_META_SIZE = 8388608;
var truncateErr = /* @__PURE__ */ new Error("Tar archive is truncated.");
function createUnpacker(options = {}) {
	const strict = options.strict ?? false;
	const { available, peek, push, discard, pull } = createChunkQueue();
	let state = STATE_HEADER;
	let ended = false;
	let done = false;
	let eof = false;
	let currentEntry = null;
	const paxGlobals = {};
	let nextEntryOverrides = {};
	const unpacker = {
		isEntryActive: () => state === STATE_BODY,
		isBodyComplete: () => !currentEntry || currentEntry.remaining === 0,
		canFinish: () => !currentEntry || available() >= currentEntry.remaining + currentEntry.padding,
		bodyBytes: () => currentEntry && currentEntry.remaining > 0 ? Math.min(currentEntry.remaining, available()) : 0,
		write(chunk) {
			if (ended) throw new Error("Archive already ended.");
			push(chunk);
		},
		end() {
			ended = true;
		},
		readHeader() {
			if (state !== STATE_HEADER) throw new Error("Cannot read header while an entry is active");
			if (done) return void 0;
			while (!done) {
				if (available() < 512) {
					if (ended) {
						if (available() > 0 && strict) throw truncateErr;
						done = true;
						return;
					}
					return null;
				}
				const headerBlock = peek(512);
				if (isZeroBlock(headerBlock)) {
					if (available() < 1024) {
						if (ended) {
							if (strict) throw truncateErr;
							done = true;
							return;
						}
						return null;
					}
					if (isZeroBlock(peek(1024).subarray(512))) {
						discard(1024);
						done = true;
						eof = true;
						return;
					}
					if (strict) throw new Error("Invalid tar header.");
					discard(512);
					continue;
				}
				let internalHeader;
				try {
					internalHeader = parseUstarHeader(headerBlock, strict);
				} catch (err) {
					if (strict) throw err;
					discard(512);
					continue;
				}
				const metaParser = getMetaParser(internalHeader.type);
				if (metaParser) {
					if (internalHeader.size > MAX_META_SIZE) throw new Error("Tar metadata entry exceeds maximum size.");
					const paddedSize = internalHeader.size + (-internalHeader.size & 511);
					if (available() < 512 + paddedSize) {
						if (ended && strict) throw truncateErr;
						return null;
					}
					discard(512);
					const overrides = metaParser(pull(paddedSize).subarray(0, internalHeader.size));
					if (nextEntryOverrides.pax) nextEntryOverrides = {};
					const target = internalHeader.type === "pax-global-header" ? paxGlobals : nextEntryOverrides;
					for (const key in overrides) target[key] = overrides[key];
					continue;
				}
				discard(512);
				const header = internalHeader;
				if (internalHeader.prefix) header.name = `${internalHeader.prefix}/${header.name}`;
				applyOverrides(header, paxGlobals);
				applyOverrides(header, nextEntryOverrides);
				let archiveSize = header.size;
				if (isBodyless(header)) {
					archiveSize = 0;
					header.size = 0;
				} else if (header.name.endsWith("/") && header.type === "file") {
					header.type = DIRECTORY;
					header.size = 0;
				}
				nextEntryOverrides = {};
				currentEntry = {
					header,
					remaining: archiveSize,
					padding: -archiveSize & 511
				};
				state = STATE_BODY;
				return header;
			}
		},
		streamBody(callback) {
			if (state !== STATE_BODY || !currentEntry || currentEntry.remaining === 0) return 0;
			const bytesToFeed = Math.min(currentEntry.remaining, available());
			if (bytesToFeed === 0) return 0;
			const fed = pull(bytesToFeed, callback);
			currentEntry.remaining -= fed;
			return fed;
		},
		skipPadding() {
			if (state !== STATE_BODY || !currentEntry) return true;
			if (currentEntry.remaining > 0) throw new Error("Body not fully consumed");
			if (available() < currentEntry.padding) return false;
			discard(currentEntry.padding);
			currentEntry = null;
			state = STATE_HEADER;
			return true;
		},
		skipEntry() {
			if (state !== STATE_BODY || !currentEntry) return true;
			const toDiscard = Math.min(currentEntry.remaining, available());
			if (toDiscard > 0) {
				discard(toDiscard);
				currentEntry.remaining -= toDiscard;
			}
			if (currentEntry.remaining > 0) return false;
			return unpacker.skipPadding();
		},
		validateEOF() {
			if (strict) {
				if (!eof) throw truncateErr;
				if (available() > 0) {
					if (pull(available()).some((byte) => byte !== 0)) throw new Error("Invalid EOF.");
				}
			}
		}
	};
	return unpacker;
}
function isZeroBlock(block) {
	if (block.byteOffset % 8 === 0) {
		const view = new BigUint64Array(block.buffer, block.byteOffset, block.length / 8);
		for (let i = 0; i < view.length; i++) if (view[i] !== 0n) return false;
		return true;
	}
	for (let i = 0; i < block.length; i++) if (block[i] !== 0) return false;
	return true;
}
//#endregion
//#region node_modules/.pnpm/modern-tar@0.7.7/node_modules/modern-tar/dist/web/index.js
function createGzipDecoder() {
	return new DecompressionStream("gzip");
}
async function streamToBuffer(stream) {
	const chunks = [];
	const reader = stream.getReader();
	let totalLength = 0;
	try {
		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			chunks.push(value);
			totalLength += value.length;
		}
		const result = new Uint8Array(totalLength);
		let offset = 0;
		for (const chunk of chunks) {
			result.set(chunk, offset);
			offset += chunk.length;
		}
		return result;
	} finally {
		reader.releaseLock();
	}
}
var drain = (stream) => stream.pipeTo(new WritableStream());
function createTarDecoder(options = {}) {
	const unpacker = createUnpacker(options);
	const strict = options.strict ?? false;
	let controller = null;
	let bodyController = null;
	let pumping = false;
	let eofReached = false;
	let sourceEnded = false;
	let closed = false;
	const closeBody = () => {
		try {
			bodyController?.close();
		} catch {}
		bodyController = null;
	};
	const fail = (reason) => {
		if (closed) return;
		closed = true;
		try {
			bodyController?.error(reason);
		} catch {}
		bodyController = null;
		try {
			controller.error(reason);
		} catch {}
		controller = null;
	};
	const finish = () => {
		if (closed) return;
		closed = true;
		closeBody();
		try {
			controller.close();
		} catch {}
		controller = null;
	};
	const truncateOrFinish = () => {
		if (strict) throw new Error("Tar archive is truncated.");
		finish();
	};
	const pump = () => {
		if (pumping || closed || !controller) return;
		pumping = true;
		try {
			while (true) {
				if (eofReached) {
					if (sourceEnded) {
						unpacker.validateEOF();
						finish();
					}
					break;
				}
				if (unpacker.isEntryActive()) {
					if (sourceEnded && !unpacker.canFinish()) {
						truncateOrFinish();
						break;
					}
					if (bodyController) {
						if ((bodyController.desiredSize ?? 1) <= 0) break;
						if (unpacker.streamBody((c) => (bodyController.enqueue(c), (bodyController.desiredSize ?? 1) > 0)) === 0 && !unpacker.isBodyComplete()) {
							if (sourceEnded) truncateOrFinish();
							break;
						}
					} else if (!unpacker.skipEntry()) {
						if (sourceEnded) truncateOrFinish();
						break;
					}
					if (unpacker.isBodyComplete()) {
						closeBody();
						if (!unpacker.skipPadding()) {
							if (sourceEnded) truncateOrFinish();
							break;
						}
					}
				} else {
					if ((controller.desiredSize ?? 0) < 0) break;
					const header = unpacker.readHeader();
					if (header === null) {
						if (sourceEnded) finish();
						break;
					}
					if (header === void 0) {
						if (sourceEnded) {
							unpacker.validateEOF();
							finish();
							break;
						}
						eofReached = true;
						break;
					}
					controller.enqueue({
						header,
						body: new ReadableStream({
							start(c) {
								if (header.size === 0) c.close();
								else bodyController = c;
							},
							pull: pump,
							cancel() {
								bodyController = null;
								pump();
							}
						})
					});
				}
			}
		} catch (error) {
			fail(error);
			throw error;
		} finally {
			pumping = false;
		}
	};
	return {
		readable: new ReadableStream({
			start(c) {
				controller = c;
			},
			pull: pump,
			cancel(reason) {
				if (reason !== void 0) fail(reason);
				else finish();
			}
		}, { highWaterMark: 2 }),
		writable: new WritableStream({
			write(chunk) {
				try {
					if (eofReached && strict && chunk.some((byte) => byte !== 0)) throw new Error("Invalid EOF.");
					unpacker.write(chunk);
					pump();
				} catch (error) {
					fail(error);
					throw error;
				}
			},
			close() {
				try {
					sourceEnded = true;
					unpacker.end();
					pump();
				} catch (error) {
					fail(error);
					throw error;
				}
			},
			abort(reason) {
				fail(reason);
			}
		})
	};
}
async function unpackTar(archive, options = {}) {
	if (!(archive instanceof ReadableStream)) return unpackTarBuffer(archive instanceof Uint8Array ? archive : new Uint8Array(archive), options);
	const results = [];
	const entryStream = archive.pipeThrough(createTarDecoder(options));
	for await (const entry of entryStream) {
		let processedHeader;
		try {
			processedHeader = transformHeader(entry.header, options);
		} catch (error) {
			await entry.body.cancel();
			throw error;
		}
		if (processedHeader === null) {
			await drain(entry.body);
			continue;
		}
		if (isBodyless(processedHeader)) {
			await drain(entry.body);
			results.push({ header: processedHeader });
		} else results.push({
			header: processedHeader,
			data: await streamToBuffer(entry.body)
		});
	}
	return results;
}
function unpackTarBuffer(archive, options) {
	const unpacker = createUnpacker(options);
	const strict = options.strict ?? false;
	const results = [];
	unpacker.write(archive);
	unpacker.end();
	while (true) {
		const header = unpacker.readHeader();
		if (header === void 0) break;
		if (header === null) {
			if (strict) throw new Error("Tar archive is truncated.");
			break;
		}
		const processedHeader = transformHeader(header, options);
		if (processedHeader === null) {
			const skipped = unpacker.skipEntry();
			if (!skipped && strict) throw new Error("Tar archive is truncated.");
			if (!skipped) break;
			continue;
		}
		if (isBodyless(processedHeader)) {
			const skipped = unpacker.skipEntry();
			if (!skipped && strict) throw new Error("Tar archive is truncated.");
			results.push({ header: processedHeader });
			if (!skipped) break;
			continue;
		}
		let size = header.size;
		if (size < 0 || !unpacker.canFinish()) {
			if (strict) throw new Error("Tar archive is truncated.");
			size = unpacker.bodyBytes();
		}
		const data = new Uint8Array(size);
		let offset = 0;
		unpacker.streamBody((chunk) => {
			data.set(chunk, offset);
			offset += chunk.length;
			return true;
		});
		const bodyComplete = unpacker.isBodyComplete();
		let paddingComplete = true;
		if (bodyComplete) {
			paddingComplete = unpacker.skipPadding();
			if (!paddingComplete && strict) throw new Error("Tar archive is truncated.");
		}
		results.push({
			header: processedHeader,
			data
		});
		if (!bodyComplete || !paddingComplete) break;
	}
	unpacker.validateEOF();
	return results;
}
//#endregion
//#region self-essentials/emdash-main/packages/registry-client/dist/valid-CrwWy2P3.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJSMin = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
var require_lrucache = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var LRUCache = class {
		constructor() {
			this.max = 1e3;
			this.map = /* @__PURE__ */ new Map();
		}
		get(key) {
			const value = this.map.get(key);
			if (value === void 0) return;
			else {
				this.map.delete(key);
				this.map.set(key, value);
				return value;
			}
		}
		delete(key) {
			return this.map.delete(key);
		}
		set(key, value) {
			if (!this.delete(key) && value !== void 0) {
				if (this.map.size >= this.max) {
					const firstKey = this.map.keys().next().value;
					this.delete(firstKey);
				}
				this.map.set(key, value);
			}
			return this;
		}
	};
	module.exports = LRUCache;
}));
var require_parse_options = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const looseOption = Object.freeze({ loose: true });
	const emptyOpts = Object.freeze({});
	const parseOptions = (options) => {
		if (!options) return emptyOpts;
		if (typeof options !== "object") return looseOption;
		return options;
	};
	module.exports = parseOptions;
}));
var require_constants = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = {
		MAX_LENGTH: 256,
		MAX_SAFE_COMPONENT_LENGTH: 16,
		MAX_SAFE_BUILD_LENGTH: 250,
		MAX_SAFE_INTEGER: Number.MAX_SAFE_INTEGER || 9007199254740991,
		RELEASE_TYPES: [
			"major",
			"premajor",
			"minor",
			"preminor",
			"patch",
			"prepatch",
			"prerelease"
		],
		SEMVER_SPEC_VERSION: "2.0.0",
		FLAG_INCLUDE_PRERELEASE: 1,
		FLAG_LOOSE: 2
	};
}));
var require_debug = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = typeof process === "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...args) => console.error("SEMVER", ...args) : () => {};
}));
var require_re = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const { MAX_SAFE_COMPONENT_LENGTH, MAX_SAFE_BUILD_LENGTH, MAX_LENGTH } = require_constants();
	const debug = require_debug();
	exports = module.exports = {};
	const re = exports.re = [];
	const safeRe = exports.safeRe = [];
	const src = exports.src = [];
	const safeSrc = exports.safeSrc = [];
	const t = exports.t = {};
	let R = 0;
	const LETTERDASHNUMBER = "[a-zA-Z0-9-]";
	const safeRegexReplacements = [
		["\\s", 1],
		["\\d", MAX_LENGTH],
		[LETTERDASHNUMBER, MAX_SAFE_BUILD_LENGTH]
	];
	const makeSafeRegex = (value) => {
		for (const [token, max] of safeRegexReplacements) value = value.split(`${token}*`).join(`${token}{0,${max}}`).split(`${token}+`).join(`${token}{1,${max}}`);
		return value;
	};
	const createToken = (name, value, isGlobal) => {
		const safe = makeSafeRegex(value);
		const index = R++;
		debug(name, index, value);
		t[name] = index;
		src[index] = value;
		safeSrc[index] = safe;
		re[index] = new RegExp(value, isGlobal ? "g" : void 0);
		safeRe[index] = new RegExp(safe, isGlobal ? "g" : void 0);
	};
	createToken("NUMERICIDENTIFIER", "0|[1-9]\\d*");
	createToken("NUMERICIDENTIFIERLOOSE", "\\d+");
	createToken("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${LETTERDASHNUMBER}*`);
	createToken("MAINVERSION", `(${src[t.NUMERICIDENTIFIER]})\\.(${src[t.NUMERICIDENTIFIER]})\\.(${src[t.NUMERICIDENTIFIER]})`);
	createToken("MAINVERSIONLOOSE", `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.(${src[t.NUMERICIDENTIFIERLOOSE]})\\.(${src[t.NUMERICIDENTIFIERLOOSE]})`);
	createToken("PRERELEASEIDENTIFIER", `(?:${src[t.NONNUMERICIDENTIFIER]}|${src[t.NUMERICIDENTIFIER]})`);
	createToken("PRERELEASEIDENTIFIERLOOSE", `(?:${src[t.NONNUMERICIDENTIFIER]}|${src[t.NUMERICIDENTIFIERLOOSE]})`);
	createToken("PRERELEASE", `(?:-(${src[t.PRERELEASEIDENTIFIER]}(?:\\.${src[t.PRERELEASEIDENTIFIER]})*))`);
	createToken("PRERELEASELOOSE", `(?:-?(${src[t.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${src[t.PRERELEASEIDENTIFIERLOOSE]})*))`);
	createToken("BUILDIDENTIFIER", `${LETTERDASHNUMBER}+`);
	createToken("BUILD", `(?:\\+(${src[t.BUILDIDENTIFIER]}(?:\\.${src[t.BUILDIDENTIFIER]})*))`);
	createToken("FULLPLAIN", `v?${src[t.MAINVERSION]}${src[t.PRERELEASE]}?${src[t.BUILD]}?`);
	createToken("FULL", `^${src[t.FULLPLAIN]}$`);
	createToken("LOOSEPLAIN", `[v=\\s]*${src[t.MAINVERSIONLOOSE]}${src[t.PRERELEASELOOSE]}?${src[t.BUILD]}?`);
	createToken("LOOSE", `^${src[t.LOOSEPLAIN]}$`);
	createToken("GTLT", "((?:<|>)?=?)");
	createToken("XRANGEIDENTIFIERLOOSE", `${src[t.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`);
	createToken("XRANGEIDENTIFIER", `${src[t.NUMERICIDENTIFIER]}|x|X|\\*`);
	createToken("XRANGEPLAIN", `[v=\\s]*(${src[t.XRANGEIDENTIFIER]})(?:\\.(${src[t.XRANGEIDENTIFIER]})(?:\\.(${src[t.XRANGEIDENTIFIER]})(?:${src[t.PRERELEASE]})?${src[t.BUILD]}?)?)?`);
	createToken("XRANGEPLAINLOOSE", `[v=\\s]*(${src[t.XRANGEIDENTIFIERLOOSE]})(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})(?:${src[t.PRERELEASELOOSE]})?${src[t.BUILD]}?)?)?`);
	createToken("XRANGE", `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAIN]}$`);
	createToken("XRANGELOOSE", `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAINLOOSE]}$`);
	createToken("COERCEPLAIN", `(^|[^\\d])(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}})(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?`);
	createToken("COERCE", `${src[t.COERCEPLAIN]}(?:$|[^\\d])`);
	createToken("COERCEFULL", src[t.COERCEPLAIN] + `(?:${src[t.PRERELEASE]})?(?:${src[t.BUILD]})?(?:$|[^\\d])`);
	createToken("COERCERTL", src[t.COERCE], true);
	createToken("COERCERTLFULL", src[t.COERCEFULL], true);
	createToken("LONETILDE", "(?:~>?)");
	createToken("TILDETRIM", `(\\s*)${src[t.LONETILDE]}\\s+`, true);
	exports.tildeTrimReplace = "$1~";
	createToken("TILDE", `^${src[t.LONETILDE]}${src[t.XRANGEPLAIN]}$`);
	createToken("TILDELOOSE", `^${src[t.LONETILDE]}${src[t.XRANGEPLAINLOOSE]}$`);
	createToken("LONECARET", "(?:\\^)");
	createToken("CARETTRIM", `(\\s*)${src[t.LONECARET]}\\s+`, true);
	exports.caretTrimReplace = "$1^";
	createToken("CARET", `^${src[t.LONECARET]}${src[t.XRANGEPLAIN]}$`);
	createToken("CARETLOOSE", `^${src[t.LONECARET]}${src[t.XRANGEPLAINLOOSE]}$`);
	createToken("COMPARATORLOOSE", `^${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]})$|^$`);
	createToken("COMPARATOR", `^${src[t.GTLT]}\\s*(${src[t.FULLPLAIN]})$|^$`);
	createToken("COMPARATORTRIM", `(\\s*)${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]}|${src[t.XRANGEPLAIN]})`, true);
	exports.comparatorTrimReplace = "$1$2$3";
	createToken("HYPHENRANGE", `^\\s*(${src[t.XRANGEPLAIN]})\\s+-\\s+(${src[t.XRANGEPLAIN]})\\s*$`);
	createToken("HYPHENRANGELOOSE", `^\\s*(${src[t.XRANGEPLAINLOOSE]})\\s+-\\s+(${src[t.XRANGEPLAINLOOSE]})\\s*$`);
	createToken("STAR", "(<|>)?=?\\s*\\*");
	createToken("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$");
	createToken("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
}));
var require_identifiers = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const numeric = /^[0-9]+$/;
	const compareIdentifiers = (a, b) => {
		if (typeof a === "number" && typeof b === "number") return a === b ? 0 : a < b ? -1 : 1;
		const anum = numeric.test(a);
		const bnum = numeric.test(b);
		if (anum && bnum) {
			a = +a;
			b = +b;
		}
		return a === b ? 0 : anum && !bnum ? -1 : bnum && !anum ? 1 : a < b ? -1 : 1;
	};
	const rcompareIdentifiers = (a, b) => compareIdentifiers(b, a);
	module.exports = {
		compareIdentifiers,
		rcompareIdentifiers
	};
}));
var require_semver = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const debug = require_debug();
	const { MAX_LENGTH, MAX_SAFE_INTEGER } = require_constants();
	const { safeRe: re, t } = require_re();
	const parseOptions = require_parse_options();
	const { compareIdentifiers } = require_identifiers();
	const isPrereleaseIdentifier = (prerelease, identifier) => {
		const identifiers = identifier.split(".");
		if (identifiers.length > prerelease.length) return false;
		for (let i = 0; i < identifiers.length; i++) if (compareIdentifiers(prerelease[i], identifiers[i]) !== 0) return false;
		return true;
	};
	module.exports = class SemVer {
		constructor(version, options) {
			options = parseOptions(options);
			if (version instanceof SemVer) if (version.loose === !!options.loose && version.includePrerelease === !!options.includePrerelease) return version;
			else version = version.version;
			else if (typeof version !== "string") throw new TypeError(`Invalid version. Must be a string. Got type "${typeof version}".`);
			if (version.length > MAX_LENGTH) throw new TypeError(`version is longer than ${MAX_LENGTH} characters`);
			debug("SemVer", version, options);
			this.options = options;
			this.loose = !!options.loose;
			this.includePrerelease = !!options.includePrerelease;
			const m = version.trim().match(options.loose ? re[t.LOOSE] : re[t.FULL]);
			if (!m) throw new TypeError(`Invalid Version: ${version}`);
			this.raw = version;
			this.major = +m[1];
			this.minor = +m[2];
			this.patch = +m[3];
			if (this.major > MAX_SAFE_INTEGER || this.major < 0) throw new TypeError("Invalid major version");
			if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) throw new TypeError("Invalid minor version");
			if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) throw new TypeError("Invalid patch version");
			if (!m[4]) this.prerelease = [];
			else this.prerelease = m[4].split(".").map((id) => {
				if (/^[0-9]+$/.test(id)) {
					const num = +id;
					if (num >= 0 && num < MAX_SAFE_INTEGER) return num;
				}
				return id;
			});
			this.build = m[5] ? m[5].split(".") : [];
			this.format();
		}
		format() {
			this.version = `${this.major}.${this.minor}.${this.patch}`;
			if (this.prerelease.length) this.version += `-${this.prerelease.join(".")}`;
			return this.version;
		}
		toString() {
			return this.version;
		}
		compare(other) {
			debug("SemVer.compare", this.version, this.options, other);
			if (!(other instanceof SemVer)) {
				if (typeof other === "string" && other === this.version) return 0;
				other = new SemVer(other, this.options);
			}
			if (other.version === this.version) return 0;
			return this.compareMain(other) || this.comparePre(other);
		}
		compareMain(other) {
			if (!(other instanceof SemVer)) other = new SemVer(other, this.options);
			if (this.major < other.major) return -1;
			if (this.major > other.major) return 1;
			if (this.minor < other.minor) return -1;
			if (this.minor > other.minor) return 1;
			if (this.patch < other.patch) return -1;
			if (this.patch > other.patch) return 1;
			return 0;
		}
		comparePre(other) {
			if (!(other instanceof SemVer)) other = new SemVer(other, this.options);
			if (this.prerelease.length && !other.prerelease.length) return -1;
			else if (!this.prerelease.length && other.prerelease.length) return 1;
			else if (!this.prerelease.length && !other.prerelease.length) return 0;
			let i = 0;
			do {
				const a = this.prerelease[i];
				const b = other.prerelease[i];
				debug("prerelease compare", i, a, b);
				if (a === void 0 && b === void 0) return 0;
				else if (b === void 0) return 1;
				else if (a === void 0) return -1;
				else if (a === b) continue;
				else return compareIdentifiers(a, b);
			} while (++i);
		}
		compareBuild(other) {
			if (!(other instanceof SemVer)) other = new SemVer(other, this.options);
			let i = 0;
			do {
				const a = this.build[i];
				const b = other.build[i];
				debug("build compare", i, a, b);
				if (a === void 0 && b === void 0) return 0;
				else if (b === void 0) return 1;
				else if (a === void 0) return -1;
				else if (a === b) continue;
				else return compareIdentifiers(a, b);
			} while (++i);
		}
		inc(release, identifier, identifierBase) {
			if (release.startsWith("pre")) {
				if (!identifier && identifierBase === false) throw new Error("invalid increment argument: identifier is empty");
				if (identifier) {
					const match = `-${identifier}`.match(this.options.loose ? re[t.PRERELEASELOOSE] : re[t.PRERELEASE]);
					if (!match || match[1] !== identifier) throw new Error(`invalid identifier: ${identifier}`);
				}
			}
			switch (release) {
				case "premajor":
					this.prerelease.length = 0;
					this.patch = 0;
					this.minor = 0;
					this.major++;
					this.inc("pre", identifier, identifierBase);
					break;
				case "preminor":
					this.prerelease.length = 0;
					this.patch = 0;
					this.minor++;
					this.inc("pre", identifier, identifierBase);
					break;
				case "prepatch":
					this.prerelease.length = 0;
					this.inc("patch", identifier, identifierBase);
					this.inc("pre", identifier, identifierBase);
					break;
				case "prerelease":
					if (this.prerelease.length === 0) this.inc("patch", identifier, identifierBase);
					this.inc("pre", identifier, identifierBase);
					break;
				case "release":
					if (this.prerelease.length === 0) throw new Error(`version ${this.raw} is not a prerelease`);
					this.prerelease.length = 0;
					break;
				case "major":
					if (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) this.major++;
					this.minor = 0;
					this.patch = 0;
					this.prerelease = [];
					break;
				case "minor":
					if (this.patch !== 0 || this.prerelease.length === 0) this.minor++;
					this.patch = 0;
					this.prerelease = [];
					break;
				case "patch":
					if (this.prerelease.length === 0) this.patch++;
					this.prerelease = [];
					break;
				case "pre": {
					const base = Number(identifierBase) ? 1 : 0;
					if (this.prerelease.length === 0) this.prerelease = [base];
					else {
						let i = this.prerelease.length;
						while (--i >= 0) if (typeof this.prerelease[i] === "number") {
							this.prerelease[i]++;
							i = -2;
						}
						if (i === -1) {
							if (identifier === this.prerelease.join(".") && identifierBase === false) throw new Error("invalid increment argument: identifier already exists");
							this.prerelease.push(base);
						}
					}
					if (identifier) {
						let prerelease = [identifier, base];
						if (identifierBase === false) prerelease = [identifier];
						if (isPrereleaseIdentifier(this.prerelease, identifier)) {
							const prereleaseBase = this.prerelease[identifier.split(".").length];
							if (isNaN(prereleaseBase)) this.prerelease = prerelease;
						} else this.prerelease = prerelease;
					}
					break;
				}
				default: throw new Error(`invalid increment argument: ${release}`);
			}
			this.raw = this.format();
			if (this.build.length) this.raw += `+${this.build.join(".")}`;
			return this;
		}
	};
}));
var require_compare = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const SemVer = require_semver();
	const compare = (a, b, loose) => new SemVer(a, loose).compare(new SemVer(b, loose));
	module.exports = compare;
}));
var require_eq = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const compare = require_compare();
	const eq = (a, b, loose) => compare(a, b, loose) === 0;
	module.exports = eq;
}));
var require_neq = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const compare = require_compare();
	const neq = (a, b, loose) => compare(a, b, loose) !== 0;
	module.exports = neq;
}));
var require_gt = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const compare = require_compare();
	const gt = (a, b, loose) => compare(a, b, loose) > 0;
	module.exports = gt;
}));
var require_gte = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const compare = require_compare();
	const gte = (a, b, loose) => compare(a, b, loose) >= 0;
	module.exports = gte;
}));
var require_lt = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const compare = require_compare();
	const lt = (a, b, loose) => compare(a, b, loose) < 0;
	module.exports = lt;
}));
var require_lte = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const compare = require_compare();
	const lte = (a, b, loose) => compare(a, b, loose) <= 0;
	module.exports = lte;
}));
var require_cmp = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const eq = require_eq();
	const neq = require_neq();
	const gt = require_gt();
	const gte = require_gte();
	const lt = require_lt();
	const lte = require_lte();
	const cmp = (a, op, b, loose) => {
		switch (op) {
			case "===":
				if (typeof a === "object") a = a.version;
				if (typeof b === "object") b = b.version;
				return a === b;
			case "!==":
				if (typeof a === "object") a = a.version;
				if (typeof b === "object") b = b.version;
				return a !== b;
			case "":
			case "=":
			case "==": return eq(a, b, loose);
			case "!=": return neq(a, b, loose);
			case ">": return gt(a, b, loose);
			case ">=": return gte(a, b, loose);
			case "<": return lt(a, b, loose);
			case "<=": return lte(a, b, loose);
			default: throw new TypeError(`Invalid operator: ${op}`);
		}
	};
	module.exports = cmp;
}));
var require_comparator = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const ANY = Symbol("SemVer ANY");
	module.exports = class Comparator {
		static get ANY() {
			return ANY;
		}
		constructor(comp, options) {
			options = parseOptions(options);
			if (comp instanceof Comparator) if (comp.loose === !!options.loose) return comp;
			else comp = comp.value;
			comp = comp.trim().split(/\s+/).join(" ");
			debug("comparator", comp, options);
			this.options = options;
			this.loose = !!options.loose;
			this.parse(comp);
			if (this.semver === ANY) this.value = "";
			else this.value = this.operator + this.semver.version;
			debug("comp", this);
		}
		parse(comp) {
			const r = this.options.loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR];
			const m = comp.match(r);
			if (!m) throw new TypeError(`Invalid comparator: ${comp}`);
			this.operator = m[1] !== void 0 ? m[1] : "";
			if (this.operator === "=") this.operator = "";
			if (!m[2]) this.semver = ANY;
			else this.semver = new SemVer(m[2], this.options.loose);
		}
		toString() {
			return this.value;
		}
		test(version) {
			debug("Comparator.test", version, this.options.loose);
			if (this.semver === ANY || version === ANY) return true;
			if (typeof version === "string") try {
				version = new SemVer(version, this.options);
			} catch (er) {
				return false;
			}
			return cmp(version, this.operator, this.semver, this.options);
		}
		intersects(comp, options) {
			if (!(comp instanceof Comparator)) throw new TypeError("a Comparator is required");
			if (this.operator === "") {
				if (this.value === "") return true;
				return new Range(comp.value, options).test(this.value);
			} else if (comp.operator === "") {
				if (comp.value === "") return true;
				return new Range(this.value, options).test(comp.semver);
			}
			options = parseOptions(options);
			if (options.includePrerelease && (this.value === "<0.0.0-0" || comp.value === "<0.0.0-0")) return false;
			if (!options.includePrerelease && (this.value.startsWith("<0.0.0") || comp.value.startsWith("<0.0.0"))) return false;
			if (this.operator.startsWith(">") && comp.operator.startsWith(">")) return true;
			if (this.operator.startsWith("<") && comp.operator.startsWith("<")) return true;
			if (this.semver.version === comp.semver.version && this.operator.includes("=") && comp.operator.includes("=")) return true;
			if (cmp(this.semver, "<", comp.semver, options) && this.operator.startsWith(">") && comp.operator.startsWith("<")) return true;
			if (cmp(this.semver, ">", comp.semver, options) && this.operator.startsWith("<") && comp.operator.startsWith(">")) return true;
			return false;
		}
	};
	const parseOptions = require_parse_options();
	const { safeRe: re, t } = require_re();
	const cmp = require_cmp();
	const debug = require_debug();
	const SemVer = require_semver();
	const Range = require_range();
}));
var require_range = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const SPACE_CHARACTERS = /\s+/g;
	module.exports = class Range {
		constructor(range, options) {
			options = parseOptions(options);
			if (range instanceof Range) if (range.loose === !!options.loose && range.includePrerelease === !!options.includePrerelease) return range;
			else return new Range(range.raw, options);
			if (range instanceof Comparator) {
				this.raw = range.value;
				this.set = [[range]];
				this.formatted = void 0;
				return this;
			}
			this.options = options;
			this.loose = !!options.loose;
			this.includePrerelease = !!options.includePrerelease;
			this.raw = range.trim().replace(SPACE_CHARACTERS, " ");
			this.set = this.raw.split("||").map((r) => this.parseRange(r.trim())).filter((c) => c.length);
			if (!this.set.length) throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
			if (this.set.length > 1) {
				const first = this.set[0];
				this.set = this.set.filter((c) => !isNullSet(c[0]));
				if (this.set.length === 0) this.set = [first];
				else if (this.set.length > 1) {
					for (const c of this.set) if (c.length === 1 && isAny(c[0])) {
						this.set = [c];
						break;
					}
				}
			}
			this.formatted = void 0;
		}
		get range() {
			if (this.formatted === void 0) {
				this.formatted = "";
				for (let i = 0; i < this.set.length; i++) {
					if (i > 0) this.formatted += "||";
					const comps = this.set[i];
					for (let k = 0; k < comps.length; k++) {
						if (k > 0) this.formatted += " ";
						this.formatted += comps[k].toString().trim();
					}
				}
			}
			return this.formatted;
		}
		format() {
			return this.range;
		}
		toString() {
			return this.range;
		}
		parseRange(range) {
			range = range.replace(BUILDSTRIPRE, "");
			const memoKey = ((this.options.includePrerelease && FLAG_INCLUDE_PRERELEASE) | (this.options.loose && FLAG_LOOSE)) + ":" + range;
			const cached = cache.get(memoKey);
			if (cached) return cached;
			const loose = this.options.loose;
			const hr = loose ? re[t.HYPHENRANGELOOSE] : re[t.HYPHENRANGE];
			range = range.replace(hr, hyphenReplace(this.options.includePrerelease));
			debug("hyphen replace", range);
			range = range.replace(re[t.COMPARATORTRIM], comparatorTrimReplace);
			debug("comparator trim", range);
			range = range.replace(re[t.TILDETRIM], tildeTrimReplace);
			debug("tilde trim", range);
			range = range.replace(re[t.CARETTRIM], caretTrimReplace);
			debug("caret trim", range);
			let rangeList = range.split(" ").map((comp) => parseComparator(comp, this.options)).join(" ").split(/\s+/).map((comp) => replaceGTE0(comp, this.options));
			if (loose) rangeList = rangeList.filter((comp) => {
				debug("loose invalid filter", comp, this.options);
				return !!comp.match(re[t.COMPARATORLOOSE]);
			});
			debug("range list", rangeList);
			const rangeMap = /* @__PURE__ */ new Map();
			const comparators = rangeList.map((comp) => new Comparator(comp, this.options));
			for (const comp of comparators) {
				if (isNullSet(comp)) return [comp];
				rangeMap.set(comp.value, comp);
			}
			if (rangeMap.size > 1 && rangeMap.has("")) rangeMap.delete("");
			const result = [...rangeMap.values()];
			cache.set(memoKey, result);
			return result;
		}
		intersects(range, options) {
			if (!(range instanceof Range)) throw new TypeError("a Range is required");
			return this.set.some((thisComparators) => {
				return isSatisfiable(thisComparators, options) && range.set.some((rangeComparators) => {
					return isSatisfiable(rangeComparators, options) && thisComparators.every((thisComparator) => {
						return rangeComparators.every((rangeComparator) => {
							return thisComparator.intersects(rangeComparator, options);
						});
					});
				});
			});
		}
		test(version) {
			if (!version) return false;
			if (typeof version === "string") try {
				version = new SemVer(version, this.options);
			} catch (er) {
				return false;
			}
			for (let i = 0; i < this.set.length; i++) if (testSet(this.set[i], version, this.options)) return true;
			return false;
		}
	};
	const cache = new (require_lrucache())();
	const parseOptions = require_parse_options();
	const Comparator = require_comparator();
	const debug = require_debug();
	const SemVer = require_semver();
	const { safeRe: re, src, t, comparatorTrimReplace, tildeTrimReplace, caretTrimReplace } = require_re();
	const { FLAG_INCLUDE_PRERELEASE, FLAG_LOOSE } = require_constants();
	const BUILDSTRIPRE = new RegExp(src[t.BUILD], "g");
	const isNullSet = (c) => c.value === "<0.0.0-0";
	const isAny = (c) => c.value === "";
	const isSatisfiable = (comparators, options) => {
		let result = true;
		const remainingComparators = comparators.slice();
		let testComparator = remainingComparators.pop();
		while (result && remainingComparators.length) {
			result = remainingComparators.every((otherComparator) => {
				return testComparator.intersects(otherComparator, options);
			});
			testComparator = remainingComparators.pop();
		}
		return result;
	};
	const parseComparator = (comp, options) => {
		comp = comp.replace(re[t.BUILD], "");
		debug("comp", comp, options);
		comp = replaceCarets(comp, options);
		debug("caret", comp);
		comp = replaceTildes(comp, options);
		debug("tildes", comp);
		comp = replaceXRanges(comp, options);
		debug("xrange", comp);
		comp = replaceStars(comp, options);
		debug("stars", comp);
		return comp;
	};
	const isX = (id) => !id || id.toLowerCase() === "x" || id === "*";
	const invalidXRangeOrder = (M, m, p) => isX(M) && !isX(m) || isX(m) && p && !isX(p);
	const replaceTildes = (comp, options) => {
		return comp.trim().split(/\s+/).map((c) => replaceTilde(c, options)).join(" ");
	};
	const replaceTilde = (comp, options) => {
		const r = options.loose ? re[t.TILDELOOSE] : re[t.TILDE];
		const z = options.includePrerelease ? "-0" : "";
		return comp.replace(r, (_, M, m, p, pr) => {
			debug("tilde", comp, _, M, m, p, pr);
			let ret;
			if (isX(M)) ret = "";
			else if (isX(m)) ret = `>=${M}.0.0${z} <${+M + 1}.0.0-0`;
			else if (isX(p)) ret = `>=${M}.${m}.0${z} <${M}.${+m + 1}.0-0`;
			else if (pr) {
				debug("replaceTilde pr", pr);
				ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
			} else ret = `>=${M}.${m}.${p} <${M}.${+m + 1}.0-0`;
			debug("tilde return", ret);
			return ret;
		});
	};
	const replaceCarets = (comp, options) => {
		return comp.trim().split(/\s+/).map((c) => replaceCaret(c, options)).join(" ");
	};
	const replaceCaret = (comp, options) => {
		debug("caret", comp, options);
		const r = options.loose ? re[t.CARETLOOSE] : re[t.CARET];
		const z = options.includePrerelease ? "-0" : "";
		return comp.replace(r, (_, M, m, p, pr) => {
			debug("caret", comp, _, M, m, p, pr);
			let ret;
			if (isX(M)) ret = "";
			else if (isX(m)) ret = `>=${M}.0.0${z} <${+M + 1}.0.0-0`;
			else if (isX(p)) if (M === "0") ret = `>=${M}.${m}.0${z} <${M}.${+m + 1}.0-0`;
			else ret = `>=${M}.${m}.0${z} <${+M + 1}.0.0-0`;
			else if (pr) {
				debug("replaceCaret pr", pr);
				if (M === "0") if (m === "0") ret = `>=${M}.${m}.${p}-${pr} <${M}.${m}.${+p + 1}-0`;
				else ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
				else ret = `>=${M}.${m}.${p}-${pr} <${+M + 1}.0.0-0`;
			} else {
				debug("no pr");
				if (M === "0") if (m === "0") ret = `>=${M}.${m}.${p} <${M}.${m}.${+p + 1}-0`;
				else ret = `>=${M}.${m}.${p} <${M}.${+m + 1}.0-0`;
				else ret = `>=${M}.${m}.${p} <${+M + 1}.0.0-0`;
			}
			debug("caret return", ret);
			return ret;
		});
	};
	const replaceXRanges = (comp, options) => {
		debug("replaceXRanges", comp, options);
		return comp.split(/\s+/).map((c) => replaceXRange(c, options)).join(" ");
	};
	const replaceXRange = (comp, options) => {
		comp = comp.trim();
		const r = options.loose ? re[t.XRANGELOOSE] : re[t.XRANGE];
		return comp.replace(r, (ret, gtlt, M, m, p, pr) => {
			debug("xRange", comp, ret, gtlt, M, m, p, pr);
			if (invalidXRangeOrder(M, m, p)) return comp;
			const xM = isX(M);
			const xm = xM || isX(m);
			const xp = xm || isX(p);
			const anyX = xp;
			if (gtlt === "=" && anyX) gtlt = "";
			pr = options.includePrerelease ? "-0" : "";
			if (xM) if (gtlt === ">" || gtlt === "<") ret = "<0.0.0-0";
			else ret = "*";
			else if (gtlt && anyX) {
				if (xm) m = 0;
				p = 0;
				if (gtlt === ">") {
					gtlt = ">=";
					if (xm) {
						M = +M + 1;
						m = 0;
						p = 0;
					} else {
						m = +m + 1;
						p = 0;
					}
				} else if (gtlt === "<=") {
					gtlt = "<";
					if (xm) M = +M + 1;
					else m = +m + 1;
				}
				if (gtlt === "<") pr = "-0";
				ret = `${gtlt + M}.${m}.${p}${pr}`;
			} else if (xm) ret = `>=${M}.0.0${pr} <${+M + 1}.0.0-0`;
			else if (xp) ret = `>=${M}.${m}.0${pr} <${M}.${+m + 1}.0-0`;
			debug("xRange return", ret);
			return ret;
		});
	};
	const replaceStars = (comp, options) => {
		debug("replaceStars", comp, options);
		return comp.trim().replace(re[t.STAR], "");
	};
	const replaceGTE0 = (comp, options) => {
		debug("replaceGTE0", comp, options);
		return comp.trim().replace(re[options.includePrerelease ? t.GTE0PRE : t.GTE0], "");
	};
	const hyphenReplace = (incPr) => ($0, from, fM, fm, fp, fpr, fb, to, tM, tm, tp, tpr) => {
		if (isX(fM)) from = "";
		else if (isX(fm)) from = `>=${fM}.0.0${incPr ? "-0" : ""}`;
		else if (isX(fp)) from = `>=${fM}.${fm}.0${incPr ? "-0" : ""}`;
		else if (fpr) from = `>=${from}`;
		else from = `>=${from}${incPr ? "-0" : ""}`;
		if (isX(tM)) to = "";
		else if (isX(tm)) to = `<${+tM + 1}.0.0-0`;
		else if (isX(tp)) to = `<${tM}.${+tm + 1}.0-0`;
		else if (tpr) to = `<=${tM}.${tm}.${tp}-${tpr}`;
		else if (incPr) to = `<${tM}.${tm}.${+tp + 1}-0`;
		else to = `<=${to}`;
		return `${from} ${to}`.trim();
	};
	const testSet = (set, version, options) => {
		for (let i = 0; i < set.length; i++) if (!set[i].test(version)) return false;
		if (version.prerelease.length && !options.includePrerelease) {
			for (let i = 0; i < set.length; i++) {
				debug(set[i].semver);
				if (set[i].semver === Comparator.ANY) continue;
				if (set[i].semver.prerelease.length > 0) {
					const allowed = set[i].semver;
					if (allowed.major === version.major && allowed.minor === version.minor && allowed.patch === version.patch) return true;
				}
			}
			return false;
		}
		return true;
	};
}));
var require_satisfies = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const Range = require_range();
	const satisfies = (version, range, options) => {
		try {
			range = new Range(range, options);
		} catch (er) {
			return false;
		}
		return range.test(version);
	};
	module.exports = satisfies;
}));
var require_parse = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const SemVer = require_semver();
	const parse = (version, options, throwErrors = false) => {
		if (version instanceof SemVer) return version;
		try {
			return new SemVer(version, options);
		} catch (er) {
			if (!throwErrors) return null;
			throw er;
		}
	};
	module.exports = parse;
}));
var require_valid$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const parse = require_parse();
	const valid = (version, options) => {
		const v = parse(version, options);
		return v ? v.version : null;
	};
	module.exports = valid;
}));
var require_valid = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const Range = require_range();
	const validRange = (range, options) => {
		try {
			return new Range(range, options).range || "*";
		} catch (er) {
			return null;
		}
	};
	module.exports = validRange;
}));
//#endregion
//#region self-essentials/emdash-main/packages/registry-client/dist/env/index.js
var import_satisfies = /* @__PURE__ */ __toESM(require_satisfies(), 1);
var import_valid = /* @__PURE__ */ __toESM(require_valid$1(), 1);
var import_valid$1 = /* @__PURE__ */ __toESM(require_valid(), 1);
/** `env:<name>` keys, where `<name>` is one or more non-colon characters. */
var ENV_KEY_RE = /^env:[^:]+$/;
/** Structural DID shape: `did:<method>:<id>` (forward-compat for package deps). */
var DID_KEY_RE = /^did:[a-z]+:.+$/;
/**
* Build the host-environment map the install/update gate compares a release's
* `requires` against, from the EmDash and Astro versions the host advertises.
*
* An environment whose version is unknown is omitted so the gate skips it
* rather than blocking on a version it can't evaluate: an uncompiled build
* reporting `"dev"` for EmDash, or an unresolved Astro version. Shared by the
* server install/update gate and the admin's client-side compat warning so the
* dev-skip / astro-omit rule lives in exactly one place.
*/
function hostEnvFromVersions(emdashVersion, astroVersion) {
	const host = {};
	if (emdashVersion && emdashVersion !== "dev") host["env:emdash"] = emdashVersion;
	if (astroVersion) host["env:astro"] = astroVersion;
	return host;
}
/**
* Guard the lexicon-`unknown` `requires` value into a string-valued record of
* recognised keys. Drops any entry whose key is not `env:*`/DID-shaped or whose
* value is not a string. Never throws.
*/
function parseRequires(value) {
	if (value === null || typeof value !== "object" || Array.isArray(value)) return {};
	const out = {};
	for (const [key, raw] of Object.entries(value)) {
		if (typeof raw !== "string") continue;
		if (!ENV_KEY_RE.test(key) && !DID_KEY_RE.test(key)) continue;
		out[key] = raw;
	}
	return out;
}
/**
* True when `version` satisfies `range`.
*
* Fails open (returns `true`) when either input is unparseable: an unparseable
* host version cannot be proven incompatible, and an unparseable range is
* garbage we decline to enforce. Both cases are non-blocking by design — the
* gate only refuses on a definite mismatch.
*
* `includePrerelease` evaluates a prerelease host version (a beta EmDash/Astro
* build) by its precedence rather than excluding it from release-only ranges.
* Without it, node-semver would refuse `1.0.0-rc.1` against `*` or `>=0.13.0`,
* blocking a prerelease host that is not a definite mismatch.
*/
function satisfiesRange(version, range) {
	if ((0, import_valid.default)(version) === null) return true;
	if ((0, import_valid$1.default)(range) === null) return true;
	return (0, import_satisfies.default)(version, range, { includePrerelease: true });
}
/**
* Compare a release's `requires` against the host environment and return the
* env keys whose host version does not satisfy the required range.
*
* Entries the host doesn't advertise (no known version for that key) are
* skipped — we can't evaluate a constraint against an environment we don't
* know we're running in. The `requires` argument is the raw lexicon-`unknown`
* value; it is guarded internally.
*/
function checkEnvCompatibility(requires, host) {
	const parsed = parseRequires(requires);
	const mismatches = [];
	for (const [key, range] of Object.entries(parsed)) {
		const hostVersion = host[key];
		if (hostVersion === void 0) continue;
		if (!satisfiesRange(hostVersion, range)) mismatches.push({
			key,
			required: range,
			host: hostVersion
		});
	}
	return mismatches;
}
/**
* Find the `env:*` constraints in `requires` that {@link checkEnvCompatibility}
* silently skips because the host can't evaluate them: the host advertises no
* version for that env, or advertises one that isn't parseable semver. These
* are the cases where a hard gate degrades to a no-op, so the server can log
* them rather than bypass silently.
*
* DID-keyed constraints are excluded — those are forward-compat package deps,
* not host environments, and their absence from the host map is expected.
*/
function findSkippedEnvConstraints(requires, host) {
	const parsed = parseRequires(requires);
	const skipped = [];
	for (const [key, range] of Object.entries(parsed)) {
		if (!ENV_KEY_RE.test(key)) continue;
		const hostVersion = host[key];
		if (hostVersion === void 0) skipped.push({
			key,
			required: range,
			reason: "unknown"
		});
		else if ((0, import_valid.default)(hostVersion) === null) skipped.push({
			key,
			required: range,
			reason: "unparseable"
		});
	}
	return skipped;
}
//#endregion
//#region self-essentials/emdash-main/packages/core/dist/api-DgPbMlng.mjs
function encodeRev(item) {
	return encodeBase64(`${item.version}:${item.updatedAt}`);
}
function decodeRev(rev) {
	try {
		const decoded = decodeBase64(rev);
		const colonIdx = decoded.indexOf(":");
		if (colonIdx === -1) return null;
		const version = parseInt(decoded.slice(0, colonIdx), 10);
		const updatedAt = decoded.slice(colonIdx + 1);
		if (isNaN(version) || !updatedAt) return null;
		return {
			version,
			updatedAt
		};
	} catch {
		return null;
	}
}
function validateRev(rev, item) {
	if (!rev) return { valid: true };
	const decoded = decodeRev(rev);
	if (!decoded) return {
		valid: false,
		message: "Malformed _rev token"
	};
	if (decoded.version !== item.version || decoded.updatedAt !== item.updatedAt) return {
		valid: false,
		message: "Content has been modified since last read (version conflict)"
	};
	return { valid: true };
}
function asMediaRef(value) {
	if (value === null || value === void 0) return null;
	if (typeof value !== "object" || Array.isArray(value)) return null;
	return value;
}
function fail(message) {
	return {
		success: false,
		error: {
			code: "INVALID_MIME_FOR_FIELD",
			message
		}
	};
}
async function loadMediaFieldsForCollection(db, collectionSlug) {
	const rows = await db.selectFrom("_emdash_fields").innerJoin("_emdash_collections", "_emdash_collections.id", "_emdash_fields.collection_id").select([
		"_emdash_fields.slug",
		"_emdash_fields.type",
		"_emdash_fields.validation"
	]).where("_emdash_collections.slug", "=", collectionSlug).where("_emdash_fields.type", "in", ["file", "image"]).execute();
	const out = [];
	for (const row of rows) {
		const list = parseAllowedMimeTypes(row.validation);
		if (!list) continue;
		out.push({
			slug: row.slug,
			type: row.type,
			allowedMimeTypes: list
		});
	}
	return out;
}
async function validateMediaFields(db, collectionSlug, data) {
	const fields = await requestCached(`mediaFields:${collectionSlug}`, () => loadMediaFieldsForCollection(db, collectionSlug));
	if (fields.length === 0) return {
		success: true,
		data: true
	};
	const localIds = /* @__PURE__ */ new Set();
	for (const field of fields) {
		const ref = asMediaRef(data[field.slug]);
		if (!ref) continue;
		if ((typeof ref.provider === "string" ? ref.provider : "local") === "local" && typeof ref.id === "string") localIds.add(ref.id);
	}
	const idList = [...localIds];
	const mimeById = /* @__PURE__ */ new Map();
	if (idList.length > 0) for (const batch of chunks(idList, 50)) {
		const rows = await db.selectFrom("media").select(["id", "mime_type"]).where("id", "in", batch).execute();
		for (const r of rows) mimeById.set(r.id, r.mime_type);
	}
	for (const field of fields) {
		const value = data[field.slug];
		if (value === null || value === void 0) continue;
		const ref = asMediaRef(value);
		if (!ref) continue;
		const provider = typeof ref.provider === "string" ? ref.provider : "local";
		let mime;
		if (provider === "local") {
			if (typeof ref.id !== "string") return fail(`Field '${field.slug}' references media with an invalid id`);
			mime = mimeById.get(ref.id);
			if (!mime) return fail(`Field '${field.slug}' references media with unknown MIME type`);
		} else {
			if (typeof ref.mimeType !== "string") return fail(`Field '${field.slug}' requires a mimeType declaration for non-local media`);
			mime = ref.mimeType;
		}
		if (!matchesMimeAllowlist(mime, field.allowedMimeTypes)) return fail(`Field '${field.slug}' does not accept ${mime}`);
	}
	return {
		success: true,
		data: true
	};
}
function hasApiError(error) {
	if (!(error instanceof Error) || !("apiError" in error)) return false;
	const { apiError } = error;
	return typeof apiError === "object" && apiError !== null && "code" in apiError && typeof apiError.code === "string";
}
function getSlugSource(data) {
	if (typeof data.title === "string" && data.title.length > 0) return data.title;
	if (typeof data.name === "string" && data.name.length > 0) return data.name;
	return null;
}
var SEO_DEFAULTS = {
	title: null,
	description: null,
	image: null,
	canonical: null,
	noIndex: false
};
async function collectionHasSeo(db, collection) {
	return (await db.selectFrom("_emdash_collections").select("has_seo").where("slug", "=", collection).executeTakeFirst())?.has_seo === 1;
}
async function hydrateSeo(db, collection, item, hasSeo) {
	if (!hasSeo) return;
	item.seo = await new SeoRepository(db).get(collection, item.id);
}
async function hydrateSeoMany(db, collection, items, hasSeo) {
	if (!hasSeo || items.length === 0) return;
	const seoMap = await new SeoRepository(db).getMany(collection, items.map((i) => i.id));
	for (const item of items) item.seo = seoMap.get(item.id) ?? { ...SEO_DEFAULTS };
}
async function hydrateBylines(db, collection, item) {
	const bylineRepo = new BylineRepository(db);
	const localeOpt = item.locale ? { locale: item.locale } : void 0;
	const bylines = await bylineRepo.getContentBylines(collection, item.id, localeOpt);
	if (bylines.length > 0) {
		item.bylines = bylines.map((c) => ({
			...c,
			source: "explicit"
		}));
		item.byline = bylines[0]?.byline ?? null;
		return;
	}
	if (item.primaryBylineId) {
		item.bylines = [];
		item.byline = null;
		return;
	}
	if (item.authorId) {
		const fallback = await bylineRepo.findByUserId(item.authorId, localeOpt);
		if (fallback) {
			item.bylines = [{
				byline: fallback,
				sortOrder: 0,
				roleLabel: null,
				source: "inferred"
			}];
			item.byline = fallback;
			return;
		}
	}
	item.bylines = [];
	item.byline = null;
}
async function hydrateBylinesMany(db, collection, items) {
	if (items.length === 0) return;
	const bylineRepo = new BylineRepository(db);
	const localeBuckets = /* @__PURE__ */ new Map();
	for (const item of items) {
		const key = item.locale ?? null;
		const bucket = localeBuckets.get(key);
		if (bucket) bucket.push(item);
		else localeBuckets.set(key, [item]);
	}
	const bylinesByItem = /* @__PURE__ */ new Map();
	const itemsNeedingAuthorCheck = [];
	for (const [locale, bucket] of localeBuckets) {
		const localeOpt = locale ? { locale } : void 0;
		const ids = bucket.map((i) => i.id);
		const credits = await bylineRepo.getContentBylinesMany(collection, ids, localeOpt);
		for (const [id, list] of credits) bylinesByItem.set(id, list);
		for (const item of bucket) {
			if (credits.has(item.id) && credits.get(item.id).length > 0) continue;
			if (item.authorId) itemsNeedingAuthorCheck.push(item);
		}
	}
	const fallbackByItem = /* @__PURE__ */ new Map();
	if (itemsNeedingAuthorCheck.length > 0) {
		const authorBuckets = /* @__PURE__ */ new Map();
		for (const item of itemsNeedingAuthorCheck) {
			if (item.primaryBylineId) continue;
			const key = item.locale ?? null;
			const bucket = authorBuckets.get(key);
			if (bucket) bucket.push(item);
			else authorBuckets.set(key, [item]);
		}
		for (const [locale, bucket] of authorBuckets) {
			const localeOpt = locale ? { locale } : void 0;
			const authorIds = bucket.map((i) => i.authorId).filter((id) => id !== null);
			const uniqueAuthorIds = [...new Set(authorIds)];
			if (uniqueAuthorIds.length === 0) continue;
			const authorMap = await bylineRepo.findByUserIds(uniqueAuthorIds, localeOpt);
			for (const item of bucket) {
				if (!item.authorId) continue;
				const f = authorMap.get(item.authorId);
				if (f) fallbackByItem.set(item.id, f);
			}
		}
	}
	for (const item of items) {
		const explicit = bylinesByItem.get(item.id);
		if (explicit && explicit.length > 0) {
			item.bylines = explicit.map((c) => ({
				...c,
				source: "explicit"
			}));
			item.byline = explicit[0]?.byline ?? null;
			continue;
		}
		const fallback = fallbackByItem.get(item.id);
		if (fallback) {
			item.bylines = [{
				byline: fallback,
				sortOrder: 0,
				roleLabel: null,
				source: "inferred"
			}];
			item.byline = fallback;
			continue;
		}
		item.bylines = [];
		item.byline = null;
	}
}
async function resolveId(repo, collection, identifier, locale) {
	return (await repo.findByIdOrSlug(collection, identifier, locale ? resolveConfiguredLocale(locale) : void 0))?.id ?? null;
}
async function resolveIdIncludingTrashed(repo, collection, identifier, locale) {
	return (await repo.findByIdOrSlugIncludingTrashed(collection, identifier, locale ? resolveConfiguredLocale(locale) : void 0))?.id ?? null;
}
async function resolveSearchColumns(db, collection) {
	const columns = ["slug"];
	const row = await db.selectFrom("_emdash_collections").select("id").where("slug", "=", collection).executeTakeFirst();
	if (!row) return columns;
	const fields = await db.selectFrom("_emdash_fields").select("slug").where("collection_id", "=", row.id).execute();
	const fieldSlugs = new Set(fields.map((f) => f.slug));
	for (const candidate of ["title", "name"]) if (fieldSlugs.has(candidate)) columns.push(candidate);
	return columns;
}
async function canUseFtsForListFilter(db, collection, searchColumns) {
	if (!isSqlite(db)) return false;
	const ftsManager = new FTSManager(db);
	if (!(await ftsManager.getSearchConfig(collection))?.enabled) return false;
	const searchable = new Set(await ftsManager.getSearchableFields(collection));
	if (!searchColumns.every((col) => col === "slug" || searchable.has(col))) return false;
	return ftsManager.ftsTableExists(collection);
}
async function createSlugChangeRedirect(db, collection, oldSlug, newSlug, contentId) {
	const collectionRow = await db.selectFrom("_emdash_collections").select("url_pattern").where("slug", "=", collection).executeTakeFirst();
	await new RedirectRepository(db).createAutoRedirect(collection, oldSlug, newSlug, contentId, collectionRow?.url_pattern ?? null);
	invalidateRedirectCache();
}
var DATE_ONLY_RE = /^\d{4}-\d{2}-\d{2}$/;
function normalizeDateBound(value, edge) {
	if (!value) return void 0;
	if (!DATE_ONLY_RE.test(value)) return value;
	return edge === "start" ? `${value}T00:00:00.000Z` : `${value}T23:59:59.999Z`;
}
async function handleContentList(db, collection, params) {
	try {
		const repo = new ContentRepository(db);
		const where = {};
		if (params.status) where.status = params.status;
		if (params.locale) where.locale = resolveConfiguredLocale(params.locale);
		if (params.authorId) where.authorId = params.authorId;
		if (params.dateField && (params.dateFrom || params.dateTo)) where.dateFilter = {
			field: params.dateField,
			from: normalizeDateBound(params.dateFrom, "start"),
			to: normalizeDateBound(params.dateTo, "end")
		};
		const q = params.q?.trim();
		if (q) {
			where.q = q;
			where.searchColumns = await resolveSearchColumns(db, collection);
			where.useFts = await canUseFtsForListFilter(db, collection, where.searchColumns);
		}
		const result = await repo.findMany(collection, {
			cursor: params.cursor,
			limit: params.limit || 50,
			where: Object.keys(where).length > 0 ? where : void 0,
			orderBy: params.orderBy ? {
				field: params.orderBy,
				direction: params.order || "desc"
			} : void 0
		});
		const hasSeo = await collectionHasSeo(db, collection);
		await hydrateSeoMany(db, collection, result.items, hasSeo);
		await hydrateBylinesMany(db, collection, result.items);
		return {
			success: true,
			data: {
				items: result.items,
				nextCursor: result.nextCursor,
				total: result.total
			}
		};
	} catch (error) {
		if (error instanceof InvalidCursorError) return {
			success: false,
			error: {
				code: "INVALID_CURSOR",
				message: error.message
			}
		};
		if (isMissingTableError(error)) return {
			success: false,
			error: {
				code: "COLLECTION_NOT_FOUND",
				message: `Collection '${collection}' not found`
			}
		};
		if (isMissingColumnError(error, "deleted_at")) return {
			success: false,
			error: {
				code: "COLLECTION_SCHEMA_MISMATCH",
				message: `Collection '${collection}' backing table is missing the 'deleted_at' column`
			}
		};
		if (error instanceof EmDashValidationError) return {
			success: false,
			error: {
				code: "VALIDATION_ERROR",
				message: error.message
			}
		};
		console.error("Content list error:", error);
		return {
			success: false,
			error: {
				code: "CONTENT_LIST_ERROR",
				message: "Failed to list content"
			}
		};
	}
}
async function handleContentAuthors(db, collection) {
	try {
		const authorIds = await new ContentRepository(db).findDistinctAuthorIds(collection);
		if (authorIds.length === 0) return {
			success: true,
			data: { items: [] }
		};
		return {
			success: true,
			data: { items: (await new UserRepository(db).findByIds(authorIds)).map((u) => ({
				id: u.id,
				name: u.name,
				email: u.email,
				avatarUrl: u.avatarUrl
			})).toSorted((a, b) => (a.name ?? a.email).localeCompare(b.name ?? b.email)) }
		};
	} catch (error) {
		if (isMissingTableError(error)) return {
			success: false,
			error: {
				code: "COLLECTION_NOT_FOUND",
				message: `Collection '${collection}' not found`
			}
		};
		console.error("Content authors error:", error);
		return {
			success: false,
			error: {
				code: "CONTENT_AUTHORS_ERROR",
				message: "Failed to list content authors"
			}
		};
	}
}
async function handleContentGet(db, collection, id, locale) {
	try {
		const item = await new ContentRepository(db).findByIdOrSlug(collection, id, locale ? resolveConfiguredLocale(locale) : void 0);
		if (!item) return {
			success: false,
			error: {
				code: "NOT_FOUND",
				message: `Content item not found: ${id}`
			}
		};
		await hydrateSeo(db, collection, item, await collectionHasSeo(db, collection));
		await hydrateBylines(db, collection, item);
		return {
			success: true,
			data: {
				item,
				_rev: encodeRev(item)
			}
		};
	} catch (error) {
		console.error("Content get error:", error);
		return {
			success: false,
			error: {
				code: "CONTENT_GET_ERROR",
				message: "Failed to get content"
			}
		};
	}
}
async function handleContentGetIncludingTrashed(db, collection, id, locale) {
	try {
		const item = await new ContentRepository(db).findByIdOrSlugIncludingTrashed(collection, id, locale ? resolveConfiguredLocale(locale) : void 0);
		if (!item) return {
			success: false,
			error: {
				code: "NOT_FOUND",
				message: `Content item not found: ${id}`
			}
		};
		await hydrateSeo(db, collection, item, await collectionHasSeo(db, collection));
		await hydrateBylines(db, collection, item);
		return {
			success: true,
			data: {
				item,
				_rev: encodeRev(item)
			}
		};
	} catch (error) {
		console.error("Content get error:", error);
		return {
			success: false,
			error: {
				code: "CONTENT_GET_ERROR",
				message: "Failed to get content"
			}
		};
	}
}
async function handleContentCreate(db, collection, body) {
	try {
		const hasSeo = await collectionHasSeo(db, collection);
		if (body.seo && !hasSeo) return {
			success: false,
			error: {
				code: "VALIDATION_ERROR",
				message: `Collection "${collection}" does not have SEO enabled. Remove the seo field or enable SEO on this collection.`
			}
		};
		const mimeCheck = await validateMediaFields(db, collection, body.data);
		if (!mimeCheck.success) return mimeCheck;
		const item = await withTransaction(db, async (trx) => {
			const repo = new ContentRepository(trx);
			const bylineRepo = new BylineRepository(trx);
			const effectiveLocale = body.locale ? resolveConfiguredLocale(body.locale) : getI18nConfig()?.defaultLocale;
			let slug = body.slug;
			if (!slug) {
				const slugSource = getSlugSource(body.data);
				if (slugSource) slug = await repo.generateUniqueSlug(collection, slugSource, effectiveLocale);
			}
			const created = await repo.create({
				type: collection,
				slug,
				data: body.data,
				status: body.status || "draft",
				authorId: body.authorId,
				locale: effectiveLocale,
				translationOf: body.translationOf,
				createdAt: body.createdAt,
				publishedAt: body.publishedAt
			});
			if (body.bylines !== void 0) created.primaryBylineId = (await bylineRepo.setContentBylines(collection, created.id, body.bylines))[0]?.byline.translationGroup ?? null;
			if (body.translationOf) {
				await new TaxonomyRepository(trx).copyEntryTerms(collection, body.translationOf, created.id);
				if (body.bylines === void 0) {
					await bylineRepo.copyContentBylines(collection, body.translationOf, created.id);
					const source = await repo.findById(collection, body.translationOf);
					if (source) created.primaryBylineId = source.primaryBylineId;
				}
			}
			await hydrateBylines(trx, collection, created);
			if (body.seo && hasSeo) created.seo = await new SeoRepository(trx).upsert(collection, created.id, body.seo);
			else if (hasSeo) created.seo = { ...SEO_DEFAULTS };
			if (body.taxonomies) await assignTaxonomies(trx, collection, created.id, effectiveLocale, body.taxonomies);
			return created;
		});
		return {
			success: true,
			data: {
				item,
				_rev: encodeRev(item)
			}
		};
	} catch (error) {
		if (isMissingTableError(error)) return {
			success: false,
			error: {
				code: "COLLECTION_NOT_FOUND",
				message: `Collection '${collection}' not found`
			}
		};
		if (error instanceof EmDashValidationError) return {
			success: false,
			error: {
				code: "VALIDATION_ERROR",
				message: error.message
			}
		};
		const message = error instanceof Error ? error.message.toLowerCase() : "";
		if (message.includes("unique constraint failed") || message.includes("duplicate key")) {
			if (message.includes("slug")) return {
				success: false,
				error: {
					code: "SLUG_CONFLICT",
					message: `Slug '${body.slug ?? "(auto-generated)"}' already exists in collection '${collection}'`
				}
			};
			return {
				success: false,
				error: {
					code: "CONFLICT",
					message: "Unique constraint violation"
				}
			};
		}
		console.error("Content create error:", error);
		return {
			success: false,
			error: {
				code: "CONTENT_CREATE_ERROR",
				message: "Failed to create content"
			}
		};
	}
}
async function handleContentUpdate(db, collection, id, body) {
	try {
		const hasSeo = await collectionHasSeo(db, collection);
		if (body.seo && !hasSeo) return {
			success: false,
			error: {
				code: "VALIDATION_ERROR",
				message: `Collection "${collection}" does not have SEO enabled. Remove the seo field or enable SEO on this collection.`
			}
		};
		if (body.data) {
			const mimeCheck = await validateMediaFields(db, collection, body.data);
			if (!mimeCheck.success) return mimeCheck;
		}
		const resolvedId = await resolveId(new ContentRepository(db), collection, id, body.locale) ?? id;
		const item = await withTransaction(db, async (trx) => {
			const trxRepo = new ContentRepository(trx);
			const bylineRepo = new BylineRepository(trx);
			const existing = body._rev || body.slug ? await trxRepo.findById(collection, resolvedId) : null;
			if (body._rev) {
				if (!existing) throw Object.assign(/* @__PURE__ */ new Error(`Content item not found: ${id}`), { apiError: { code: "NOT_FOUND" } });
				const revCheck = validateRev(body._rev, existing);
				if (!revCheck.valid) throw Object.assign(new Error(revCheck.message), { apiError: { code: "CONFLICT" } });
			}
			let oldSlug;
			if (body.slug && existing?.slug && existing.slug !== body.slug) oldSlug = existing.slug;
			const updated = await trxRepo.update(collection, resolvedId, {
				data: body.data,
				slug: body.slug,
				status: body.status,
				authorId: body.authorId,
				publishedAt: body.publishedAt
			});
			if (body.bylines !== void 0) updated.primaryBylineId = (await bylineRepo.setContentBylines(collection, resolvedId, body.bylines))[0]?.byline.translationGroup ?? null;
			if (oldSlug && body.slug) await createSlugChangeRedirect(trx, collection, oldSlug, body.slug, resolvedId);
			if (isI18nEnabled() && body.data && updated.translationGroup) await syncNonTranslatableFields(trx, collection, updated.id, updated.translationGroup, body.data);
			if (body.seo && hasSeo) updated.seo = await new SeoRepository(trx).upsert(collection, resolvedId, body.seo);
			else if (hasSeo) updated.seo = await new SeoRepository(trx).get(collection, resolvedId);
			await hydrateBylines(trx, collection, updated);
			if (body.taxonomies) await assignTaxonomies(trx, collection, resolvedId, updated.locale ?? body.locale, body.taxonomies);
			return updated;
		});
		return {
			success: true,
			data: {
				item,
				_rev: encodeRev(item)
			}
		};
	} catch (error) {
		if (hasApiError(error)) return {
			success: false,
			error: {
				code: error.apiError.code,
				message: error.message
			}
		};
		if (isMissingTableError(error)) return {
			success: false,
			error: {
				code: "COLLECTION_NOT_FOUND",
				message: `Collection '${collection}' not found`
			}
		};
		if (error instanceof EmDashValidationError) return {
			success: false,
			error: {
				code: "VALIDATION_ERROR",
				message: error.message
			}
		};
		const message = error instanceof Error ? error.message.toLowerCase() : "";
		if (message.includes("unique constraint failed") || message.includes("duplicate key")) {
			if (message.includes("slug")) return {
				success: false,
				error: {
					code: "SLUG_CONFLICT",
					message: `Slug '${body.slug ?? id}' already exists in collection '${collection}'`
				}
			};
			return {
				success: false,
				error: {
					code: "CONFLICT",
					message: "Unique constraint violation"
				}
			};
		}
		console.error("Content update error:", error);
		return {
			success: false,
			error: {
				code: "CONTENT_UPDATE_ERROR",
				message: "Failed to update content"
			}
		};
	}
}
async function handleContentDuplicate(db, collection, id, authorId) {
	try {
		const hasSeo = await collectionHasSeo(db, collection);
		return {
			success: true,
			data: { item: await withTransaction(db, async (trx) => {
				const repo = new ContentRepository(trx);
				const bylineRepo = new BylineRepository(trx);
				const resolvedId = await resolveId(repo, collection, id) ?? id;
				const dup = await repo.duplicate(collection, resolvedId, authorId);
				const existingBylines = await bylineRepo.getContentBylines(collection, resolvedId);
				if (existingBylines.length > 0) await bylineRepo.setContentBylines(collection, dup.id, existingBylines.map((entry) => ({
					bylineId: entry.byline.id,
					roleLabel: entry.roleLabel
				})));
				if (hasSeo) {
					const seoRepo = new SeoRepository(trx);
					await seoRepo.copyForDuplicate(collection, resolvedId, dup.id);
					dup.seo = await seoRepo.get(collection, dup.id);
				}
				await hydrateBylines(trx, collection, dup);
				return dup;
			}) }
		};
	} catch (err) {
		if (err instanceof EmDashValidationError) return {
			success: false,
			error: {
				code: "NOT_FOUND",
				message: err.message
			}
		};
		console.error("Content duplicate error:", err);
		return {
			success: false,
			error: {
				code: "CONTENT_DUPLICATE_ERROR",
				message: "Failed to duplicate content"
			}
		};
	}
}
async function handleContentDelete(db, collection, id) {
	try {
		const result = await withTransaction(db, async (trx) => {
			const repo = new ContentRepository(trx);
			const resolvedId = await resolveId(repo, collection, id) ?? id;
			return {
				id: resolvedId,
				deleted: await repo.delete(collection, resolvedId)
			};
		});
		if (!result.deleted) return {
			success: false,
			error: {
				code: "NOT_FOUND",
				message: `Content item not found: ${id}`
			}
		};
		return {
			success: true,
			data: {
				deleted: true,
				id: result.id
			}
		};
	} catch (error) {
		console.error("Content delete error:", error);
		return {
			success: false,
			error: {
				code: "CONTENT_DELETE_ERROR",
				message: "Failed to delete content"
			}
		};
	}
}
async function handleContentRestore(db, collection, id) {
	try {
		const item = await withTransaction(db, async (trx) => {
			const repo = new ContentRepository(trx);
			const resolvedId = await resolveIdIncludingTrashed(repo, collection, id) ?? id;
			return repo.restore(collection, resolvedId);
		});
		if (!item) return {
			success: false,
			error: {
				code: "NOT_FOUND",
				message: `Trashed content item not found: ${id}`
			}
		};
		return {
			success: true,
			data: {
				restored: true,
				item
			}
		};
	} catch (error) {
		console.error("Content restore error:", error);
		return {
			success: false,
			error: {
				code: "CONTENT_RESTORE_ERROR",
				message: "Failed to restore content"
			}
		};
	}
}
async function handleContentPermanentDelete(db, collection, id) {
	try {
		const resolvedId = await resolveIdIncludingTrashed(new ContentRepository(db), collection, id) ?? id;
		if (!await withTransaction(db, async (trx) => {
			const wasDeleted = await new ContentRepository(trx).permanentDelete(collection, resolvedId);
			if (wasDeleted) {
				await new SeoRepository(trx).delete(collection, resolvedId);
				await new CommentRepository(trx).deleteByContent(collection, resolvedId);
				await new RevisionRepository(trx).deleteByEntry(collection, resolvedId);
			}
			return wasDeleted;
		})) return {
			success: false,
			error: {
				code: "NOT_FOUND",
				message: `Content item not found: ${id}`
			}
		};
		return {
			success: true,
			data: {
				deleted: true,
				id: resolvedId
			}
		};
	} catch (error) {
		console.error("Content permanent delete error:", error);
		return {
			success: false,
			error: {
				code: "CONTENT_DELETE_ERROR",
				message: "Failed to permanently delete content"
			}
		};
	}
}
async function handleContentListTrashed(db, collection, options = {}) {
	try {
		const result = await new ContentRepository(db).findTrashed(collection, {
			limit: options.limit,
			cursor: options.cursor
		});
		return {
			success: true,
			data: {
				items: result.items.map((item) => ({
					id: item.id,
					type: item.type,
					slug: item.slug,
					status: item.status,
					data: item.data,
					authorId: item.authorId,
					createdAt: item.createdAt,
					updatedAt: item.updatedAt,
					publishedAt: item.publishedAt,
					deletedAt: item.deletedAt
				})),
				nextCursor: result.nextCursor
			}
		};
	} catch (error) {
		if (error instanceof InvalidCursorError) return {
			success: false,
			error: {
				code: "INVALID_CURSOR",
				message: error.message
			}
		};
		console.error("Content list trashed error:", error);
		return {
			success: false,
			error: {
				code: "CONTENT_LIST_ERROR",
				message: "Failed to list trashed content"
			}
		};
	}
}
async function handleContentCountTrashed(db, collection) {
	try {
		return {
			success: true,
			data: { count: await new ContentRepository(db).countTrashed(collection) }
		};
	} catch (error) {
		console.error("Content count trashed error:", error);
		return {
			success: false,
			error: {
				code: "CONTENT_COUNT_ERROR",
				message: "Failed to count trashed content"
			}
		};
	}
}
async function handleContentSchedule(db, collection, id, scheduledAt) {
	try {
		const item = await withTransaction(db, async (trx) => {
			const repo = new ContentRepository(trx);
			const resolvedId = await resolveId(repo, collection, id) ?? id;
			return repo.schedule(collection, resolvedId, scheduledAt);
		});
		await hydrateSeo(db, collection, item, await collectionHasSeo(db, collection));
		return {
			success: true,
			data: { item }
		};
	} catch (error) {
		if (error instanceof EmDashValidationError) return {
			success: false,
			error: {
				code: "VALIDATION_ERROR",
				message: error.message
			}
		};
		console.error("Content schedule error:", error);
		return {
			success: false,
			error: {
				code: "CONTENT_SCHEDULE_ERROR",
				message: "Failed to schedule content"
			}
		};
	}
}
async function handleContentUnschedule(db, collection, id) {
	try {
		const item = await withTransaction(db, async (trx) => {
			const repo = new ContentRepository(trx);
			const resolvedId = await resolveId(repo, collection, id) ?? id;
			return repo.unschedule(collection, resolvedId);
		});
		await hydrateSeo(db, collection, item, await collectionHasSeo(db, collection));
		return {
			success: true,
			data: { item }
		};
	} catch (error) {
		if (error instanceof EmDashValidationError) return {
			success: false,
			error: {
				code: "VALIDATION_ERROR",
				message: error.message
			}
		};
		console.error("Content unschedule error:", error);
		return {
			success: false,
			error: {
				code: "CONTENT_UNSCHEDULE_ERROR",
				message: "Failed to unschedule content"
			}
		};
	}
}
async function handleContentPublish(db, collection, id, options = {}) {
	try {
		const item = await withTransaction(db, async (trx) => {
			const repo = new ContentRepository(trx);
			const resolvedId = await resolveId(repo, collection, id) ?? id;
			const existing = await repo.findById(collection, resolvedId);
			const published = await repo.publish(collection, resolvedId, options.publishedAt, options.requireScheduledDue);
			if (existing?.status === "published" && existing.slug && published.slug && existing.slug !== published.slug) await createSlugChangeRedirect(trx, collection, existing.slug, published.slug, resolvedId);
			return published;
		});
		await hydrateSeo(db, collection, item, await collectionHasSeo(db, collection));
		return {
			success: true,
			data: { item }
		};
	} catch (error) {
		if (error instanceof ScheduledNotDueError) return {
			success: false,
			error: {
				code: "NOT_DUE",
				message: error.message
			}
		};
		if (error instanceof EmDashValidationError) {
			const details = error.details;
			return {
				success: false,
				error: {
					code: typeof details === "object" && details !== null && "code" in details && details.code === "SLUG_CONFLICT" ? "SLUG_CONFLICT" : "VALIDATION_ERROR",
					message: error.message
				}
			};
		}
		const message = error instanceof Error ? error.message.toLowerCase() : "";
		if ((message.includes("unique constraint failed") || message.includes("duplicate key")) && message.includes("slug")) return {
			success: false,
			error: {
				code: "SLUG_CONFLICT",
				message: `The staged slug is already used by another entry in collection '${collection}'`
			}
		};
		console.error("Content publish error:", error);
		return {
			success: false,
			error: {
				code: "CONTENT_PUBLISH_ERROR",
				message: "Failed to publish content"
			}
		};
	}
}
async function handleContentUnpublish(db, collection, id) {
	try {
		const item = await withTransaction(db, async (trx) => {
			const repo = new ContentRepository(trx);
			const resolvedId = await resolveId(repo, collection, id) ?? id;
			return repo.unpublish(collection, resolvedId);
		});
		await hydrateSeo(db, collection, item, await collectionHasSeo(db, collection));
		return {
			success: true,
			data: { item }
		};
	} catch (error) {
		if (error instanceof EmDashValidationError) return {
			success: false,
			error: {
				code: "VALIDATION_ERROR",
				message: error.message
			}
		};
		console.error("Content unpublish error:", error);
		return {
			success: false,
			error: {
				code: "CONTENT_UNPUBLISH_ERROR",
				message: "Failed to unpublish content"
			}
		};
	}
}
async function handleContentCountScheduled(db, collection) {
	try {
		return {
			success: true,
			data: { count: await new ContentRepository(db).countScheduled(collection) }
		};
	} catch (error) {
		console.error("Content count scheduled error:", error);
		return {
			success: false,
			error: {
				code: "CONTENT_COUNT_ERROR",
				message: "Failed to count scheduled content"
			}
		};
	}
}
async function handleContentDiscardDraft(db, collection, id) {
	try {
		const item = await withTransaction(db, async (trx) => {
			const repo = new ContentRepository(trx);
			const resolvedId = await resolveId(repo, collection, id) ?? id;
			return repo.discardDraft(collection, resolvedId);
		});
		await hydrateSeo(db, collection, item, await collectionHasSeo(db, collection));
		return {
			success: true,
			data: { item }
		};
	} catch (error) {
		if (error instanceof EmDashValidationError) return {
			success: false,
			error: {
				code: "NOT_FOUND",
				message: error.message
			}
		};
		console.error("Content discard draft error:", error);
		return {
			success: false,
			error: {
				code: "CONTENT_DISCARD_DRAFT_ERROR",
				message: "Failed to discard draft"
			}
		};
	}
}
async function handleContentCompare(db, collection, id) {
	try {
		const entry = await new ContentRepository(db).findByIdOrSlug(collection, id);
		if (!entry) return {
			success: false,
			error: {
				code: "NOT_FOUND",
				message: `Content item not found: ${id}`
			}
		};
		const revisionRepo = new RevisionRepository(db);
		const live = entry.liveRevisionId ? await revisionRepo.findById(entry.liveRevisionId) : null;
		const draft = entry.draftRevisionId ? await revisionRepo.findById(entry.draftRevisionId) : null;
		return {
			success: true,
			data: {
				hasChanges: entry.draftRevisionId !== null && entry.draftRevisionId !== entry.liveRevisionId,
				live: live?.data ?? null,
				draft: draft?.data ?? null
			}
		};
	} catch (error) {
		console.error("Content compare error:", error);
		return {
			success: false,
			error: {
				code: "CONTENT_COMPARE_ERROR",
				message: "Failed to compare revisions"
			}
		};
	}
}
async function handleContentTranslations(db, collection, id) {
	try {
		const repo = new ContentRepository(db);
		const item = await repo.findByIdOrSlug(collection, id);
		if (!item) return {
			success: false,
			error: {
				code: "NOT_FOUND",
				message: `Content item not found: ${id}`
			}
		};
		if (!item.translationGroup) return {
			success: true,
			data: {
				translationGroup: item.id,
				translations: [{
					id: item.id,
					locale: item.locale,
					slug: item.slug,
					status: item.status,
					updatedAt: item.updatedAt
				}]
			}
		};
		const translations = await repo.findTranslations(collection, item.translationGroup);
		return {
			success: true,
			data: {
				translationGroup: item.translationGroup,
				translations: translations.map((t) => ({
					id: t.id,
					locale: t.locale,
					slug: t.slug,
					status: t.status,
					updatedAt: t.updatedAt
				}))
			}
		};
	} catch (error) {
		if (error instanceof Error) console.error("Content translations error:", error);
		return {
			success: false,
			error: {
				code: "CONTENT_TRANSLATIONS_ERROR",
				message: "Failed to get translations"
			}
		};
	}
}
async function syncNonTranslatableFields(trx, collectionSlug, updatedItemId, translationGroup, data) {
	const collection = await trx.selectFrom("_emdash_collections").select("id").where("slug", "=", collectionSlug).executeTakeFirst();
	if (!collection) return;
	const nonTranslatableSlugs = (await trx.selectFrom("_emdash_fields").select("slug").where("collection_id", "=", collection.id).where("translatable", "=", 0).execute()).map((f) => f.slug);
	if (nonTranslatableSlugs.length === 0) return;
	const syncData = {};
	for (const slug of nonTranslatableSlugs) if (slug in data) syncData[slug] = data[slug];
	if (Object.keys(syncData).length === 0) return;
	validateIdentifier(collectionSlug, "collection slug");
	const tableName = `ec_${collectionSlug}`;
	const setClauses = Object.entries(syncData).map(([key, value]) => {
		validateIdentifier(key, "field slug");
		const serialized = typeof value === "object" && value !== null ? JSON.stringify(value) : value;
		return sql`${sql.ref(key)} = ${serialized}`;
	});
	await sql`
		UPDATE ${sql.ref(tableName)}
		SET ${sql.join(setClauses, sql`, `)}
		WHERE translation_group = ${translationGroup}
		AND id != ${updatedItemId}
	`.execute(trx);
}
async function assignTaxonomies(trx, collection, entryId, locale, taxonomies) {
	const taxRepo = new TaxonomyRepository(trx);
	let anyChange = false;
	for (const [taxonomyName, slugs] of Object.entries(taxonomies)) {
		if (!Array.isArray(slugs)) throw new EmDashValidationError(`taxonomies.${taxonomyName} must be an array of term slugs`);
		const termIds = [];
		for (const slug of slugs) {
			if (typeof slug !== "string" || slug.length === 0) throw new EmDashValidationError(`taxonomies.${taxonomyName} contains a non-string or empty slug`);
			const term = await taxRepo.findBySlug(taxonomyName, slug, locale);
			if (!term) throw new EmDashValidationError(`Unknown taxonomy term: ${taxonomyName}='${slug}'${locale ? ` (locale '${locale}')` : ""}`);
			termIds.push(term.id);
		}
		await taxRepo.setTermsForEntry(collection, entryId, taxonomyName, termIds);
		anyChange = true;
	}
	if (anyChange) invalidateTermCache();
}
async function handleRevisionList(db, collection, entryId, params = {}) {
	try {
		const repo = new RevisionRepository(db);
		const [items, total] = await Promise.all([repo.findByEntry(collection, entryId, { limit: Math.min(params.limit || 50, 100) }), repo.countByEntry(collection, entryId)]);
		return {
			success: true,
			data: {
				items,
				total
			}
		};
	} catch {
		return {
			success: false,
			error: {
				code: "REVISION_LIST_ERROR",
				message: "Failed to list revisions"
			}
		};
	}
}
async function handleRevisionGet(db, revisionId) {
	try {
		const item = await new RevisionRepository(db).findById(revisionId);
		if (!item) return {
			success: false,
			error: {
				code: "NOT_FOUND",
				message: `Revision not found: ${revisionId}`
			}
		};
		return {
			success: true,
			data: { item }
		};
	} catch {
		return {
			success: false,
			error: {
				code: "REVISION_GET_ERROR",
				message: "Failed to get revision"
			}
		};
	}
}
async function handleRevisionRestore(db, revisionId, callerUserId) {
	try {
		const revision = await new RevisionRepository(db).findById(revisionId);
		if (!revision) return {
			success: false,
			error: {
				code: "NOT_FOUND",
				message: `Revision not found: ${revisionId}`
			}
		};
		const { _slug, ...fieldData } = revision.data;
		const item = await withTransaction(db, async (trx) => {
			const trxContentRepo = new ContentRepository(trx);
			const trxRevisionRepo = new RevisionRepository(trx);
			const updated = await trxContentRepo.update(revision.collection, revision.entryId, {
				data: fieldData,
				slug: typeof _slug === "string" ? _slug : void 0
			});
			await trxRevisionRepo.create({
				collection: revision.collection,
				entryId: revision.entryId,
				data: revision.data,
				authorId: callerUserId
			});
			return updated;
		});
		new RevisionRepository(db).pruneOldRevisions(revision.collection, revision.entryId, 50).catch(() => {});
		return {
			success: true,
			data: { item }
		};
	} catch {
		return {
			success: false,
			error: {
				code: "REVISION_RESTORE_ERROR",
				message: "Failed to restore revision"
			}
		};
	}
}
async function handleMediaList(db, params) {
	try {
		const result = await new MediaRepository(db).findMany({
			cursor: params.cursor,
			limit: Math.min(params.limit || 50, 100),
			mimeType: params.mimeType,
			q: params.q
		});
		return {
			success: true,
			data: {
				items: result.items,
				nextCursor: result.nextCursor
			}
		};
	} catch (error) {
		if (error instanceof InvalidCursorError) return {
			success: false,
			error: {
				code: "INVALID_CURSOR",
				message: error.message
			}
		};
		return {
			success: false,
			error: {
				code: "MEDIA_LIST_ERROR",
				message: "Failed to list media"
			}
		};
	}
}
async function handleMediaGet(db, id) {
	try {
		const item = await new MediaRepository(db).findById(id);
		if (!item) return {
			success: false,
			error: {
				code: "NOT_FOUND",
				message: `Media item not found: ${id}`
			}
		};
		return {
			success: true,
			data: { item }
		};
	} catch {
		return {
			success: false,
			error: {
				code: "MEDIA_GET_ERROR",
				message: "Failed to get media"
			}
		};
	}
}
async function handleMediaCreate(db, input) {
	try {
		return {
			success: true,
			data: { item: await new MediaRepository(db).create(input) }
		};
	} catch {
		return {
			success: false,
			error: {
				code: "MEDIA_CREATE_ERROR",
				message: "Failed to create media"
			}
		};
	}
}
async function handleMediaUpdate(db, id, input) {
	try {
		const item = await new MediaRepository(db).update(id, input);
		if (!item) return {
			success: false,
			error: {
				code: "NOT_FOUND",
				message: `Media item not found: ${id}`
			}
		};
		return {
			success: true,
			data: { item }
		};
	} catch {
		return {
			success: false,
			error: {
				code: "MEDIA_UPDATE_ERROR",
				message: "Failed to update media"
			}
		};
	}
}
async function handleMediaDelete(db, id) {
	try {
		const storageKey = await new MediaRepository(db).deleteWithStorageKey(id);
		if (!storageKey) return {
			success: false,
			error: {
				code: "NOT_FOUND",
				message: `Media item not found: ${id}`
			}
		};
		return {
			success: true,
			data: {
				deleted: true,
				storageKey
			}
		};
	} catch {
		return {
			success: false,
			error: {
				code: "MEDIA_DELETE_ERROR",
				message: "Failed to delete media"
			}
		};
	}
}
async function handleSchemaCollectionList(db) {
	try {
		return {
			success: true,
			data: { items: await new SchemaRegistry(db).listCollections() }
		};
	} catch {
		return {
			success: false,
			error: {
				code: "SCHEMA_LIST_ERROR",
				message: "Failed to list collections"
			}
		};
	}
}
async function handleSchemaCollectionGet(db, slug, options) {
	try {
		const registry = new SchemaRegistry(db);
		if (options?.includeFields) {
			const item2 = await registry.getCollectionWithFields(slug);
			if (!item2) return {
				success: false,
				error: {
					code: "NOT_FOUND",
					message: `Collection not found: ${slug}`
				}
			};
			return {
				success: true,
				data: { item: item2 }
			};
		}
		const item = await registry.getCollection(slug);
		if (!item) return {
			success: false,
			error: {
				code: "NOT_FOUND",
				message: `Collection not found: ${slug}`
			}
		};
		return {
			success: true,
			data: { item }
		};
	} catch {
		return {
			success: false,
			error: {
				code: "SCHEMA_GET_ERROR",
				message: "Failed to get collection"
			}
		};
	}
}
async function handleSchemaCollectionCreate(db, input) {
	try {
		return {
			success: true,
			data: { item: await new SchemaRegistry(db).createCollection(input) }
		};
	} catch (error) {
		if (error instanceof SchemaError) return {
			success: false,
			error: {
				code: error.code,
				message: error.message,
				details: error.details
			}
		};
		console.error("[emdash] Failed to create collection:", error);
		return {
			success: false,
			error: {
				code: "SCHEMA_CREATE_ERROR",
				message: "Failed to create collection"
			}
		};
	}
}
async function handleSchemaCollectionUpdate(db, slug, input) {
	try {
		return {
			success: true,
			data: { item: await new SchemaRegistry(db).updateCollection(slug, input) }
		};
	} catch (error) {
		if (error instanceof SchemaError) return {
			success: false,
			error: {
				code: error.code,
				message: error.message,
				details: error.details
			}
		};
		return {
			success: false,
			error: {
				code: "SCHEMA_UPDATE_ERROR",
				message: "Failed to update collection"
			}
		};
	}
}
async function handleSchemaCollectionDelete(db, slug, options) {
	try {
		await new SchemaRegistry(db).deleteCollection(slug, options);
		return {
			success: true,
			data: { success: true }
		};
	} catch (error) {
		if (error instanceof SchemaError) return {
			success: false,
			error: {
				code: error.code,
				message: error.message,
				details: error.details
			}
		};
		return {
			success: false,
			error: {
				code: "SCHEMA_DELETE_ERROR",
				message: "Failed to delete collection"
			}
		};
	}
}
async function handleSchemaFieldList(db, collectionSlug) {
	try {
		const registry = new SchemaRegistry(db);
		const collection = await registry.getCollection(collectionSlug);
		if (!collection) return {
			success: false,
			error: {
				code: "NOT_FOUND",
				message: `Collection not found: ${collectionSlug}`
			}
		};
		return {
			success: true,
			data: { items: await registry.listFields(collection.id) }
		};
	} catch {
		return {
			success: false,
			error: {
				code: "SCHEMA_FIELD_LIST_ERROR",
				message: "Failed to list fields"
			}
		};
	}
}
async function handleSchemaFieldGet(db, collectionSlug, fieldSlug) {
	try {
		const item = await new SchemaRegistry(db).getField(collectionSlug, fieldSlug);
		if (!item) return {
			success: false,
			error: {
				code: "NOT_FOUND",
				message: `Field not found: ${fieldSlug} in collection ${collectionSlug}`
			}
		};
		return {
			success: true,
			data: { item }
		};
	} catch {
		return {
			success: false,
			error: {
				code: "SCHEMA_FIELD_GET_ERROR",
				message: "Failed to get field"
			}
		};
	}
}
async function handleSchemaFieldCreate(db, collectionSlug, input) {
	try {
		const item = await new SchemaRegistry(db).createField(collectionSlug, input);
		invalidateCollectionCache(collectionSlug);
		return {
			success: true,
			data: { item }
		};
	} catch (error) {
		if (error instanceof SchemaError) return {
			success: false,
			error: {
				code: error.code,
				message: error.message,
				details: error.details
			}
		};
		return {
			success: false,
			error: {
				code: "SCHEMA_FIELD_CREATE_ERROR",
				message: "Failed to create field"
			}
		};
	}
}
async function handleSchemaFieldUpdate(db, collectionSlug, fieldSlug, input) {
	try {
		const item = await new SchemaRegistry(db).updateField(collectionSlug, fieldSlug, input);
		invalidateCollectionCache(collectionSlug);
		return {
			success: true,
			data: { item }
		};
	} catch (error) {
		if (error instanceof SchemaError) return {
			success: false,
			error: {
				code: error.code,
				message: error.message,
				details: error.details
			}
		};
		return {
			success: false,
			error: {
				code: "SCHEMA_FIELD_UPDATE_ERROR",
				message: "Failed to update field"
			}
		};
	}
}
async function handleSchemaFieldDelete(db, collectionSlug, fieldSlug) {
	try {
		await new SchemaRegistry(db).deleteField(collectionSlug, fieldSlug);
		invalidateCollectionCache(collectionSlug);
		return {
			success: true,
			data: { success: true }
		};
	} catch (error) {
		if (error instanceof SchemaError) return {
			success: false,
			error: {
				code: error.code,
				message: error.message,
				details: error.details
			}
		};
		return {
			success: false,
			error: {
				code: "SCHEMA_FIELD_DELETE_ERROR",
				message: "Failed to delete field"
			}
		};
	}
}
async function handleSchemaFieldReorder(db, collectionSlug, fieldSlugs) {
	try {
		await new SchemaRegistry(db).reorderFields(collectionSlug, fieldSlugs);
		return {
			success: true,
			data: { success: true }
		};
	} catch (error) {
		if (error instanceof SchemaError) return {
			success: false,
			error: {
				code: error.code,
				message: error.message,
				details: error.details
			}
		};
		return {
			success: false,
			error: {
				code: "SCHEMA_FIELD_REORDER_ERROR",
				message: "Failed to reorder fields"
			}
		};
	}
}
async function handleOrphanedTableList(db) {
	try {
		return {
			success: true,
			data: { items: await new SchemaRegistry(db).discoverOrphanedTables() }
		};
	} catch (error) {
		console.error("[emdash] Failed to list orphaned tables:", error);
		return {
			success: false,
			error: {
				code: "ORPHAN_LIST_ERROR",
				message: "Failed to list orphaned tables"
			}
		};
	}
}
async function handleOrphanedTableRegister(db, slug, options) {
	try {
		return {
			success: true,
			data: { item: await new SchemaRegistry(db).registerOrphanedTable(slug, options) }
		};
	} catch (error) {
		if (error instanceof SchemaError) return {
			success: false,
			error: {
				code: error.code,
				message: error.message,
				details: error.details
			}
		};
		return {
			success: false,
			error: {
				code: "ORPHAN_REGISTER_ERROR",
				message: "Failed to register orphaned table"
			}
		};
	}
}
function marketplaceIconUrl(marketplaceUrl, pluginId) {
	return `${marketplaceUrl}/api/v1/plugins/${encodeURIComponent(pluginId)}/icon`;
}
function buildPluginInfo(plugin, state, marketplaceUrl) {
	const status = state?.status ?? "active";
	const enabled = status === "active";
	const isMarketplace = (state?.source ?? "config") === "marketplace";
	return {
		id: plugin.id,
		name: state?.displayName || plugin.id,
		version: plugin.version,
		package: void 0,
		enabled,
		status,
		source: state?.source ?? "config",
		marketplaceVersion: state?.marketplaceVersion ?? void 0,
		registryPublisherDid: state?.registryPublisherDid ?? void 0,
		registrySlug: state?.registrySlug ?? void 0,
		capabilities: plugin.capabilities,
		hasAdminPages: (plugin.admin.pages?.length ?? 0) > 0,
		hasDashboardWidgets: (plugin.admin.widgets?.length ?? 0) > 0,
		hasHooks: Object.keys(plugin.hooks ?? {}).length > 0,
		hasSettings: Object.keys(plugin.admin.settingsSchema ?? {}).length > 0,
		installedAt: state?.installedAt?.toISOString(),
		activatedAt: state?.activatedAt?.toISOString() ?? void 0,
		deactivatedAt: state?.deactivatedAt?.toISOString() ?? void 0,
		description: state?.description ?? void 0,
		iconUrl: isMarketplace && marketplaceUrl ? marketplaceIconUrl(marketplaceUrl, plugin.id) : void 0,
		mcpToolsEnabled: state?.mcpToolsEnabled ?? false,
		mcpTools: Object.entries(plugin.mcp?.tools ?? {}).flatMap(([name, tool]) => {
			const permission = plugin.routes[tool.route]?.permission;
			return permission ? [{
				name,
				description: tool.description,
				route: tool.route,
				permission,
				destructive: tool.destructive ?? false
			}] : [];
		})
	};
}
function buildSandboxedPluginInfo(entry, state) {
	const status = state?.status ?? "active";
	const enabled = status === "active";
	return {
		id: entry.id,
		name: state?.displayName || entry.id,
		version: entry.version,
		package: void 0,
		enabled,
		status,
		source: "config",
		sandboxed: true,
		capabilities: entry.capabilities,
		hasAdminPages: (entry.adminPages?.length ?? 0) > 0,
		hasDashboardWidgets: (entry.adminWidgets?.length ?? 0) > 0,
		hasHooks: false,
		hasSettings: Object.keys(entry.settingsSchema ?? {}).length > 0,
		installedAt: state?.installedAt?.toISOString(),
		activatedAt: state?.activatedAt?.toISOString() ?? void 0,
		deactivatedAt: state?.deactivatedAt?.toISOString() ?? void 0,
		description: state?.description ?? void 0,
		mcpToolsEnabled: state?.mcpToolsEnabled ?? false,
		mcpTools: entry.mcp?.tools.map(({ inputSchema: _, outputSchema: __, ...tool }) => tool) ?? []
	};
}
async function handlePluginList(db, configuredPlugins, sandboxedPluginEntries, marketplaceUrl, runtimeSettingsSchemaLookup) {
	try {
		const allStates = await new PluginStateRepository(db).getAll();
		const stateMap = new Map(allStates.map((s) => [s.pluginId, s]));
		const configuredIds = new Set(configuredPlugins.map((p) => p.id));
		const items = configuredPlugins.map((plugin) => {
			return buildPluginInfo(plugin, stateMap.get(plugin.id) ?? null, marketplaceUrl);
		});
		for (const entry of sandboxedPluginEntries) {
			if (configuredIds.has(entry.id)) continue;
			configuredIds.add(entry.id);
			items.push(buildSandboxedPluginInfo(entry, stateMap.get(entry.id) ?? null));
		}
		for (const state of allStates) {
			if (state.source !== "marketplace" && state.source !== "registry") continue;
			if (configuredIds.has(state.pluginId)) continue;
			items.push({
				id: state.pluginId,
				name: state.displayName || state.pluginId,
				version: state.marketplaceVersion ?? state.version,
				enabled: state.status === "active",
				status: state.status,
				source: state.source,
				marketplaceVersion: state.marketplaceVersion ?? void 0,
				registryPublisherDid: state.registryPublisherDid ?? void 0,
				registrySlug: state.registrySlug ?? void 0,
				capabilities: [],
				hasAdminPages: false,
				hasDashboardWidgets: false,
				hasHooks: false,
				hasSettings: Object.keys(runtimeSettingsSchemaLookup?.(state.pluginId) ?? {}).length > 0,
				installedAt: state.installedAt?.toISOString(),
				activatedAt: state.activatedAt?.toISOString() ?? void 0,
				deactivatedAt: state.deactivatedAt?.toISOString() ?? void 0,
				description: state.description ?? void 0,
				iconUrl: state.source === "marketplace" && marketplaceUrl ? marketplaceIconUrl(marketplaceUrl, state.pluginId) : void 0,
				mcpToolsEnabled: state.mcpToolsEnabled,
				mcpTools: []
			});
		}
		return {
			success: true,
			data: { items }
		};
	} catch {
		return {
			success: false,
			error: {
				code: "PLUGIN_LIST_ERROR",
				message: "Failed to list plugins"
			}
		};
	}
}
async function handlePluginGet(db, configuredPlugins, sandboxedPluginEntries, pluginId, marketplaceUrl) {
	try {
		const stateRepo = new PluginStateRepository(db);
		const plugin = configuredPlugins.find((p) => p.id === pluginId);
		if (plugin) return {
			success: true,
			data: { item: buildPluginInfo(plugin, await stateRepo.get(pluginId), marketplaceUrl) }
		};
		const sandboxed = sandboxedPluginEntries.find((e) => e.id === pluginId);
		if (sandboxed) return {
			success: true,
			data: { item: buildSandboxedPluginInfo(sandboxed, await stateRepo.get(pluginId)) }
		};
		return {
			success: false,
			error: {
				code: "NOT_FOUND",
				message: `Plugin not found: ${pluginId}`
			}
		};
	} catch {
		return {
			success: false,
			error: {
				code: "PLUGIN_GET_ERROR",
				message: "Failed to get plugin"
			}
		};
	}
}
function buildStateOnlyPluginInfo(state) {
	return {
		id: state.pluginId,
		name: state.displayName || state.pluginId,
		version: state.marketplaceVersion ?? state.version,
		enabled: state.status === "active",
		status: state.status,
		source: state.source,
		marketplaceVersion: state.marketplaceVersion ?? void 0,
		registryPublisherDid: state.registryPublisherDid ?? void 0,
		registrySlug: state.registrySlug ?? void 0,
		capabilities: [],
		hasAdminPages: false,
		hasDashboardWidgets: false,
		hasHooks: false,
		hasSettings: false,
		installedAt: state.installedAt?.toISOString(),
		activatedAt: state.activatedAt?.toISOString() ?? void 0,
		deactivatedAt: state.deactivatedAt?.toISOString() ?? void 0,
		description: state.description ?? void 0,
		mcpToolsEnabled: state.mcpToolsEnabled,
		mcpTools: []
	};
}
async function handlePluginEnable(db, configuredPlugins, sandboxedPluginEntries, pluginId) {
	try {
		const stateRepo = new PluginStateRepository(db);
		const plugin = configuredPlugins.find((p) => p.id === pluginId);
		if (plugin) return {
			success: true,
			data: { item: buildPluginInfo(plugin, await stateRepo.enable(pluginId, plugin.version)) }
		};
		const sandboxed = sandboxedPluginEntries.find((e) => e.id === pluginId);
		if (sandboxed) return {
			success: true,
			data: { item: buildSandboxedPluginInfo(sandboxed, await stateRepo.enable(pluginId, sandboxed.version)) }
		};
		const existing = await stateRepo.get(pluginId);
		if (!existing || existing.source !== "marketplace" && existing.source !== "registry") return {
			success: false,
			error: {
				code: "NOT_FOUND",
				message: `Plugin not found: ${pluginId}`
			}
		};
		return {
			success: true,
			data: { item: buildStateOnlyPluginInfo(await stateRepo.enable(pluginId, existing.version)) }
		};
	} catch {
		return {
			success: false,
			error: {
				code: "PLUGIN_ENABLE_ERROR",
				message: "Failed to enable plugin"
			}
		};
	}
}
async function handlePluginDisable(db, configuredPlugins, sandboxedPluginEntries, pluginId) {
	try {
		const stateRepo = new PluginStateRepository(db);
		const plugin = configuredPlugins.find((p) => p.id === pluginId);
		if (plugin) return {
			success: true,
			data: { item: buildPluginInfo(plugin, await stateRepo.disable(pluginId, plugin.version)) }
		};
		const sandboxed = sandboxedPluginEntries.find((e) => e.id === pluginId);
		if (sandboxed) return {
			success: true,
			data: { item: buildSandboxedPluginInfo(sandboxed, await stateRepo.disable(pluginId, sandboxed.version)) }
		};
		const existing = await stateRepo.get(pluginId);
		if (!existing || existing.source !== "marketplace" && existing.source !== "registry") return {
			success: false,
			error: {
				code: "NOT_FOUND",
				message: `Plugin not found: ${pluginId}`
			}
		};
		return {
			success: true,
			data: { item: buildStateOnlyPluginInfo(await stateRepo.disable(pluginId, existing.version)) }
		};
	} catch {
		return {
			success: false,
			error: {
				code: "PLUGIN_DISABLE_ERROR",
				message: "Failed to disable plugin"
			}
		};
	}
}
function settingsKey(pluginId, key) {
	return `plugin:${pluginId}:settings:${key}`;
}
function getPluginSettingsSchema(configuredPlugins, sandboxedPluginEntries, pluginId) {
	const plugin = configuredPlugins.find((p) => p.id === pluginId);
	if (plugin) return plugin.admin.settingsSchema ?? {};
	const sandboxed = sandboxedPluginEntries.find((e) => e.id === pluginId);
	if (sandboxed) return sandboxed.settingsSchema ?? {};
	return null;
}
function validateValue(key, field, value) {
	switch (field.type) {
		case "string":
		case "secret":
		case "url":
		case "email":
			if (typeof value !== "string") return `Setting "${key}" must be a string`;
			if (field.type === "url" && value !== "" && !URL.canParse(value)) return `Setting "${key}" must be a valid URL`;
			if (field.type === "email" && value !== "" && !value.includes("@")) return `Setting "${key}" must be a valid email address`;
			return null;
		case "number":
			if (typeof value !== "number" || Number.isNaN(value)) return `Setting "${key}" must be a number`;
			if (field.min !== void 0 && value < field.min) return `Setting "${key}" must be at least ${field.min}`;
			if (field.max !== void 0 && value > field.max) return `Setting "${key}" must be at most ${field.max}`;
			return null;
		case "boolean": return typeof value === "boolean" ? null : `Setting "${key}" must be a boolean`;
		case "select":
			if (typeof value !== "string" || !field.options.some((o) => o.value === value)) return `Setting "${key}" must be one of the defined options`;
			return null;
		default: return `Setting "${key}" has an unknown field type`;
	}
}
async function buildSettingsResponse(optionsRepo, pluginId, schema) {
	const keys = Object.keys(schema);
	const stored = await optionsRepo.getMany(keys.map((key) => settingsKey(pluginId, key)));
	const values = {};
	const secretsSet = {};
	for (const key of keys) {
		const field = schema[key];
		if (!field) continue;
		const storedValue = stored.get(settingsKey(pluginId, key));
		if (field.type === "secret") {
			secretsSet[key] = typeof storedValue === "string" && storedValue.length > 0;
			continue;
		}
		if (storedValue !== void 0 && storedValue !== null) values[key] = storedValue;
		else if ("default" in field && field.default !== void 0) values[key] = field.default;
		else values[key] = null;
	}
	return {
		schema,
		values,
		secretsSet
	};
}
async function handlePluginSettingsGet(db, pluginId, schema) {
	try {
		return {
			success: true,
			data: await buildSettingsResponse(new OptionsRepository(db), pluginId, schema)
		};
	} catch {
		return {
			success: false,
			error: {
				code: ErrorCode.PLUGIN_SETTINGS_READ_ERROR,
				message: "Failed to read plugin settings"
			}
		};
	}
}
async function handlePluginSettingsUpdate(db, pluginId, schema, updates) {
	try {
		for (const [key, value] of Object.entries(updates)) {
			const field = schema[key];
			if (!field) return {
				success: false,
				error: {
					code: ErrorCode.VALIDATION_ERROR,
					message: `Unknown setting "${key}" for plugin "${pluginId}"`
				}
			};
			if (value === null) continue;
			const error = validateValue(key, field, value);
			if (error) return {
				success: false,
				error: {
					code: ErrorCode.VALIDATION_ERROR,
					message: error
				}
			};
		}
		return {
			success: true,
			data: await withTransaction(db, async (trx) => {
				const txRepo = new OptionsRepository(trx);
				for (const [key, value] of Object.entries(updates)) if (value === null) await txRepo.delete(settingsKey(pluginId, key));
				else await txRepo.set(settingsKey(pluginId, key), value);
				return buildSettingsResponse(txRepo, pluginId, schema);
			})
		};
	} catch {
		return {
			success: false,
			error: {
				code: ErrorCode.PLUGIN_SETTINGS_UPDATE_ERROR,
				message: "Failed to update plugin settings"
			}
		};
	}
}
var TRAILING_SLASHES$1 = /\/+$/;
var LEADING_DOT_SLASH = /^\.\//;
var MarketplaceError = class extends Error {
	constructor(message, status, code) {
		super(message);
		this.status = status;
		this.code = code;
		this.name = "MarketplaceError";
	}
};
var MarketplaceUnavailableError = class extends MarketplaceError {
	constructor(cause) {
		super("Plugin marketplace is unavailable", void 0, "MARKETPLACE_UNAVAILABLE");
		if (cause) this.cause = cause;
	}
};
var MarketplaceClientImpl = class {
	baseUrl;
	siteOrigin;
	constructor(baseUrl, siteOrigin) {
		this.baseUrl = baseUrl.replace(TRAILING_SLASHES$1, "");
		this.siteOrigin = siteOrigin;
	}
	async search(query, opts) {
		const params = new URLSearchParams();
		if (query) params.set("q", query);
		if (opts?.category) params.set("category", opts.category);
		if (opts?.capability) params.set("capability", opts.capability);
		if (opts?.sort) params.set("sort", opts.sort);
		if (opts?.cursor) params.set("cursor", opts.cursor);
		if (opts?.limit) params.set("limit", String(opts.limit));
		const qs = params.toString();
		const url = `${this.baseUrl}/api/v1/plugins${qs ? `?${qs}` : ""}`;
		return await this.fetchJson(url);
	}
	async getPlugin(id) {
		const url = `${this.baseUrl}/api/v1/plugins/${encodeURIComponent(id)}`;
		return this.fetchJson(url);
	}
	async getVersions(id) {
		const url = `${this.baseUrl}/api/v1/plugins/${encodeURIComponent(id)}/versions`;
		return (await this.fetchJson(url)).items;
	}
	async downloadBundle(id, version) {
		const bundleUrl = `${this.baseUrl}/api/v1/plugins/${encodeURIComponent(id)}/versions/${encodeURIComponent(version)}/bundle`;
		const marketplaceOrigin = new URL(this.baseUrl).origin;
		const MAX_REDIRECTS2 = 5;
		let response;
		try {
			let currentUrl = bundleUrl;
			response = await fetch(currentUrl, { redirect: "manual" });
			for (let i = 0; i < MAX_REDIRECTS2; i++) {
				if (response.status < 300 || response.status >= 400) break;
				const location = response.headers.get("location");
				if (!location) break;
				const target = new URL(location, currentUrl);
				if (target.origin !== marketplaceOrigin) throw new MarketplaceError(`Bundle download redirected to untrusted host: ${target.origin}`, response.status, "BUNDLE_REDIRECT_UNTRUSTED");
				currentUrl = target.href;
				response = await fetch(currentUrl, { redirect: "manual" });
			}
			if (response.status >= 300 && response.status < 400) throw new MarketplaceError(`Bundle download exceeded maximum redirects (${MAX_REDIRECTS2})`, response.status, "BUNDLE_TOO_MANY_REDIRECTS");
		} catch (err) {
			if (err instanceof MarketplaceError) throw err;
			throw new MarketplaceUnavailableError(err);
		}
		if (!response.ok) throw new MarketplaceError(`Failed to download bundle: ${response.status} ${response.statusText}`, response.status, "BUNDLE_DOWNLOAD_FAILED");
		const tarballBytes = new Uint8Array(await response.arrayBuffer());
		try {
			return await extractBundle(tarballBytes);
		} catch (err) {
			if (err instanceof MarketplaceError) throw err;
			throw new MarketplaceError("Failed to extract plugin bundle", void 0, "BUNDLE_EXTRACT_FAILED");
		}
	}
	async reportInstall(id, version) {
		const siteHash = await generateSiteHash(this.siteOrigin);
		const url = `${this.baseUrl}/api/v1/plugins/${encodeURIComponent(id)}/installs`;
		try {
			await fetch(url, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					siteHash,
					version
				})
			});
		} catch {}
	}
	async searchThemes(query, opts) {
		const params = new URLSearchParams();
		if (query) params.set("q", query);
		if (opts?.keyword) params.set("keyword", opts.keyword);
		if (opts?.sort) params.set("sort", opts.sort);
		if (opts?.cursor) params.set("cursor", opts.cursor);
		if (opts?.limit) params.set("limit", String(opts.limit));
		const qs = params.toString();
		const url = `${this.baseUrl}/api/v1/themes${qs ? `?${qs}` : ""}`;
		return this.fetchJson(url);
	}
	async getTheme(id) {
		const url = `${this.baseUrl}/api/v1/themes/${encodeURIComponent(id)}`;
		return this.fetchJson(url);
	}
	async fetchJson(url) {
		let response;
		try {
			response = await fetch(url, { headers: { Accept: "application/json" } });
		} catch (err) {
			throw new MarketplaceUnavailableError(err);
		}
		if (!response.ok) {
			let errorMessage = `Marketplace request failed: ${response.status}`;
			try {
				const body = await response.json();
				if (body.error) errorMessage = body.error;
			} catch {}
			throw new MarketplaceError(errorMessage, response.status);
		}
		return await response.json();
	}
};
var MAX_DECOMPRESSED_BUNDLE_BYTES = 262144;
var MAX_BUNDLE_TAR_ENTRIES = 32;
async function extractBundle(tarballBytes) {
	const reader = new ReadableStream({ start(controller) {
		controller.enqueue(tarballBytes);
		controller.close();
	} }).pipeThrough(createGzipDecoder()).getReader();
	const chunks2 = [];
	let total = 0;
	while (true) {
		const { done, value } = await reader.read();
		if (done) break;
		if (!value) continue;
		total += value.byteLength;
		if (total > MAX_DECOMPRESSED_BUNDLE_BYTES) {
			try {
				await reader.cancel();
			} catch {}
			throw new MarketplaceError(`Bundle decompressed size exceeds limit (${MAX_DECOMPRESSED_BUNDLE_BYTES} bytes)`, void 0, "INVALID_BUNDLE");
		}
		chunks2.push(value);
	}
	const decompressedBytes = new Uint8Array(total);
	{
		let offset = 0;
		for (const chunk of chunks2) {
			decompressedBytes.set(chunk, offset);
			offset += chunk.byteLength;
		}
	}
	const entries = await unpackTar(new ReadableStream({ start(controller) {
		controller.enqueue(decompressedBytes);
		controller.close();
	} }));
	if (entries.length > MAX_BUNDLE_TAR_ENTRIES) throw new MarketplaceError(`Bundle has too many tar entries (${entries.length} > ${MAX_BUNDLE_TAR_ENTRIES})`, void 0, "INVALID_BUNDLE");
	const decoder = new TextDecoder();
	const files = /* @__PURE__ */ new Map();
	for (const entry of entries) if (entry.data && entry.header.type === "file") {
		const name = entry.header.name.replace(LEADING_DOT_SLASH, "");
		files.set(name, decoder.decode(entry.data));
	}
	const manifestJson = files.get("manifest.json");
	const backendCode = files.get("backend.js");
	if (!manifestJson) throw new MarketplaceError("Invalid bundle: missing manifest.json", void 0, "INVALID_BUNDLE");
	if (!backendCode) throw new MarketplaceError("Invalid bundle: missing backend.js", void 0, "INVALID_BUNDLE");
	let manifest;
	try {
		const parsed = JSON.parse(manifestJson);
		const result = pluginManifestSchema.safeParse(parsed);
		if (!result.success) throw new MarketplaceError("Invalid bundle: manifest.json failed validation", void 0, "INVALID_BUNDLE");
		manifest = reconcileManifestAccess(result.data);
	} catch (err) {
		if (err instanceof MarketplaceError) throw err;
		throw new MarketplaceError("Invalid bundle: malformed manifest.json", void 0, "INVALID_BUNDLE");
	}
	const hashBuffer = await crypto.subtle.digest("SHA-256", tarballBytes);
	const hashArray = new Uint8Array(hashBuffer);
	const checksum = Array.from(hashArray, (b) => b.toString(16).padStart(2, "0")).join("");
	return {
		manifest,
		backendCode,
		adminCode: files.get("admin.js"),
		checksum
	};
}
async function generateSiteHash(siteOrigin) {
	const seed = siteOrigin ? `emdash-site:${siteOrigin}` : `emdash-anonymous`;
	try {
		const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(seed));
		const arr = new Uint8Array(hash);
		return Array.from(arr.slice(0, 8), (b) => b.toString(16).padStart(2, "0")).join("");
	} catch {
		let h = 2166136261;
		for (let i = 0; i < seed.length; i++) {
			h ^= seed.charCodeAt(i);
			h = Math.imul(h, 16777619);
		}
		const h2 = h ^ h >>> 16;
		return (h >>> 0).toString(16).padStart(8, "0") + (h2 >>> 0).toString(16).padStart(8, "0");
	}
}
function createMarketplaceClient(baseUrl, siteOrigin) {
	return new MarketplaceClientImpl(baseUrl, siteOrigin);
}
var VERSION_PATTERN = /^[a-z0-9][a-z0-9._+-]*$/i;
function validateVersion(version) {
	if (version.includes("..")) throw new Error("Invalid version format");
	if (!VERSION_PATTERN.test(version)) throw new Error("Invalid version format");
}
function getClient(marketplaceUrl, siteOrigin) {
	if (!marketplaceUrl) return null;
	return createMarketplaceClient(marketplaceUrl, siteOrigin);
}
function diffCapabilities(oldCaps, newCaps) {
	const oldNorm = normalizeCapabilities(oldCaps);
	const newNorm = normalizeCapabilities(newCaps);
	const oldSet = new Set(oldNorm);
	const newSet = new Set(newNorm);
	return {
		added: newNorm.filter((c) => !oldSet.has(c)),
		removed: oldNorm.filter((c) => !newSet.has(c))
	};
}
function diffRouteVisibility(oldManifest, newManifest) {
	const oldPublicRoutes = /* @__PURE__ */ new Set();
	if (oldManifest) for (const entry of oldManifest.routes) {
		const normalized = normalizeManifestRoute(entry);
		if (normalized.public === true) oldPublicRoutes.add(normalized.name);
	}
	const newlyPublic = [];
	for (const entry of newManifest.routes) {
		const normalized = normalizeManifestRoute(entry);
		if (normalized.public === true && !oldPublicRoutes.has(normalized.name)) newlyPublic.push(normalized.name);
	}
	return { newlyPublic };
}
async function resolveVersionMetadata(client, pluginId, pluginDetail, version) {
	if (pluginDetail.latestVersion?.version === version) return {
		version: pluginDetail.latestVersion.version,
		minEmDashVersion: pluginDetail.latestVersion.minEmDashVersion,
		bundleSize: pluginDetail.latestVersion.bundleSize,
		checksum: pluginDetail.latestVersion.checksum,
		changelog: pluginDetail.latestVersion.changelog,
		capabilities: pluginDetail.latestVersion.capabilities,
		status: pluginDetail.latestVersion.status,
		auditVerdict: pluginDetail.latestVersion.audit?.verdict ?? null,
		imageAuditVerdict: pluginDetail.latestVersion.imageAudit?.verdict ?? null,
		publishedAt: pluginDetail.latestVersion.publishedAt
	};
	return (await client.getVersions(pluginId)).find((v) => v.version === version) ?? null;
}
function validateBundleIdentity(bundle, pluginId, version) {
	if (bundle.manifest.id !== pluginId) return {
		success: false,
		error: {
			code: "MANIFEST_MISMATCH",
			message: `Bundle manifest ID (${bundle.manifest.id}) does not match requested plugin (${pluginId})`
		}
	};
	if (bundle.manifest.version !== version) return {
		success: false,
		error: {
			code: "MANIFEST_VERSION_MISMATCH",
			message: `Bundle manifest version (${bundle.manifest.version}) does not match requested version (${version})`
		}
	};
	return null;
}
function bundlePrefix(source, pluginId, version) {
	return `${source}/${pluginId}/${version}`;
}
async function storeBundleInR2(storage, pluginId, version, bundle, source = "marketplace") {
	validatePluginIdentifier(pluginId, "plugin ID");
	validateVersion(version);
	const prefix = bundlePrefix(source, pluginId, version);
	await storage.upload({
		key: `${prefix}/manifest.json`,
		body: new TextEncoder().encode(JSON.stringify(bundle.manifest)),
		contentType: "application/json"
	});
	await storage.upload({
		key: `${prefix}/backend.js`,
		body: new TextEncoder().encode(bundle.backendCode),
		contentType: "application/javascript"
	});
	if (bundle.adminCode) await storage.upload({
		key: `${prefix}/admin.js`,
		body: new TextEncoder().encode(bundle.adminCode),
		contentType: "application/javascript"
	});
}
async function streamToText(stream) {
	return new Response(stream).text();
}
async function loadBundleFromR2(storage, pluginId, version, source = "marketplace") {
	validatePluginIdentifier(pluginId, "plugin ID");
	validateVersion(version);
	const prefix = bundlePrefix(source, pluginId, version);
	try {
		const manifestResult = await storage.download(`${prefix}/manifest.json`);
		const backendResult = await storage.download(`${prefix}/backend.js`);
		const manifestText = await streamToText(manifestResult.body);
		const backendCode = await streamToText(backendResult.body);
		const parsed = JSON.parse(manifestText);
		const result = pluginManifestSchema.safeParse(parsed);
		if (!result.success) return null;
		const manifest = reconcileManifestAccess(result.data);
		let adminCode;
		try {
			adminCode = await streamToText((await storage.download(`${prefix}/admin.js`)).body);
		} catch {}
		return {
			manifest,
			backendCode,
			adminCode
		};
	} catch {
		return null;
	}
}
async function deleteBundleFromR2(storage, pluginId, version, source = "marketplace") {
	validatePluginIdentifier(pluginId, "plugin ID");
	validateVersion(version);
	const prefix = bundlePrefix(source, pluginId, version);
	for (const file of [
		"manifest.json",
		"backend.js",
		"admin.js"
	]) try {
		await storage.delete(`${prefix}/${file}`);
	} catch {}
}
async function handleMarketplaceInstall(db, storage, sandboxRunner, marketplaceUrl, pluginId, opts) {
	const client = getClient(marketplaceUrl, opts?.siteOrigin);
	if (!client) return {
		success: false,
		error: {
			code: "MARKETPLACE_NOT_CONFIGURED",
			message: "Marketplace is not configured"
		}
	};
	if (!storage) return {
		success: false,
		error: {
			code: "STORAGE_NOT_CONFIGURED",
			message: "Storage is required for marketplace plugin installation"
		}
	};
	if (!opts?.sandboxBypassed && (!sandboxRunner || !sandboxRunner.isAvailable())) return {
		success: false,
		error: {
			code: "SANDBOX_NOT_AVAILABLE",
			message: "Sandbox runner is required for marketplace plugins"
		}
	};
	try {
		const stateRepo = new PluginStateRepository(db);
		const existing = await stateRepo.get(pluginId);
		if (existing && existing.source === "marketplace") return {
			success: false,
			error: {
				code: "ALREADY_INSTALLED",
				message: `Plugin ${pluginId} is already installed`
			}
		};
		if (opts?.configuredPluginIds?.has(pluginId)) return {
			success: false,
			error: {
				code: "PLUGIN_ID_CONFLICT",
				message: `Cannot install marketplace plugin "${pluginId}" — a configured plugin with the same ID already exists`
			}
		};
		const pluginDetail = await client.getPlugin(pluginId);
		const version = opts?.version ?? pluginDetail.latestVersion?.version;
		if (!version) return {
			success: false,
			error: {
				code: "NO_VERSION",
				message: `No published versions found for plugin ${pluginId}`
			}
		};
		const versionMetadata = await resolveVersionMetadata(client, pluginId, pluginDetail, version);
		if (!versionMetadata) return {
			success: false,
			error: {
				code: "NO_VERSION",
				message: `Version ${version} was not found for plugin ${pluginId}`
			}
		};
		if (versionMetadata.auditVerdict === "fail" || versionMetadata.auditVerdict === "warn") return {
			success: false,
			error: {
				code: "AUDIT_FAILED",
				message: versionMetadata.auditVerdict === "fail" ? "Plugin failed security audit and cannot be installed" : "Plugin audit was inconclusive and cannot be installed until reviewed"
			}
		};
		const bundle = await client.downloadBundle(pluginId, version);
		if (versionMetadata.checksum && bundle.checksum !== versionMetadata.checksum) return {
			success: false,
			error: {
				code: "CHECKSUM_MISMATCH",
				message: "Bundle checksum does not match marketplace record. Download may be corrupted."
			}
		};
		const bundleIdentityError = validateBundleIdentity(bundle, pluginId, version);
		if (bundleIdentityError) return bundleIdentityError;
		if ((bundle.manifest.mcp?.tools.length ?? 0) > 0 && !opts?.confirmMcpTools) return {
			success: false,
			error: {
				code: "MCP_TOOL_CONSENT_REQUIRED",
				message: "Plugin MCP tools require explicit consent",
				details: { mcpTools: bundle.manifest.mcp?.tools.map(({ inputSchema: _, outputSchema: __, ...tool }) => tool) }
			}
		};
		await storeBundleInR2(storage, pluginId, version, bundle);
		await stateRepo.upsert(pluginId, version, "active", {
			source: "marketplace",
			marketplaceVersion: version,
			displayName: pluginDetail.name,
			description: pluginDetail.description ?? void 0
		});
		client.reportInstall(pluginId, version).catch(() => {});
		return {
			success: true,
			data: {
				pluginId,
				version,
				capabilities: bundle.manifest.capabilities
			}
		};
	} catch (err) {
		if (err instanceof MarketplaceUnavailableError) return {
			success: false,
			error: {
				code: "MARKETPLACE_UNAVAILABLE",
				message: "Plugin marketplace is currently unavailable"
			}
		};
		if (err instanceof MarketplaceError) return {
			success: false,
			error: {
				code: err.code ?? "MARKETPLACE_ERROR",
				message: err.message
			}
		};
		if (err instanceof EmDashStorageError) return {
			success: false,
			error: {
				code: err.code ?? "STORAGE_ERROR",
				message: "Storage error while installing plugin"
			}
		};
		if (err && typeof err === "object" && "code" in err) {
			const code = err.code;
			if (typeof code === "string" && code.trim()) return {
				success: false,
				error: {
					code,
					message: "Failed to install plugin from marketplace"
				}
			};
		}
		console.error("Failed to install marketplace plugin:", err);
		return {
			success: false,
			error: {
				code: "INSTALL_FAILED",
				message: "Failed to install plugin from marketplace"
			}
		};
	}
}
async function handleMarketplaceUpdate(db, storage, sandboxRunner, marketplaceUrl, pluginId, opts) {
	const client = getClient(marketplaceUrl);
	if (!client) return {
		success: false,
		error: {
			code: "MARKETPLACE_NOT_CONFIGURED",
			message: "Marketplace is not configured"
		}
	};
	if (!storage) return {
		success: false,
		error: {
			code: "STORAGE_NOT_CONFIGURED",
			message: "Storage is required"
		}
	};
	if (!opts?.sandboxBypassed && (!sandboxRunner || !sandboxRunner.isAvailable())) return {
		success: false,
		error: {
			code: "SANDBOX_NOT_AVAILABLE",
			message: "Sandbox runner is required"
		}
	};
	try {
		const stateRepo = new PluginStateRepository(db);
		const existing = await stateRepo.get(pluginId);
		if (!existing || existing.source !== "marketplace") return {
			success: false,
			error: {
				code: "NOT_FOUND",
				message: `No marketplace plugin found: ${pluginId}`
			}
		};
		const oldVersion = existing.marketplaceVersion ?? existing.version;
		const pluginDetail = await client.getPlugin(pluginId);
		const newVersion = opts?.version ?? pluginDetail.latestVersion?.version;
		if (!newVersion) return {
			success: false,
			error: {
				code: "NO_VERSION",
				message: "No newer version available"
			}
		};
		if (newVersion === oldVersion) return {
			success: false,
			error: {
				code: "ALREADY_UP_TO_DATE",
				message: "Plugin is already up to date"
			}
		};
		const versionMetadata = await resolveVersionMetadata(client, pluginId, pluginDetail, newVersion);
		if (!versionMetadata) return {
			success: false,
			error: {
				code: "NO_VERSION",
				message: `Version ${newVersion} was not found for plugin ${pluginId}`
			}
		};
		const bundle = await client.downloadBundle(pluginId, newVersion);
		if (versionMetadata.checksum && bundle.checksum !== versionMetadata.checksum) return {
			success: false,
			error: {
				code: "CHECKSUM_MISMATCH",
				message: "Bundle checksum does not match marketplace record. Download may be corrupted."
			}
		};
		const bundleIdentityError = validateBundleIdentity(bundle, pluginId, newVersion);
		if (bundleIdentityError) return bundleIdentityError;
		const oldBundle = await loadBundleFromR2(storage, pluginId, oldVersion);
		const capabilityChanges = diffCapabilities(oldBundle?.manifest.capabilities ?? [], bundle.manifest.capabilities);
		if (capabilityChanges.added.length > 0 && !opts?.confirmCapabilityChanges) return {
			success: false,
			error: {
				code: "CAPABILITY_ESCALATION",
				message: "Plugin update requires new capabilities",
				details: { capabilityChanges }
			}
		};
		const routeVisibilityChanges = diffRouteVisibility(oldBundle?.manifest, bundle.manifest);
		const hasNewPublicRoutes = routeVisibilityChanges.newlyPublic.length > 0;
		if (hasNewPublicRoutes && !opts?.confirmRouteVisibilityChanges) return {
			success: false,
			error: {
				code: "ROUTE_VISIBILITY_ESCALATION",
				message: "Plugin update exposes new public (unauthenticated) routes",
				details: {
					routeVisibilityChanges,
					capabilityChanges
				}
			}
		};
		const oldMcpTools = [...oldBundle?.manifest.mcp?.tools ?? []].toSorted((a, b) => a.name.localeCompare(b.name));
		const newMcpTools = [...bundle.manifest.mcp?.tools ?? []].toSorted((a, b) => a.name.localeCompare(b.name));
		if (JSON.stringify(oldMcpTools) !== JSON.stringify(newMcpTools) && !opts?.confirmMcpTools) return {
			success: false,
			error: {
				code: "MCP_TOOL_CONSENT_REQUIRED",
				message: "Plugin update changes its MCP tools",
				details: { mcpTools: newMcpTools.map(({ inputSchema: _, outputSchema: __, ...tool }) => tool) }
			}
		};
		await storeBundleInR2(storage, pluginId, newVersion, bundle);
		await stateRepo.upsert(pluginId, newVersion, "active", {
			source: "marketplace",
			marketplaceVersion: newVersion,
			displayName: pluginDetail.name,
			description: pluginDetail.description ?? void 0,
			mcpToolsEnabled: false,
			mcpToolsConsent: null
		});
		deleteBundleFromR2(storage, pluginId, oldVersion).catch(() => {});
		return {
			success: true,
			data: {
				pluginId,
				oldVersion,
				newVersion,
				capabilityChanges,
				routeVisibilityChanges: hasNewPublicRoutes ? routeVisibilityChanges : void 0
			}
		};
	} catch (err) {
		if (err instanceof MarketplaceUnavailableError) return {
			success: false,
			error: {
				code: "MARKETPLACE_UNAVAILABLE",
				message: "Marketplace is unavailable"
			}
		};
		if (err instanceof MarketplaceError) return {
			success: false,
			error: {
				code: err.code ?? "MARKETPLACE_ERROR",
				message: err.message
			}
		};
		console.error("Failed to update marketplace plugin:", err);
		return {
			success: false,
			error: {
				code: "UPDATE_FAILED",
				message: "Failed to update plugin"
			}
		};
	}
}
async function handleMarketplaceUninstall(db, storage, pluginId, opts) {
	try {
		const stateRepo = new PluginStateRepository(db);
		const existing = await stateRepo.get(pluginId);
		if (!existing || existing.source !== "marketplace") return {
			success: false,
			error: {
				code: "NOT_FOUND",
				message: `No marketplace plugin found: ${pluginId}`
			}
		};
		const version = existing.marketplaceVersion ?? existing.version;
		if (storage) await deleteBundleFromR2(storage, pluginId, version);
		let dataDeleted = false;
		if (opts?.deleteData) try {
			await db.deleteFrom("_plugin_storage").where("plugin_id", "=", pluginId).execute();
			dataDeleted = true;
		} catch {}
		await stateRepo.delete(pluginId);
		return {
			success: true,
			data: {
				pluginId,
				dataDeleted
			}
		};
	} catch (err) {
		console.error("Failed to uninstall marketplace plugin:", err);
		return {
			success: false,
			error: {
				code: "UNINSTALL_FAILED",
				message: "Failed to uninstall plugin"
			}
		};
	}
}
async function handleMarketplaceUpdateCheck(db, marketplaceUrl) {
	const client = getClient(marketplaceUrl);
	if (!client) return {
		success: false,
		error: {
			code: "MARKETPLACE_NOT_CONFIGURED",
			message: "Marketplace is not configured"
		}
	};
	try {
		const marketplacePlugins = await new PluginStateRepository(db).getMarketplacePlugins();
		const items = [];
		for (const plugin of marketplacePlugins) try {
			const detail = await client.getPlugin(plugin.pluginId);
			const latest = detail.latestVersion?.version;
			const installed = plugin.marketplaceVersion ?? plugin.version;
			if (!latest) continue;
			const hasUpdate = latest !== installed;
			let capabilityChanges;
			let hasCapabilityChanges = false;
			if (hasUpdate && detail.latestVersion) {
				capabilityChanges = diffCapabilities(detail.capabilities ?? [], detail.latestVersion.capabilities ?? []);
				hasCapabilityChanges = capabilityChanges.added.length > 0 || capabilityChanges.removed.length > 0;
			}
			items.push({
				pluginId: plugin.pluginId,
				installed,
				latest: latest ?? installed,
				hasUpdate,
				hasCapabilityChanges,
				capabilityChanges: hasCapabilityChanges ? capabilityChanges : void 0,
				hasRouteVisibilityChanges: false
			});
		} catch (err) {
			console.warn(`Failed to check updates for ${plugin.pluginId}:`, err);
		}
		return {
			success: true,
			data: { items }
		};
	} catch (err) {
		if (err instanceof MarketplaceUnavailableError) return {
			success: false,
			error: {
				code: "MARKETPLACE_UNAVAILABLE",
				message: "Marketplace is unavailable"
			}
		};
		console.error("Failed to check marketplace updates:", err);
		return {
			success: false,
			error: {
				code: "UPDATE_CHECK_FAILED",
				message: "Failed to check for updates"
			}
		};
	}
}
async function handleMarketplaceSearch(marketplaceUrl, query, opts) {
	const client = getClient(marketplaceUrl);
	if (!client) return {
		success: false,
		error: {
			code: "MARKETPLACE_NOT_CONFIGURED",
			message: "Marketplace is not configured"
		}
	};
	try {
		return {
			success: true,
			data: await client.search(query, opts)
		};
	} catch (err) {
		if (err instanceof MarketplaceUnavailableError) return {
			success: false,
			error: {
				code: "MARKETPLACE_UNAVAILABLE",
				message: "Marketplace is unavailable"
			}
		};
		console.error("Failed to search marketplace:", err);
		return {
			success: false,
			error: {
				code: "SEARCH_FAILED",
				message: "Failed to search marketplace"
			}
		};
	}
}
async function handleMarketplaceGetPlugin(marketplaceUrl, pluginId) {
	const client = getClient(marketplaceUrl);
	if (!client) return {
		success: false,
		error: {
			code: "MARKETPLACE_NOT_CONFIGURED",
			message: "Marketplace is not configured"
		}
	};
	try {
		return {
			success: true,
			data: await client.getPlugin(pluginId)
		};
	} catch (err) {
		if (err instanceof MarketplaceError && err.status === 404) return {
			success: false,
			error: {
				code: "NOT_FOUND",
				message: `Plugin not found: ${pluginId}`
			}
		};
		if (err instanceof MarketplaceUnavailableError) return {
			success: false,
			error: {
				code: "MARKETPLACE_UNAVAILABLE",
				message: "Marketplace is unavailable"
			}
		};
		console.error("Failed to get marketplace plugin:", err);
		return {
			success: false,
			error: {
				code: "GET_PLUGIN_FAILED",
				message: "Failed to get plugin details"
			}
		};
	}
}
async function handleThemeSearch(marketplaceUrl, query, opts) {
	const client = getClient(marketplaceUrl);
	if (!client) return {
		success: false,
		error: {
			code: "MARKETPLACE_NOT_CONFIGURED",
			message: "Marketplace is not configured"
		}
	};
	try {
		return {
			success: true,
			data: await client.searchThemes(query, opts)
		};
	} catch (err) {
		if (err instanceof MarketplaceUnavailableError) return {
			success: false,
			error: {
				code: "MARKETPLACE_UNAVAILABLE",
				message: "Marketplace is unavailable"
			}
		};
		console.error("Failed to search themes:", err);
		return {
			success: false,
			error: {
				code: "THEME_SEARCH_FAILED",
				message: "Failed to search themes"
			}
		};
	}
}
async function handleThemeGetDetail(marketplaceUrl, themeId) {
	const client = getClient(marketplaceUrl);
	if (!client) return {
		success: false,
		error: {
			code: "MARKETPLACE_NOT_CONFIGURED",
			message: "Marketplace is not configured"
		}
	};
	try {
		return {
			success: true,
			data: await client.getTheme(themeId)
		};
	} catch (err) {
		if (err instanceof MarketplaceError && err.status === 404) return {
			success: false,
			error: {
				code: "NOT_FOUND",
				message: `Theme not found: ${themeId}`
			}
		};
		if (err instanceof MarketplaceUnavailableError) return {
			success: false,
			error: {
				code: "MARKETPLACE_UNAVAILABLE",
				message: "Marketplace is unavailable"
			}
		};
		console.error("Failed to get marketplace theme:", err);
		return {
			success: false,
			error: {
				code: "GET_THEME_FAILED",
				message: "Failed to get theme details"
			}
		};
	}
}
function canonicalCapabilitiesForDriftCheck(value) {
	if (!Array.isArray(value)) return [];
	const seen = /* @__PURE__ */ new Set();
	for (const entry of value) if (typeof entry === "string" && entry.length > 0) seen.add(entry);
	return [...seen].toSorted();
}
function releaseExemptFromMinimumAge(exclude, publisherDid, slug) {
	if (!exclude || exclude.length === 0) return false;
	const didLower = publisherDid.toLowerCase();
	const fullDid = `${didLower}/${slug.toLowerCase()}`;
	for (const entry of exclude) {
		if (entry === didLower) return true;
		if (entry === fullDid) return true;
	}
	return false;
}
var DURATION_PATTERN = /^(\d+)(s|m|h|d|w)$/;
var TRAILING_SLASHES = /\/+$/;
var TRAILING_DOT$1 = /\.$/;
function parseDurationSeconds(duration) {
	if (typeof duration === "number") {
		if (!Number.isFinite(duration) || duration < 0) throw new Error(`Invalid duration: ${duration} (must be a non-negative finite number)`);
		return Math.floor(duration);
	}
	const match = duration.match(DURATION_PATTERN);
	if (!match) throw new Error(`Invalid duration format: "${duration}". Use a duration string like "48h", "7d", "30m", or a number of seconds.`);
	const value = parseInt(match[1], 10);
	const unit = match[2];
	switch (unit) {
		case "s": return value;
		case "m": return value * 60;
		case "h": return value * 60 * 60;
		case "d": return value * 24 * 60 * 60;
		case "w": return value * 7 * 24 * 60 * 60;
		default: throw new Error(`Unknown duration unit: ${unit}`);
	}
}
function validateAggregatorUrl(aggregatorUrl) {
	let parsed;
	try {
		parsed = new URL(aggregatorUrl);
	} catch {
		throw new Error(`registry.aggregatorUrl is not a valid URL: ${aggregatorUrl}`);
	}
	if (parsed.protocol !== "http:" && parsed.protocol !== "https:") throw new Error(`registry.aggregatorUrl must use http or https: ${aggregatorUrl}`);
	if (parsed.username || parsed.password) throw new Error("registry.aggregatorUrl must not contain embedded credentials (user:pass@)");
	const rawHostname = parsed.hostname.toLowerCase().replace(TRAILING_DOT$1, "");
	const hostname = rawHostname.startsWith("[") && rawHostname.endsWith("]") ? rawHostname.slice(1, -1) : rawHostname;
	const isLocalhost = hostname === "localhost" || hostname.endsWith(".localhost") || hostname === "127.0.0.1" || hostname === "::1" || hostname.startsWith("::ffff:127.") || hostname.startsWith("::ffff:7f00:");
	if (parsed.protocol === "http:") throw new Error(`registry.aggregatorUrl must use https in production: ${aggregatorUrl}`);
	if (isLocalhost) throw new Error(`registry.aggregatorUrl points at localhost; allowed only in dev: ${aggregatorUrl}`);
	return parsed;
}
function coerceRegistryConfig(input) {
	if (input === void 0) return void 0;
	if (typeof input === "string") return { aggregatorUrl: input };
	return input;
}
function normalizeRegistryConfig(input) {
	const config = coerceRegistryConfig(input);
	if (!config) return null;
	const aggregatorUrl = config.aggregatorUrl?.trim();
	if (!aggregatorUrl) throw new Error("registry.aggregatorUrl is required when registry is configured");
	validateAggregatorUrl(aggregatorUrl);
	const out = { aggregatorUrl: aggregatorUrl.replace(TRAILING_SLASHES, "") };
	if (config.acceptLabelers) out.acceptLabelers = config.acceptLabelers;
	const policy = {};
	let hasPolicy = false;
	if (config.policy?.minimumReleaseAge !== void 0) {
		policy.minimumReleaseAgeSeconds = parseDurationSeconds(config.policy.minimumReleaseAge);
		hasPolicy = true;
	}
	if (config.policy?.minimumReleaseAgeExclude !== void 0) {
		const list = config.policy.minimumReleaseAgeExclude.map((entry) => {
			const trimmed = entry.trim();
			if (!trimmed) throw new Error("registry.policy.minimumReleaseAgeExclude entries cannot be empty");
			return trimmed.toLowerCase();
		});
		if (list.length > 0) {
			policy.minimumReleaseAgeExclude = list;
			hasPolicy = true;
		}
	}
	if (hasPolicy) out.policy = policy;
	return out;
}
var HASH_LENGTH = 16;
var BASE32_ALPHABET = "abcdefghijklmnopqrstuvwxyz234567";
function base32Encode(bytes) {
	let bits = 0;
	let value = 0;
	let out = "";
	for (const byte of bytes) {
		value = value << 8 | byte;
		bits += 8;
		while (bits >= 5) {
			bits -= 5;
			out += BASE32_ALPHABET[value >>> bits & 31];
		}
	}
	if (bits > 0) out += BASE32_ALPHABET[value << 5 - bits & 31];
	return out;
}
async function makeRegistryPluginId(publisherDid, slug) {
	const did = publisherDid.trim();
	const s = slug.trim();
	if (!did) throw new Error("makeRegistryPluginId: publisherDid is required");
	if (!s) throw new Error("makeRegistryPluginId: slug is required");
	const input = `${did}
${s}`;
	const hashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
	return `r_${base32Encode(new Uint8Array(hashBuffer)).slice(0, HASH_LENGTH)}`;
}
var RELEASE_EXTENSION_NSID = "com.emdashcms.experimental.package.releaseExtension";
function enforcedAccessEqual(a, b) {
	const aa = declaredAccessToCapabilities(a);
	const bb = declaredAccessToCapabilities(b);
	return JSON.stringify(aa.capabilities.toSorted()) === JSON.stringify(bb.capabilities.toSorted()) && JSON.stringify(aa.allowedHosts.toSorted()) === JSON.stringify(bb.allowedHosts.toSorted());
}
var SHA256_HEX_PATTERN = /^[a-f0-9]{64}$/i;
async function sha256Hex(bytes) {
	const buf = await crypto.subtle.digest("SHA-256", bytes);
	const arr = new Uint8Array(buf);
	return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
}
var MULTIHASH_SHA256_CODE = 18;
var MULTIHASH_SHA256_LENGTH = 32;
async function sha256MultibaseMultihash(bytes) {
	const digestBuf = await crypto.subtle.digest("SHA-256", bytes);
	const digest = new Uint8Array(digestBuf);
	const multihash = new Uint8Array(2 + digest.length);
	multihash[0] = MULTIHASH_SHA256_CODE;
	multihash[1] = MULTIHASH_SHA256_LENGTH;
	multihash.set(digest, 2);
	const { toBase32 } = await import("./dist_CO-iluUq.mjs");
	return `b${toBase32(multihash)}`;
}
async function verifyChecksum(bytes, checksum) {
	if (SHA256_HEX_PATTERN.test(checksum)) {
		const actual = await sha256Hex(bytes);
		return checksum.toLowerCase() === actual;
	}
	if (checksum.length === 56 && checksum.startsWith("b")) return (await sha256MultibaseMultihash(bytes)).toLowerCase() === checksum.toLowerCase();
	return false;
}
var MAX_ARTIFACT_BYTES = 524288;
var MAX_REDIRECTS = 5;
var ARTIFACT_FETCH_TIMEOUT_MS = 15e3;
var ARTIFACT_TOTAL_BUDGET_MS = 45e3;
var MAX_MIRRORS = 16;
var AGGREGATOR_REQUEST_TIMEOUT_MS = 15e3;
var AGGREGATOR_TOTAL_BUDGET_MS = 3e4;
function timedFetch(totalDeadline) {
	return (input, init) => {
		const remaining = Math.max(0, totalDeadline - Date.now());
		if (remaining === 0) return Promise.reject(/* @__PURE__ */ new Error("Aggregator request budget exhausted"));
		const timeout = Math.min(AGGREGATOR_REQUEST_TIMEOUT_MS, remaining);
		const controller = new AbortController();
		const timer = setTimeout(() => controller.abort(), timeout);
		const callerSignal = init?.signal;
		if (callerSignal) if (callerSignal.aborted) controller.abort(callerSignal.reason);
		else callerSignal.addEventListener("abort", () => controller.abort(callerSignal.reason));
		return fetch(input, {
			...init,
			signal: controller.signal
		}).finally(() => {
			clearTimeout(timer);
		});
	};
}
var FORBIDDEN_HOSTNAMES = /* @__PURE__ */ new Set([
	"localhost",
	"localhost.localdomain",
	"ip6-localhost",
	"ip6-loopback"
]);
var TRAILING_DOT = /\.$/;
function isLocalhostHostname(hostname) {
	const stripped = hostname.toLowerCase().replace(TRAILING_DOT, "");
	const h = stripped.startsWith("[") && stripped.endsWith("]") ? stripped.slice(1, -1) : stripped;
	if (FORBIDDEN_HOSTNAMES.has(h)) return true;
	if (h === "localhost") return true;
	if (h.endsWith(".localhost")) return true;
	if (h === "127.0.0.1" || h === "::1") return true;
	if (h.startsWith("::ffff:127.") || h.startsWith("::ffff:7f00:")) return true;
	return false;
}
async function assertSafeArtifactUrl(urlString) {
	let url;
	try {
		url = new URL(urlString);
	} catch {
		throw new Error(`Invalid artifact URL: ${urlString}`);
	}
	if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error(`Artifact URL protocol not allowed: ${url.protocol}`);
	if (url.username || url.password) throw new Error("Artifact URL must not contain embedded credentials");
	const rawHostname = url.hostname.toLowerCase().replace(TRAILING_DOT, "");
	const hostname = rawHostname.startsWith("[") && rawHostname.endsWith("]") ? rawHostname.slice(1, -1) : rawHostname;
	const localhost = isLocalhostHostname(hostname);
	if (url.protocol === "http:") throw new Error("Artifact URL must use https");
	if (localhost) throw new Error(`Artifact URL points to localhost: ${hostname}`);
	if (localhost) return url;
	try {
		return await resolveAndValidateExternalUrl(url.href);
	} catch (err) {
		if (err instanceof SsrfError) throw new Error(`Artifact URL rejected: ${err.message}`, { cause: err });
		throw err;
	}
}
async function fetchWithLimits(initialUrl, totalDeadline) {
	const remaining = Math.max(0, totalDeadline - Date.now());
	if (remaining === 0) throw new Error("Artifact download budget exhausted");
	const perUrlTimeout = Math.min(ARTIFACT_FETCH_TIMEOUT_MS, remaining);
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), perUrlTimeout);
	try {
		let current = await assertSafeArtifactUrl(initialUrl);
		let response;
		for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
			response = await fetch(current.href, {
				redirect: "manual",
				signal: controller.signal
			});
			if (response.status < 300 || response.status >= 400) break;
			const location = response.headers.get("location");
			if (!location) break;
			if (hop === MAX_REDIRECTS) throw new Error(`Too many redirects fetching artifact (>${MAX_REDIRECTS})`);
			current = await assertSafeArtifactUrl(new URL(location, current).href);
		}
		const finalResponse = response;
		if (!finalResponse.ok) throw new Error(`HTTP ${finalResponse.status}`);
		const lengthHeader = finalResponse.headers.get("content-length");
		if (lengthHeader) {
			const declared = Number(lengthHeader);
			if (Number.isFinite(declared) && declared > MAX_ARTIFACT_BYTES) throw new Error(`Artifact too large (declared ${declared} bytes, limit ${MAX_ARTIFACT_BYTES})`);
		}
		const body = finalResponse.body;
		if (!body) {
			const buf = new Uint8Array(await finalResponse.arrayBuffer());
			if (buf.byteLength > MAX_ARTIFACT_BYTES) throw new Error(`Artifact too large (limit ${MAX_ARTIFACT_BYTES} bytes)`);
			return buf;
		}
		const reader = body.getReader();
		const chunks2 = [];
		let total = 0;
		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			if (!value) continue;
			total += value.byteLength;
			if (total > MAX_ARTIFACT_BYTES) {
				try {
					await reader.cancel();
				} catch {}
				throw new Error(`Artifact too large (limit ${MAX_ARTIFACT_BYTES} bytes)`);
			}
			chunks2.push(value);
		}
		const out = new Uint8Array(total);
		let offset = 0;
		for (const chunk of chunks2) {
			out.set(chunk, offset);
			offset += chunk.byteLength;
		}
		return out;
	} finally {
		clearTimeout(timer);
	}
}
function redactUrlForError(raw) {
	try {
		const u = new URL(raw);
		return `${u.origin}${u.pathname}`;
	} catch {
		return "<malformed url>";
	}
}
async function fetchArtifact(mirrors, declaredUrl) {
	const urls = [...mirrors.slice(0, MAX_MIRRORS), declaredUrl];
	const clientErrors = [];
	const totalDeadline = Date.now() + ARTIFACT_TOTAL_BUDGET_MS;
	for (const url of urls) {
		if (Date.now() >= totalDeadline) {
			clientErrors.push("(total artifact download budget exhausted)");
			break;
		}
		try {
			return await fetchWithLimits(url, totalDeadline);
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err);
			console.warn(`[registry-install] Artifact fetch failed from ${url}:`, message);
			clientErrors.push(`${redactUrlForError(url)}: ${message}`);
		}
	}
	throw new Error(`Failed to download artifact from any source. Tried:
  ${clientErrors.join("\n  ")}`);
}
function assertEnvCompatible(requires, hostEnv) {
	for (const skipped of findSkippedEnvConstraints(requires, hostEnv)) console.warn(`[registry] env compatibility constraint skipped: ${skipped.key} requires ${skipped.required} but host version is ${skipped.reason}`);
	const mismatches = checkEnvCompatibility(requires, hostEnv);
	if (mismatches.length === 0) return null;
	const guarded = {};
	for (const m of mismatches) guarded[m.key] = m.required;
	return {
		code: "ENV_INCOMPATIBLE",
		message: `This release is not compatible with the current environment: ${mismatches.map((m) => `${m.key} requires ${m.required} but host is ${m.host}`).join("; ")}.`,
		details: {
			requires: guarded,
			host: hostEnv
		}
	};
}
async function handleRegistryInstall(db, storage, sandboxRunner, registryConfigInput, input, opts) {
	const registryConfig = coerceRegistryConfig(registryConfigInput);
	if (!registryConfig) return {
		success: false,
		error: {
			code: "REGISTRY_NOT_CONFIGURED",
			message: "Registry is not configured"
		}
	};
	if (!storage) return {
		success: false,
		error: {
			code: "STORAGE_NOT_CONFIGURED",
			message: "Storage is required for registry plugin installation"
		}
	};
	if (!sandboxRunner || !sandboxRunner.isAvailable()) return {
		success: false,
		error: {
			code: "SANDBOX_NOT_AVAILABLE",
			message: "Sandbox runner is required for registry plugins"
		}
	};
	try {
		validateAggregatorUrl(registryConfig.aggregatorUrl);
	} catch (err) {
		return {
			success: false,
			error: {
				code: "REGISTRY_NOT_CONFIGURED",
				message: err instanceof Error ? err.message : "Invalid aggregator URL"
			}
		};
	}
	const { did, slug, version: requestedVersion } = input;
	const { DiscoveryClient } = await import("./discovery_uSPm7AgP.mjs");
	const aggregatorDeadline = Date.now() + AGGREGATOR_TOTAL_BUDGET_MS;
	const discovery = new DiscoveryClient({
		aggregatorUrl: registryConfig.aggregatorUrl,
		acceptLabelers: registryConfig.acceptLabelers,
		fetch: timedFetch(aggregatorDeadline)
	});
	if (!did.startsWith("did:") || did.split(":").length < 3) return {
		success: false,
		error: {
			code: "INVALID_DID",
			message: "DID must be a valid atproto DID (e.g. did:plc:abc123)"
		}
	};
	try {
		const publisherDid = did;
		const packageView = await discovery.getPackage({
			did: publisherDid,
			slug
		});
		const MAX_LIST_PAGES = 20;
		const releaseView = await (async () => {
			if (!requestedVersion) return discovery.getLatestRelease({
				did: publisherDid,
				package: slug
			});
			let cursor;
			const seenCursors = /* @__PURE__ */ new Set();
			for (let page = 0; page < MAX_LIST_PAGES; page++) {
				if (cursor !== void 0) {
					if (seenCursors.has(cursor)) break;
					seenCursors.add(cursor);
				}
				const result = await discovery.listReleases({
					did: publisherDid,
					package: slug,
					cursor,
					limit: 50
				});
				for (const r of result.releases) if (r.version === requestedVersion) return r;
				if (!result.cursor) break;
				cursor = result.cursor;
			}
		})();
		if (!releaseView) return {
			success: false,
			error: {
				code: "NO_RELEASE",
				message: requestedVersion ? `Version ${requestedVersion} not found for ${publisherDid}/${slug}` : `No installable release found for ${publisherDid}/${slug}`
			}
		};
		const signedRelease = releaseView.release;
		if (packageView.did !== publisherDid || packageView.slug !== slug) return {
			success: false,
			error: {
				code: "AGGREGATOR_IDENTITY_MISMATCH",
				message: "Aggregator returned a package view for a different publisher or slug."
			}
		};
		if (releaseView.did !== publisherDid || releaseView.package !== slug || signedRelease?.package !== slug || requestedVersion !== void 0 && releaseView.version !== requestedVersion || signedRelease?.version !== releaseView.version) return {
			success: false,
			error: {
				code: "AGGREGATOR_IDENTITY_MISMATCH",
				message: "Aggregator returned a release view that does not match the requested package or version."
			}
		};
		const version = releaseView.version;
		const yanked = (packageView.labels ?? []).some((l) => l.val === "security:yanked");
		const releaseYanked = (releaseView.labels ?? []).some((l) => l.val === "security:yanked");
		if (yanked || releaseYanked) return {
			success: false,
			error: {
				code: "RELEASE_YANKED",
				message: "This release has been withdrawn (security:yanked label)."
			}
		};
		if (opts?.hostEnv) {
			const envError = assertEnvCompatible(releaseView.release?.requires, opts.hostEnv);
			if (envError) return {
				success: false,
				error: envError
			};
		}
		const minimumReleaseAge = registryConfig.policy?.minimumReleaseAge;
		let minimumReleaseAgeSeconds = 0;
		if (minimumReleaseAge !== void 0) try {
			minimumReleaseAgeSeconds = parseDurationSeconds(minimumReleaseAge);
		} catch (err) {
			return {
				success: false,
				error: {
					code: "REGISTRY_POLICY_INVALID",
					message: err instanceof Error ? err.message : "Invalid minimumReleaseAge value in registry config"
				}
			};
		}
		if (minimumReleaseAgeSeconds > 0) {
			const exclude = registryConfig.policy?.minimumReleaseAgeExclude?.map((e) => e.trim().toLowerCase());
			if (!releaseExemptFromMinimumAge(exclude, publisherDid, slug)) {
				const indexedAt = Date.parse(releaseView.indexedAt);
				if (!Number.isFinite(indexedAt)) return {
					success: false,
					error: {
						code: "RELEASE_TIMESTAMP_INVALID",
						message: "Release record is missing a valid indexed-at timestamp; cannot evaluate minimum release age policy."
					}
				};
				const ageSeconds = (Date.now() - indexedAt) / 1e3;
				if (ageSeconds < minimumReleaseAgeSeconds) {
					const remaining = Math.ceil(minimumReleaseAgeSeconds - ageSeconds);
					return {
						success: false,
						error: {
							code: "RELEASE_TOO_NEW",
							message: `This release does not meet the configured minimum release age of ${minimumReleaseAgeSeconds}s. It will be installable in ~${remaining}s.`
						}
					};
				}
			}
		}
		const pluginId = await makeRegistryPluginId(publisherDid, slug);
		if (opts?.configuredPluginIds?.has(pluginId)) return {
			success: false,
			error: {
				code: "PLUGIN_ID_CONFLICT",
				message: "A configured plugin with the same derived id already exists"
			}
		};
		const stateRepo = new PluginStateRepository(db);
		const existing = await stateRepo.get(pluginId);
		if (existing) {
			if (existing.source === "registry") return {
				success: false,
				error: {
					code: "ALREADY_INSTALLED",
					message: `Plugin ${publisherDid}/${slug} is already installed`
				}
			};
			return {
				success: false,
				error: {
					code: "PLUGIN_ID_COLLISION",
					message: `A non-registry plugin already exists at the derived id ${pluginId}. Uninstall it before installing this registry plugin.`
				}
			};
		}
		const release = releaseView.release;
		const declaredUrl = release?.artifacts?.package?.url;
		const declaredChecksum = release?.artifacts?.package?.checksum;
		if (!declaredUrl || !declaredChecksum) return {
			success: false,
			error: {
				code: "INVALID_RELEASE",
				message: "Release record is missing artifact url or checksum"
			}
		};
		const artifactBytes = await fetchArtifact(releaseView.mirrors ?? [], declaredUrl);
		if (!await verifyChecksum(artifactBytes, declaredChecksum)) return {
			success: false,
			error: {
				code: "CHECKSUM_MISMATCH",
				message: "Artifact bytes do not match the release record's checksum, or the checksum encoding is unsupported."
			}
		};
		let bundle;
		try {
			bundle = await extractBundle(artifactBytes);
		} catch (err) {
			return {
				success: false,
				error: {
					code: "INVALID_BUNDLE",
					message: err instanceof Error ? err.message : "Failed to extract plugin bundle"
				}
			};
		}
		if (bundle.manifest.version !== version) return {
			success: false,
			error: {
				code: "MANIFEST_VERSION_MISMATCH",
				message: `Bundle manifest version (${bundle.manifest.version}) does not match release version (${version})`
			}
		};
		if (bundle.manifest.id !== slug) return {
			success: false,
			error: {
				code: "MANIFEST_ID_MISMATCH",
				message: `Bundle manifest id (${bundle.manifest.id}) does not match registry slug (${slug})`
			}
		};
		bundle.manifest = {
			...bundle.manifest,
			id: pluginId
		};
		const recordExt = release?.extensions?.[RELEASE_EXTENSION_NSID];
		if (!enforcedAccessEqual(recordExt?.declaredAccess ?? {}, bundle.manifest.declaredAccess ?? {})) return {
			success: false,
			error: {
				code: "DECLARED_ACCESS_DRIFT",
				message: "The plugin bundle declares different permissions than its published record. Installation refused."
			}
		};
		const actualCapabilities = canonicalCapabilitiesForDriftCheck(bundle.manifest.capabilities);
		if (actualCapabilities.length > 0) {
			if (input.acknowledgedDeclaredAccess === void 0) return {
				success: false,
				error: {
					code: "DECLARED_ACCESS_REQUIRED",
					message: "This plugin declares capabilities that require consent. Re-open the install dialog to review and acknowledge them."
				}
			};
			const acknowledged = canonicalCapabilitiesForDriftCheck(input.acknowledgedDeclaredAccess);
			if (acknowledged.length !== actualCapabilities.length || acknowledged.some((cap, i) => cap !== actualCapabilities[i])) return {
				success: false,
				error: {
					code: "DECLARED_ACCESS_DRIFT",
					message: "Plugin manifest has changed since you consented. Re-open the install dialog to review the new permissions."
				}
			};
		}
		const actualMcpTools = (bundle.manifest.mcp?.tools ?? []).map(({ inputSchema: _, outputSchema: __, ...tool }) => tool);
		if (actualMcpTools.length > 0) {
			if (JSON.stringify(input.acknowledgedMcpTools) !== JSON.stringify(actualMcpTools)) return {
				success: false,
				error: {
					code: "MCP_TOOL_CONSENT_REQUIRED",
					message: "Plugin MCP tools require explicit consent",
					details: { mcpTools: actualMcpTools }
				}
			};
		}
		await storeBundleInR2(storage, pluginId, version, bundle, "registry");
		const profile = packageView.profile;
		try {
			await stateRepo.upsert(pluginId, version, "active", {
				source: "registry",
				displayName: profile?.name ?? slug,
				description: profile?.description ?? void 0,
				registryPublisherDid: publisherDid,
				registrySlug: slug
			});
		} catch (stateErr) {
			let lostRace = false;
			try {
				const winner = await stateRepo.get(pluginId);
				lostRace = winner !== void 0 && winner !== null;
			} catch (probeErr) {
				console.warn(`[registry-install] Failed to probe state row for ${pluginId} after state-write failure; treating as orphan:`, probeErr);
			}
			if (!lostRace) try {
				await deleteBundleFromR2(storage, pluginId, version, "registry");
			} catch (cleanupErr) {
				console.warn(`[registry-install] Failed to clean up R2 bundle for ${pluginId}@${version} after state-row write failure:`, cleanupErr);
			}
			throw stateErr;
		}
		return {
			success: true,
			data: {
				pluginId,
				publisherDid,
				slug,
				version,
				capabilities: bundle.manifest.capabilities
			}
		};
	} catch (err) {
		if (err instanceof ClientValidationError) return {
			success: false,
			error: {
				code: "AGGREGATOR_RESPONSE_INVALID",
				message: `Aggregator returned a response that does not conform to its lexicon (${err.target})`
			}
		};
		if (err instanceof ClientResponseError) return {
			success: false,
			error: {
				code: err.status === 404 ? "AGGREGATOR_NOT_FOUND" : "AGGREGATOR_HTTP_ERROR",
				message: `Aggregator returned ${err.status}: ${err.error}`
			}
		};
		if (err instanceof EmDashStorageError) return {
			success: false,
			error: {
				code: err.code ?? "STORAGE_ERROR",
				message: "Storage error while installing plugin"
			}
		};
		console.error("[registry-install] Failed:", err);
		return {
			success: false,
			error: {
				code: "INSTALL_FAILED",
				message: err instanceof Error ? err.message : "Failed to install plugin from registry"
			}
		};
	}
}
async function handleRegistryUpdateCheck(db, registryConfigInput) {
	const registryConfig = coerceRegistryConfig(registryConfigInput);
	if (!registryConfig) return {
		success: false,
		error: {
			code: "REGISTRY_NOT_CONFIGURED",
			message: "Registry is not configured"
		}
	};
	try {
		const registryPlugins = await new PluginStateRepository(db).getRegistryPlugins();
		if (registryPlugins.length === 0) return {
			success: true,
			data: { items: [] }
		};
		const { DiscoveryClient } = await import("./discovery_uSPm7AgP.mjs");
		const aggregatorDeadline = Date.now() + AGGREGATOR_TOTAL_BUDGET_MS;
		const discovery = new DiscoveryClient({
			aggregatorUrl: registryConfig.aggregatorUrl,
			acceptLabelers: registryConfig.acceptLabelers,
			fetch: timedFetch(aggregatorDeadline)
		});
		const items = [];
		for (const plugin of registryPlugins) {
			if (!plugin.registryPublisherDid || !plugin.registrySlug) continue;
			try {
				const latest = (await discovery.getLatestRelease({
					did: plugin.registryPublisherDid,
					package: plugin.registrySlug
				})).version;
				if (!latest) continue;
				const installed = plugin.version;
				items.push({
					pluginId: plugin.pluginId,
					installed,
					latest,
					hasUpdate: latest !== installed,
					hasCapabilityChanges: false,
					hasRouteVisibilityChanges: false
				});
			} catch (err) {
				console.warn(`[registry-update-check] Skipped ${plugin.pluginId}:`, err);
			}
		}
		return {
			success: true,
			data: { items }
		};
	} catch (err) {
		if (err instanceof ClientValidationError) return {
			success: false,
			error: {
				code: "AGGREGATOR_RESPONSE_INVALID",
				message: `Aggregator returned a response that does not conform to its lexicon (${err.target})`
			}
		};
		if (err instanceof ClientResponseError) return {
			success: false,
			error: {
				code: err.status === 404 ? "AGGREGATOR_NOT_FOUND" : "AGGREGATOR_HTTP_ERROR",
				message: `Aggregator returned ${err.status}: ${err.error}`
			}
		};
		console.error("[registry-update-check] Failed:", err);
		return {
			success: false,
			error: {
				code: "UPDATE_CHECK_FAILED",
				message: "Failed to check for registry updates"
			}
		};
	}
}
//#endregion
export { handleSchemaFieldCreate as $, handleMediaCreate as A, handlePluginList as B, handleContentUpdate as C, handleMarketplaceUninstall as D, handleMarketplaceSearch as E, handleOrphanedTableList as F, handleRevisionGet as G, handlePluginSettingsUpdate as H, handleOrphanedTableRegister as I, handleSchemaCollectionCreate as J, handleRevisionList as K, handlePluginDisable as L, handleMediaGet as M, handleMediaList as N, handleMarketplaceUpdate as O, handleMediaUpdate as P, handleSchemaCollectionUpdate as Q, handlePluginEnable as R, handleContentUnschedule as S, handleMarketplaceInstall as T, handleRegistryInstall as U, handlePluginSettingsGet as V, handleRegistryUpdateCheck as W, handleSchemaCollectionGet as X, handleSchemaCollectionDelete as Y, handleSchemaCollectionList as Z, handleContentPublish as _, handleContentCompare as a, handleThemeGetDetail as at, handleContentTranslations as b, handleContentCreate as c, normalizeRegistryConfig as ct, handleContentDuplicate as d, hostEnvFromVersions as dt, handleSchemaFieldDelete as et, handleContentGet as f, EmDashStorageError as ft, handleContentPermanentDelete as g, handleContentListTrashed as h, handleContentAuthors as i, handleSchemaFieldUpdate as it, handleMediaDelete as j, handleMarketplaceUpdateCheck as k, handleContentDelete as l, validateAggregatorUrl as lt, handleContentList as m, coerceRegistryConfig as n, handleSchemaFieldList as nt, handleContentCountScheduled as o, handleThemeSearch as ot, handleContentGetIncludingTrashed as p, SeoRepository as pt, handleRevisionRestore as q, getPluginSettingsSchema as r, handleSchemaFieldReorder as rt, handleContentCountTrashed as s, loadBundleFromR2 as st, assertSafeArtifactUrl as t, handleSchemaFieldGet as tt, handleContentDiscardDraft as u, validateRev as ut, handleContentRestore as v, handleMarketplaceGetPlugin as w, handleContentUnpublish as x, handleContentSchedule as y, handlePluginGet as z };
