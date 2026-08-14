//#region self-essentials/emdash-main/packages/core/src/database/transaction.ts
/**
* Run a callback inside a transaction if supported, or directly if not.
*
* Probes the database once on first call to determine if transactions work.
* The result is cached for the lifetime of the process/worker.
*/
var transactionsSupported = null;
var TRANSACTIONS_NOT_SUPPORTED_RE = /transactions are not supported/i;
async function withTransaction(db, fn) {
	if (transactionsSupported === true) return db.transaction().execute(fn);
	if (transactionsSupported === false) return fn(db);
	try {
		const result = await db.transaction().execute(fn);
		transactionsSupported = true;
		return result;
	} catch (error) {
		if (error instanceof Error && TRANSACTIONS_NOT_SUPPORTED_RE.test(error.message)) {
			transactionsSupported = false;
			return fn(db);
		}
		throw error;
	}
}
//#endregion
//#region self-essentials/emdash-main/packages/core/src/schema/types.ts
/**
* Map field types to their SQLite column types
*/
var FIELD_TYPE_TO_COLUMN = {
	string: "TEXT",
	text: "TEXT",
	number: "REAL",
	integer: "INTEGER",
	boolean: "INTEGER",
	datetime: "TEXT",
	select: "TEXT",
	multiSelect: "JSON",
	portableText: "JSON",
	image: "TEXT",
	file: "TEXT",
	reference: "TEXT",
	json: "JSON",
	slug: "TEXT",
	url: "TEXT",
	repeater: "JSON"
};
/**
* Reserved field slugs that cannot be used.
*
* Includes names reserved for runtime hydration (`terms`, `bylines`, `byline`)
* so user-defined fields never shadow the auto-hydrated values on entry.data.
*/
var RESERVED_FIELD_SLUGS = [
	"id",
	"slug",
	"status",
	"author_id",
	"primary_byline_id",
	"created_at",
	"updated_at",
	"published_at",
	"scheduled_at",
	"deleted_at",
	"version",
	"live_revision_id",
	"draft_revision_id",
	"terms",
	"bylines",
	"byline"
];
/**
* Reserved collection slugs that cannot be used
*/
var RESERVED_COLLECTION_SLUGS = [
	"content",
	"media",
	"users",
	"revisions",
	"taxonomies",
	"options",
	"audit_logs"
];
var BYLINE_FIELD_TYPES = [
	"string",
	"text",
	"url",
	"boolean",
	"select"
];
/**
* Reserved byline-field slugs. Two reasons a slug ends up here:
*
* 1. **Column collision.** Slugs that match a fixed column on
*    `_emdash_bylines` (migrations 031 + 040) would shadow that column
*    on hydration. The first 12 entries cover this.
* 2. **Route collision.** Static file routes under
*    `/_emdash/api/admin/byline-fields/` take precedence over the
*    `[slug].ts` dynamic route in Astro, so a custom field whose slug
*    matches a sibling static file (e.g. `reorder.ts`) is unreachable
*    via single-field CRUD — the static route handles only its own
*    method (POST for `reorder`) and 405s everything else.
*    `reorder` is the only such sibling today; new sibling routes
*    (e.g. a hypothetical `import.ts`) must be added here.
*    `[slug]/usage.ts` lives a level deeper so a slug of `usage` does
*    not collide — it resolves cleanly to `[slug].ts`.
*
* Enforced at the registry layer (Phase 2) and the admin API zod layer
* (Phase 4) so non-HTTP callers (seeds, scripts) get the same guarantee.
*/
var RESERVED_BYLINE_FIELD_SLUGS = [
	"id",
	"slug",
	"display_name",
	"bio",
	"avatar_media_id",
	"website_url",
	"user_id",
	"is_guest",
	"locale",
	"translation_group",
	"created_at",
	"updated_at",
	"reorder"
];
//#endregion
export { RESERVED_FIELD_SLUGS as a, RESERVED_COLLECTION_SLUGS as i, FIELD_TYPE_TO_COLUMN as n, withTransaction as o, RESERVED_BYLINE_FIELD_SLUGS as r, BYLINE_FIELD_TYPES as t };
