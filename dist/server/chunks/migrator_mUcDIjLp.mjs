import { Mn as getLast, Z as WithSchemaPlugin, jn as freeze, zn as isObject } from "./dist_D4nVBoqy.mjs";
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/plugin/noop-plugin.js
var NoopPlugin = class {
	transformQuery(args) {
		return args.node;
	}
	async transformResult(args) {
		return args.result;
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/migration/migrator.js
var DEFAULT_MIGRATION_TABLE = "kysely_migration";
var DEFAULT_MIGRATION_LOCK_TABLE = "kysely_migration_lock";
var MIGRATION_LOCK_ID = "migration_lock";
freeze({ __noMigrations__: true });
/**
* A class for running migrations.
*
* ### Example
*
* This example uses the {@link FileMigrationProvider} that reads migrations
* files from a single folder. You can easily implement your own
* {@link MigrationProvider} if you want to provide migrations some
* other way.
*
* ```ts
* import { promises as fs } from 'node:fs'
* import path from 'node:path'
* import * as Sqlite from 'better-sqlite3'
* import { Kysely, SqliteDialect } from 'kysely'
* import { FileMigrationProvider, Migrator } from 'kysely/migration'
*
* const db = new Kysely<any>({
*   dialect: new SqliteDialect({
*     database: Sqlite(':memory:')
*   })
* })
*
* const migrator = new Migrator({
*   db,
*   provider: new FileMigrationProvider({
*     fs,
*     // Path to the folder that contains all your migrations.
*     migrationFolder: 'some/path/to/migrations',
*     path,
*   })
* })
* ```
*/
var Migrator = class {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	/**
	* Returns a {@link MigrationInfo} object for each migration.
	*
	* The returned array is sorted by migration name.
	*/
	async getMigrations() {
		const executedMigrations = await this.#doesTableExist(this.#migrationTable) ? await this.#props.db.withPlugin(this.#schemaPlugin).selectFrom(this.#migrationTable).select(["name", "timestamp"]).$narrowType().execute() : [];
		return (await this.#resolveMigrations()).map(({ name, ...migration }) => {
			const executed = executedMigrations.find((it) => it.name === name);
			return {
				name,
				migration,
				executedAt: executed ? new Date(executed.timestamp) : void 0
			};
		});
	}
	/**
	* Runs all migrations that have not yet been run.
	*
	* This method returns a {@link MigrationResultSet} instance and _never_ throws.
	* {@link MigrationResultSet.error} holds the error if something went wrong.
	* {@link MigrationResultSet.results} contains information about which migrations
	* were executed and which failed. See the examples below.
	*
	* This method goes through all possible migrations provided by the provider and runs the
	* ones whose names come alphabetically after the last migration that has been run. If the
	* list of executed migrations doesn't match the beginning of the list of possible migrations
	* an error is returned.
	*
	* ### Examples
	*
	* ```ts
	* import { promises as fs } from 'node:fs'
	* import path from 'node:path'
	* import * as Sqlite from 'better-sqlite3'
	* import { FileMigrationProvider, Migrator } from 'kysely/migration'
	*
	* const migrator = new Migrator({
	*   db,
	*   provider: new FileMigrationProvider({
	*     fs,
	*     migrationFolder: 'some/path/to/migrations',
	*     path,
	*   })
	* })
	*
	* const { error, results } = await migrator.migrateToLatest()
	*
	* results?.forEach((it) => {
	*   if (it.status === 'Success') {
	*     console.log(`migration "${it.migrationName}" was executed successfully`)
	*   } else if (it.status === 'Error') {
	*     console.error(`failed to execute migration "${it.migrationName}"`)
	*   }
	* })
	*
	* if (error) {
	*   console.error('failed to run `migrateToLatest`')
	*   console.error(error)
	* }
	* ```
	*/
	async migrateToLatest(options) {
		return this.#migrate(() => ({
			direction: "Up",
			step: Infinity
		}), options);
	}
	/**
	* Migrate up/down to a specific migration.
	*
	* This method returns a {@link MigrationResultSet} instance and _never_ throws.
	* {@link MigrationResultSet.error} holds the error if something went wrong.
	* {@link MigrationResultSet.results} contains information about which migrations
	* were executed and which failed.
	*
	* ### Examples
	*
	* ```ts
	* import { promises as fs } from 'node:fs'
	* import path from 'node:path'
	* import { FileMigrationProvider, Migrator } from 'kysely/migration'
	*
	* const migrator = new Migrator({
	*   db,
	*   provider: new FileMigrationProvider({
	*     fs,
	*     // Path to the folder that contains all your migrations.
	*     migrationFolder: 'some/path/to/migrations',
	*     path,
	*   })
	* })
	*
	* await migrator.migrateTo('some_migration')
	* ```
	*
	* If you specify the name of the first migration, this method migrates
	* down to the first migration, but doesn't run the `down` method of
	* the first migration. In case you want to migrate all the way down,
	* you can use a special constant `NO_MIGRATIONS`:
	*
	* ```ts
	* import { promises as fs } from 'node:fs'
	* import path from 'node:path'
	* import { FileMigrationProvider, Migrator, NO_MIGRATIONS } from 'kysely/migration'
	*
	* const migrator = new Migrator({
	*   db,
	*   provider: new FileMigrationProvider({
	*     fs,
	*     // Path to the folder that contains all your migrations.
	*     migrationFolder: 'some/path/to/migrations',
	*     path,
	*   })
	* })
	*
	* await migrator.migrateTo(NO_MIGRATIONS)
	* ```
	*/
	async migrateTo(targetMigrationName, options) {
		return this.#migrate(({ migrations, executedMigrations, pendingMigrations }) => {
			if (isObject(targetMigrationName) && targetMigrationName.__noMigrations__ === true) return {
				direction: "Down",
				step: Infinity
			};
			if (!migrations.find((m) => m.name === targetMigrationName)) throw new Error(`migration "${targetMigrationName}" doesn't exist`);
			const executedIndex = executedMigrations.indexOf(targetMigrationName);
			const pendingIndex = pendingMigrations.findIndex((m) => m.name === targetMigrationName);
			if (executedIndex !== -1) return {
				direction: "Down",
				step: executedMigrations.length - executedIndex - 1
			};
			if (pendingIndex !== -1) return {
				direction: "Up",
				step: pendingIndex + 1
			};
			throw new Error(`migration "${targetMigrationName}" isn't executed or pending`);
		}, options);
	}
	/**
	* Migrate one step up.
	*
	* This method returns a {@link MigrationResultSet} instance and _never_ throws.
	* {@link MigrationResultSet.error} holds the error if something went wrong.
	* {@link MigrationResultSet.results} contains information about which migrations
	* were executed and which failed.
	*
	* ### Examples
	*
	* ```ts
	* import { promises as fs } from 'node:fs'
	* import path from 'node:path'
	* import { FileMigrationProvider, Migrator } from 'kysely/migration'
	*
	* const migrator = new Migrator({
	*   db,
	*   provider: new FileMigrationProvider({
	*     fs,
	*     // Path to the folder that contains all your migrations.
	*     migrationFolder: 'some/path/to/migrations',
	*     path,
	*   })
	* })
	*
	* await migrator.migrateUp()
	* ```
	*/
	async migrateUp(options) {
		return this.#migrate(() => ({
			direction: "Up",
			step: 1
		}), options);
	}
	/**
	* Migrate one step down.
	*
	* This method returns a {@link MigrationResultSet} instance and _never_ throws.
	* {@link MigrationResultSet.error} holds the error if something went wrong.
	* {@link MigrationResultSet.results} contains information about which migrations
	* were executed and which failed.
	*
	* ### Examples
	*
	* ```ts
	* import { promises as fs } from 'node:fs'
	* import path from 'node:path'
	* import { FileMigrationProvider, Migrator } from 'kysely/migration'
	*
	* const migrator = new Migrator({
	*   db,
	*   provider: new FileMigrationProvider({
	*     fs,
	*     // Path to the folder that contains all your migrations.
	*     migrationFolder: 'some/path/to/migrations',
	*     path,
	*   })
	* })
	*
	* await migrator.migrateDown()
	* ```
	*/
	async migrateDown(options) {
		return this.#migrate(() => ({
			direction: "Down",
			step: 1
		}), options);
	}
	async #migrate(getMigrationDirectionAndStep, options) {
		try {
			await this.#ensureMigrationTableSchemaExists();
			await this.#ensureMigrationTableExists();
			await this.#ensureMigrationLockTableExists();
			await this.#ensureLockRowExists();
			return await this.#runMigrations(getMigrationDirectionAndStep, options);
		} catch (error) {
			if (error instanceof MigrationResultSetError) return error.resultSet;
			return { error };
		}
	}
	get #migrationTableSchema() {
		return this.#props.migrationTableSchema;
	}
	get #migrationTable() {
		return this.#props.migrationTableName ?? "kysely_migration";
	}
	get #migrationLockTable() {
		return this.#props.migrationLockTableName ?? "kysely_migration_lock";
	}
	get #allowUnorderedMigrations() {
		return this.#props.allowUnorderedMigrations ?? false;
	}
	get #schemaPlugin() {
		if (this.#migrationTableSchema) return new WithSchemaPlugin(this.#migrationTableSchema);
		return new NoopPlugin();
	}
	async #ensureMigrationTableSchemaExists() {
		if (!this.#migrationTableSchema) return;
		if (await this.#doesSchemaExist()) return;
		try {
			await this.#createIfNotExists(this.#props.db.schema.createSchema(this.#migrationTableSchema));
		} catch (error) {
			if (!await this.#doesSchemaExist()) throw error;
		}
	}
	async #ensureMigrationTableExists() {
		if (await this.#doesTableExist(this.#migrationTable)) return;
		try {
			await this.#createIfNotExists(this.#props.db.schema.withPlugin(this.#schemaPlugin).createTable(this.#migrationTable).addColumn("name", "varchar(255)", (col) => col.notNull().primaryKey()).addColumn("timestamp", "varchar(255)", (col) => col.notNull()));
		} catch (error) {
			if (!await this.#doesTableExist(this.#migrationTable)) throw error;
		}
	}
	async #ensureMigrationLockTableExists() {
		if (await this.#doesTableExist(this.#migrationLockTable)) return;
		try {
			await this.#createIfNotExists(this.#props.db.schema.withPlugin(this.#schemaPlugin).createTable(this.#migrationLockTable).addColumn("id", "varchar(255)", (col) => col.notNull().primaryKey()).addColumn("is_locked", "integer", (col) => col.notNull().defaultTo(0)));
		} catch (error) {
			if (!await this.#doesTableExist(this.#migrationLockTable)) throw error;
		}
	}
	async #ensureLockRowExists() {
		if (await this.#doesLockRowExists()) return;
		try {
			await this.#props.db.withPlugin(this.#schemaPlugin).insertInto(this.#migrationLockTable).values({
				id: MIGRATION_LOCK_ID,
				is_locked: 0
			}).execute();
		} catch (error) {
			if (!await this.#doesLockRowExists()) throw error;
		}
	}
	async #doesSchemaExist() {
		return (await this.#props.db.introspection.getSchemas()).some((it) => it.name === this.#migrationTableSchema);
	}
	async #doesTableExist(tableName) {
		const schema = this.#migrationTableSchema;
		return (await this.#props.db.introspection.getTables({ withInternalKyselyTables: true })).some((it) => it.name === tableName && (!schema || it.schema === schema));
	}
	async #doesLockRowExists() {
		return !!await this.#props.db.withPlugin(this.#schemaPlugin).selectFrom(this.#migrationLockTable).where("id", "=", MIGRATION_LOCK_ID).select("id").executeTakeFirst();
	}
	async #runMigrations(getMigrationDirectionAndStep, options) {
		const adapter = this.#props.db.getExecutor().adapter;
		const lockOptions = freeze({
			lockTable: this.#props.migrationLockTableName ?? "kysely_migration_lock",
			lockRowId: MIGRATION_LOCK_ID,
			lockTableSchema: this.#props.migrationTableSchema
		});
		const run = async (db) => {
			const state = await this.#getState(db);
			if (state.migrations.length === 0) return { results: [] };
			const { direction, step } = getMigrationDirectionAndStep(state);
			if (step <= 0) return { results: [] };
			if (direction === "Down") return await this.#migrateDown(db, state, step);
			else if (direction === "Up") return await this.#migrateUp(db, state, step);
			return { results: [] };
		};
		const runWithLock = async (db, cb) => {
			try {
				await adapter.acquireMigrationLock(db, lockOptions);
				return await cb(db);
			} finally {
				await adapter.releaseMigrationLock(db, lockOptions);
			}
		};
		const disableTransactions = options?.disableTransactions ?? this.#props.disableTransactions;
		if (this.#props.db.isTransaction) {
			if (!adapter.supportsTransactionalDdl) throw new Error("Transactional DDL is not supported in this dialect. Passing a transaction to this migrator would result in failure or unexpected behavior.");
			if (disableTransactions) throw new Error("`disableTransactions` is true but the migrator was given a transaction. Passing a transaction to this migrator would result in failure or unexpected behavior.");
			return runWithLock(this.#props.db, run);
		}
		if (adapter.supportsTransactionalDdl && !disableTransactions) return this.#props.db.connection().execute((db) => runWithLock(db, (db) => db.transaction().execute((trx) => run(trx))));
		return this.#props.db.connection().execute((db) => runWithLock(db, run));
	}
	async #getState(db) {
		const migrations = await this.#resolveMigrations();
		const executedMigrations = await this.#getExecutedMigrations(db);
		this.#ensureNoMissingMigrations(migrations, executedMigrations);
		if (!this.#allowUnorderedMigrations) this.#ensureMigrationsInOrder(migrations, executedMigrations);
		const pendingMigrations = this.#getPendingMigrations(migrations, executedMigrations);
		return freeze({
			migrations,
			executedMigrations,
			lastMigration: getLast(executedMigrations),
			pendingMigrations
		});
	}
	#getPendingMigrations(migrations, executedMigrations) {
		return migrations.filter((migration) => {
			return !executedMigrations.includes(migration.name);
		});
	}
	async #resolveMigrations() {
		const allMigrations = await this.#props.provider.getMigrations();
		return Object.keys(allMigrations).sort().map((name) => ({
			...allMigrations[name],
			name
		}));
	}
	async #getExecutedMigrations(db) {
		const executedMigrations = await db.withPlugin(this.#schemaPlugin).selectFrom(this.#migrationTable).select(["name", "timestamp"]).$narrowType().execute();
		const nameComparator = this.#props.nameComparator || ((a, b) => a.localeCompare(b));
		return executedMigrations.sort((a, b) => {
			if (a.timestamp === b.timestamp) return nameComparator(a.name, b.name);
			return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
		}).map((it) => it.name);
	}
	#ensureNoMissingMigrations(migrations, executedMigrations) {
		for (const executed of executedMigrations) if (!migrations.some((it) => it.name === executed)) throw new Error(`corrupted migrations: previously executed migration ${executed} is missing`);
	}
	#ensureMigrationsInOrder(migrations, executedMigrations) {
		for (let i = 0; i < executedMigrations.length; ++i) if (migrations[i].name !== executedMigrations[i]) throw new Error(`corrupted migrations: expected previously executed migration ${executedMigrations[i]} to be at index ${i} but ${migrations[i].name} was found in its place. New migrations must always have a name that comes alphabetically after the last executed migration.`);
	}
	async #migrateDown(db, state, step) {
		const migrationsToRollback = state.executedMigrations.toReversed().slice(0, step).map((name) => {
			return state.migrations.find((it) => it.name === name);
		});
		const results = migrationsToRollback.map((migration) => {
			return {
				migrationName: migration.name,
				direction: "Down",
				status: "NotExecuted"
			};
		});
		for (let i = 0; i < results.length; ++i) {
			const migration = migrationsToRollback[i];
			try {
				if (migration.down) {
					await migration.down(db);
					await db.withPlugin(this.#schemaPlugin).deleteFrom(this.#migrationTable).where("name", "=", migration.name).execute();
					results[i] = {
						migrationName: migration.name,
						direction: "Down",
						status: "Success"
					};
				}
			} catch (error) {
				results[i] = {
					migrationName: migration.name,
					direction: "Down",
					status: "Error"
				};
				throw new MigrationResultSetError({
					error,
					results
				});
			}
		}
		return { results };
	}
	async #migrateUp(db, state, step) {
		const results = state.pendingMigrations.slice(0, step).map((migration) => {
			return {
				migrationName: migration.name,
				direction: "Up",
				status: "NotExecuted"
			};
		});
		for (let i = 0; i < results.length; i++) {
			const migration = state.pendingMigrations[i];
			try {
				await migration.up(db);
				await db.withPlugin(this.#schemaPlugin).insertInto(this.#migrationTable).values({
					name: migration.name,
					timestamp: (/* @__PURE__ */ new Date()).toISOString()
				}).execute();
				results[i] = {
					migrationName: migration.name,
					direction: "Up",
					status: "Success"
				};
			} catch (error) {
				results[i] = {
					migrationName: migration.name,
					direction: "Up",
					status: "Error"
				};
				throw new MigrationResultSetError({
					error,
					results
				});
			}
		}
		return { results };
	}
	async #createIfNotExists(qb) {
		if (this.#props.db.getExecutor().adapter.supportsCreateIfNotExists) qb = qb.ifNotExists();
		await qb.execute();
	}
};
var MigrationResultSetError = class extends Error {
	#resultSet;
	constructor(result) {
		super();
		this.#resultSet = result;
	}
	get resultSet() {
		return this.#resultSet;
	}
};
//#endregion
export { DEFAULT_MIGRATION_TABLE as n, Migrator as r, DEFAULT_MIGRATION_LOCK_TABLE as t };
