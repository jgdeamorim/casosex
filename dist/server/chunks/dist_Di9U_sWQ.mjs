import { i as encodeBase64urlNoPadding } from "./dist_CycaXRgm.mjs";
import { i as toRoleLevel } from "./types-ndj-bYfi_CKu1x_5-.mjs";
import "./sha2_Celbjg9f.mjs";
import "./dist_Lsl8Hpq0.mjs";
//#region self-essentials/emdash-main/packages/core/dist/oauth-user-lookup-CzuzOSlF.mjs
/**
* Shared user lookup for OAuth token operations.
*
* Extracts user role and disabled status from the database. Used by
* handleTokenRefresh() to revalidate scopes against the user's current
* role and reject disabled users.
*/
/**
* Look up a user's current role and disabled status.
* Returns null if the user doesn't exist.
*/
async function lookupUserRoleAndStatus(db, userId) {
	const row = await db.selectFrom("users").select(["role", "disabled"]).where("id", "=", userId).executeTakeFirst();
	if (!row) return null;
	return {
		role: toRoleLevel(row.role),
		disabled: row.disabled === 1
	};
}
//#endregion
//#region node_modules/.pnpm/arctic@3.7.0/node_modules/arctic/dist/oauth2.js
function generateCodeVerifier() {
	const randomValues = /* @__PURE__ */ new Uint8Array(32);
	crypto.getRandomValues(randomValues);
	return encodeBase64urlNoPadding(randomValues);
}
//#endregion
//#region node_modules/.pnpm/arctic@3.7.0/node_modules/arctic/dist/client.js
var CodeChallengeMethod;
(function(CodeChallengeMethod) {
	CodeChallengeMethod[CodeChallengeMethod["S256"] = 0] = "S256";
	CodeChallengeMethod[CodeChallengeMethod["Plain"] = 1] = "Plain";
})(CodeChallengeMethod || (CodeChallengeMethod = {}));
//#endregion
//#region node_modules/.pnpm/@oslojs+encoding@0.4.1/node_modules/@oslojs/encoding/dist/base32.js
var EncodingPadding$1;
(function(EncodingPadding) {
	EncodingPadding[EncodingPadding["Include"] = 0] = "Include";
	EncodingPadding[EncodingPadding["None"] = 1] = "None";
})(EncodingPadding$1 || (EncodingPadding$1 = {}));
var DecodingPadding$1;
(function(DecodingPadding) {
	DecodingPadding[DecodingPadding["Required"] = 0] = "Required";
	DecodingPadding[DecodingPadding["Ignore"] = 1] = "Ignore";
})(DecodingPadding$1 || (DecodingPadding$1 = {}));
//#endregion
//#region node_modules/.pnpm/@oslojs+encoding@0.4.1/node_modules/@oslojs/encoding/dist/base64.js
var EncodingPadding;
(function(EncodingPadding) {
	EncodingPadding[EncodingPadding["Include"] = 0] = "Include";
	EncodingPadding[EncodingPadding["None"] = 1] = "None";
})(EncodingPadding || (EncodingPadding = {}));
var DecodingPadding;
(function(DecodingPadding) {
	DecodingPadding[DecodingPadding["Required"] = 0] = "Required";
	DecodingPadding[DecodingPadding["Ignore"] = 1] = "Ignore";
})(DecodingPadding || (DecodingPadding = {}));
//#endregion
export { lookupUserRoleAndStatus as n, generateCodeVerifier as t };
