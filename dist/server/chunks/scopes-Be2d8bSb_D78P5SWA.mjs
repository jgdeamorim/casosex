import { d as hasScope } from "./passkey_eKvnpHNN.mjs";
import { t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import "./api-tokens-CEsW_jCg_B5pZxyoX.mjs";
//#region self-essentials/emdash-main/packages/core/dist/scopes-Be2d8bSb.mjs
/**
* Scope enforcement for API token authentication.
*
* Routes call `requireScope(locals, "content:write")` alongside role checks.
* Session-authenticated requests have no scope restrictions (implicit full access).
* Token-authenticated requests must have the required scope (or "admin").
*/
/**
* Check if the request has a required scope.
* Returns a 403 Response if the scope is missing, or null if OK.
*
* For session-authenticated users (no tokenScopes), always returns null
* since session auth has implicit full scope.
*/
function requireScope(locals, scope) {
	if (!locals.tokenScopes) return null;
	if (hasScope(locals.tokenScopes, scope)) return null;
	return apiError("INSUFFICIENT_SCOPE", `Token lacks required scope: ${scope}`, 403);
}
//#endregion
export { requireScope as t };
