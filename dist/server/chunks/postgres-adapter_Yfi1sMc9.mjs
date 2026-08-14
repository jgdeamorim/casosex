import { t as sql } from "./dist_D4nVBoqy.mjs";
import { t as DialectAdapterBase } from "./dialect-adapter-base_X4bQ_7JS.mjs";
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/dialect/postgres/postgres-adapter.js
var LOCK_ID = BigInt("3853314791062309107");
var LOCK_TIMEOUT_MILLISECONDS = 36e5;
var PostgresAdapter = class extends DialectAdapterBase {
	get supportsTransactionalDdl() {
		return true;
	}
	get supportsReturning() {
		return true;
	}
	async acquireMigrationLock(db, _opt) {
		await sql`
    with set_timeout as (
      select set_config('lock_timeout', '${sql.lit(LOCK_TIMEOUT_MILLISECONDS)}', true) as config_val
    )
    select pg_advisory_lock(${sql.lit(LOCK_ID)})
    from set_timeout`.execute(db);
	}
	async releaseMigrationLock(db, _opt) {
		await sql`select pg_advisory_unlock(${sql.lit(LOCK_ID)})`.execute(db);
	}
};
//#endregion
export { PostgresAdapter as t };
