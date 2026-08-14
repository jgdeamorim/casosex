import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./after-B1IIdH3Y_D2PBgJNO.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { n as apiSuccess, r as handleError, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { n as parsePreviewSignatureHeader, r as verifyPreviewSignature, t as generateSnapshot } from "./snapshot-BdpUJKD-_Bg7WVs0D.mjs";
import { t as resolveSecretsCached } from "./secrets-870d-7yA_DAoCQXHi.mjs";
import { t as resolveSessionUser } from "./session-user-BrK2zz7S_Dc_rrKQB.mjs";
import { n as getPublicOrigin } from "./public-url-DSGTnJFw_DEONbqkZ.mjs";
import { r as requirePerm } from "./authorize-R5iYYrpa_Cy7kmN6L.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/snapshot.mjs
var snapshot_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => false
});
var GET = async ({ request, locals, url, session }) => {
	const { emdash } = locals;
	let user = locals.user;
	if (!user && session && emdash?.db) try {
		const { createKyselyAdapter } = await import("./kysely_CDHYUKUq.mjs");
		const sessionUser = await resolveSessionUser(session);
		if (sessionUser?.id) {
			const resolved = await createKyselyAdapter(emdash.db).getUserById(sessionUser.id);
			if (resolved && !resolved.disabled) user = resolved;
		}
	} catch {}
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	const previewSig = request.headers.get("X-Preview-Signature");
	let authorized = false;
	if (previewSig) {
		const { previewSecret: secret, previewSecretSource } = await resolveSecretsCached(emdash.db);
		const parsed = parsePreviewSignatureHeader(previewSig);
		if (!parsed) console.warn("[snapshot] Failed to parse X-Preview-Signature header");
		else {
			authorized = await verifyPreviewSignature(parsed.source, parsed.exp, parsed.sig, secret);
			if (!authorized) {
				const fields = {
					source: parsed.source,
					exp: parsed.exp,
					expired: parsed.exp < Date.now() / 1e3,
					secretSource: previewSecretSource
				};
				if (previewSecretSource === "db") fields.hint = "Set EMDASH_PREVIEW_SECRET in both this process and the signing process to share secrets across deployments";
				console.warn("[snapshot] Preview signature verification failed", fields);
			}
		}
	}
	if (!authorized) {
		const contentDenied = requirePerm(user, "content:read");
		if (contentDenied) return contentDenied;
		const schemaDenied = requirePerm(user, "schema:read");
		if (schemaDenied) return schemaDenied;
	}
	try {
		const includeDrafts = url.searchParams.get("drafts") === "true";
		return apiSuccess(await generateSnapshot(emdash.db, {
			includeDrafts,
			origin: getPublicOrigin(url, emdash.config)
		}));
	} catch (error) {
		return handleError(error, "Failed to generate snapshot", "SNAPSHOT_ERROR");
	}
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/snapshot@_@mjs
var page = () => snapshot_exports;
//#endregion
export { page };
