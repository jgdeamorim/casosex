import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./media-DWIzoVFL_BXsPMJM8.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { t as OptionsRepository } from "./options-BlmBHTvX_UAvxM4cG.mjs";
import { s as inviteCreateBody } from "./relations-C4duJnwI_Csyh7PoS.mjs";
import { t as Role } from "./types-ndj-bYfi_CKu1x_5-.mjs";
import { d as createInvite, t as InviteError } from "./dist_Lsl8Hpq0.mjs";
import { n as apiSuccess, r as handleError, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { n as parseBody, t as isParseError } from "./parse-BL49yb9D_DEZsBUX3.mjs";
import { t as createKyselyAdapter } from "./kysely_CgZkYw6d.mjs";
import "./schemas_CKWG3bd1.mjs";
import { t as getSiteBaseUrl } from "./site-url-8N3kSyVZ_Dwp-TjYy.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/auth/invite/index.mjs
var invite_exports = /* @__PURE__ */ __exportAll({
	POST: () => POST,
	prerender: () => false
});
var POST = async ({ request, locals }) => {
	const { emdash, user } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	if (!user || user.role < Role.ADMIN) return apiError("FORBIDDEN", "Admin privileges required", 403);
	const adapter = createKyselyAdapter(emdash.db);
	try {
		const body = await parseBody(request, inviteCreateBody);
		if (isParseError(body)) return body;
		const role = body.role ?? Role.AUTHOR;
		const siteName = await new OptionsRepository(emdash.db).get("emdash:site_title") || "EmDash";
		const baseUrl = await getSiteBaseUrl(emdash.db, request);
		const emailSend = emdash.email?.isAvailable() ? (message) => emdash.email.send(message, "system") : void 0;
		const result = await createInvite({
			baseUrl,
			siteName,
			email: emailSend
		}, adapter, body.email, role, user.id);
		if (emailSend) return apiSuccess({
			success: true,
			message: `Invite sent to ${body.email}`
		});
		return apiSuccess({
			success: true,
			message: "Invite created. No email provider configured — share the link manually.",
			inviteUrl: result.url
		}, 200);
	} catch (error) {
		if (error instanceof InviteError) return apiError(error.code.toUpperCase(), error.message, {
			user_exists: 409,
			invalid_token: 400,
			token_expired: 400
		}[error.code] ?? 400);
		return handleError(error, "Failed to create invite", "INVITE_CREATE_ERROR");
	}
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/auth/invite/index@_@mjs
var page = () => invite_exports;
//#endregion
export { page };
