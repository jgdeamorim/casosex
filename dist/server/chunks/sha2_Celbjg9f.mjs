//#region node_modules/.pnpm/@oslojs+binary@1.0.0/node_modules/@oslojs/binary/dist/uint.js
var BigEndian = class {
	uint8(data, offset) {
		if (data.byteLength < offset + 1) throw new TypeError("Insufficient bytes");
		return data[offset];
	}
	uint16(data, offset) {
		if (data.byteLength < offset + 2) throw new TypeError("Insufficient bytes");
		return data[offset] << 8 | data[offset + 1];
	}
	uint32(data, offset) {
		if (data.byteLength < offset + 4) throw new TypeError("Insufficient bytes");
		let result = 0;
		for (let i = 0; i < 4; i++) result |= data[offset + i] << 24 - i * 8;
		return result;
	}
	uint64(data, offset) {
		if (data.byteLength < offset + 8) throw new TypeError("Insufficient bytes");
		let result = 0n;
		for (let i = 0; i < 8; i++) result |= BigInt(data[offset + i]) << BigInt(56 - i * 8);
		return result;
	}
	putUint8(target, value, offset) {
		if (target.length < offset + 1) throw new TypeError("Not enough space");
		if (value < 0 || value > 255) throw new TypeError("Invalid uint8 value");
		target[offset] = value;
	}
	putUint16(target, value, offset) {
		if (target.length < offset + 2) throw new TypeError("Not enough space");
		if (value < 0 || value > 65535) throw new TypeError("Invalid uint16 value");
		target[offset] = value >> 8;
		target[offset + 1] = value & 255;
	}
	putUint32(target, value, offset) {
		if (target.length < offset + 4) throw new TypeError("Not enough space");
		if (value < 0 || value > 4294967295) throw new TypeError("Invalid uint32 value");
		for (let i = 0; i < 4; i++) target[offset + i] = value >> (3 - i) * 8 & 255;
	}
	putUint64(target, value, offset) {
		if (target.length < offset + 8) throw new TypeError("Not enough space");
		if (value < 0 || value > 18446744073709551615n) throw new TypeError("Invalid uint64 value");
		for (let i = 0; i < 8; i++) target[offset + i] = Number(value >> BigInt((7 - i) * 8) & 255n);
	}
};
var LittleEndian = class {
	uint8(data, offset) {
		if (data.byteLength < offset + 1) throw new TypeError("Insufficient bytes");
		return data[offset];
	}
	uint16(data, offset) {
		if (data.byteLength < offset + 2) throw new TypeError("Insufficient bytes");
		return data[offset] | data[offset + 1] << 8;
	}
	uint32(data, offset) {
		if (data.byteLength < offset + 4) throw new TypeError("Insufficient bytes");
		let result = 0;
		for (let i = 0; i < 4; i++) result |= data[offset + i] << i * 8;
		return result;
	}
	uint64(data, offset) {
		if (data.byteLength < offset + 8) throw new TypeError("Insufficient bytes");
		let result = 0n;
		for (let i = 0; i < 8; i++) result |= BigInt(data[offset + i]) << BigInt(i * 8);
		return result;
	}
	putUint8(target, value, offset) {
		if (target.length < 1 + offset) throw new TypeError("Insufficient space");
		if (value < 0 || value > 255) throw new TypeError("Invalid uint8 value");
		target[offset] = value;
	}
	putUint16(target, value, offset) {
		if (target.length < 2 + offset) throw new TypeError("Insufficient space");
		if (value < 0 || value > 65535) throw new TypeError("Invalid uint16 value");
		target[offset + 1] = value >> 8;
		target[offset] = value & 255;
	}
	putUint32(target, value, offset) {
		if (target.length < 4 + offset) throw new TypeError("Insufficient space");
		if (value < 0 || value > 4294967295) throw new TypeError("Invalid uint32 value");
		for (let i = 0; i < 4; i++) target[offset + i] = value >> i * 8 & 255;
	}
	putUint64(target, value, offset) {
		if (target.length < 8 + offset) throw new TypeError("Insufficient space");
		if (value < 0 || value > 18446744073709551615n) throw new TypeError("Invalid uint64 value");
		for (let i = 0; i < 8; i++) target[offset + i] = Number(value >> BigInt(i * 8) & 255n);
	}
};
var bigEndian = new BigEndian();
new LittleEndian();
//#endregion
//#region node_modules/.pnpm/@oslojs+binary@1.0.0/node_modules/@oslojs/binary/dist/bits.js
function rotr32(x, n) {
	return (x << 32 - n | x >>> n) >>> 0;
}
new Uint32Array([
	1116352408,
	1899447441,
	3049323471,
	3921009573,
	961987163,
	1508970993,
	2453635748,
	2870763221,
	3624381080,
	310598401,
	607225278,
	1426881987,
	1925078388,
	2162078206,
	2614888103,
	3248222580,
	3835390401,
	4022224774,
	264347078,
	604807628,
	770255983,
	1249150122,
	1555081692,
	1996064986,
	2554220882,
	2821834349,
	2952996808,
	3210313671,
	3336571891,
	3584528711,
	113926993,
	338241895,
	666307205,
	773529912,
	1294757372,
	1396182291,
	1695183700,
	1986661051,
	2177026350,
	2456956037,
	2730485921,
	2820302411,
	3259730800,
	3345764771,
	3516065817,
	3600352804,
	4094571909,
	275423344,
	430227734,
	506948616,
	659060556,
	883997877,
	958139571,
	1322822218,
	1537002063,
	1747873779,
	1955562222,
	2024104815,
	2227730452,
	2361852424,
	2428436474,
	2756734187,
	3204031479,
	3329325298
]);
//#endregion
//#region node_modules/.pnpm/@oslojs+crypto@1.0.1/node_modules/@oslojs/crypto/dist/sha2/sha256.js
function sha256(data) {
	const hash = new SHA256();
	hash.update(data);
	return hash.digest();
}
var SHA256 = class {
	blockSize = 64;
	size = 32;
	blocks = /* @__PURE__ */ new Uint8Array(64);
	currentBlockSize = 0;
	H = new Uint32Array([
		1779033703,
		3144134277,
		1013904242,
		2773480762,
		1359893119,
		2600822924,
		528734635,
		1541459225
	]);
	l = 0n;
	w = /* @__PURE__ */ new Uint32Array(64);
	update(data) {
		this.l += BigInt(data.byteLength) * 8n;
		if (this.currentBlockSize + data.byteLength < 64) {
			this.blocks.set(data, this.currentBlockSize);
			this.currentBlockSize += data.byteLength;
			return;
		}
		let processed = 0;
		if (this.currentBlockSize > 0) {
			const next = data.slice(0, 64 - this.currentBlockSize);
			this.blocks.set(next, this.currentBlockSize);
			this.process();
			processed += next.byteLength;
			this.currentBlockSize = 0;
		}
		while (processed + 64 <= data.byteLength) {
			const next = data.slice(processed, processed + 64);
			this.blocks.set(next);
			this.process();
			processed += 64;
		}
		if (data.byteLength - processed > 0) {
			const remaining = data.slice(processed);
			this.blocks.set(remaining);
			this.currentBlockSize = remaining.byteLength;
		}
	}
	digest() {
		this.blocks[this.currentBlockSize] = 128;
		this.currentBlockSize += 1;
		if (64 - this.currentBlockSize < 8) {
			this.blocks.fill(0, this.currentBlockSize);
			this.process();
			this.currentBlockSize = 0;
		}
		this.blocks.fill(0, this.currentBlockSize);
		bigEndian.putUint64(this.blocks, this.l, this.blockSize - 8);
		this.process();
		const result = /* @__PURE__ */ new Uint8Array(32);
		for (let i = 0; i < 8; i++) bigEndian.putUint32(result, this.H[i], i * 4);
		return result;
	}
	process() {
		for (let t = 0; t < 16; t++) this.w[t] = (this.blocks[t * 4] << 24 | this.blocks[t * 4 + 1] << 16 | this.blocks[t * 4 + 2] << 8 | this.blocks[t * 4 + 3]) >>> 0;
		for (let t = 16; t < 64; t++) {
			const sigma1 = (rotr32(this.w[t - 2], 17) ^ rotr32(this.w[t - 2], 19) ^ this.w[t - 2] >>> 10) >>> 0;
			const sigma0 = (rotr32(this.w[t - 15], 7) ^ rotr32(this.w[t - 15], 18) ^ this.w[t - 15] >>> 3) >>> 0;
			this.w[t] = sigma1 + this.w[t - 7] + sigma0 + this.w[t - 16] | 0;
		}
		let a = this.H[0];
		let b = this.H[1];
		let c = this.H[2];
		let d = this.H[3];
		let e = this.H[4];
		let f = this.H[5];
		let g = this.H[6];
		let h = this.H[7];
		for (let t = 0; t < 64; t++) {
			const sigma1 = (rotr32(e, 6) ^ rotr32(e, 11) ^ rotr32(e, 25)) >>> 0;
			const ch = (e & f ^ ~e & g) >>> 0;
			const t1 = h + sigma1 + ch + K$1[t] + this.w[t] | 0;
			const t2 = ((rotr32(a, 2) ^ rotr32(a, 13) ^ rotr32(a, 22)) >>> 0) + ((a & b ^ a & c ^ b & c) >>> 0) | 0;
			h = g;
			g = f;
			f = e;
			e = d + t1 | 0;
			d = c;
			c = b;
			b = a;
			a = t1 + t2 | 0;
		}
		this.H[0] = a + this.H[0] | 0;
		this.H[1] = b + this.H[1] | 0;
		this.H[2] = c + this.H[2] | 0;
		this.H[3] = d + this.H[3] | 0;
		this.H[4] = e + this.H[4] | 0;
		this.H[5] = f + this.H[5] | 0;
		this.H[6] = g + this.H[6] | 0;
		this.H[7] = h + this.H[7] | 0;
	}
};
var K$1 = new Uint32Array([
	1116352408,
	1899447441,
	3049323471,
	3921009573,
	961987163,
	1508970993,
	2453635748,
	2870763221,
	3624381080,
	310598401,
	607225278,
	1426881987,
	1925078388,
	2162078206,
	2614888103,
	3248222580,
	3835390401,
	4022224774,
	264347078,
	604807628,
	770255983,
	1249150122,
	1555081692,
	1996064986,
	2554220882,
	2821834349,
	2952996808,
	3210313671,
	3336571891,
	3584528711,
	113926993,
	338241895,
	666307205,
	773529912,
	1294757372,
	1396182291,
	1695183700,
	1986661051,
	2177026350,
	2456956037,
	2730485921,
	2820302411,
	3259730800,
	3345764771,
	3516065817,
	3600352804,
	4094571909,
	275423344,
	430227734,
	506948616,
	659060556,
	883997877,
	958139571,
	1322822218,
	1537002063,
	1747873779,
	1955562222,
	2024104815,
	2227730452,
	2361852424,
	2428436474,
	2756734187,
	3204031479,
	3329325298
]);
new BigUint64Array([
	4794697086780616226n,
	8158064640168781261n,
	13096744586834688815n,
	16840607885511220156n,
	4131703408338449720n,
	6480981068601479193n,
	10538285296894168987n,
	12329834152419229976n,
	15566598209576043074n,
	1334009975649890238n,
	2608012711638119052n,
	6128411473006802146n,
	8268148722764581231n,
	9286055187155687089n,
	11230858885718282805n,
	13951009754708518548n,
	16472876342353939154n,
	17275323862435702243n,
	1135362057144423861n,
	2597628984639134821n,
	3308224258029322869n,
	5365058923640841347n,
	6679025012923562964n,
	8573033837759648693n,
	10970295158949994411n,
	12119686244451234320n,
	12683024718118986047n,
	13788192230050041572n,
	14330467153632333762n,
	15395433587784984357n,
	489312712824947311n,
	1452737877330783856n,
	2861767655752347644n,
	3322285676063803686n,
	5560940570517711597n,
	5996557281743188959n,
	7280758554555802590n,
	8532644243296465576n,
	9350256976987008742n,
	10552545826968843579n,
	11727347734174303076n,
	12113106623233404929n,
	14000437183269869457n,
	14369950271660146224n,
	15101387698204529176n,
	15463397548674623760n,
	17586052441742319658n,
	1182934255886127544n,
	1847814050463011016n,
	2177327727835720531n,
	2830643537854262169n,
	3796741975233480872n,
	4115178125766777443n,
	5681478168544905931n,
	6601373596472566643n,
	7507060721942968483n,
	8399075790359081724n,
	8693463985226723168n,
	9568029438360202098n,
	10144078919501101548n,
	10430055236837252648n,
	11840083180663258601n,
	13761210420658862357n,
	14299343276471374635n,
	14566680578165727644n,
	15097957966210449927n,
	16922976911328602910n,
	17689382322260857208n,
	500013540394364858n,
	748580250866718886n,
	1242879168328830382n,
	1977374033974150939n,
	2944078676154940804n,
	3659926193048069267n,
	4368137639120453308n,
	4836135668995329356n,
	5532061633213252278n,
	6448918945643986474n,
	6902733635092675308n,
	7801388544844847127n
]);
//#endregion
export { bigEndian as i, sha256 as n, rotr32 as r, SHA256 as t };
