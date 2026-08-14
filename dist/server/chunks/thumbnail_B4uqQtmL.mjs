import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { r as requirePerm } from "./authorize-R5iYYrpa_Cy7kmN6L.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/themes/marketplace/_id_/thumbnail.mjs
var thumbnail_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => false
});
var GET = async ({ params, url, locals }) => {
	const { emdash, user } = locals;
	const { id } = params;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	const denied = requirePerm(user, "plugins:read");
	if (denied) return denied;
	const marketplaceUrl = emdash.config.marketplace;
	if (!marketplaceUrl || !id) return apiError("NOT_CONFIGURED", "Marketplace not configured", 400);
	const width = url.searchParams.get("w");
	const target = new URL(`/api/v1/themes/${encodeURIComponent(id)}/thumbnail`, marketplaceUrl);
	if (width) target.searchParams.set("w", width);
	try {
		const resp = await fetch(target.href);
		if (!resp.ok) return new Response(resp.body, {
			status: resp.status,
			headers: {
				"Content-Type": resp.headers.get("Content-Type") ?? "application/octet-stream",
				"Cache-Control": "private, no-store"
			}
		});
		return new Response(resp.body, { headers: {
			"Content-Type": resp.headers.get("Content-Type") ?? "image/png",
			"Cache-Control": "private, no-store"
		} });
	} catch {
		return apiError("PROXY_ERROR", "Failed to fetch thumbnail", 502);
	}
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/themes/marketplace/_id_/thumbnail@_@mjs
var page = () => thumbnail_exports;
//#endregion
export { page };
