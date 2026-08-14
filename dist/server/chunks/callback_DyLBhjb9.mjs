import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import { t as OptionsRepository } from "./options-BlmBHTvX_UAvxM4cG.mjs";
import { t as Role } from "./types-ndj-bYfi_CKu1x_5-.mjs";
import { p as handleOAuthCallback, r as OAuthError } from "./dist_Lsl8Hpq0.mjs";
import { t as createKyselyAdapter } from "./kysely_CgZkYw6d.mjs";
import { n as getPublicOrigin } from "./public-url-DSGTnJFw_DEONbqkZ.mjs";
import { t as createOAuthStateStore } from "./oauth-state-store-DaRUwPWO_BuNmER1-.mjs";
//#region self-essentials/emdash-main/packages/core/dist/setup-complete-L7bMK2VI.mjs
/**
* Finalize setup after the first admin user is created.
*
* Reads the setup_state option (written by the setup wizard's step 1),
* persists site_title and site_tagline, then marks setup complete.
*
* Safe to call multiple times — checks setup_complete first and no-ops
* if already done.
*/
async function finalizeSetup(db) {
	const options = new OptionsRepository(db);
	const setupComplete = await options.get("emdash:setup_complete");
	if (setupComplete === true || setupComplete === "true") return;
	const setupState = await options.get("emdash:setup_state");
	if (setupState?.title && typeof setupState.title === "string") await options.set("emdash:site_title", setupState.title);
	if (setupState?.tagline && typeof setupState.tagline === "string") await options.set("emdash:site_tagline", setupState.tagline);
	await options.set("emdash:setup_complete", true);
	await options.delete("emdash:setup_state");
}
//#endregion
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/auth/oauth/_provider_/callback.mjs
var callback_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => false
});
var VALID_PROVIDERS = /* @__PURE__ */ new Set(["github", "google"]);
function isValidProvider(provider) {
	return VALID_PROVIDERS.has(provider);
}
function envString(env, ...keys) {
	for (const key of keys) {
		const val = env[key];
		if (typeof val === "string" && val) return val;
	}
}
function getOAuthConfig(env) {
	const providers = {};
	const githubClientId = envString(env, "EMDASH_OAUTH_GITHUB_CLIENT_ID", "GITHUB_CLIENT_ID");
	const githubClientSecret = envString(env, "EMDASH_OAUTH_GITHUB_CLIENT_SECRET", "GITHUB_CLIENT_SECRET");
	if (githubClientId && githubClientSecret) providers.github = {
		clientId: githubClientId,
		clientSecret: githubClientSecret
	};
	const googleClientId = envString(env, "EMDASH_OAUTH_GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_ID");
	const googleClientSecret = envString(env, "EMDASH_OAUTH_GOOGLE_CLIENT_SECRET", "GOOGLE_CLIENT_SECRET");
	if (googleClientId && googleClientSecret) providers.google = {
		clientId: googleClientId,
		clientSecret: googleClientSecret
	};
	return providers;
}
var GET = async ({ params, request, locals, session, redirect }) => {
	const { emdash } = locals;
	const provider = params.provider;
	if (!provider || !isValidProvider(provider)) return redirect(`/_emdash/admin/login?error=invalid_provider&message=${encodeURIComponent("Invalid OAuth provider")}`);
	if (!emdash?.db) return redirect(`/_emdash/admin/login?error=server_error&message=${encodeURIComponent("Database not configured")}`);
	const url = new URL(request.url);
	const code = url.searchParams.get("code");
	const state = url.searchParams.get("state");
	const error = url.searchParams.get("error");
	const errorDescription = url.searchParams.get("error_description");
	if (error) return redirect(`/_emdash/admin/login?error=oauth_denied&message=${encodeURIComponent(errorDescription || error)}`);
	if (!code || !state) return redirect(`/_emdash/admin/login?error=invalid_callback&message=${encodeURIComponent("Missing code or state parameter")}`);
	try {
		const { env: cfEnv } = await import("./env_tImiiId5.mjs");
		const providers = getOAuthConfig(cfEnv ?? Object.assign({
			"ASSETS_PREFIX": void 0,
			"BASE_URL": "/",
			"DEV": false,
			"MODE": "production",
			"PROD": true,
			"SITE": void 0,
			"SSR": true
		}, {}));
		if (!providers[provider]) return redirect(`/_emdash/admin/login?error=provider_not_configured&message=${encodeURIComponent(`OAuth provider ${provider} is not configured`)}`);
		const adapter = createKyselyAdapter(emdash.db);
		const stateStore = createOAuthStateStore(emdash.db);
		const config = {
			baseUrl: `${getPublicOrigin(url, emdash?.config)}/_emdash`,
			providers,
			canSelfSignup: async (email) => {
				const setupComplete = await new OptionsRepository(emdash.db).get("emdash:setup_complete");
				if (setupComplete !== true && setupComplete !== "true") return {
					allowed: true,
					role: Role.ADMIN
				};
				const domain = email.split("@")[1]?.toLowerCase();
				if (!domain) return null;
				const entry = await emdash.db.selectFrom("allowed_domains").selectAll().where("domain", "=", domain).where("enabled", "=", 1).executeTakeFirst();
				if (!entry) return null;
				const roleLevel = entry.default_role;
				const roleMap = {
					50: Role.ADMIN,
					40: Role.EDITOR,
					30: Role.AUTHOR,
					20: Role.CONTRIBUTOR,
					10: Role.SUBSCRIBER
				};
				const role = roleMap[roleLevel] ?? Role.CONTRIBUTOR;
				if (!roleMap[roleLevel]) console.warn(`[oauth] Unknown role level ${roleLevel} for domain ${domain}, defaulting to CONTRIBUTOR`);
				return {
					allowed: true,
					role
				};
			}
		};
		const setupCompleteBefore = await new OptionsRepository(emdash.db).get("emdash:setup_complete");
		const user = await handleOAuthCallback(config, adapter, provider, code, state, stateStore);
		if (setupCompleteBefore !== true && setupCompleteBefore !== "true") {
			await finalizeSetup(emdash.db);
			console.log(`[oauth] Setup complete: created admin user via ${provider} (${user.email})`);
		}
		if (session) session.set("user", { id: user.id });
		return redirect("/_emdash/admin");
	} catch (callbackError) {
		console.error("OAuth callback error:", callbackError);
		let message = "Authentication failed";
		let errorCode = "oauth_error";
		if (callbackError instanceof OAuthError) {
			errorCode = callbackError.code;
			switch (callbackError.code) {
				case "invalid_state":
					message = "OAuth session expired or invalid. Please try again.";
					break;
				case "signup_not_allowed":
					message = "Self-signup is not allowed for your email. Please contact an administrator.";
					break;
				case "invite_invalid":
					message = "This invite link is invalid or has expired. Please ask for a new one.";
					break;
				case "invite_email_mismatch":
					message = "This invite was sent to a different email address than your account.";
					break;
				case "invite_email_unverified":
					message = "Your account's email is not verified by the provider. Please verify it and try again.";
					break;
				case "user_not_found":
					message = "Your account was not found. It may have been deleted.";
					break;
				case "token_exchange_failed":
					message = "Failed to complete authentication. Please try again.";
					break;
				case "profile_fetch_failed":
					message = "Failed to retrieve your profile. Please try again.";
					break;
				default: message = "Authentication failed. Please try again.";
			}
		}
		return redirect(`/_emdash/admin/login?error=${errorCode}&message=${encodeURIComponent(message)}`);
	}
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/auth/oauth/_provider_/callback@_@mjs
var page = () => callback_exports;
//#endregion
export { page };
