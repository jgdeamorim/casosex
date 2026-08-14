import "./after-B1IIdH3Y_D2PBgJNO.mjs";
import "./object-cache-Bok5j2ae_D6Qn5mkk.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { t as MediaRepository } from "./media-tQDZEdu7_D9hYcuMC.mjs";
import "./request-cache-BSUptuJR_D0VqgZlt.mjs";
import "./loader-C1XOLV5b_C3i6HyEe.mjs";
import { r as invalidateSiteSettingsCache } from "./settings-DgKouY2S_DP0zmLXj.mjs";
//#region self-essentials/emdash-main/packages/core/dist/media/local-runtime.mjs
/**
* Create the local media provider
*/
var createMediaProvider = (config) => {
	const { db, storage } = config;
	if (!db) throw new Error("Local media provider requires database connection");
	const resolveDb = config.getDb ?? (() => db);
	const repo = () => new MediaRepository(resolveDb());
	return {
		async list(options) {
			const result = await repo().findMany({
				cursor: options.cursor,
				limit: options.limit,
				mimeType: options.mimeType
			});
			return {
				items: result.items.map((item) => ({
					id: item.id,
					filename: item.filename,
					mimeType: item.mimeType,
					size: item.size ?? void 0,
					width: item.width ?? void 0,
					height: item.height ?? void 0,
					blurhash: item.blurhash ?? void 0,
					dominantColor: item.dominantColor ?? void 0,
					alt: item.alt ?? void 0,
					previewUrl: `/_emdash/api/media/file/${item.storageKey}`,
					meta: {
						storageKey: item.storageKey,
						caption: item.caption,
						blurhash: item.blurhash,
						dominantColor: item.dominantColor
					}
				})),
				nextCursor: result.nextCursor
			};
		},
		async get(id) {
			const item = await repo().findById(id);
			if (!item) return null;
			return {
				id: item.id,
				filename: item.filename,
				mimeType: item.mimeType,
				size: item.size ?? void 0,
				width: item.width ?? void 0,
				height: item.height ?? void 0,
				blurhash: item.blurhash ?? void 0,
				dominantColor: item.dominantColor ?? void 0,
				alt: item.alt ?? void 0,
				previewUrl: `/_emdash/api/media/file/${item.storageKey}`,
				meta: {
					storageKey: item.storageKey,
					caption: item.caption,
					blurhash: item.blurhash,
					dominantColor: item.dominantColor
				}
			};
		},
		async upload(_input) {
			if (!storage) throw new Error("Storage not configured for local media provider");
			throw new Error("Local upload should use /_emdash/api/media endpoint");
		},
		async delete(id) {
			const repoInstance = repo();
			const item = await repoInstance.findById(id);
			if (!item) return;
			if (storage) try {
				await storage.delete(item.storageKey);
			} catch {}
			await repoInstance.delete(id);
			invalidateSiteSettingsCache();
		},
		getEmbed(value, _options) {
			const src = `/_emdash/api/media/file/${typeof value.meta?.storageKey === "string" ? value.meta.storageKey : value.id}`;
			const mimeType = value.mimeType || "";
			const blurhash = value.blurhash ?? (typeof value.meta?.blurhash === "string" ? value.meta.blurhash : void 0);
			const dominantColor = value.dominantColor ?? (typeof value.meta?.dominantColor === "string" ? value.meta.dominantColor : void 0);
			if (mimeType.startsWith("image/")) return {
				type: "image",
				src,
				width: value.width,
				height: value.height,
				blurhash,
				dominantColor,
				alt: value.alt
			};
			if (mimeType.startsWith("video/")) return {
				type: "video",
				src,
				width: value.width,
				height: value.height,
				controls: true,
				preload: "metadata"
			};
			if (mimeType.startsWith("audio/")) return {
				type: "audio",
				src,
				controls: true,
				preload: "metadata"
			};
			return {
				type: "image",
				src,
				width: value.width,
				height: value.height,
				blurhash,
				dominantColor,
				alt: value.alt
			};
		},
		getThumbnailUrl(id, _mimeType) {
			return `/_emdash/api/media/file/${id}`;
		}
	};
};
//#endregion
//#region \0virtual:emdash/media-providers
/** Media provider descriptors with factory functions */
var mediaProviders = [{
	id: "local",
	name: "Library",
	icon: "folder",
	capabilities: {
		browse: true,
		search: false,
		upload: true,
		delete: true
	},
	createProvider: (ctx) => createMediaProvider({
		...ctx,
		enabled: true
	})
}];
//#endregion
export { mediaProviders as t };
