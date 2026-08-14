import { C as unescapeHTML, T as createAstro, _ as addAttribute, d as renderTemplate, h as maybeRenderHead, t as spreadAttributes } from "./server_Lac7W6ZE.mjs";
import { c as isRemotePath } from "./path_CsjwVQRw.mjs";
import { W as RemoteImageNotAllowed, c as ExpectedImage, f as FontFamilyNotFound, j as MissingGetFontFileRequestUrl, l as ExpectedImageOptions, t as AstroError, u as ExpectedNotESMImage, w as InvalidImageService, y as ImageMissingAlt } from "./errors_CPRp8csy.mjs";
import { t as createComponent } from "./astro-component_CcaHMe5u.mjs";
import { t as isRemoteAllowed } from "./remote_Df8tYpvm.mjs";
import { t as DEFAULT_HASH_PROPS } from "./consts_Cii1GIAu.mjs";
import { c as isESMImportedImage, i as inferRemoteSize$1, l as isRemoteImage, n as isLocalService, s as resolveDefaultOutputFormat, u as resolveSrc } from "./service_DzPQ2Ryn.mjs";
import "./compiler_BPLn2J1w.mjs";
//#region node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/dist/assets/layout.js
var DEFAULT_RESOLUTIONS = [
	640,
	750,
	828,
	960,
	1080,
	1280,
	1668,
	1920,
	2048,
	2560,
	3200,
	3840,
	4480,
	5120,
	6016
];
var LIMITED_RESOLUTIONS = [
	640,
	750,
	828,
	1080,
	1280,
	1668,
	2048,
	2560
];
var getWidths = ({ width, layout, breakpoints = DEFAULT_RESOLUTIONS, originalWidth }) => {
	const smallerThanOriginal = (w) => !originalWidth || w <= originalWidth;
	if (layout === "full-width") return breakpoints.filter(smallerThanOriginal);
	if (!width) return [];
	const doubleWidth = width * 2;
	const maxSize = originalWidth ? Math.min(doubleWidth, originalWidth) : doubleWidth;
	if (layout === "fixed") return originalWidth && width > originalWidth ? [originalWidth] : [width, maxSize];
	if (layout === "constrained") return [
		width,
		doubleWidth,
		...breakpoints
	].filter((w) => w <= maxSize).sort((a, b) => a - b);
	return [];
};
var getSizesAttribute = ({ width, layout }) => {
	if (!width || !layout) return;
	switch (layout) {
		case "constrained": return `(min-width: ${width}px) ${width}px, 100vw`;
		case "fixed": return `${width}px`;
		case "full-width": return `100vw`;
		default: return;
	}
};
//#endregion
//#region node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/dist/assets/types.js
function isImageMetadata(src) {
	return src.fsPath && !("fsPath" in src);
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/dist/assets/utils/url.js
var PLACEHOLDER_BASE = "astro://placeholder";
function createPlaceholderURL(pathOrUrl) {
	return new URL(pathOrUrl, PLACEHOLDER_BASE);
}
function stringifyPlaceholderURL(url) {
	return url.href.replace(PLACEHOLDER_BASE, "");
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/dist/assets/internal.js
var cssFitValues = [
	"fill",
	"contain",
	"cover",
	"scale-down"
];
async function getConfiguredImageService$1() {
	if (!globalThis?.astroAsset?.imageService) {
		const { default: service } = await import("./sharp_Cm-TlKkJ.mjs").catch((e) => {
			const error = new AstroError(InvalidImageService);
			error.cause = e;
			throw error;
		});
		if (!globalThis.astroAsset) globalThis.astroAsset = {};
		globalThis.astroAsset.imageService = service;
		return service;
	}
	return globalThis.astroAsset.imageService;
}
async function getImage$1(options, imageConfig) {
	if (!options || typeof options !== "object") throw new AstroError({
		...ExpectedImageOptions,
		message: ExpectedImageOptions.message(JSON.stringify(options))
	});
	if (typeof options.src === "undefined") throw new AstroError({
		...ExpectedImage,
		message: ExpectedImage.message(options.src, "undefined", JSON.stringify(options))
	});
	if (isImageMetadata(options)) throw new AstroError(ExpectedNotESMImage);
	const service = await getConfiguredImageService$1();
	const resolvedOptions = {
		...options,
		src: await resolveSrc(options.src)
	};
	let originalWidth;
	let originalHeight;
	if (resolvedOptions.inferSize) {
		delete resolvedOptions.inferSize;
		if (isRemoteImage(resolvedOptions.src) && isRemotePath(resolvedOptions.src)) {
			if (!isRemoteAllowed(resolvedOptions.src, imageConfig)) throw new AstroError({
				...RemoteImageNotAllowed,
				message: RemoteImageNotAllowed.message(resolvedOptions.src)
			});
			const getRemoteSize = (url) => service.getRemoteSize?.(url, imageConfig) ?? inferRemoteSize$1(url, imageConfig);
			const result = await getRemoteSize(resolvedOptions.src);
			resolvedOptions.width ??= result.width;
			resolvedOptions.height ??= result.height;
			if (result.format) resolvedOptions.format ??= resolveDefaultOutputFormat(result.format);
			originalWidth = result.width;
			originalHeight = result.height;
		}
	}
	const originalFilePath = isESMImportedImage(resolvedOptions.src) ? resolvedOptions.src.fsPath : void 0;
	const clonedSrc = isESMImportedImage(resolvedOptions.src) ? resolvedOptions.src.clone ?? resolvedOptions.src : resolvedOptions.src;
	if (isESMImportedImage(clonedSrc)) {
		originalWidth = clonedSrc.width;
		originalHeight = clonedSrc.height;
	}
	if (originalWidth && originalHeight) {
		const aspectRatio = originalWidth / originalHeight;
		if (resolvedOptions.height && !resolvedOptions.width) resolvedOptions.width = Math.round(resolvedOptions.height * aspectRatio);
		else if (resolvedOptions.width && !resolvedOptions.height) resolvedOptions.height = Math.round(resolvedOptions.width / aspectRatio);
		else if (!resolvedOptions.width && !resolvedOptions.height) {
			resolvedOptions.width = originalWidth;
			resolvedOptions.height = originalHeight;
		}
	}
	resolvedOptions.src = clonedSrc;
	const layout = options.layout ?? imageConfig.layout ?? "none";
	if (resolvedOptions.priority) {
		resolvedOptions.loading ??= "eager";
		resolvedOptions.decoding ??= "sync";
		resolvedOptions.fetchpriority ??= "high";
		delete resolvedOptions.priority;
	} else {
		resolvedOptions.loading ??= "lazy";
		resolvedOptions.decoding ??= "async";
		resolvedOptions.fetchpriority ??= void 0;
	}
	if (layout !== "none") {
		resolvedOptions.widths ||= getWidths({
			width: resolvedOptions.width,
			layout,
			originalWidth,
			breakpoints: imageConfig.breakpoints?.length ? imageConfig.breakpoints : isLocalService(service) ? LIMITED_RESOLUTIONS : DEFAULT_RESOLUTIONS
		});
		resolvedOptions.sizes ||= getSizesAttribute({
			width: resolvedOptions.width,
			layout
		});
		delete resolvedOptions.densities;
		resolvedOptions["data-astro-image"] = layout;
		if (resolvedOptions.fit && cssFitValues.includes(resolvedOptions.fit)) resolvedOptions["data-astro-image-fit"] = resolvedOptions.fit;
		resolvedOptions["data-astro-image-pos"] = (resolvedOptions.position || "center").replace(/\s+/g, "-");
	}
	const validatedOptions = service.validateOptions ? await service.validateOptions(resolvedOptions, imageConfig) : resolvedOptions;
	validatedOptions.format ??= await peekRemoteFormatForStaticEmit(validatedOptions, imageConfig, service);
	const srcSetTransforms = service.getSrcSet ? await service.getSrcSet(validatedOptions, imageConfig) : [];
	const lazyImageURLFactory = (getValue) => {
		let cached = null;
		return () => cached ??= getValue();
	};
	const initialImageURL = await service.getURL(validatedOptions, imageConfig);
	let lazyImageURL = lazyImageURLFactory(() => initialImageURL);
	const matchesValidatedTransform = (transform) => transform.width === validatedOptions.width && transform.height === validatedOptions.height && transform.format === validatedOptions.format;
	let srcSets = await Promise.all(srcSetTransforms.map(async (srcSet) => {
		return {
			transform: srcSet.transform,
			url: matchesValidatedTransform(srcSet.transform) ? initialImageURL : await service.getURL(srcSet.transform, imageConfig),
			descriptor: srcSet.descriptor,
			attributes: srcSet.attributes
		};
	}));
	if (isLocalService(service) && globalThis.astroAsset.addStaticImage && !(isRemoteImage(validatedOptions.src) && initialImageURL === validatedOptions.src)) {
		const propsToHash = service.propertiesToHash ?? DEFAULT_HASH_PROPS;
		lazyImageURL = lazyImageURLFactory(() => globalThis.astroAsset.addStaticImage(validatedOptions, propsToHash, originalFilePath));
		srcSets = srcSetTransforms.map((srcSet) => {
			return {
				transform: srcSet.transform,
				url: matchesValidatedTransform(srcSet.transform) ? lazyImageURL() : globalThis.astroAsset.addStaticImage(srcSet.transform, propsToHash, originalFilePath),
				descriptor: srcSet.descriptor,
				attributes: srcSet.attributes
			};
		});
	} else if (imageConfig.assetQueryParams) {
		const imageURLObj = createPlaceholderURL(initialImageURL);
		imageConfig.assetQueryParams.forEach((value, key) => {
			imageURLObj.searchParams.set(key, value);
		});
		lazyImageURL = lazyImageURLFactory(() => stringifyPlaceholderURL(imageURLObj));
		srcSets = srcSets.map((srcSet) => {
			const urlObj = createPlaceholderURL(srcSet.url);
			imageConfig.assetQueryParams.forEach((value, key) => {
				urlObj.searchParams.set(key, value);
			});
			return {
				...srcSet,
				url: stringifyPlaceholderURL(urlObj)
			};
		});
	}
	return {
		rawOptions: resolvedOptions,
		options: validatedOptions,
		get src() {
			return lazyImageURL();
		},
		srcSet: {
			values: srcSets,
			attribute: srcSets.map((srcSet) => `${srcSet.url} ${srcSet.descriptor}`).join(", ")
		},
		attributes: service.getHTMLAttributes !== void 0 ? await service.getHTMLAttributes(validatedOptions, imageConfig) : {}
	};
}
async function peekRemoteFormatForStaticEmit(options, imageConfig, service) {
	if (!isRemoteImage(options.src) || !isRemoteAllowed(options.src, imageConfig) || !globalThis.astroAsset?.addStaticImage || !isLocalService(service) || !service.getRemoteSize) return;
	try {
		const probed = await service.getRemoteSize(options.src, imageConfig);
		return resolveDefaultOutputFormat(probed.format);
	} catch {
		return;
	}
}
Function.prototype.toString.call(Object);
//#endregion
//#region node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/components/Image.astro
createAstro("https://astro.build");
var $$Image = createComponent(async ($$result, $$props, $$slots) => {
	const Astro2 = $$result.createAstro($$props, $$slots);
	Astro2.self = $$Image;
	const props = Astro2.props;
	if (props.alt === void 0 || props.alt === null) throw new AstroError(ImageMissingAlt);
	if (typeof props.width === "string") props.width = Number.parseInt(props.width);
	if (typeof props.height === "string") props.height = Number.parseInt(props.height);
	if ((props.layout ?? imageConfig.layout ?? "none") !== "none") {
		props.layout ??= imageConfig.layout;
		props.fit ??= imageConfig.objectFit ?? "cover";
		props.position ??= imageConfig.objectPosition ?? "center";
	} else if (imageConfig.objectFit || imageConfig.objectPosition) {
		props.fit ??= imageConfig.objectFit;
		props.position ??= imageConfig.objectPosition;
	}
	const image = await getImage(props);
	const additionalAttributes = {};
	if (image.srcSet.values.length > 0) additionalAttributes.srcset = image.srcSet.attribute;
	const { class: className, ...attributes } = {
		...additionalAttributes,
		...image.attributes
	};
	return renderTemplate`${maybeRenderHead($$result)}<img${addAttribute(image.src, "src")}${spreadAttributes(attributes)}${addAttribute(className, "class")}>`;
}, "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/components/Image.astro", void 0);
//#endregion
//#region node_modules/.pnpm/mrmime@2.0.1/node_modules/mrmime/index.mjs
var mimes = {
	"3g2": "video/3gpp2",
	"3gp": "video/3gpp",
	"3gpp": "video/3gpp",
	"3mf": "model/3mf",
	"aac": "audio/aac",
	"ac": "application/pkix-attr-cert",
	"adp": "audio/adpcm",
	"adts": "audio/aac",
	"ai": "application/postscript",
	"aml": "application/automationml-aml+xml",
	"amlx": "application/automationml-amlx+zip",
	"amr": "audio/amr",
	"apng": "image/apng",
	"appcache": "text/cache-manifest",
	"appinstaller": "application/appinstaller",
	"appx": "application/appx",
	"appxbundle": "application/appxbundle",
	"asc": "application/pgp-keys",
	"atom": "application/atom+xml",
	"atomcat": "application/atomcat+xml",
	"atomdeleted": "application/atomdeleted+xml",
	"atomsvc": "application/atomsvc+xml",
	"au": "audio/basic",
	"avci": "image/avci",
	"avcs": "image/avcs",
	"avif": "image/avif",
	"aw": "application/applixware",
	"bdoc": "application/bdoc",
	"bin": "application/octet-stream",
	"bmp": "image/bmp",
	"bpk": "application/octet-stream",
	"btf": "image/prs.btif",
	"btif": "image/prs.btif",
	"buffer": "application/octet-stream",
	"ccxml": "application/ccxml+xml",
	"cdfx": "application/cdfx+xml",
	"cdmia": "application/cdmi-capability",
	"cdmic": "application/cdmi-container",
	"cdmid": "application/cdmi-domain",
	"cdmio": "application/cdmi-object",
	"cdmiq": "application/cdmi-queue",
	"cer": "application/pkix-cert",
	"cgm": "image/cgm",
	"cjs": "application/node",
	"class": "application/java-vm",
	"coffee": "text/coffeescript",
	"conf": "text/plain",
	"cpl": "application/cpl+xml",
	"cpt": "application/mac-compactpro",
	"crl": "application/pkix-crl",
	"css": "text/css",
	"csv": "text/csv",
	"cu": "application/cu-seeme",
	"cwl": "application/cwl",
	"cww": "application/prs.cww",
	"davmount": "application/davmount+xml",
	"dbk": "application/docbook+xml",
	"deb": "application/octet-stream",
	"def": "text/plain",
	"deploy": "application/octet-stream",
	"dib": "image/bmp",
	"disposition-notification": "message/disposition-notification",
	"dist": "application/octet-stream",
	"distz": "application/octet-stream",
	"dll": "application/octet-stream",
	"dmg": "application/octet-stream",
	"dms": "application/octet-stream",
	"doc": "application/msword",
	"dot": "application/msword",
	"dpx": "image/dpx",
	"drle": "image/dicom-rle",
	"dsc": "text/prs.lines.tag",
	"dssc": "application/dssc+der",
	"dtd": "application/xml-dtd",
	"dump": "application/octet-stream",
	"dwd": "application/atsc-dwd+xml",
	"ear": "application/java-archive",
	"ecma": "application/ecmascript",
	"elc": "application/octet-stream",
	"emf": "image/emf",
	"eml": "message/rfc822",
	"emma": "application/emma+xml",
	"emotionml": "application/emotionml+xml",
	"eps": "application/postscript",
	"epub": "application/epub+zip",
	"exe": "application/octet-stream",
	"exi": "application/exi",
	"exp": "application/express",
	"exr": "image/aces",
	"ez": "application/andrew-inset",
	"fdf": "application/fdf",
	"fdt": "application/fdt+xml",
	"fits": "image/fits",
	"g3": "image/g3fax",
	"gbr": "application/rpki-ghostbusters",
	"geojson": "application/geo+json",
	"gif": "image/gif",
	"glb": "model/gltf-binary",
	"gltf": "model/gltf+json",
	"gml": "application/gml+xml",
	"gpx": "application/gpx+xml",
	"gram": "application/srgs",
	"grxml": "application/srgs+xml",
	"gxf": "application/gxf",
	"gz": "application/gzip",
	"h261": "video/h261",
	"h263": "video/h263",
	"h264": "video/h264",
	"heic": "image/heic",
	"heics": "image/heic-sequence",
	"heif": "image/heif",
	"heifs": "image/heif-sequence",
	"hej2": "image/hej2k",
	"held": "application/atsc-held+xml",
	"hjson": "application/hjson",
	"hlp": "application/winhlp",
	"hqx": "application/mac-binhex40",
	"hsj2": "image/hsj2",
	"htm": "text/html",
	"html": "text/html",
	"ics": "text/calendar",
	"ief": "image/ief",
	"ifb": "text/calendar",
	"iges": "model/iges",
	"igs": "model/iges",
	"img": "application/octet-stream",
	"in": "text/plain",
	"ini": "text/plain",
	"ink": "application/inkml+xml",
	"inkml": "application/inkml+xml",
	"ipfix": "application/ipfix",
	"iso": "application/octet-stream",
	"its": "application/its+xml",
	"jade": "text/jade",
	"jar": "application/java-archive",
	"jhc": "image/jphc",
	"jls": "image/jls",
	"jp2": "image/jp2",
	"jpe": "image/jpeg",
	"jpeg": "image/jpeg",
	"jpf": "image/jpx",
	"jpg": "image/jpeg",
	"jpg2": "image/jp2",
	"jpgm": "image/jpm",
	"jpgv": "video/jpeg",
	"jph": "image/jph",
	"jpm": "image/jpm",
	"jpx": "image/jpx",
	"js": "text/javascript",
	"json": "application/json",
	"json5": "application/json5",
	"jsonld": "application/ld+json",
	"jsonml": "application/jsonml+json",
	"jsx": "text/jsx",
	"jt": "model/jt",
	"jxl": "image/jxl",
	"jxr": "image/jxr",
	"jxra": "image/jxra",
	"jxrs": "image/jxrs",
	"jxs": "image/jxs",
	"jxsc": "image/jxsc",
	"jxsi": "image/jxsi",
	"jxss": "image/jxss",
	"kar": "audio/midi",
	"ktx": "image/ktx",
	"ktx2": "image/ktx2",
	"less": "text/less",
	"lgr": "application/lgr+xml",
	"list": "text/plain",
	"litcoffee": "text/coffeescript",
	"log": "text/plain",
	"lostxml": "application/lost+xml",
	"lrf": "application/octet-stream",
	"m1v": "video/mpeg",
	"m21": "application/mp21",
	"m2a": "audio/mpeg",
	"m2t": "video/mp2t",
	"m2ts": "video/mp2t",
	"m2v": "video/mpeg",
	"m3a": "audio/mpeg",
	"m4a": "audio/mp4",
	"m4p": "application/mp4",
	"m4s": "video/iso.segment",
	"ma": "application/mathematica",
	"mads": "application/mads+xml",
	"maei": "application/mmt-aei+xml",
	"man": "text/troff",
	"manifest": "text/cache-manifest",
	"map": "application/json",
	"mar": "application/octet-stream",
	"markdown": "text/markdown",
	"mathml": "application/mathml+xml",
	"mb": "application/mathematica",
	"mbox": "application/mbox",
	"md": "text/markdown",
	"mdx": "text/mdx",
	"me": "text/troff",
	"mesh": "model/mesh",
	"meta4": "application/metalink4+xml",
	"metalink": "application/metalink+xml",
	"mets": "application/mets+xml",
	"mft": "application/rpki-manifest",
	"mid": "audio/midi",
	"midi": "audio/midi",
	"mime": "message/rfc822",
	"mj2": "video/mj2",
	"mjp2": "video/mj2",
	"mjs": "text/javascript",
	"mml": "text/mathml",
	"mods": "application/mods+xml",
	"mov": "video/quicktime",
	"mp2": "audio/mpeg",
	"mp21": "application/mp21",
	"mp2a": "audio/mpeg",
	"mp3": "audio/mpeg",
	"mp4": "video/mp4",
	"mp4a": "audio/mp4",
	"mp4s": "application/mp4",
	"mp4v": "video/mp4",
	"mpd": "application/dash+xml",
	"mpe": "video/mpeg",
	"mpeg": "video/mpeg",
	"mpf": "application/media-policy-dataset+xml",
	"mpg": "video/mpeg",
	"mpg4": "video/mp4",
	"mpga": "audio/mpeg",
	"mpp": "application/dash-patch+xml",
	"mrc": "application/marc",
	"mrcx": "application/marcxml+xml",
	"ms": "text/troff",
	"mscml": "application/mediaservercontrol+xml",
	"msh": "model/mesh",
	"msi": "application/octet-stream",
	"msix": "application/msix",
	"msixbundle": "application/msixbundle",
	"msm": "application/octet-stream",
	"msp": "application/octet-stream",
	"mtl": "model/mtl",
	"mts": "video/mp2t",
	"musd": "application/mmt-usd+xml",
	"mxf": "application/mxf",
	"mxmf": "audio/mobile-xmf",
	"mxml": "application/xv+xml",
	"n3": "text/n3",
	"nb": "application/mathematica",
	"nq": "application/n-quads",
	"nt": "application/n-triples",
	"obj": "model/obj",
	"oda": "application/oda",
	"oga": "audio/ogg",
	"ogg": "audio/ogg",
	"ogv": "video/ogg",
	"ogx": "application/ogg",
	"omdoc": "application/omdoc+xml",
	"onepkg": "application/onenote",
	"onetmp": "application/onenote",
	"onetoc": "application/onenote",
	"onetoc2": "application/onenote",
	"opf": "application/oebps-package+xml",
	"opus": "audio/ogg",
	"otf": "font/otf",
	"owl": "application/rdf+xml",
	"oxps": "application/oxps",
	"p10": "application/pkcs10",
	"p7c": "application/pkcs7-mime",
	"p7m": "application/pkcs7-mime",
	"p7s": "application/pkcs7-signature",
	"p8": "application/pkcs8",
	"pdf": "application/pdf",
	"pfr": "application/font-tdpfr",
	"pgp": "application/pgp-encrypted",
	"pkg": "application/octet-stream",
	"pki": "application/pkixcmp",
	"pkipath": "application/pkix-pkipath",
	"pls": "application/pls+xml",
	"png": "image/png",
	"prc": "model/prc",
	"prf": "application/pics-rules",
	"provx": "application/provenance+xml",
	"ps": "application/postscript",
	"pskcxml": "application/pskc+xml",
	"pti": "image/prs.pti",
	"qt": "video/quicktime",
	"raml": "application/raml+yaml",
	"rapd": "application/route-apd+xml",
	"rdf": "application/rdf+xml",
	"relo": "application/p2p-overlay+xml",
	"rif": "application/reginfo+xml",
	"rl": "application/resource-lists+xml",
	"rld": "application/resource-lists-diff+xml",
	"rmi": "audio/midi",
	"rnc": "application/relax-ng-compact-syntax",
	"rng": "application/xml",
	"roa": "application/rpki-roa",
	"roff": "text/troff",
	"rq": "application/sparql-query",
	"rs": "application/rls-services+xml",
	"rsat": "application/atsc-rsat+xml",
	"rsd": "application/rsd+xml",
	"rsheet": "application/urc-ressheet+xml",
	"rss": "application/rss+xml",
	"rtf": "text/rtf",
	"rtx": "text/richtext",
	"rusd": "application/route-usd+xml",
	"s3m": "audio/s3m",
	"sbml": "application/sbml+xml",
	"scq": "application/scvp-cv-request",
	"scs": "application/scvp-cv-response",
	"sdp": "application/sdp",
	"senmlx": "application/senml+xml",
	"sensmlx": "application/sensml+xml",
	"ser": "application/java-serialized-object",
	"setpay": "application/set-payment-initiation",
	"setreg": "application/set-registration-initiation",
	"sgi": "image/sgi",
	"sgm": "text/sgml",
	"sgml": "text/sgml",
	"shex": "text/shex",
	"shf": "application/shf+xml",
	"shtml": "text/html",
	"sieve": "application/sieve",
	"sig": "application/pgp-signature",
	"sil": "audio/silk",
	"silo": "model/mesh",
	"siv": "application/sieve",
	"slim": "text/slim",
	"slm": "text/slim",
	"sls": "application/route-s-tsid+xml",
	"smi": "application/smil+xml",
	"smil": "application/smil+xml",
	"snd": "audio/basic",
	"so": "application/octet-stream",
	"spdx": "text/spdx",
	"spp": "application/scvp-vp-response",
	"spq": "application/scvp-vp-request",
	"spx": "audio/ogg",
	"sql": "application/sql",
	"sru": "application/sru+xml",
	"srx": "application/sparql-results+xml",
	"ssdl": "application/ssdl+xml",
	"ssml": "application/ssml+xml",
	"stk": "application/hyperstudio",
	"stl": "model/stl",
	"stpx": "model/step+xml",
	"stpxz": "model/step-xml+zip",
	"stpz": "model/step+zip",
	"styl": "text/stylus",
	"stylus": "text/stylus",
	"svg": "image/svg+xml",
	"svgz": "image/svg+xml",
	"swidtag": "application/swid+xml",
	"t": "text/troff",
	"t38": "image/t38",
	"td": "application/urc-targetdesc+xml",
	"tei": "application/tei+xml",
	"teicorpus": "application/tei+xml",
	"text": "text/plain",
	"tfi": "application/thraud+xml",
	"tfx": "image/tiff-fx",
	"tif": "image/tiff",
	"tiff": "image/tiff",
	"toml": "application/toml",
	"tr": "text/troff",
	"trig": "application/trig",
	"ts": "video/mp2t",
	"tsd": "application/timestamped-data",
	"tsv": "text/tab-separated-values",
	"ttc": "font/collection",
	"ttf": "font/ttf",
	"ttl": "text/turtle",
	"ttml": "application/ttml+xml",
	"txt": "text/plain",
	"u3d": "model/u3d",
	"u8dsn": "message/global-delivery-status",
	"u8hdr": "message/global-headers",
	"u8mdn": "message/global-disposition-notification",
	"u8msg": "message/global",
	"ubj": "application/ubjson",
	"uri": "text/uri-list",
	"uris": "text/uri-list",
	"urls": "text/uri-list",
	"vcard": "text/vcard",
	"vrml": "model/vrml",
	"vtt": "text/vtt",
	"vxml": "application/voicexml+xml",
	"war": "application/java-archive",
	"wasm": "application/wasm",
	"wav": "audio/wav",
	"weba": "audio/webm",
	"webm": "video/webm",
	"webmanifest": "application/manifest+json",
	"webp": "image/webp",
	"wgsl": "text/wgsl",
	"wgt": "application/widget",
	"wif": "application/watcherinfo+xml",
	"wmf": "image/wmf",
	"woff": "font/woff",
	"woff2": "font/woff2",
	"wrl": "model/vrml",
	"wsdl": "application/wsdl+xml",
	"wspolicy": "application/wspolicy+xml",
	"x3d": "model/x3d+xml",
	"x3db": "model/x3d+fastinfoset",
	"x3dbz": "model/x3d+binary",
	"x3dv": "model/x3d-vrml",
	"x3dvz": "model/x3d+vrml",
	"x3dz": "model/x3d+xml",
	"xaml": "application/xaml+xml",
	"xav": "application/xcap-att+xml",
	"xca": "application/xcap-caps+xml",
	"xcs": "application/calendar+xml",
	"xdf": "application/xcap-diff+xml",
	"xdssc": "application/dssc+xml",
	"xel": "application/xcap-el+xml",
	"xenc": "application/xenc+xml",
	"xer": "application/patch-ops-error+xml",
	"xfdf": "application/xfdf",
	"xht": "application/xhtml+xml",
	"xhtml": "application/xhtml+xml",
	"xhvml": "application/xv+xml",
	"xlf": "application/xliff+xml",
	"xm": "audio/xm",
	"xml": "text/xml",
	"xns": "application/xcap-ns+xml",
	"xop": "application/xop+xml",
	"xpl": "application/xproc+xml",
	"xsd": "application/xml",
	"xsf": "application/prs.xsf+xml",
	"xsl": "application/xml",
	"xslt": "application/xml",
	"xspf": "application/xspf+xml",
	"xvm": "application/xv+xml",
	"xvml": "application/xv+xml",
	"yaml": "text/yaml",
	"yang": "application/yang",
	"yin": "application/yin+xml",
	"yml": "text/yaml",
	"zip": "application/zip"
};
function lookup(extn) {
	let tmp = ("" + extn).trim().toLowerCase();
	let idx = tmp.lastIndexOf(".");
	return mimes[!~idx ? tmp : tmp.substring(++idx)];
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/components/Picture.astro
createAstro("https://astro.build");
var $$Picture = createComponent(async ($$result, $$props, $$slots) => {
	const Astro2 = $$result.createAstro($$props, $$slots);
	Astro2.self = $$Picture;
	const defaultFormats = ["webp"];
	const defaultFallbackFormat = "png";
	const specialFormatsFallback = [
		"gif",
		"svg",
		"jpg",
		"jpeg"
	];
	const { formats = defaultFormats, pictureAttributes = {}, fallbackFormat, ...props } = Astro2.props;
	if (props.alt === void 0 || props.alt === null) throw new AstroError(ImageMissingAlt);
	const scopedStyleClass = props.class?.match(/\bastro-\w{8}\b/)?.[0];
	if (scopedStyleClass) {
		if (pictureAttributes.class) pictureAttributes.class = `${pictureAttributes.class} ${scopedStyleClass}`;
		else pictureAttributes.class = scopedStyleClass;
	}
	const useResponsive = (props.layout ?? imageConfig.layout ?? "none") !== "none";
	if (useResponsive) {
		props.layout ??= imageConfig.layout;
		props.fit ??= imageConfig.objectFit ?? "cover";
		props.position ??= imageConfig.objectPosition ?? "center";
	} else if (imageConfig.objectFit || imageConfig.objectPosition) {
		props.fit ??= imageConfig.objectFit;
		props.position ??= imageConfig.objectPosition;
	}
	for (const key in props) if (key.startsWith("data-astro-cid")) pictureAttributes[key] = props[key];
	const originalSrc = await resolveSrc(props.src);
	if (props.inferSize && isRemoteImage(originalSrc)) {
		const remoteSize = await inferRemoteSize(originalSrc);
		delete props.inferSize;
		props.width ??= remoteSize.width;
		props.height ??= remoteSize.height;
	}
	const optimizedImages = await Promise.all(formats.map(async (format) => await getImage({
		...props,
		src: originalSrc,
		format,
		widths: props.widths,
		densities: props.densities
	})));
	const clonedSrc = isESMImportedImage(originalSrc) ? originalSrc.clone ?? originalSrc : originalSrc;
	let resultFallbackFormat = fallbackFormat ?? defaultFallbackFormat;
	if (!fallbackFormat && isESMImportedImage(clonedSrc) && specialFormatsFallback.includes(clonedSrc.format)) resultFallbackFormat = clonedSrc.format;
	const fallbackImage = await getImage({
		...props,
		format: resultFallbackFormat,
		widths: props.widths,
		densities: props.densities
	});
	const imgAdditionalAttributes = {};
	const sourceAdditionalAttributes = {};
	if (props.sizes) sourceAdditionalAttributes.sizes = props.sizes;
	if (fallbackImage.srcSet.values.length > 0) imgAdditionalAttributes.srcset = fallbackImage.srcSet.attribute;
	const { class: className, ...attributes } = {
		...imgAdditionalAttributes,
		...fallbackImage.attributes
	};
	return renderTemplate`${maybeRenderHead($$result)}<picture${spreadAttributes(pictureAttributes)}>${Object.entries(optimizedImages).map(([_, image]) => {
		const srcsetAttribute = props.densities || !props.densities && !props.widths && !useResponsive ? `${image.src}${image.srcSet.values.length > 0 ? ", " + image.srcSet.attribute : ""}` : image.srcSet.attribute;
		return renderTemplate`<source${addAttribute(srcsetAttribute, "srcset")}${addAttribute(lookup(image.options.format ?? image.src) ?? `image/${image.options.format}`, "type")}${spreadAttributes(sourceAdditionalAttributes)}>`;
	})}<img${addAttribute(fallbackImage.src, "src")}${spreadAttributes(attributes)}${addAttribute(className, "class")}></picture>`;
}, "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/components/Picture.astro", void 0);
//#endregion
//#region \0virtual:astro:assets/fonts/internal
var componentDataByCssVariable = /* @__PURE__ */ new Map([["--font-emdash", {
	"preloads": [
		{
			"style": "italic",
			"subset": "cyrillic-ext",
			"type": "woff2",
			"url": "/_astro/fonts/08f0ea18cdf1ae81.woff2",
			"weight": "100 900"
		},
		{
			"style": "italic",
			"subset": "cyrillic",
			"type": "woff2",
			"url": "/_astro/fonts/9593fbb8383eb01c.woff2",
			"weight": "100 900"
		},
		{
			"style": "italic",
			"subset": "devanagari",
			"type": "woff2",
			"url": "/_astro/fonts/cced06053f87829e.woff2",
			"weight": "100 900"
		},
		{
			"style": "italic",
			"subset": "greek-ext",
			"type": "woff2",
			"url": "/_astro/fonts/a9bea187e846fcc2.woff2",
			"weight": "100 900"
		},
		{
			"style": "italic",
			"subset": "greek",
			"type": "woff2",
			"url": "/_astro/fonts/84070159564df0be.woff2",
			"weight": "100 900"
		},
		{
			"style": "italic",
			"subset": "vietnamese",
			"type": "woff2",
			"url": "/_astro/fonts/d581d51cd793384e.woff2",
			"weight": "100 900"
		},
		{
			"style": "italic",
			"subset": "latin-ext",
			"type": "woff2",
			"url": "/_astro/fonts/190f8cf059e0f931.woff2",
			"weight": "100 900"
		},
		{
			"style": "italic",
			"subset": "latin",
			"type": "woff2",
			"url": "/_astro/fonts/1d7aab50fda97bb3.woff2",
			"weight": "100 900"
		},
		{
			"style": "normal",
			"subset": "cyrillic-ext",
			"type": "woff2",
			"url": "/_astro/fonts/81fc65a9fa1b7533.woff2",
			"weight": "100 900"
		},
		{
			"style": "normal",
			"subset": "cyrillic",
			"type": "woff2",
			"url": "/_astro/fonts/1633c6c006fb5995.woff2",
			"weight": "100 900"
		},
		{
			"style": "normal",
			"subset": "devanagari",
			"type": "woff2",
			"url": "/_astro/fonts/f52e1d65e1364c61.woff2",
			"weight": "100 900"
		},
		{
			"style": "normal",
			"subset": "greek-ext",
			"type": "woff2",
			"url": "/_astro/fonts/63342f4e10d096aa.woff2",
			"weight": "100 900"
		},
		{
			"style": "normal",
			"subset": "greek",
			"type": "woff2",
			"url": "/_astro/fonts/a582ec5275b6220a.woff2",
			"weight": "100 900"
		},
		{
			"style": "normal",
			"subset": "vietnamese",
			"type": "woff2",
			"url": "/_astro/fonts/6ed39b447c70fac7.woff2",
			"weight": "100 900"
		},
		{
			"style": "normal",
			"subset": "latin-ext",
			"type": "woff2",
			"url": "/_astro/fonts/ad35ff1453ab1728.woff2",
			"weight": "100 900"
		},
		{
			"style": "normal",
			"subset": "latin",
			"type": "woff2",
			"url": "/_astro/fonts/1e5097bbf9c9d577.woff2",
			"weight": "100 900"
		}
	],
	"css": "@font-face{font-family:\"Noto Sans-ada45c26760e80a3\";src:url(\"/_astro/fonts/08f0ea18cdf1ae81.woff2\") format(\"woff2\");font-display:swap;unicode-range:U+0460-052F,U+1C80-1C8A,U+20B4,U+2DE0-2DFF,U+A640-A69F,U+FE2E-FE2F;font-weight:100 900;font-style:italic;font-stretch:100%;}@font-face{font-family:\"Noto Sans-ada45c26760e80a3\";src:url(\"/_astro/fonts/9593fbb8383eb01c.woff2\") format(\"woff2\");font-display:swap;unicode-range:U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116;font-weight:100 900;font-style:italic;font-stretch:100%;}@font-face{font-family:\"Noto Sans-ada45c26760e80a3\";src:url(\"/_astro/fonts/cced06053f87829e.woff2\") format(\"woff2\");font-display:swap;unicode-range:U+0900-097F,U+1CD0-1CF9,U+200C-200D,U+20A8,U+20B9,U+20F0,U+25CC,U+A830-A839,U+A8E0-A8FF,U+11B00-11B09;font-weight:100 900;font-style:italic;font-stretch:100%;}@font-face{font-family:\"Noto Sans-ada45c26760e80a3\";src:url(\"/_astro/fonts/a9bea187e846fcc2.woff2\") format(\"woff2\");font-display:swap;unicode-range:U+1F00-1FFF;font-weight:100 900;font-style:italic;font-stretch:100%;}@font-face{font-family:\"Noto Sans-ada45c26760e80a3\";src:url(\"/_astro/fonts/84070159564df0be.woff2\") format(\"woff2\");font-display:swap;unicode-range:U+0370-0377,U+037A-037F,U+0384-038A,U+038C,U+038E-03A1,U+03A3-03FF;font-weight:100 900;font-style:italic;font-stretch:100%;}@font-face{font-family:\"Noto Sans-ada45c26760e80a3\";src:url(\"/_astro/fonts/d581d51cd793384e.woff2\") format(\"woff2\");font-display:swap;unicode-range:U+0102-0103,U+0110-0111,U+0128-0129,U+0168-0169,U+01A0-01A1,U+01AF-01B0,U+0300-0301,U+0303-0304,U+0308-0309,U+0323,U+0329,U+1EA0-1EF9,U+20AB;font-weight:100 900;font-style:italic;font-stretch:100%;}@font-face{font-family:\"Noto Sans-ada45c26760e80a3\";src:url(\"/_astro/fonts/190f8cf059e0f931.woff2\") format(\"woff2\");font-display:swap;unicode-range:U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF;font-weight:100 900;font-style:italic;font-stretch:100%;}@font-face{font-family:\"Noto Sans-ada45c26760e80a3\";src:url(\"/_astro/fonts/1d7aab50fda97bb3.woff2\") format(\"woff2\");font-display:swap;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;font-weight:100 900;font-style:italic;font-stretch:100%;}@font-face{font-family:\"Noto Sans-ada45c26760e80a3\";src:url(\"/_astro/fonts/81fc65a9fa1b7533.woff2\") format(\"woff2\");font-display:swap;unicode-range:U+0460-052F,U+1C80-1C8A,U+20B4,U+2DE0-2DFF,U+A640-A69F,U+FE2E-FE2F;font-weight:100 900;font-style:normal;font-stretch:100%;}@font-face{font-family:\"Noto Sans-ada45c26760e80a3\";src:url(\"/_astro/fonts/1633c6c006fb5995.woff2\") format(\"woff2\");font-display:swap;unicode-range:U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116;font-weight:100 900;font-style:normal;font-stretch:100%;}@font-face{font-family:\"Noto Sans-ada45c26760e80a3\";src:url(\"/_astro/fonts/f52e1d65e1364c61.woff2\") format(\"woff2\");font-display:swap;unicode-range:U+0900-097F,U+1CD0-1CF9,U+200C-200D,U+20A8,U+20B9,U+20F0,U+25CC,U+A830-A839,U+A8E0-A8FF,U+11B00-11B09;font-weight:100 900;font-style:normal;font-stretch:100%;}@font-face{font-family:\"Noto Sans-ada45c26760e80a3\";src:url(\"/_astro/fonts/63342f4e10d096aa.woff2\") format(\"woff2\");font-display:swap;unicode-range:U+1F00-1FFF;font-weight:100 900;font-style:normal;font-stretch:100%;}@font-face{font-family:\"Noto Sans-ada45c26760e80a3\";src:url(\"/_astro/fonts/a582ec5275b6220a.woff2\") format(\"woff2\");font-display:swap;unicode-range:U+0370-0377,U+037A-037F,U+0384-038A,U+038C,U+038E-03A1,U+03A3-03FF;font-weight:100 900;font-style:normal;font-stretch:100%;}@font-face{font-family:\"Noto Sans-ada45c26760e80a3\";src:url(\"/_astro/fonts/6ed39b447c70fac7.woff2\") format(\"woff2\");font-display:swap;unicode-range:U+0102-0103,U+0110-0111,U+0128-0129,U+0168-0169,U+01A0-01A1,U+01AF-01B0,U+0300-0301,U+0303-0304,U+0308-0309,U+0323,U+0329,U+1EA0-1EF9,U+20AB;font-weight:100 900;font-style:normal;font-stretch:100%;}@font-face{font-family:\"Noto Sans-ada45c26760e80a3\";src:url(\"/_astro/fonts/ad35ff1453ab1728.woff2\") format(\"woff2\");font-display:swap;unicode-range:U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF;font-weight:100 900;font-style:normal;font-stretch:100%;}@font-face{font-family:\"Noto Sans-ada45c26760e80a3\";src:url(\"/_astro/fonts/1e5097bbf9c9d577.woff2\") format(\"woff2\");font-display:swap;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;font-weight:100 900;font-style:normal;font-stretch:100%;}@font-face{font-family:\"Noto Sans-ada45c26760e80a3 fallback: Arial\";src:local(\"Arial\");font-display:swap;font-weight:100 900;font-style:italic;size-adjust:122.9249%;ascent-override:86.9637%;descent-override:23.8357%;line-gap-override:0%;}@font-face{font-family:\"Noto Sans-ada45c26760e80a3 fallback: Arial\";src:local(\"Arial\");font-display:swap;font-weight:100 900;font-style:italic;size-adjust:122.9249%;ascent-override:86.9637%;descent-override:23.8357%;line-gap-override:0%;}@font-face{font-family:\"Noto Sans-ada45c26760e80a3 fallback: Arial\";src:local(\"Arial\");font-display:swap;font-weight:100 900;font-style:italic;size-adjust:122.9249%;ascent-override:86.9637%;descent-override:23.8357%;line-gap-override:0%;}@font-face{font-family:\"Noto Sans-ada45c26760e80a3 fallback: Arial\";src:local(\"Arial\");font-display:swap;font-weight:100 900;font-style:italic;size-adjust:122.9249%;ascent-override:86.9637%;descent-override:23.8357%;line-gap-override:0%;}@font-face{font-family:\"Noto Sans-ada45c26760e80a3 fallback: Arial\";src:local(\"Arial\");font-display:swap;font-weight:100 900;font-style:italic;size-adjust:122.9249%;ascent-override:86.9637%;descent-override:23.8357%;line-gap-override:0%;}@font-face{font-family:\"Noto Sans-ada45c26760e80a3 fallback: Arial\";src:local(\"Arial\");font-display:swap;font-weight:100 900;font-style:italic;size-adjust:122.9249%;ascent-override:86.9637%;descent-override:23.8357%;line-gap-override:0%;}@font-face{font-family:\"Noto Sans-ada45c26760e80a3 fallback: Arial\";src:local(\"Arial\");font-display:swap;font-weight:100 900;font-style:italic;size-adjust:122.9249%;ascent-override:86.9637%;descent-override:23.8357%;line-gap-override:0%;}@font-face{font-family:\"Noto Sans-ada45c26760e80a3 fallback: Arial\";src:local(\"Arial\");font-display:swap;font-weight:100 900;font-style:italic;size-adjust:122.9249%;ascent-override:86.9637%;descent-override:23.8357%;line-gap-override:0%;}@font-face{font-family:\"Noto Sans-ada45c26760e80a3 fallback: Arial\";src:local(\"Arial\");font-display:swap;font-weight:100 900;font-style:normal;size-adjust:122.9249%;ascent-override:86.9637%;descent-override:23.8357%;line-gap-override:0%;}@font-face{font-family:\"Noto Sans-ada45c26760e80a3 fallback: Arial\";src:local(\"Arial\");font-display:swap;font-weight:100 900;font-style:normal;size-adjust:122.9249%;ascent-override:86.9637%;descent-override:23.8357%;line-gap-override:0%;}@font-face{font-family:\"Noto Sans-ada45c26760e80a3 fallback: Arial\";src:local(\"Arial\");font-display:swap;font-weight:100 900;font-style:normal;size-adjust:122.9249%;ascent-override:86.9637%;descent-override:23.8357%;line-gap-override:0%;}@font-face{font-family:\"Noto Sans-ada45c26760e80a3 fallback: Arial\";src:local(\"Arial\");font-display:swap;font-weight:100 900;font-style:normal;size-adjust:122.9249%;ascent-override:86.9637%;descent-override:23.8357%;line-gap-override:0%;}@font-face{font-family:\"Noto Sans-ada45c26760e80a3 fallback: Arial\";src:local(\"Arial\");font-display:swap;font-weight:100 900;font-style:normal;size-adjust:122.9249%;ascent-override:86.9637%;descent-override:23.8357%;line-gap-override:0%;}@font-face{font-family:\"Noto Sans-ada45c26760e80a3 fallback: Arial\";src:local(\"Arial\");font-display:swap;font-weight:100 900;font-style:normal;size-adjust:122.9249%;ascent-override:86.9637%;descent-override:23.8357%;line-gap-override:0%;}@font-face{font-family:\"Noto Sans-ada45c26760e80a3 fallback: Arial\";src:local(\"Arial\");font-display:swap;font-weight:100 900;font-style:normal;size-adjust:122.9249%;ascent-override:86.9637%;descent-override:23.8357%;line-gap-override:0%;}@font-face{font-family:\"Noto Sans-ada45c26760e80a3 fallback: Arial\";src:local(\"Arial\");font-display:swap;font-weight:100 900;font-style:normal;size-adjust:122.9249%;ascent-override:86.9637%;descent-override:23.8357%;line-gap-override:0%;}:root{--font-emdash:\"Noto Sans-ada45c26760e80a3\",\"Noto Sans-ada45c26760e80a3 fallback: Arial\",ui-sans-serif,system-ui,sans-serif;}"
}]]);
//#endregion
//#region node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/dist/assets/fonts/core/filter-preloads.js
function filterPreloads(data, preload) {
	if (!preload) return null;
	if (preload === true) return data;
	return data.filter(({ weight, style, subset }) => preload.some((p) => {
		if (p.weight !== void 0 && weight !== void 0 && !checkWeight(p.weight.toString(), weight)) return false;
		if (p.style !== void 0 && p.style !== style) return false;
		if (p.subset !== void 0 && p.subset !== subset) return false;
		return true;
	}));
}
function checkWeight(input, target) {
	const trimmedInput = input.trim();
	if (trimmedInput.includes(" ")) return trimmedInput === target;
	if (target.includes(" ")) {
		const [a, b] = target.split(" ");
		const parsedInput = Number.parseInt(input);
		return parsedInput >= Number.parseInt(a) && parsedInput <= Number.parseInt(b);
	}
	return input === target;
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/components/Font.astro
createAstro("https://astro.build");
var $$Font = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Font;
	const { cssVariable, preload = false } = Astro.props;
	const data = componentDataByCssVariable.get(cssVariable);
	if (!data) throw new AstroError({
		...FontFamilyNotFound,
		message: FontFamilyNotFound.message(cssVariable)
	});
	const filteredPreloadData = filterPreloads(data.preloads, preload);
	return renderTemplate`<style>${unescapeHTML(data.css)}</style>${filteredPreloadData?.map(({ url, type }) => renderTemplate`<link rel="preload"${addAttribute(url, "href")} as="font"${addAttribute(`font/${type}`, "type")} crossorigin>`)}`;
}, "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/components/Font.astro", void 0);
//#endregion
//#region node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/dist/assets/fonts/infra/ssr-runtime-font-file-url-resolver.js
var SsrRuntimeFontFileUrlResolver = class {
	#urls;
	constructor({ urls }) {
		this.#urls = urls;
	}
	resolve(url, requestUrl) {
		if (!this.#urls.has(url)) return null;
		if (!url.startsWith("/")) return url;
		if (!requestUrl) throw new AstroError(MissingGetFontFileRequestUrl);
		return `${requestUrl.origin}${url}`;
	}
};
new SsrRuntimeFontFileUrlResolver({ urls: /* @__PURE__ */ new Set([
	"/_astro/fonts/08f0ea18cdf1ae81.woff2",
	"/_astro/fonts/9593fbb8383eb01c.woff2",
	"/_astro/fonts/cced06053f87829e.woff2",
	"/_astro/fonts/a9bea187e846fcc2.woff2",
	"/_astro/fonts/84070159564df0be.woff2",
	"/_astro/fonts/d581d51cd793384e.woff2",
	"/_astro/fonts/190f8cf059e0f931.woff2",
	"/_astro/fonts/1d7aab50fda97bb3.woff2",
	"/_astro/fonts/81fc65a9fa1b7533.woff2",
	"/_astro/fonts/1633c6c006fb5995.woff2",
	"/_astro/fonts/f52e1d65e1364c61.woff2",
	"/_astro/fonts/63342f4e10d096aa.woff2",
	"/_astro/fonts/a582ec5275b6220a.woff2",
	"/_astro/fonts/6ed39b447c70fac7.woff2",
	"/_astro/fonts/ad35ff1453ab1728.woff2",
	"/_astro/fonts/1e5097bbf9c9d577.woff2"
]) });
//#endregion
//#region \0astro:assets
var getConfiguredImageService = getConfiguredImageService$1;
var assetQueryParams = void 0;
var imageConfig = {
	"endpoint": {
		"route": "/_image",
		"entrypoint": "emdash/image-endpoint"
	},
	"service": {
		"entrypoint": "astro/assets/services/sharp",
		"config": {}
	},
	"dangerouslyProcessSVG": false,
	"domains": [],
	"remotePatterns": [],
	"responsiveStyles": false
};
Object.defineProperty(imageConfig, "assetQueryParams", {
	value: assetQueryParams,
	enumerable: false,
	configurable: true
});
var inferRemoteSize = async (url) => {
	return (await getConfiguredImageService$1()).getRemoteSize?.(url, imageConfig) ?? inferRemoteSize$1(url, imageConfig);
};
var getImage = async (options) => await getImage$1(options, imageConfig);
//#endregion
export { lookup as a, $$Font as i, getImage as n, $$Image as o, imageConfig as r, getConfiguredImageService$1 as s, getConfiguredImageService as t };
