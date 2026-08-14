import { n as j } from "./dist_CHdF0ICT.mjs";
//#region node_modules/.pnpm/@unpic+placeholder@0.1.2/node_modules/@unpic/placeholder/dist/index.mjs
function rgbaPixelsToBmp(pixels, width, height) {
	const bytesPerPixel = 3;
	const padding = (4 - width * bytesPerPixel % 4) % 4;
	const bmpPixels = new Uint8Array((width * bytesPerPixel + padding) * height);
	for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
		const i = (y * width + x) * 4;
		const j = (height - y - 1) * (width * bytesPerPixel + padding) + x * bytesPerPixel;
		bmpPixels[j] = pixels[i + 2];
		bmpPixels[j + 1] = pixels[i + 1];
		bmpPixels[j + 2] = pixels[i];
	}
	const header = new Uint8Array([
		66,
		77,
		54 + bmpPixels.length,
		4,
		0,
		0,
		0,
		0,
		0,
		0,
		54,
		0,
		0,
		0,
		40,
		0,
		0,
		0,
		width & 255,
		width >> 8 & 255,
		width >> 16 & 255,
		width >> 24 & 255,
		height & 255,
		height >> 8 & 255,
		height >> 16 & 255,
		height >> 24 & 255,
		1,
		0,
		24,
		0,
		0,
		0,
		0,
		0,
		bmpPixels.length,
		0,
		0,
		0,
		19,
		11,
		0,
		0,
		19,
		11,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	]);
	const fullArr = new Uint8Array(header.length + bmpPixels.length);
	fullArr.set(header);
	fullArr.set(bmpPixels, header.length);
	return fullArr;
}
function imageDataToDataURI(data, mimeType) {
	return `data:${mimeType};base64,${btoa(String.fromCharCode(...data))}`;
}
function blurhashToDataUri(blurhash, width = 8, height = 8) {
	return imageDataToDataURI(rgbaPixelsToBmp(j(blurhash, width, height), width, height), "image/bmp");
}
function blurhashToImageCssString(blurhash, width = 8, height = 8) {
	return `background: url("${blurhashToDataUri(blurhash, width, height)}") cover`;
}
//#endregion
export { blurhashToImageCssString };
