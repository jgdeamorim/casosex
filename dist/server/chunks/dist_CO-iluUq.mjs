//#region node_modules/.pnpm/@atcute+multibase@1.2.5/node_modules/@atcute/multibase/dist/bases/base32-encode.js
var ALPHABET = "abcdefghijklmnopqrstuvwxyz234567";
var _cc = /*#__PURE__*/ (() => {
	const t = /* @__PURE__ */ new Uint8Array(32);
	for (let i = 0; i < 32; i++) t[i] = ALPHABET.charCodeAt(i);
	return t;
})();
var _fromCharCode = String.fromCharCode;
/**
* encodes a Uint8Array to an unpadded RFC 4648 base32 (lowercase) string
*
* @param bytes source buffer
* @returns base32 encoded string
*/
var toBase32 = (bytes) => {
	const len = bytes.length;
	const full = len / 5 | 0;
	const rem = len - full * 5;
	const cc = _cc;
	let str = "";
	let ip = 0;
	const pairs = full / 2 | 0;
	for (let g = 0; g < pairs; g++) {
		const a0 = bytes[ip], a1 = bytes[ip + 1], a2 = bytes[ip + 2], a3 = bytes[ip + 3], a4 = bytes[ip + 4];
		const b0 = bytes[ip + 5], b1 = bytes[ip + 6], b2 = bytes[ip + 7], b3 = bytes[ip + 8], b4 = bytes[ip + 9];
		str += _fromCharCode(cc[a0 >>> 3], cc[(a0 << 2 | a1 >>> 6) & 31], cc[a1 >>> 1 & 31], cc[(a1 << 4 | a2 >>> 4) & 31], cc[(a2 << 1 | a3 >>> 7) & 31], cc[a3 >>> 2 & 31], cc[(a3 << 3 | a4 >>> 5) & 31], cc[a4 & 31], cc[b0 >>> 3], cc[(b0 << 2 | b1 >>> 6) & 31], cc[b1 >>> 1 & 31], cc[(b1 << 4 | b2 >>> 4) & 31], cc[(b2 << 1 | b3 >>> 7) & 31], cc[b3 >>> 2 & 31], cc[(b3 << 3 | b4 >>> 5) & 31], cc[b4 & 31]);
		ip += 10;
	}
	if (full & 1) {
		const b0 = bytes[ip], b1 = bytes[ip + 1], b2 = bytes[ip + 2], b3 = bytes[ip + 3], b4 = bytes[ip + 4];
		str += _fromCharCode(cc[b0 >>> 3], cc[(b0 << 2 | b1 >>> 6) & 31], cc[b1 >>> 1 & 31], cc[(b1 << 4 | b2 >>> 4) & 31], cc[(b2 << 1 | b3 >>> 7) & 31], cc[b3 >>> 2 & 31], cc[(b3 << 3 | b4 >>> 5) & 31], cc[b4 & 31]);
		ip += 5;
	}
	if (rem > 0) {
		let buffer = 0;
		let bits = 0;
		for (let i = ip; i < len; i++) {
			buffer = buffer << 8 | bytes[i];
			bits += 8;
		}
		while (bits >= 5) {
			bits -= 5;
			str += _fromCharCode(cc[buffer >>> bits & 31]);
		}
		if (bits > 0) str += _fromCharCode(cc[buffer << 5 - bits & 31]);
	}
	return str;
};
//#endregion
export { toBase32 };
