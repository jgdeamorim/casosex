import { d as hasScope } from "./passkey_eKvnpHNN.mjs";
import { m as hasPermission, o as canActOnOwn } from "./dist_Lsl8Hpq0.mjs";
import { t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
//#region self-essentials/emdash-main/packages/core/dist/authorize-R5iYYrpa.mjs
function canReadMediaUsageCount(user, tokenScopes) {
	return hasPermission(user, "content:read_drafts") && (!tokenScopes || hasScope(tokenScopes, "admin"));
}
/**
* Check if user has a permission. Returns a 401/403 Response if not, or null if authorized.
*
* Usage:
* ```ts
* const denied = requirePerm(user, "schema:manage");
* if (denied) return denied;
* ```
*/
function requirePerm(user, permission) {
	if (!user) return apiError("UNAUTHORIZED", "Authentication required", 401);
	if (!hasPermission(user, permission)) return apiError("FORBIDDEN", "Insufficient permissions", 403);
	return null;
}
/**
* Check if user can act on a resource, considering ownership.
* Returns a 401/403 Response if not, or null if authorized.
*
* Usage:
* ```ts
* const denied = requireOwnerPerm(user, item.authorId, "content:edit_own", "content:edit_any");
* if (denied) return denied;
* ```
*/
function requireOwnerPerm(user, ownerId, ownPermission, anyPermission) {
	if (!user) return apiError("UNAUTHORIZED", "Authentication required", 401);
	if (!canActOnOwn(user, ownerId, ownPermission, anyPermission)) return apiError("FORBIDDEN", "Insufficient permissions", 403);
	return null;
}
//#endregion
export { requireOwnerPerm as n, requirePerm as r, canReadMediaUsageCount as t };
