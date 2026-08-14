//#region node_modules/.pnpm/@oslojs+encoding@1.1.0/node_modules/@oslojs/encoding/dist/hex.js
function encodeHexUpperCase(data) {
	let result = "";
	for (let i = 0; i < data.length; i++) {
		result += alphabetUpperCase[data[i] >> 4];
		result += alphabetUpperCase[data[i] & 15];
	}
	return result;
}
function encodeHexLowerCase(data) {
	let result = "";
	for (let i = 0; i < data.length; i++) {
		result += alphabetLowerCase[data[i] >> 4];
		result += alphabetLowerCase[data[i] & 15];
	}
	return result;
}
function decodeHex(data) {
	if (data.length % 2 !== 0) throw new Error("Invalid hex string");
	const result = new Uint8Array(data.length / 2);
	for (let i = 0; i < data.length; i += 2) {
		if (!(data[i] in decodeMap)) throw new Error("Invalid character");
		if (!(data[i + 1] in decodeMap)) throw new Error("Invalid character");
		result[i / 2] |= decodeMap[data[i]] << 4;
		result[i / 2] |= decodeMap[data[i + 1]];
	}
	return result;
}
var alphabetUpperCase = "0123456789ABCDEF";
var alphabetLowerCase = "0123456789abcdef";
var decodeMap = {
	"0": 0,
	"1": 1,
	"2": 2,
	"3": 3,
	"4": 4,
	"5": 5,
	"6": 6,
	"7": 7,
	"8": 8,
	"9": 9,
	a: 10,
	A: 10,
	b: 11,
	B: 11,
	c: 12,
	C: 12,
	d: 13,
	D: 13,
	e: 14,
	E: 14,
	f: 15,
	F: 15
};
//#endregion
export { encodeHexLowerCase as n, encodeHexUpperCase as r, decodeHex as t };
