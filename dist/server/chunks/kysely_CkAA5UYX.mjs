import { $ as createQueryId, An as IdentifierNode, Bn as isString, En as isOperationNodeSource, Et as QueryNode, Hn as noop, In as isFunction, J as waitOrAbort, K as QueryExecutorBase, Kt as ValueNode, Q as OperationNodeTransformer, R as QueryCreator, S as CaseNode, Vn as isUndefined, Wt as parseValueBinaryOperationOrExpression, Xt as parseOrderedColumnName, Y as provideControlledConnection, Yt as parseColumnName, Z as WithSchemaPlugin, Zt as parseStringReference, a as DynamicTableBuilder, in as RawNode, jn as freeze, kn as SchemableIdentifierNode, ln as SelectAllNode, on as DynamicReferenceBuilder, q as printBackgroundFail, qt as ValueListNode, r as parseTable, s as parseExpression, tn as logOnce, u as parseDataTypeExpression, un as ColumnNode, v as CaseBuilder, w as createFunctionModule, zn as isObject } from "./dist_D4nVBoqy.mjs";
import { n as CreateTableNode, r as ON_COMMIT_ACTIONS, t as CreateViewNode } from "./create-view-node_BTVY3Z3f.mjs";
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/alter-table-node.js
/**
* @internal
*/
var AlterTableNode = freeze({
	is(node) {
		return node.kind === "AlterTableNode";
	},
	create(table) {
		return freeze({
			kind: "AlterTableNode",
			table
		});
	},
	cloneWithTableProps(node, props) {
		return freeze({
			...node,
			...props
		});
	},
	cloneWithColumnAlteration(node, columnAlteration) {
		return freeze({
			...node,
			columnAlterations: node.columnAlterations ? [...node.columnAlterations, columnAlteration] : [columnAlteration]
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/create-index-node.js
/**
* @internal
*/
var CreateIndexNode = freeze({
	is(node) {
		return node.kind === "CreateIndexNode";
	},
	create(name) {
		return freeze({
			kind: "CreateIndexNode",
			name: IdentifierNode.create(name)
		});
	},
	cloneWith(node, props) {
		return freeze({
			...node,
			...props
		});
	},
	cloneWithColumns(node, columns) {
		return freeze({
			...node,
			columns: [...node.columns || [], ...columns]
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/create-schema-node.js
/**
* @internal
*/
var CreateSchemaNode = freeze({
	is(node) {
		return node.kind === "CreateSchemaNode";
	},
	create(schema, params) {
		return freeze({
			kind: "CreateSchemaNode",
			schema: IdentifierNode.create(schema),
			...params
		});
	},
	cloneWith(createSchema, params) {
		return freeze({
			...createSchema,
			...params
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/drop-index-node.js
/**
* @internal
*/
var DropIndexNode = freeze({
	is(node) {
		return node.kind === "DropIndexNode";
	},
	create(name, params) {
		return freeze({
			kind: "DropIndexNode",
			name: SchemableIdentifierNode.create(name),
			...params
		});
	},
	cloneWith(dropIndex, props) {
		return freeze({
			...dropIndex,
			...props
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/drop-schema-node.js
/**
* @internal
*/
var DropSchemaNode = freeze({
	is(node) {
		return node.kind === "DropSchemaNode";
	},
	create(schema, params) {
		return freeze({
			kind: "DropSchemaNode",
			schema: IdentifierNode.create(schema),
			...params
		});
	},
	cloneWith(dropSchema, params) {
		return freeze({
			...dropSchema,
			...params
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/drop-table-node.js
/**
* @internal
*/
var DropTableNode = freeze({
	is(node) {
		return node.kind === "DropTableNode";
	},
	create(table, params) {
		return freeze({
			kind: "DropTableNode",
			table,
			...params
		});
	},
	cloneWith(dropIndex, params) {
		return freeze({
			...dropIndex,
			...params
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/add-column-node.js
/**
* @internal
*/
var AddColumnNode = freeze({
	is(node) {
		return node.kind === "AddColumnNode";
	},
	create(column) {
		return freeze({
			kind: "AddColumnNode",
			column
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/column-definition-node.js
/**
* @internal
*/
var ColumnDefinitionNode = freeze({
	is(node) {
		return node.kind === "ColumnDefinitionNode";
	},
	create(column, dataType) {
		return freeze({
			kind: "ColumnDefinitionNode",
			column: ColumnNode.create(column),
			dataType
		});
	},
	cloneWithFrontModifier(node, modifier) {
		return freeze({
			...node,
			frontModifiers: node.frontModifiers ? freeze([...node.frontModifiers, modifier]) : [modifier]
		});
	},
	cloneWithEndModifier(node, modifier) {
		return freeze({
			...node,
			endModifiers: node.endModifiers ? freeze([...node.endModifiers, modifier]) : [modifier]
		});
	},
	cloneWith(node, props) {
		return freeze({
			...node,
			...props
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/drop-column-node.js
/**
* @internal
*/
var DropColumnNode = freeze({
	is(node) {
		return node.kind === "DropColumnNode";
	},
	create(column) {
		return freeze({
			kind: "DropColumnNode",
			column: ColumnNode.create(column)
		});
	},
	cloneWith(node, props) {
		return freeze({
			...node,
			...props
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/rename-column-node.js
/**
* @internal
*/
var RenameColumnNode = freeze({
	is(node) {
		return node.kind === "RenameColumnNode";
	},
	create(column, newColumn) {
		return freeze({
			kind: "RenameColumnNode",
			column: ColumnNode.create(column),
			renameTo: ColumnNode.create(newColumn)
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/check-constraint-node.js
/**
* @internal
*/
var CheckConstraintNode = freeze({
	is(node) {
		return node.kind === "CheckConstraintNode";
	},
	create(expression, constraintName) {
		return freeze({
			kind: "CheckConstraintNode",
			expression,
			name: constraintName ? IdentifierNode.create(constraintName) : void 0
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/references-node.js
var ON_MODIFY_FOREIGN_ACTIONS_DICTIONARY = freeze({
	cascade: true,
	"no action": true,
	restrict: true,
	"set default": true,
	"set null": true
});
Object.keys(ON_MODIFY_FOREIGN_ACTIONS_DICTIONARY);
/**
* @internal
*/
var ReferencesNode = freeze({
	is(node) {
		return node.kind === "ReferencesNode";
	},
	create(table, columns) {
		return freeze({
			kind: "ReferencesNode",
			table,
			columns: freeze([...columns])
		});
	},
	cloneWithOnDelete(references, onDelete) {
		return freeze({
			...references,
			onDelete
		});
	},
	cloneWithOnUpdate(references, onUpdate) {
		return freeze({
			...references,
			onUpdate
		});
	}
});
function isOnModifyForeignAction(thing) {
	return isString(thing) && ON_MODIFY_FOREIGN_ACTIONS_DICTIONARY[thing];
}
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/parser/default-value-parser.js
function parseDefaultValueExpression(value) {
	return isOperationNodeSource(value) ? value.toOperationNode() : ValueNode.createImmediate(value);
}
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/generated-node.js
/**
* @internal
*/
var GeneratedNode = freeze({
	is(node) {
		return node.kind === "GeneratedNode";
	},
	create(params) {
		return freeze({
			kind: "GeneratedNode",
			...params
		});
	},
	createWithExpression(expression) {
		return freeze({
			kind: "GeneratedNode",
			always: true,
			expression
		});
	},
	cloneWith(node, params) {
		return freeze({
			...node,
			...params
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/default-value-node.js
/**
* @internal
*/
var DefaultValueNode = freeze({
	is(node) {
		return node.kind === "DefaultValueNode";
	},
	create(defaultValue) {
		return freeze({
			kind: "DefaultValueNode",
			defaultValue
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/parser/on-modify-action-parser.js
function parseOnModifyForeignAction(action) {
	if (isOnModifyForeignAction(action)) return action;
	throw new Error(`invalid OnModifyForeignAction ${action}`);
}
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/schema/column-definition-builder.js
var ColumnDefinitionBuilder = class ColumnDefinitionBuilder {
	#node;
	constructor(node) {
		this.#node = node;
	}
	/**
	* Adds `auto_increment` or `autoincrement` to the column definition
	* depending on the dialect.
	*
	* Some dialects like PostgreSQL don't support this. On PostgreSQL
	* you can use the `serial` or `bigserial` data type instead.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .createTable('person')
	*   .addColumn('id', 'integer', col => col.autoIncrement().primaryKey())
	*   .execute()
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* create table `person` (
	*   `id` integer primary key auto_increment
	* )
	* ```
	*/
	autoIncrement() {
		return new ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, { autoIncrement: true }));
	}
	/**
	* Makes the column an identity column.
	*
	* This only works on some dialects like MS SQL Server (MSSQL).
	*
	* For PostgreSQL's `generated always as identity` use {@link generatedAlwaysAsIdentity}.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .createTable('person')
	*   .addColumn('id', 'integer', col => col.identity().primaryKey())
	*   .execute()
	* ```
	*
	* The generated SQL (MSSQL):
	*
	* ```sql
	* create table "person" (
	*   "id" integer identity primary key
	* )
	* ```
	*/
	identity() {
		return new ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, { identity: true }));
	}
	/**
	* Makes the column the primary key.
	*
	* If you want to specify a composite primary key use the
	* {@link CreateTableBuilder.addPrimaryKeyConstraint} method.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .createTable('person')
	*   .addColumn('id', 'integer', col => col.primaryKey())
	*   .execute()
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* create table `person` (
	*   `id` integer primary key
	* )
	*/
	primaryKey() {
		return new ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, { primaryKey: true }));
	}
	/**
	* Adds a foreign key constraint for the column.
	*
	* If your database engine doesn't support foreign key constraints in the
	* column definition (like MySQL 5) you need to call the table level
	* {@link CreateTableBuilder.addForeignKeyConstraint} method instead.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .createTable('pet')
	*   .addColumn('owner_id', 'integer', (col) => col.references('person.id'))
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* create table "pet" (
	*   "owner_id" integer references "person" ("id")
	* )
	* ```
	*/
	references(ref) {
		const references = parseStringReference(ref);
		if (!references.table || SelectAllNode.is(references.column)) throw new Error(`invalid call references('${ref}'). The reference must have format table.column or schema.table.column`);
		return new ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, { references: ReferencesNode.create(references.table, [references.column]) }));
	}
	/**
	* Adds an `on delete` constraint for the foreign key column.
	*
	* If your database engine doesn't support foreign key constraints in the
	* column definition (like MySQL 5) you need to call the table level
	* {@link CreateTableBuilder.addForeignKeyConstraint} method instead.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .createTable('pet')
	*   .addColumn(
	*     'owner_id',
	*     'integer',
	*     (col) => col.references('person.id').onDelete('cascade')
	*   )
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* create table "pet" (
	*   "owner_id" integer references "person" ("id") on delete cascade
	* )
	* ```
	*/
	onDelete(onDelete) {
		if (!this.#node.references) throw new Error("on delete constraint can only be added for foreign keys");
		return new ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, { references: ReferencesNode.cloneWithOnDelete(this.#node.references, parseOnModifyForeignAction(onDelete)) }));
	}
	/**
	* Adds an `on update` constraint for the foreign key column.
	*
	* If your database engine doesn't support foreign key constraints in the
	* column definition (like MySQL 5) you need to call the table level
	* {@link CreateTableBuilder.addForeignKeyConstraint} method instead.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .createTable('pet')
	*   .addColumn(
	*     'owner_id',
	*     'integer',
	*     (col) => col.references('person.id').onUpdate('cascade')
	*   )
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* create table "pet" (
	*   "owner_id" integer references "person" ("id") on update cascade
	* )
	* ```
	*/
	onUpdate(onUpdate) {
		if (!this.#node.references) throw new Error("on update constraint can only be added for foreign keys");
		return new ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, { references: ReferencesNode.cloneWithOnUpdate(this.#node.references, parseOnModifyForeignAction(onUpdate)) }));
	}
	/**
	* Adds a unique constraint for the column.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .createTable('person')
	*   .addColumn('email', 'varchar(255)', col => col.unique())
	*   .execute()
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* create table `person` (
	*   `email` varchar(255) unique
	* )
	* ```
	*/
	unique() {
		return new ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, { unique: true }));
	}
	/**
	* Adds a `not null` constraint for the column.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .createTable('person')
	*   .addColumn('first_name', 'varchar(255)', col => col.notNull())
	*   .execute()
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* create table `person` (
	*   `first_name` varchar(255) not null
	* )
	* ```
	*/
	notNull() {
		return new ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, { notNull: true }));
	}
	/**
	* Adds a `unsigned` modifier for the column.
	*
	* This only works on some dialects like MySQL.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .createTable('person')
	*   .addColumn('age', 'integer', col => col.unsigned())
	*   .execute()
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* create table `person` (
	*   `age` integer unsigned
	* )
	* ```
	*/
	unsigned() {
		return new ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, { unsigned: true }));
	}
	/**
	* Adds a default value constraint for the column.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .createTable('pet')
	*   .addColumn('number_of_legs', 'integer', (col) => col.defaultTo(4))
	*   .execute()
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* create table `pet` (
	*   `number_of_legs` integer default 4
	* )
	* ```
	*
	* Values passed to `defaultTo` are interpreted as value literals by default. You can define
	* an arbitrary SQL expression using the {@link sql} template tag:
	*
	* ```ts
	* import { sql } from 'kysely'
	*
	* await db.schema
	*   .createTable('pet')
	*   .addColumn(
	*     'created_at',
	*     'timestamp',
	*     (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`)
	*   )
	*   .execute()
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* create table `pet` (
	*   `created_at` timestamp default CURRENT_TIMESTAMP
	* )
	* ```
	*/
	defaultTo(value) {
		return new ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, { defaultTo: DefaultValueNode.create(parseDefaultValueExpression(value)) }));
	}
	/**
	* Adds a check constraint for the column.
	*
	* ### Examples
	*
	* ```ts
	* import { sql } from 'kysely'
	*
	* await db.schema
	*   .createTable('pet')
	*   .addColumn('number_of_legs', 'integer', (col) =>
	*     col.check(sql`number_of_legs < 5`)
	*   )
	*   .execute()
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* create table `pet` (
	*   `number_of_legs` integer check (number_of_legs < 5)
	* )
	* ```
	*/
	check(expression) {
		return new ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, { check: CheckConstraintNode.create(expression.toOperationNode()) }));
	}
	/**
	* Makes the column a generated column using a `generated always as` statement.
	*
	* ### Examples
	*
	* ```ts
	* import { sql } from 'kysely'
	*
	* await db.schema
	*   .createTable('person')
	*   .addColumn('full_name', 'varchar(255)',
	*     (col) => col.generatedAlwaysAs(sql`concat(first_name, ' ', last_name)`)
	*   )
	*   .execute()
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* create table `person` (
	*   `full_name` varchar(255) generated always as (concat(first_name, ' ', last_name))
	* )
	* ```
	*/
	generatedAlwaysAs(expression) {
		return new ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, { generated: GeneratedNode.createWithExpression(expression.toOperationNode()) }));
	}
	/**
	* Adds the `generated always as identity` specifier.
	*
	* This only works on some dialects like PostgreSQL.
	*
	* For MS SQL Server (MSSQL)'s identity column use {@link identity}.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .createTable('person')
	*   .addColumn('id', 'integer', col => col.generatedAlwaysAsIdentity().primaryKey())
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* create table "person" (
	*   "id" integer generated always as identity primary key
	* )
	* ```
	*/
	generatedAlwaysAsIdentity() {
		return new ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, { generated: GeneratedNode.create({
			identity: true,
			always: true
		}) }));
	}
	/**
	* Adds the `generated by default as identity` specifier on supported dialects.
	*
	* This only works on some dialects like PostgreSQL.
	*
	* For MS SQL Server (MSSQL)'s identity column use {@link identity}.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .createTable('person')
	*   .addColumn('id', 'integer', col => col.generatedByDefaultAsIdentity().primaryKey())
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* create table "person" (
	*   "id" integer generated by default as identity primary key
	* )
	* ```
	*/
	generatedByDefaultAsIdentity() {
		return new ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, { generated: GeneratedNode.create({
			identity: true,
			byDefault: true
		}) }));
	}
	/**
	* Makes a generated column stored instead of virtual. This method can only
	* be used with {@link generatedAlwaysAs}
	*
	* ### Examples
	*
	* ```ts
	* import { sql } from 'kysely'
	*
	* await db.schema
	*   .createTable('person')
	*   .addColumn('full_name', 'varchar(255)', (col) => col
	*     .generatedAlwaysAs(sql`concat(first_name, ' ', last_name)`)
	*     .stored()
	*   )
	*   .execute()
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* create table `person` (
	*   `full_name` varchar(255) generated always as (concat(first_name, ' ', last_name)) stored
	* )
	* ```
	*/
	stored() {
		if (!this.#node.generated) throw new Error("stored() can only be called after generatedAlwaysAs");
		return new ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, { generated: GeneratedNode.cloneWith(this.#node.generated, { stored: true }) }));
	}
	/**
	* This can be used to add any additional SQL right after the column's data type.
	*
	* ### Examples
	*
	* ```ts
	* import { sql } from 'kysely'
	*
	* await db.schema
	*   .createTable('person')
	*   .addColumn('id', 'integer', col => col.primaryKey())
	*   .addColumn(
	*     'first_name',
	*     'varchar(36)',
	*     (col) => col.modifyFront(sql`collate utf8mb4_general_ci`).notNull()
	*   )
	*   .execute()
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* create table `person` (
	*   `id` integer primary key,
	*   `first_name` varchar(36) collate utf8mb4_general_ci not null
	* )
	* ```
	*/
	modifyFront(modifier) {
		return new ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWithFrontModifier(this.#node, modifier.toOperationNode()));
	}
	/**
	* Adds `nulls not distinct` specifier.
	* Should be used with `unique` constraint.
	*
	* This only works on some dialects like PostgreSQL.
	*
	* ### Examples
	*
	* ```ts
	* db.schema
	*   .createTable('person')
	*   .addColumn('id', 'integer', col => col.primaryKey())
	*   .addColumn('first_name', 'varchar(30)', col => col.unique().nullsNotDistinct())
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* create table "person" (
	*   "id" integer primary key,
	*   "first_name" varchar(30) unique nulls not distinct
	* )
	* ```
	*/
	nullsNotDistinct() {
		return new ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, { nullsNotDistinct: true }));
	}
	/**
	* Adds `if not exists` specifier. This only works for PostgreSQL.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .alterTable('person')
	*   .addColumn('email', 'varchar(255)', col => col.unique().ifNotExists())
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* alter table "person" add column if not exists "email" varchar(255) unique
	* ```
	*/
	ifNotExists() {
		return new ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, { ifNotExists: true }));
	}
	/**
	* This can be used to add any additional SQL to the end of the column definition.
	*
	* ### Examples
	*
	* ```ts
	* import { sql } from 'kysely'
	*
	* await db.schema
	*   .createTable('person')
	*   .addColumn('id', 'integer', col => col.primaryKey())
	*   .addColumn(
	*     'age',
	*     'integer',
	*     col => col.unsigned()
	*       .notNull()
	*       .modifyEnd(sql`comment ${sql.lit('it is not polite to ask a woman her age')}`)
	*   )
	*   .execute()
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* create table `person` (
	*   `id` integer primary key,
	*   `age` integer unsigned not null comment 'it is not polite to ask a woman her age'
	* )
	* ```
	*/
	modifyEnd(modifier) {
		return new ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWithEndModifier(this.#node, modifier.toOperationNode()));
	}
	/**
	* Simply calls the provided function passing `this` as the only argument. `$call` returns
	* what the provided function returns.
	*/
	$call(func) {
		return func(this);
	}
	toOperationNode() {
		return this.#node;
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/modify-column-node.js
/**
* @internal
*/
var ModifyColumnNode = freeze({
	is(node) {
		return node.kind === "ModifyColumnNode";
	},
	create(column) {
		return freeze({
			kind: "ModifyColumnNode",
			column
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/foreign-key-constraint-node.js
/**
* @internal
*/
var ForeignKeyConstraintNode = freeze({
	is(node) {
		return node.kind === "ForeignKeyConstraintNode";
	},
	create(sourceColumns, targetTable, targetColumns, constraintName) {
		return freeze({
			kind: "ForeignKeyConstraintNode",
			columns: sourceColumns,
			references: ReferencesNode.create(targetTable, targetColumns),
			name: constraintName ? IdentifierNode.create(constraintName) : void 0
		});
	},
	cloneWith(node, props) {
		return freeze({
			...node,
			...props
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/schema/foreign-key-constraint-builder.js
var ForeignKeyConstraintBuilder = class ForeignKeyConstraintBuilder {
	#node;
	constructor(node) {
		this.#node = node;
	}
	onDelete(onDelete) {
		return new ForeignKeyConstraintBuilder(ForeignKeyConstraintNode.cloneWith(this.#node, { onDelete: parseOnModifyForeignAction(onDelete) }));
	}
	onUpdate(onUpdate) {
		return new ForeignKeyConstraintBuilder(ForeignKeyConstraintNode.cloneWith(this.#node, { onUpdate: parseOnModifyForeignAction(onUpdate) }));
	}
	deferrable() {
		return new ForeignKeyConstraintBuilder(ForeignKeyConstraintNode.cloneWith(this.#node, { deferrable: true }));
	}
	notDeferrable() {
		return new ForeignKeyConstraintBuilder(ForeignKeyConstraintNode.cloneWith(this.#node, { deferrable: false }));
	}
	initiallyDeferred() {
		return new ForeignKeyConstraintBuilder(ForeignKeyConstraintNode.cloneWith(this.#node, { initiallyDeferred: true }));
	}
	initiallyImmediate() {
		return new ForeignKeyConstraintBuilder(ForeignKeyConstraintNode.cloneWith(this.#node, { initiallyDeferred: false }));
	}
	/**
	* Simply calls the provided function passing `this` as the only argument. `$call` returns
	* what the provided function returns.
	*/
	$call(func) {
		return func(this);
	}
	toOperationNode() {
		return this.#node;
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/add-constraint-node.js
/**
* @internal
*/
var AddConstraintNode = freeze({
	is(node) {
		return node.kind === "AddConstraintNode";
	},
	create(constraint) {
		return freeze({
			kind: "AddConstraintNode",
			constraint
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/unique-constraint-node.js
/**
* @internal
*/
var UniqueConstraintNode = freeze({
	is(node) {
		return node.kind === "UniqueConstraintNode";
	},
	create(columns, constraintName, nullsNotDistinct) {
		if (isString(columns.at(0))) {
			logOnce("`UniqueConstraintNode.create(columns: string[], ...)` is deprecated - pass `ColumnNode[]` instead.");
			columns = columns.map(ColumnNode.create);
		}
		return freeze({
			kind: "UniqueConstraintNode",
			columns: freeze(columns),
			name: constraintName ? IdentifierNode.create(constraintName) : void 0,
			nullsNotDistinct
		});
	},
	cloneWith(node, props) {
		return freeze({
			...node,
			...props
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/drop-constraint-node.js
/**
* @internal
*/
var DropConstraintNode = freeze({
	is(node) {
		return node.kind === "DropConstraintNode";
	},
	create(constraintName) {
		return freeze({
			kind: "DropConstraintNode",
			constraintName: IdentifierNode.create(constraintName)
		});
	},
	cloneWith(dropConstraint, props) {
		return freeze({
			...dropConstraint,
			...props
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/alter-column-node.js
/**
* @internal
*/
var AlterColumnNode = freeze({
	is(node) {
		return node.kind === "AlterColumnNode";
	},
	create(column, prop, value) {
		return freeze({
			kind: "AlterColumnNode",
			column: ColumnNode.create(column),
			[prop]: value
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/schema/alter-column-builder.js
var AlterColumnBuilder = class {
	#column;
	constructor(column) {
		this.#column = column;
	}
	setDataType(dataType) {
		return new AlteredColumnBuilder(AlterColumnNode.create(this.#column, "dataType", parseDataTypeExpression(dataType)));
	}
	setDefault(value) {
		return new AlteredColumnBuilder(AlterColumnNode.create(this.#column, "setDefault", parseDefaultValueExpression(value)));
	}
	dropDefault() {
		return new AlteredColumnBuilder(AlterColumnNode.create(this.#column, "dropDefault", true));
	}
	setNotNull() {
		return new AlteredColumnBuilder(AlterColumnNode.create(this.#column, "setNotNull", true));
	}
	dropNotNull() {
		return new AlteredColumnBuilder(AlterColumnNode.create(this.#column, "dropNotNull", true));
	}
	/**
	* Simply calls the provided function passing `this` as the only argument. `$call` returns
	* what the provided function returns.
	*/
	$call(func) {
		return func(this);
	}
};
/**
* Allows us to force consumers to do exactly one alteration to a column.
*
* One cannot do no alterations:
*
* ```ts
* await db.schema
*   .alterTable('person')
* //  .execute() // Property 'execute' does not exist on type 'AlteredColumnBuilder'.
* ```
*
* ```ts
* await db.schema
*   .alterTable('person')
* //  .alterColumn('age', (ac) => ac) // Type 'AlterColumnBuilder' is not assignable to type 'AlteredColumnBuilder'.
* //  .execute()
* ```
*
* One cannot do multiple alterations:
*
* ```ts
* await db.schema
*   .alterTable('person')
* //  .alterColumn('age', (ac) => ac.dropNotNull().setNotNull()) // Property 'setNotNull' does not exist on type 'AlteredColumnBuilder'.
* //  .execute()
* ```
*
* Which would now throw a compilation error, instead of a runtime error.
*/
var AlteredColumnBuilder = class {
	#alterColumnNode;
	constructor(alterColumnNode) {
		this.#alterColumnNode = alterColumnNode;
	}
	toOperationNode() {
		return this.#alterColumnNode;
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/schema/alter-table-executor.js
var AlterTableExecutor = class {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	toOperationNode() {
		return this.#props.executor.transformQuery(this.#props.node, this.#props.queryId);
	}
	compile() {
		return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
	}
	async execute(options) {
		await this.#props.executor.executeQuery(this.compile(), options);
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/schema/alter-table-add-foreign-key-constraint-builder.js
var AlterTableAddForeignKeyConstraintBuilder = class AlterTableAddForeignKeyConstraintBuilder {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	onDelete(onDelete) {
		return new AlterTableAddForeignKeyConstraintBuilder({
			...this.#props,
			constraintBuilder: this.#props.constraintBuilder.onDelete(onDelete)
		});
	}
	onUpdate(onUpdate) {
		return new AlterTableAddForeignKeyConstraintBuilder({
			...this.#props,
			constraintBuilder: this.#props.constraintBuilder.onUpdate(onUpdate)
		});
	}
	deferrable() {
		return new AlterTableAddForeignKeyConstraintBuilder({
			...this.#props,
			constraintBuilder: this.#props.constraintBuilder.deferrable()
		});
	}
	notDeferrable() {
		return new AlterTableAddForeignKeyConstraintBuilder({
			...this.#props,
			constraintBuilder: this.#props.constraintBuilder.notDeferrable()
		});
	}
	initiallyDeferred() {
		return new AlterTableAddForeignKeyConstraintBuilder({
			...this.#props,
			constraintBuilder: this.#props.constraintBuilder.initiallyDeferred()
		});
	}
	initiallyImmediate() {
		return new AlterTableAddForeignKeyConstraintBuilder({
			...this.#props,
			constraintBuilder: this.#props.constraintBuilder.initiallyImmediate()
		});
	}
	/**
	* Simply calls the provided function passing `this` as the only argument. `$call` returns
	* what the provided function returns.
	*/
	$call(func) {
		return func(this);
	}
	toOperationNode() {
		return this.#props.executor.transformQuery(AlterTableNode.cloneWithTableProps(this.#props.node, { addConstraint: AddConstraintNode.create(this.#props.constraintBuilder.toOperationNode()) }), this.#props.queryId);
	}
	compile() {
		return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
	}
	async execute(options) {
		await this.#props.executor.executeQuery(this.compile(), options);
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/schema/alter-table-drop-constraint-builder.js
var AlterTableDropConstraintBuilder = class AlterTableDropConstraintBuilder {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	ifExists() {
		return new AlterTableDropConstraintBuilder({
			...this.#props,
			node: AlterTableNode.cloneWithTableProps(this.#props.node, { dropConstraint: DropConstraintNode.cloneWith(this.#props.node.dropConstraint, { ifExists: true }) })
		});
	}
	cascade() {
		return new AlterTableDropConstraintBuilder({
			...this.#props,
			node: AlterTableNode.cloneWithTableProps(this.#props.node, { dropConstraint: DropConstraintNode.cloneWith(this.#props.node.dropConstraint, { modifier: "cascade" }) })
		});
	}
	restrict() {
		return new AlterTableDropConstraintBuilder({
			...this.#props,
			node: AlterTableNode.cloneWithTableProps(this.#props.node, { dropConstraint: DropConstraintNode.cloneWith(this.#props.node.dropConstraint, { modifier: "restrict" }) })
		});
	}
	/**
	* Simply calls the provided function passing `this` as the only argument. `$call` returns
	* what the provided function returns.
	*/
	$call(func) {
		return func(this);
	}
	toOperationNode() {
		return this.#props.executor.transformQuery(this.#props.node, this.#props.queryId);
	}
	compile() {
		return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
	}
	async execute(options) {
		await this.#props.executor.executeQuery(this.compile(), options);
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/primary-key-constraint-node.js
/**
* @internal
*/
var PrimaryKeyConstraintNode = freeze({
	is(node) {
		return node.kind === "PrimaryKeyConstraintNode";
	},
	create(columns, constraintName) {
		return freeze({
			kind: "PrimaryKeyConstraintNode",
			columns: freeze(columns.map(ColumnNode.create)),
			name: constraintName ? IdentifierNode.create(constraintName) : void 0
		});
	},
	cloneWith(node, props) {
		return freeze({
			...node,
			...props
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/add-index-node.js
/**
* @internal
*/
var AddIndexNode = freeze({
	is(node) {
		return node.kind === "AddIndexNode";
	},
	create(name) {
		return freeze({
			kind: "AddIndexNode",
			name: IdentifierNode.create(name)
		});
	},
	cloneWith(node, props) {
		return freeze({
			...node,
			...props
		});
	},
	cloneWithColumns(node, columns) {
		return freeze({
			...node,
			columns: [...node.columns || [], ...columns]
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/schema/alter-table-add-index-builder.js
var AlterTableAddIndexBuilder = class AlterTableAddIndexBuilder {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	/**
	* Makes the index unique.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .alterTable('person')
	*   .addIndex('person_first_name_index')
	*   .unique()
	*   .column('email')
	*   .execute()
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* alter table `person` add unique index `person_first_name_index` (`email`)
	* ```
	*/
	unique() {
		return new AlterTableAddIndexBuilder({
			...this.#props,
			node: AlterTableNode.cloneWithTableProps(this.#props.node, { addIndex: AddIndexNode.cloneWith(this.#props.node.addIndex, { unique: true }) })
		});
	}
	column(arg) {
		return new AlterTableAddIndexBuilder({
			...this.#props,
			node: AlterTableNode.cloneWithTableProps(this.#props.node, { addIndex: AddIndexNode.cloneWithColumns(this.#props.node.addIndex, [isString(arg) ? parseOrderedColumnName(arg) : arg.toOperationNode()]) })
		});
	}
	/**
	* Specifies a list of columns for the index.
	*
	* Also see {@link column} for adding a single column or {@link expression} for
	* specifying an arbitrary expression.
	*
	* ### Examples
	*
	* ```ts
	* import { sql } from 'kysely'
	*
	* await db.schema
	*   .alterTable('person')
	*   .addIndex('person_first_name_and_age_index')
	*   .columns(['first_name', sql`(left(lower(last_name), 1))`, 'age desc'])
	*   .execute()
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* alter table `person`
	* add index `person_first_name_and_age_index` (
	*   `first_name`,
	*   (left(lower(last_name), 1)),
	*   `age` desc
	* )
	* ```
	*/
	columns(columns) {
		return new AlterTableAddIndexBuilder({
			...this.#props,
			node: AlterTableNode.cloneWithTableProps(this.#props.node, { addIndex: AddIndexNode.cloneWithColumns(this.#props.node.addIndex, columns.map((item) => isString(item) ? parseOrderedColumnName(item) : item.toOperationNode())) })
		});
	}
	/**
	* Specifies an arbitrary expression for the index.
	*
	* ### Examples
	*
	* ```ts
	* import { sql } from 'kysely'
	*
	* await db.schema
	*   .alterTable('person')
	*   .addIndex('person_first_name_index')
	*   .expression(sql<boolean>`(first_name < 'Sami')`)
	*   .execute()
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* alter table `person` add index `person_first_name_index` ((first_name < 'Sami'))
	* ```
	*
	* @deprecated Use {@link column} or {@link columns} with an {@link Expression} instead.
	*/
	expression(expression) {
		return new AlterTableAddIndexBuilder({
			...this.#props,
			node: AlterTableNode.cloneWithTableProps(this.#props.node, { addIndex: AddIndexNode.cloneWithColumns(this.#props.node.addIndex, [expression.toOperationNode()]) })
		});
	}
	using(indexType) {
		return new AlterTableAddIndexBuilder({
			...this.#props,
			node: AlterTableNode.cloneWithTableProps(this.#props.node, { addIndex: AddIndexNode.cloneWith(this.#props.node.addIndex, { using: RawNode.createWithSql(indexType) }) })
		});
	}
	/**
	* Simply calls the provided function passing `this` as the only argument. `$call` returns
	* what the provided function returns.
	*/
	$call(func) {
		return func(this);
	}
	toOperationNode() {
		return this.#props.executor.transformQuery(this.#props.node, this.#props.queryId);
	}
	compile() {
		return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
	}
	async execute(options) {
		await this.#props.executor.executeQuery(this.compile(), options);
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/schema/unique-constraint-builder.js
var UniqueConstraintNodeBuilder = class UniqueConstraintNodeBuilder {
	#node;
	constructor(node) {
		this.#node = node;
	}
	/**
	* Adds `nulls not distinct` to the unique constraint definition
	*
	* Supported by PostgreSQL dialect only
	*/
	nullsNotDistinct() {
		return new UniqueConstraintNodeBuilder(UniqueConstraintNode.cloneWith(this.#node, { nullsNotDistinct: true }));
	}
	deferrable() {
		return new UniqueConstraintNodeBuilder(UniqueConstraintNode.cloneWith(this.#node, { deferrable: true }));
	}
	notDeferrable() {
		return new UniqueConstraintNodeBuilder(UniqueConstraintNode.cloneWith(this.#node, { deferrable: false }));
	}
	initiallyDeferred() {
		return new UniqueConstraintNodeBuilder(UniqueConstraintNode.cloneWith(this.#node, { initiallyDeferred: true }));
	}
	initiallyImmediate() {
		return new UniqueConstraintNodeBuilder(UniqueConstraintNode.cloneWith(this.#node, { initiallyDeferred: false }));
	}
	/**
	* Simply calls the provided function passing `this` as the only argument. `$call` returns
	* what the provided function returns.
	*/
	$call(func) {
		return func(this);
	}
	toOperationNode() {
		return this.#node;
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/schema/primary-key-constraint-builder.js
var PrimaryKeyConstraintBuilder = class PrimaryKeyConstraintBuilder {
	#node;
	constructor(node) {
		this.#node = node;
	}
	deferrable() {
		return new PrimaryKeyConstraintBuilder(PrimaryKeyConstraintNode.cloneWith(this.#node, { deferrable: true }));
	}
	notDeferrable() {
		return new PrimaryKeyConstraintBuilder(PrimaryKeyConstraintNode.cloneWith(this.#node, { deferrable: false }));
	}
	initiallyDeferred() {
		return new PrimaryKeyConstraintBuilder(PrimaryKeyConstraintNode.cloneWith(this.#node, { initiallyDeferred: true }));
	}
	initiallyImmediate() {
		return new PrimaryKeyConstraintBuilder(PrimaryKeyConstraintNode.cloneWith(this.#node, { initiallyDeferred: false }));
	}
	/**
	* Simply calls the provided function passing `this` as the only argument. `$call` returns
	* what the provided function returns.
	*/
	$call(func) {
		return func(this);
	}
	toOperationNode() {
		return this.#node;
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/schema/check-constraint-builder.js
var CheckConstraintBuilder = class {
	#node;
	constructor(node) {
		this.#node = node;
	}
	/**
	* Simply calls the provided function passing `this` as the only argument. `$call` returns
	* what the provided function returns.
	*/
	$call(func) {
		return func(this);
	}
	toOperationNode() {
		return this.#node;
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/rename-constraint-node.js
/**
* @internal
*/
var RenameConstraintNode = freeze({
	is(node) {
		return node.kind === "RenameConstraintNode";
	},
	create(oldName, newName) {
		return freeze({
			kind: "RenameConstraintNode",
			oldName: IdentifierNode.create(oldName),
			newName: IdentifierNode.create(newName)
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/schema/drop-column-builder.js
var DropColumnBuilder = class DropColumnBuilder {
	#props;
	constructor(props) {
		this.#props = freeze({ ...props });
	}
	ifExists() {
		return new DropColumnBuilder({
			...this.#props,
			node: DropColumnNode.cloneWith(this.#props.node, { ifExists: true })
		});
	}
	toOperationNode() {
		return this.#props.node;
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/schema/alter-table-builder.js
/**
* This builder can be used to create a `alter table` query.
*/
var AlterTableBuilder = class {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	renameTo(newTableName) {
		return new AlterTableExecutor({
			...this.#props,
			node: AlterTableNode.cloneWithTableProps(this.#props.node, { renameTo: parseTable(newTableName) })
		});
	}
	setSchema(newSchema) {
		return new AlterTableExecutor({
			...this.#props,
			node: AlterTableNode.cloneWithTableProps(this.#props.node, { setSchema: IdentifierNode.create(newSchema) })
		});
	}
	alterColumn(column, alteration) {
		const builder = alteration(new AlterColumnBuilder(column));
		return new AlterTableColumnAlteringBuilder({
			...this.#props,
			node: AlterTableNode.cloneWithColumnAlteration(this.#props.node, builder.toOperationNode())
		});
	}
	dropColumn(column, build = noop) {
		const builder = build(new DropColumnBuilder({ node: DropColumnNode.create(column) }));
		return new AlterTableColumnAlteringBuilder({
			...this.#props,
			node: AlterTableNode.cloneWithColumnAlteration(this.#props.node, builder.toOperationNode())
		});
	}
	renameColumn(column, newColumn) {
		return new AlterTableColumnAlteringBuilder({
			...this.#props,
			node: AlterTableNode.cloneWithColumnAlteration(this.#props.node, RenameColumnNode.create(column, newColumn))
		});
	}
	addColumn(columnName, dataType, build = noop) {
		const builder = build(new ColumnDefinitionBuilder(ColumnDefinitionNode.create(columnName, parseDataTypeExpression(dataType))));
		return new AlterTableColumnAlteringBuilder({
			...this.#props,
			node: AlterTableNode.cloneWithColumnAlteration(this.#props.node, AddColumnNode.create(builder.toOperationNode()))
		});
	}
	modifyColumn(columnName, dataType, build = noop) {
		const builder = build(new ColumnDefinitionBuilder(ColumnDefinitionNode.create(columnName, parseDataTypeExpression(dataType))));
		return new AlterTableColumnAlteringBuilder({
			...this.#props,
			node: AlterTableNode.cloneWithColumnAlteration(this.#props.node, ModifyColumnNode.create(builder.toOperationNode()))
		});
	}
	/**
	* See {@link CreateTableBuilder.addUniqueConstraint}
	*/
	addUniqueConstraint(constraintName, columns, build = noop) {
		const uniqueConstraintBuilder = build(new UniqueConstraintNodeBuilder(UniqueConstraintNode.create(columns.map((column) => isString(column) ? ColumnNode.create(column) : parseExpression(column)), constraintName)));
		return new AlterTableExecutor({
			...this.#props,
			node: AlterTableNode.cloneWithTableProps(this.#props.node, { addConstraint: AddConstraintNode.create(uniqueConstraintBuilder.toOperationNode()) })
		});
	}
	/**
	* See {@link CreateTableBuilder.addCheckConstraint}
	*/
	addCheckConstraint(constraintName, checkExpression, build = noop) {
		const constraintBuilder = build(new CheckConstraintBuilder(CheckConstraintNode.create(checkExpression.toOperationNode(), constraintName)));
		return new AlterTableExecutor({
			...this.#props,
			node: AlterTableNode.cloneWithTableProps(this.#props.node, { addConstraint: AddConstraintNode.create(constraintBuilder.toOperationNode()) })
		});
	}
	/**
	* See {@link CreateTableBuilder.addForeignKeyConstraint}
	*
	* Unlike {@link CreateTableBuilder.addForeignKeyConstraint} this method returns
	* the constraint builder and doesn't take a callback as the last argument. This
	* is because you can only add one column per `ALTER TABLE` query.
	*/
	addForeignKeyConstraint(constraintName, columns, targetTable, targetColumns, build = noop) {
		const constraintBuilder = build(new ForeignKeyConstraintBuilder(ForeignKeyConstraintNode.create(columns.map(ColumnNode.create), parseTable(targetTable), targetColumns.map(ColumnNode.create), constraintName)));
		return new AlterTableAddForeignKeyConstraintBuilder({
			...this.#props,
			constraintBuilder
		});
	}
	/**
	* See {@link CreateTableBuilder.addPrimaryKeyConstraint}
	*/
	addPrimaryKeyConstraint(constraintName, columns, build = noop) {
		const constraintBuilder = build(new PrimaryKeyConstraintBuilder(PrimaryKeyConstraintNode.create(columns, constraintName)));
		return new AlterTableExecutor({
			...this.#props,
			node: AlterTableNode.cloneWithTableProps(this.#props.node, { addConstraint: AddConstraintNode.create(constraintBuilder.toOperationNode()) })
		});
	}
	dropConstraint(constraintName) {
		return new AlterTableDropConstraintBuilder({
			...this.#props,
			node: AlterTableNode.cloneWithTableProps(this.#props.node, { dropConstraint: DropConstraintNode.create(constraintName) })
		});
	}
	renameConstraint(oldName, newName) {
		return new AlterTableDropConstraintBuilder({
			...this.#props,
			node: AlterTableNode.cloneWithTableProps(this.#props.node, { renameConstraint: RenameConstraintNode.create(oldName, newName) })
		});
	}
	/**
	* This can be used to add index to table.
	*
	*  ### Examples
	*
	* ```ts
	* db.schema.alterTable('person')
	*   .addIndex('person_email_index')
	*   .column('email')
	*   .unique()
	*   .execute()
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* alter table `person` add unique index `person_email_index` (`email`)
	* ```
	*/
	addIndex(indexName) {
		return new AlterTableAddIndexBuilder({
			...this.#props,
			node: AlterTableNode.cloneWithTableProps(this.#props.node, { addIndex: AddIndexNode.create(indexName) })
		});
	}
	/**
	* This can be used to drop index from table.
	*
	* ### Examples
	*
	* ```ts
	* db.schema.alterTable('person')
	*   .dropIndex('person_email_index')
	*   .execute()
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* alter table `person` drop index `test_first_name_index`
	* ```
	*/
	dropIndex(indexName) {
		return new AlterTableExecutor({
			...this.#props,
			node: AlterTableNode.cloneWithTableProps(this.#props.node, { dropIndex: DropIndexNode.create(indexName) })
		});
	}
	/**
	* Calls the given function passing `this` as the only argument.
	*
	* See {@link CreateTableBuilder.$call}
	*/
	$call(func) {
		return func(this);
	}
};
var AlterTableColumnAlteringBuilder = class AlterTableColumnAlteringBuilder {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	alterColumn(column, alteration) {
		const builder = alteration(new AlterColumnBuilder(column));
		return new AlterTableColumnAlteringBuilder({
			...this.#props,
			node: AlterTableNode.cloneWithColumnAlteration(this.#props.node, builder.toOperationNode())
		});
	}
	dropColumn(column, build = noop) {
		const builder = build(new DropColumnBuilder({ node: DropColumnNode.create(column) }));
		return new AlterTableColumnAlteringBuilder({
			...this.#props,
			node: AlterTableNode.cloneWithColumnAlteration(this.#props.node, builder.toOperationNode())
		});
	}
	renameColumn(column, newColumn) {
		return new AlterTableColumnAlteringBuilder({
			...this.#props,
			node: AlterTableNode.cloneWithColumnAlteration(this.#props.node, RenameColumnNode.create(column, newColumn))
		});
	}
	addColumn(columnName, dataType, build = noop) {
		const builder = build(new ColumnDefinitionBuilder(ColumnDefinitionNode.create(columnName, parseDataTypeExpression(dataType))));
		return new AlterTableColumnAlteringBuilder({
			...this.#props,
			node: AlterTableNode.cloneWithColumnAlteration(this.#props.node, AddColumnNode.create(builder.toOperationNode()))
		});
	}
	modifyColumn(columnName, dataType, build = noop) {
		const builder = build(new ColumnDefinitionBuilder(ColumnDefinitionNode.create(columnName, parseDataTypeExpression(dataType))));
		return new AlterTableColumnAlteringBuilder({
			...this.#props,
			node: AlterTableNode.cloneWithColumnAlteration(this.#props.node, ModifyColumnNode.create(builder.toOperationNode()))
		});
	}
	toOperationNode() {
		return this.#props.executor.transformQuery(this.#props.node, this.#props.queryId);
	}
	compile() {
		return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
	}
	async execute(options) {
		await this.#props.executor.executeQuery(this.compile(), options);
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/plugin/immediate-value/immediate-value-transformer.js
/**
* Transforms all ValueNodes to immediate.
*
* WARNING! This should never be part of the public API. Users should never use this.
* This is an internal helper.
*
* @internal
*/
var ImmediateValueTransformer = class extends OperationNodeTransformer {
	transformPrimitiveValueList(node) {
		return ValueListNode.create(node.values.map(ValueNode.createImmediate));
	}
	transformValue(node) {
		return ValueNode.createImmediate(node.value);
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/schema/create-index-builder.js
var CreateIndexBuilder = class CreateIndexBuilder {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	/**
	* Adds the "if not exists" modifier.
	*
	* If the index already exists, no error is thrown if this method has been called.
	*/
	ifNotExists() {
		return new CreateIndexBuilder({
			...this.#props,
			node: CreateIndexNode.cloneWith(this.#props.node, { ifNotExists: true })
		});
	}
	/**
	* Makes the index unique.
	*/
	unique() {
		return new CreateIndexBuilder({
			...this.#props,
			node: CreateIndexNode.cloneWith(this.#props.node, { unique: true })
		});
	}
	/**
	* Adds `nulls not distinct` specifier to index.
	* This only works on some dialects like PostgreSQL.
	*
	* ### Examples
	*
	* ```ts
	* db.schema.createIndex('person_first_name_index')
	*  .on('person')
	*  .column('first_name')
	*  .nullsNotDistinct()
	*  .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* create index "person_first_name_index"
	* on "test" ("first_name")
	* nulls not distinct;
	* ```
	*/
	nullsNotDistinct() {
		return new CreateIndexBuilder({
			...this.#props,
			node: CreateIndexNode.cloneWith(this.#props.node, { nullsNotDistinct: true })
		});
	}
	/**
	* Specifies the table for the index.
	*/
	on(table) {
		return new CreateIndexBuilder({
			...this.#props,
			node: CreateIndexNode.cloneWith(this.#props.node, { table: parseTable(table) })
		});
	}
	column(arg) {
		return new CreateIndexBuilder({
			...this.#props,
			node: CreateIndexNode.cloneWithColumns(this.#props.node, [isString(arg) ? parseOrderedColumnName(arg) : arg.toOperationNode()])
		});
	}
	/**
	* Adds a list of columns to the index.
	*
	* Also see {@link column} for adding a single column.
	*
	* ### Examples
	*
	* ```ts
	* import { sql } from 'kysely'
	*
	* await db.schema
	*   .createIndex('person_first_name_and_age_index')
	*   .on('person')
	*   .columns(['first_name', sql`left(lower("last_name"), 1)`, 'age desc'])
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* create index "person_first_name_and_age_index"
	* on "person" ("first_name", left(lower("last_name"), 1), "age" desc)
	* ```
	*/
	columns(columns) {
		return new CreateIndexBuilder({
			...this.#props,
			node: CreateIndexNode.cloneWithColumns(this.#props.node, columns.map((item) => isString(item) ? parseOrderedColumnName(item) : item.toOperationNode()))
		});
	}
	/**
	* Adds an arbitrary expression as a column to the index.
	*
	* ### Examples
	*
	* ```ts
	* import { sql } from 'kysely'
	*
	* await db.schema
	*   .createIndex('person_first_name_index')
	*   .on('person')
	*   .expression(sql`first_name COLLATE "fi_FI"`)
	*   .column('gender')
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* create index "person_first_name_index"
	* on "person" (first_name COLLATE "fi_FI", "gender")
	* ```
	*
	* @deprecated Use {@link column} or {@link columns} with an {@link Expression} instead.
	*/
	expression(expression) {
		return new CreateIndexBuilder({
			...this.#props,
			node: CreateIndexNode.cloneWithColumns(this.#props.node, [expression.toOperationNode()])
		});
	}
	using(indexType) {
		return new CreateIndexBuilder({
			...this.#props,
			node: CreateIndexNode.cloneWith(this.#props.node, { using: RawNode.createWithSql(indexType) })
		});
	}
	where(...args) {
		const transformer = new ImmediateValueTransformer();
		return new CreateIndexBuilder({
			...this.#props,
			node: QueryNode.cloneWithWhere(this.#props.node, transformer.transformNode(parseValueBinaryOperationOrExpression(args), this.#props.queryId))
		});
	}
	/**
	* Simply calls the provided function passing `this` as the only argument. `$call` returns
	* what the provided function returns.
	*/
	$call(func) {
		return func(this);
	}
	toOperationNode() {
		return this.#props.executor.transformQuery(this.#props.node, this.#props.queryId);
	}
	compile() {
		return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
	}
	async execute(options) {
		await this.#props.executor.executeQuery(this.compile(), options);
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/schema/create-schema-builder.js
var CreateSchemaBuilder = class CreateSchemaBuilder {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	ifNotExists() {
		return new CreateSchemaBuilder({
			...this.#props,
			node: CreateSchemaNode.cloneWith(this.#props.node, { ifNotExists: true })
		});
	}
	/**
	* Simply calls the provided function passing `this` as the only argument. `$call` returns
	* what the provided function returns.
	*/
	$call(func) {
		return func(this);
	}
	toOperationNode() {
		return this.#props.executor.transformQuery(this.#props.node, this.#props.queryId);
	}
	compile() {
		return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
	}
	async execute(options) {
		await this.#props.executor.executeQuery(this.compile(), options);
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/parser/on-commit-action-parse.js
function parseOnCommitAction(action) {
	if (ON_COMMIT_ACTIONS.includes(action)) return action;
	throw new Error(`invalid OnCommitAction ${action}`);
}
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/schema/create-table-add-index-builder.js
var CreateTableAddIndexBuilder = class CreateTableAddIndexBuilder {
	#node;
	constructor(node) {
		this.#node = node;
	}
	using(indexType) {
		return new CreateTableAddIndexBuilder(AddIndexNode.cloneWith(this.#node, { using: RawNode.createWithSql(indexType) }));
	}
	/**
	* Simply calls the provided function passing `this` as the only argument. `$call` returns
	* what the provided function returns.
	*/
	$call(func) {
		return func(this);
	}
	toOperationNode() {
		return this.#node;
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/schema/create-table-builder.js
/**
* This builder can be used to create a `create table` query.
*/
var CreateTableBuilder = class CreateTableBuilder {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	/**
	* Adds the "temporary" modifier.
	*
	* Use this to create a temporary table.
	*/
	temporary() {
		return new CreateTableBuilder({
			...this.#props,
			node: CreateTableNode.cloneWith(this.#props.node, { temporary: true })
		});
	}
	/**
	* Adds an "on commit" statement.
	*
	* This can be used in conjunction with temporary tables on supported databases
	* like PostgreSQL.
	*/
	onCommit(onCommit) {
		return new CreateTableBuilder({
			...this.#props,
			node: CreateTableNode.cloneWith(this.#props.node, { onCommit: parseOnCommitAction(onCommit) })
		});
	}
	/**
	* Adds the "if not exists" modifier.
	*
	* If the table already exists, no error is thrown if this method has been called.
	*/
	ifNotExists() {
		return new CreateTableBuilder({
			...this.#props,
			node: CreateTableNode.cloneWith(this.#props.node, { ifNotExists: true })
		});
	}
	/**
	* Adds a column to the table.
	*
	* ### Examples
	*
	* ```ts
	* import { sql } from 'kysely'
	*
	* await db.schema
	*   .createTable('person')
	*   .addColumn('id', 'integer', (col) => col.autoIncrement().primaryKey())
	*   .addColumn('first_name', 'varchar(50)', (col) => col.notNull())
	*   .addColumn('last_name', 'varchar(255)')
	*   .addColumn('bank_balance', 'numeric(8, 2)')
	*   // You can specify any data type using the `sql` tag if the types
	*   // don't include it.
	*   .addColumn('data', sql`any_type_here`)
	*   .addColumn('parent_id', 'integer', (col) =>
	*     col.references('person.id').onDelete('cascade')
	*   )
	* ```
	*
	* With this method, it's once again good to remember that Kysely just builds the
	* query and doesn't provide the same API for all databases. For example, some
	* databases like older MySQL don't support the `references` statement in the
	* column definition. Instead foreign key constraints need to be defined in the
	* `create table` query. See the next example:
	*
	* ```ts
	* await db.schema
	*   .createTable('person')
	*   .addColumn('id', 'integer', (col) => col.primaryKey())
	*   .addColumn('parent_id', 'integer')
	*   .addForeignKeyConstraint(
	*     'person_parent_id_fk',
	*     ['parent_id'],
	*     'person',
	*     ['id'],
	*     (cb) => cb.onDelete('cascade')
	*   )
	*   .execute()
	* ```
	*
	* Another good example is that PostgreSQL doesn't support the `auto_increment`
	* keyword and you need to define an autoincrementing column for example using
	* `serial`:
	*
	* ```ts
	* await db.schema
	*   .createTable('person')
	*   .addColumn('id', 'serial', (col) => col.primaryKey())
	*   .execute()
	* ```
	*/
	addColumn(columnName, dataType, build = noop) {
		const columnBuilder = build(new ColumnDefinitionBuilder(ColumnDefinitionNode.create(columnName, parseDataTypeExpression(dataType))));
		return new CreateTableBuilder({
			...this.#props,
			node: CreateTableNode.cloneWithColumn(this.#props.node, columnBuilder.toOperationNode())
		});
	}
	/**
	* Adds a primary key constraint for one or more columns.
	*
	* The constraint name can be anything you want, but it must be unique
	* across the whole database.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .createTable('person')
	*   .addColumn('first_name', 'varchar(64)')
	*   .addColumn('last_name', 'varchar(64)')
	*   .addPrimaryKeyConstraint('primary_key', ['first_name', 'last_name'])
	*   .execute()
	* ```
	*/
	addPrimaryKeyConstraint(constraintName, columns, build = noop) {
		const constraintBuilder = build(new PrimaryKeyConstraintBuilder(PrimaryKeyConstraintNode.create(columns, constraintName)));
		return new CreateTableBuilder({
			...this.#props,
			node: CreateTableNode.cloneWithConstraint(this.#props.node, constraintBuilder.toOperationNode())
		});
	}
	/**
	* Adds a unique constraint for one or more columns.
	*
	* The constraint name can be anything you want, but it must be unique
	* across the whole database.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .createTable('person')
	*   .addColumn('first_name', 'varchar(64)')
	*   .addColumn('last_name', 'varchar(64)')
	*   .addUniqueConstraint(
	*     'first_name_last_name_unique',
	*     ['first_name', 'last_name']
	*   )
	*   .execute()
	* ```
	*
	* In dialects such as PostgreSQL you can specify `nulls not distinct` as follows:
	*
	* ```ts
	* await db.schema
	*   .createTable('person')
	*   .addColumn('first_name', 'varchar(64)')
	*   .addColumn('last_name', 'varchar(64)')
	*   .addUniqueConstraint(
	*     'first_name_last_name_unique',
	*     ['first_name', 'last_name'],
	*     (cb) => cb.nullsNotDistinct()
	*   )
	*   .execute()
	* ```
	*
	* In dialects such as MySQL you create unique constraints on expressions as follows:
	*
	* ```ts
	*
	* import { sql } from 'kysely'
	*
	* await db.schema
	*   .createTable('person')
	*   .addColumn('first_name', 'varchar(64)')
	*   .addColumn('last_name', 'varchar(64)')
	*   .addUniqueConstraint(
	*     'first_name_last_name_unique',
	*     [sql`(lower('first_name'))`, 'last_name']
	*   )
	*   .execute()
	* ```
	*/
	addUniqueConstraint(constraintName, columns, build = noop) {
		const uniqueConstraintBuilder = build(new UniqueConstraintNodeBuilder(UniqueConstraintNode.create(columns.map((column) => isString(column) ? ColumnNode.create(column) : parseExpression(column)), constraintName)));
		return new CreateTableBuilder({
			...this.#props,
			node: CreateTableNode.cloneWithConstraint(this.#props.node, uniqueConstraintBuilder.toOperationNode())
		});
	}
	/**
	* Adds an index that includes one or more columns.
	*
	* This is only supported by some dialects like MySQL.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .createTable('person')
	*   .addColumn('first_name', 'varchar(64)')
	*   .addColumn('last_name', 'varchar(64)')
	*   .addIndex('last_name_key', ['last_name'])
	*   .execute()
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* create table `person` (
	*   `id` integer primary key,
	*   `first_name` varchar(64) not null,
	*   `last_name` varchar(64) not null,
	*   index `last_name_key` (`last_name`)
	* )
	* ```
	*/
	addIndex(indexName, columns, build = noop) {
		const addIndexBuilder = build(new CreateTableAddIndexBuilder(AddIndexNode.cloneWithColumns(AddIndexNode.create(indexName), columns.map((column) => isString(column) ? ColumnNode.create(column) : parseExpression(column)))));
		return new CreateTableBuilder({
			...this.#props,
			node: CreateTableNode.cloneWithIndex(this.#props.node, addIndexBuilder.toOperationNode())
		});
	}
	/**
	* Adds a check constraint.
	*
	* The constraint name can be anything you want, but it must be unique
	* across the whole database.
	*
	* ### Examples
	*
	* ```ts
	* import { sql } from 'kysely'
	*
	* await db.schema
	*   .createTable('animal')
	*   .addColumn('number_of_legs', 'integer')
	*   .addCheckConstraint('check_legs', sql`number_of_legs < 5`)
	*   .execute()
	* ```
	*/
	addCheckConstraint(constraintName, checkExpression, build = noop) {
		const constraintBuilder = build(new CheckConstraintBuilder(CheckConstraintNode.create(checkExpression.toOperationNode(), constraintName)));
		return new CreateTableBuilder({
			...this.#props,
			node: CreateTableNode.cloneWithConstraint(this.#props.node, constraintBuilder.toOperationNode())
		});
	}
	/**
	* Adds a foreign key constraint.
	*
	* The constraint name can be anything you want, but it must be unique
	* across the whole database.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .createTable('pet')
	*   .addColumn('owner_id', 'integer')
	*   .addForeignKeyConstraint(
	*     'owner_id_foreign',
	*     ['owner_id'],
	*     'person',
	*     ['id'],
	*   )
	*   .execute()
	* ```
	*
	* Add constraint for multiple columns:
	*
	* ```ts
	* await db.schema
	*   .createTable('pet')
	*   .addColumn('owner_id1', 'integer')
	*   .addColumn('owner_id2', 'integer')
	*   .addForeignKeyConstraint(
	*     'owner_id_foreign',
	*     ['owner_id1', 'owner_id2'],
	*     'person',
	*     ['id1', 'id2'],
	*     (cb) => cb.onDelete('cascade')
	*   )
	*   .execute()
	* ```
	*/
	addForeignKeyConstraint(constraintName, columns, targetTable, targetColumns, build = noop) {
		const builder = build(new ForeignKeyConstraintBuilder(ForeignKeyConstraintNode.create(columns.map(ColumnNode.create), parseTable(targetTable), targetColumns.map(ColumnNode.create), constraintName)));
		return new CreateTableBuilder({
			...this.#props,
			node: CreateTableNode.cloneWithConstraint(this.#props.node, builder.toOperationNode())
		});
	}
	/**
	* This can be used to add any additional SQL to the front of the query __after__ the `create` keyword.
	*
	* Also see {@link temporary}.
	*
	* ### Examples
	*
	* ```ts
	* import { sql } from 'kysely'
	*
	* await db.schema
	*   .createTable('person')
	*   .modifyFront(sql`global temporary`)
	*   .addColumn('id', 'integer', col => col.primaryKey())
	*   .addColumn('first_name', 'varchar(64)', col => col.notNull())
	*   .addColumn('last_name', 'varchar(64)', col => col.notNull())
	*   .execute()
	* ```
	*
	* The generated SQL (Postgres):
	*
	* ```sql
	* create global temporary table "person" (
	*   "id" integer primary key,
	*   "first_name" varchar(64) not null,
	*   "last_name" varchar(64) not null
	* )
	* ```
	*/
	modifyFront(modifier) {
		return new CreateTableBuilder({
			...this.#props,
			node: CreateTableNode.cloneWithFrontModifier(this.#props.node, modifier.toOperationNode())
		});
	}
	/**
	* This can be used to add any additional SQL to the end of the query.
	*
	* Also see {@link onCommit}.
	*
	* ### Examples
	*
	* ```ts
	* import { sql } from 'kysely'
	*
	* await db.schema
	*   .createTable('person')
	*   .addColumn('id', 'integer', col => col.primaryKey())
	*   .addColumn('first_name', 'varchar(64)', col => col.notNull())
	*   .addColumn('last_name', 'varchar(64)', col => col.notNull())
	*   .modifyEnd(sql`collate utf8_unicode_ci`)
	*   .execute()
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* create table `person` (
	*   `id` integer primary key,
	*   `first_name` varchar(64) not null,
	*   `last_name` varchar(64) not null
	* ) collate utf8_unicode_ci
	* ```
	*/
	modifyEnd(modifier) {
		return new CreateTableBuilder({
			...this.#props,
			node: CreateTableNode.cloneWithEndModifier(this.#props.node, modifier.toOperationNode())
		});
	}
	/**
	* Allows to create table from `select` query.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .createTable('copy')
	*   .temporary()
	*   .as(db.selectFrom('person').select(['first_name', 'last_name']))
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* create temporary table "copy" as
	* select "first_name", "last_name" from "person"
	* ```
	*/
	as(expression) {
		return new CreateTableBuilder({
			...this.#props,
			node: CreateTableNode.cloneWith(this.#props.node, { selectQuery: parseExpression(expression) })
		});
	}
	/**
	* Calls the given function passing `this` as the only argument.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .createTable('test')
	*   .$call((builder) => builder.addColumn('id', 'integer'))
	*   .execute()
	* ```
	*
	* This is useful for creating reusable functions that can be called with a builder.
	*
	* ```ts
	* import { type CreateTableBuilder, sql } from 'kysely'
	*
	* const addDefaultColumns = (ctb: CreateTableBuilder<any, any>) => {
	*   return ctb
	*     .addColumn('id', 'integer', (col) => col.notNull())
	*     .addColumn('created_at', 'date', (col) =>
	*       col.notNull().defaultTo(sql`now()`)
	*     )
	*     .addColumn('updated_at', 'date', (col) =>
	*       col.notNull().defaultTo(sql`now()`)
	*     )
	* }
	*
	* await db.schema
	*   .createTable('test')
	*   .$call(addDefaultColumns)
	*   .execute()
	* ```
	*/
	$call(func) {
		return func(this);
	}
	toOperationNode() {
		return this.#props.executor.transformQuery(this.#props.node, this.#props.queryId);
	}
	compile() {
		return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
	}
	async execute(options) {
		await this.#props.executor.executeQuery(this.compile(), options);
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/schema/drop-index-builder.js
var DropIndexBuilder = class DropIndexBuilder {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	/**
	* Specifies the table the index was created for. This is not needed
	* in all dialects.
	*/
	on(table) {
		return new DropIndexBuilder({
			...this.#props,
			node: DropIndexNode.cloneWith(this.#props.node, { table: parseTable(table) })
		});
	}
	ifExists() {
		return new DropIndexBuilder({
			...this.#props,
			node: DropIndexNode.cloneWith(this.#props.node, { ifExists: true })
		});
	}
	cascade() {
		return new DropIndexBuilder({
			...this.#props,
			node: DropIndexNode.cloneWith(this.#props.node, { cascade: true })
		});
	}
	/**
	* Simply calls the provided function passing `this` as the only argument. `$call` returns
	* what the provided function returns.
	*/
	$call(func) {
		return func(this);
	}
	toOperationNode() {
		return this.#props.executor.transformQuery(this.#props.node, this.#props.queryId);
	}
	compile() {
		return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
	}
	async execute(options) {
		await this.#props.executor.executeQuery(this.compile(), options);
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/schema/drop-schema-builder.js
var DropSchemaBuilder = class DropSchemaBuilder {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	ifExists() {
		return new DropSchemaBuilder({
			...this.#props,
			node: DropSchemaNode.cloneWith(this.#props.node, { ifExists: true })
		});
	}
	cascade() {
		return new DropSchemaBuilder({
			...this.#props,
			node: DropSchemaNode.cloneWith(this.#props.node, { cascade: true })
		});
	}
	/**
	* Simply calls the provided function passing `this` as the only argument. `$call` returns
	* what the provided function returns.
	*/
	$call(func) {
		return func(this);
	}
	toOperationNode() {
		return this.#props.executor.transformQuery(this.#props.node, this.#props.queryId);
	}
	compile() {
		return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
	}
	async execute(options) {
		await this.#props.executor.executeQuery(this.compile(), options);
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/schema/drop-table-builder.js
var DropTableBuilder = class DropTableBuilder {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	/**
	* Adds the "temporary" modifier.
	*
	* This is only supported by some dialects like MySQL.
	*/
	temporary() {
		return new DropTableBuilder({
			...this.#props,
			node: DropTableNode.cloneWith(this.#props.node, { temporary: true })
		});
	}
	ifExists() {
		return new DropTableBuilder({
			...this.#props,
			node: DropTableNode.cloneWith(this.#props.node, { ifExists: true })
		});
	}
	cascade() {
		return new DropTableBuilder({
			...this.#props,
			node: DropTableNode.cloneWith(this.#props.node, { cascade: true })
		});
	}
	/**
	* Simply calls the provided function passing `this` as the only argument. `$call` returns
	* what the provided function returns.
	*/
	$call(func) {
		return func(this);
	}
	toOperationNode() {
		return this.#props.executor.transformQuery(this.#props.node, this.#props.queryId);
	}
	compile() {
		return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
	}
	async execute(options) {
		await this.#props.executor.executeQuery(this.compile(), options);
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/plugin/immediate-value/immediate-value-plugin.js
/**
* Transforms all ValueNodes to immediate.
*
* WARNING! This should never be part of the public API. Users should never use this.
* This is an internal helper.
*
* @internal
*/
var ImmediateValuePlugin = class {
	#transformer = new ImmediateValueTransformer();
	transformQuery(args) {
		return this.#transformer.transformNode(args.node, args.queryId);
	}
	transformResult(args) {
		return Promise.resolve(args.result);
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/schema/create-view-builder.js
var CreateViewBuilder = class CreateViewBuilder {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	/**
	* Adds the "temporary" modifier.
	*
	* Use this to create a temporary view.
	*/
	temporary() {
		return new CreateViewBuilder({
			...this.#props,
			node: CreateViewNode.cloneWith(this.#props.node, { temporary: true })
		});
	}
	materialized() {
		return new CreateViewBuilder({
			...this.#props,
			node: CreateViewNode.cloneWith(this.#props.node, { materialized: true })
		});
	}
	/**
	* Only implemented on some dialects like SQLite. On most dialects, use {@link orReplace}.
	*/
	ifNotExists() {
		return new CreateViewBuilder({
			...this.#props,
			node: CreateViewNode.cloneWith(this.#props.node, { ifNotExists: true })
		});
	}
	orReplace() {
		return new CreateViewBuilder({
			...this.#props,
			node: CreateViewNode.cloneWith(this.#props.node, { orReplace: true })
		});
	}
	columns(columns) {
		return new CreateViewBuilder({
			...this.#props,
			node: CreateViewNode.cloneWith(this.#props.node, { columns: columns.map(parseColumnName) })
		});
	}
	/**
	* Sets the select query or a `values` statement that creates the view.
	*
	* WARNING!
	* Some dialects don't support parameterized queries in DDL statements and therefore
	* the query or raw {@link sql } expression passed here is interpolated into a single
	* string opening an SQL injection vulnerability. DO NOT pass unchecked user input
	* into the query or raw expression passed to this method!
	*/
	as(query) {
		const queryNode = query.withPlugin(new ImmediateValuePlugin()).toOperationNode();
		return new CreateViewBuilder({
			...this.#props,
			node: CreateViewNode.cloneWith(this.#props.node, { as: queryNode })
		});
	}
	/**
	* Simply calls the provided function passing `this` as the only argument. `$call` returns
	* what the provided function returns.
	*/
	$call(func) {
		return func(this);
	}
	toOperationNode() {
		return this.#props.executor.transformQuery(this.#props.node, this.#props.queryId);
	}
	compile() {
		return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
	}
	async execute(options) {
		await this.#props.executor.executeQuery(this.compile(), options);
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/drop-view-node.js
/**
* @internal
*/
var DropViewNode = freeze({
	is(node) {
		return node.kind === "DropViewNode";
	},
	create(name) {
		return freeze({
			kind: "DropViewNode",
			name: SchemableIdentifierNode.create(name)
		});
	},
	cloneWith(dropView, params) {
		return freeze({
			...dropView,
			...params
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/schema/drop-view-builder.js
var DropViewBuilder = class DropViewBuilder {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	materialized() {
		return new DropViewBuilder({
			...this.#props,
			node: DropViewNode.cloneWith(this.#props.node, { materialized: true })
		});
	}
	ifExists() {
		return new DropViewBuilder({
			...this.#props,
			node: DropViewNode.cloneWith(this.#props.node, { ifExists: true })
		});
	}
	cascade() {
		return new DropViewBuilder({
			...this.#props,
			node: DropViewNode.cloneWith(this.#props.node, { cascade: true })
		});
	}
	/**
	* Simply calls the provided function passing `this` as the only argument. `$call` returns
	* what the provided function returns.
	*/
	$call(func) {
		return func(this);
	}
	toOperationNode() {
		return this.#props.executor.transformQuery(this.#props.node, this.#props.queryId);
	}
	compile() {
		return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
	}
	async execute(options) {
		await this.#props.executor.executeQuery(this.compile(), options);
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/create-type-node.js
/**
* @internal
*/
var CreateTypeNode = freeze({
	is(node) {
		return node.kind === "CreateTypeNode";
	},
	create(name) {
		return freeze({
			kind: "CreateTypeNode",
			name
		});
	},
	cloneWithEnum(createType, values) {
		return freeze({
			...createType,
			enum: ValueListNode.create(values.map(ValueNode.createImmediate))
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/schema/create-type-builder.js
var CreateTypeBuilder = class CreateTypeBuilder {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	toOperationNode() {
		return this.#props.executor.transformQuery(this.#props.node, this.#props.queryId);
	}
	/**
	* Creates an enum type.
	*
	* ### Examples
	*
	* ```ts
	* db.schema.createType('species').asEnum(['cat', 'dog', 'frog'])
	* ```
	*/
	asEnum(values) {
		return new CreateTypeBuilder({
			...this.#props,
			node: CreateTypeNode.cloneWithEnum(this.#props.node, values)
		});
	}
	/**
	* Simply calls the provided function passing `this` as the only argument. `$call` returns
	* what the provided function returns.
	*/
	$call(func) {
		return func(this);
	}
	compile() {
		return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
	}
	async execute(options) {
		await this.#props.executor.executeQuery(this.compile(), options);
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/drop-type-node.js
/**
* @internal
*/
var DropTypeNode = freeze({
	is(node) {
		return node.kind === "DropTypeNode";
	},
	create(names) {
		if (!Array.isArray(names)) names = [names];
		return freeze({
			kind: "DropTypeNode",
			name: names[0],
			additionalNames: names.slice(1)
		});
	},
	cloneWith(dropType, params) {
		return freeze({
			...dropType,
			...params
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/schema/drop-type-builder.js
var DropTypeBuilder = class DropTypeBuilder {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	/**
	* Adds `if exists` to the query.
	*/
	ifExists() {
		return new DropTypeBuilder({
			...this.#props,
			node: DropTypeNode.cloneWith(this.#props.node, { ifExists: true })
		});
	}
	/**
	* Adds `cascade` to the query.
	*/
	cascade() {
		return new DropTypeBuilder({
			...this.#props,
			node: DropTypeNode.cloneWith(this.#props.node, { cascade: true })
		});
	}
	/**
	* Simply calls the provided function passing `this` as the only argument. `$call` returns
	* what the provided function returns.
	*/
	$call(func) {
		return func(this);
	}
	toOperationNode() {
		return this.#props.executor.transformQuery(this.#props.node, this.#props.queryId);
	}
	compile() {
		return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
	}
	async execute(options) {
		await this.#props.executor.executeQuery(this.compile(), options);
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/parser/identifier-parser.js
function parseSchemableIdentifier(id) {
	const SCHEMA_SEPARATOR = ".";
	if (id.includes(SCHEMA_SEPARATOR)) {
		const parts = id.split(SCHEMA_SEPARATOR).map(trim);
		if (parts.length === 2) return SchemableIdentifierNode.createWithSchema(parts[0], parts[1]);
		else throw new Error(`invalid schemable identifier ${id}`);
	} else return SchemableIdentifierNode.create(id);
}
function parseSchemableIdentifierArray(id) {
	if (!Array.isArray(id)) id = [id];
	return id.map(parseSchemableIdentifier);
}
function trim(str) {
	return str.trim();
}
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/refresh-materialized-view-node.js
/**
* @internal
*/
var RefreshMaterializedViewNode = freeze({
	is(node) {
		return node.kind === "RefreshMaterializedViewNode";
	},
	create(name) {
		return freeze({
			kind: "RefreshMaterializedViewNode",
			name: SchemableIdentifierNode.create(name)
		});
	},
	cloneWith(createView, params) {
		return freeze({
			...createView,
			...params
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/schema/refresh-materialized-view-builder.js
var RefreshMaterializedViewBuilder = class RefreshMaterializedViewBuilder {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	/**
	* Adds the "concurrently" modifier.
	*
	* Use this to refresh the view without locking out concurrent selects on the materialized view.
	*
	* WARNING!
	* This cannot be used with the "with no data" modifier.
	*/
	concurrently() {
		return new RefreshMaterializedViewBuilder({
			...this.#props,
			node: RefreshMaterializedViewNode.cloneWith(this.#props.node, {
				concurrently: true,
				withNoData: false
			})
		});
	}
	/**
	* Adds the "with data" modifier.
	*
	* If specified (or defaults) the backing query is executed to provide the new data, and the materialized view is left in a scannable state
	*/
	withData() {
		return new RefreshMaterializedViewBuilder({
			...this.#props,
			node: RefreshMaterializedViewNode.cloneWith(this.#props.node, { withNoData: false })
		});
	}
	/**
	* Adds the "with no data" modifier.
	*
	* If specified, no new data is generated and the materialized view is left in an unscannable state.
	*
	* WARNING!
	* This cannot be used with the "concurrently" modifier.
	*/
	withNoData() {
		return new RefreshMaterializedViewBuilder({
			...this.#props,
			node: RefreshMaterializedViewNode.cloneWith(this.#props.node, {
				withNoData: true,
				concurrently: false
			})
		});
	}
	/**
	* Simply calls the provided function passing `this` as the only argument. `$call` returns
	* what the provided function returns.
	*/
	$call(func) {
		return func(this);
	}
	toOperationNode() {
		return this.#props.executor.transformQuery(this.#props.node, this.#props.queryId);
	}
	compile() {
		return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
	}
	async execute(options) {
		await this.#props.executor.executeQuery(this.compile(), options);
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/alter-type-node.js
/**
* @internal
*/
var AlterTypeNode = freeze({
	is(node) {
		return node.kind === "AlterTypeNode";
	},
	create(name) {
		return freeze({
			kind: "AlterTypeNode",
			name
		});
	},
	cloneWith(node, props) {
		return freeze({
			...node,
			...props
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/add-value-node.js
/**
* @internal
*/
var AddValueNode = freeze({
	is(node) {
		return node.kind === "AddValueNode";
	},
	create(value) {
		return freeze({
			kind: "AddValueNode",
			value
		});
	},
	cloneWith(node, props) {
		return freeze({
			...node,
			...props
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/query-finalizer.js
var QueryFinalizer = class {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	toOperationNode() {
		return this.#props.executor.transformQuery(this.#props.node, this.#props.queryId);
	}
	/**
	* Compiles the query.
	*/
	compile() {
		return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
	}
	/**
	* Executes the query.
	*/
	async execute(options) {
		return await this.#props.executor.executeQuery(this.compile(), options);
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/schema/alter-type-add-value-builder.js
var _a;
var AlterTypeAddValueBuilder = class extends QueryFinalizer {
	#props;
	constructor(props) {
		super(props);
		this.#props = props;
	}
	/**
	* Adds an `if not exists` clause.
	*/
	ifNotExists() {
		return new _a({
			...this.#props,
			node: AlterTypeNode.cloneWith(this.#props.node, { addValue: AddValueNode.cloneWith(this.#props.node.addValue, { ifNotExists: true }) })
		});
	}
	/**
	* Sets a `before <value>` clause.
	*/
	before(neighborValue) {
		return this.#setNeighbor(neighborValue, true);
	}
	/**
	* Sets an `after <value>` clause.
	*/
	after(neighborValue) {
		return this.#setNeighbor(neighborValue, false);
	}
	#setNeighbor(neighborValue, isBefore) {
		return new _a({
			...this.#props,
			node: AlterTypeNode.cloneWith(this.#props.node, { addValue: AddValueNode.cloneWith(this.#props.node.addValue, {
				isBefore,
				neighborValue: ValueNode.createImmediate(neighborValue)
			}) })
		});
	}
};
_a = AlterTypeAddValueBuilder;
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/rename-value-node.js
var RenameValueNode = freeze({
	is(node) {
		return node.kind === "RenameValueNode";
	},
	create(oldValue, newValue) {
		return freeze({
			kind: "RenameValueNode",
			oldValue,
			newValue
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/schema/alter-type-builder.js
/**
* This builder can be used to create `alter type` queries.
*/
var AlterTypeBuilder = class {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	/**
	* Adds a new value to an enum type.
	*/
	addValue(value) {
		return new AlterTypeAddValueBuilder({
			...this.#props,
			node: AlterTypeNode.cloneWith(this.#props.node, { addValue: AddValueNode.create(ValueNode.createImmediate(value)) })
		});
	}
	/**
	* Rename the type.
	*/
	renameTo(newName) {
		return new QueryFinalizer({
			...this.#props,
			node: AlterTypeNode.cloneWith(this.#props.node, { renameTo: IdentifierNode.create(newName) })
		});
	}
	/**
	* Renames a value of an enum type.
	*/
	renameValue(oldValue, newValue) {
		return new QueryFinalizer({
			...this.#props,
			node: AlterTypeNode.cloneWith(this.#props.node, { renameValue: RenameValueNode.create(ValueNode.createImmediate(oldValue), ValueNode.createImmediate(newValue)) })
		});
	}
	/**
	* Changes the type's schema.
	*/
	setSchema(schema) {
		return new QueryFinalizer({
			...this.#props,
			node: AlterTypeNode.cloneWith(this.#props.node, { setSchema: IdentifierNode.create(schema) })
		});
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/schema/schema-module.js
/**
* Provides methods for building database schema.
*/
var SchemaModule = class SchemaModule {
	#executor;
	constructor(executor) {
		this.#executor = executor;
	}
	/**
	* Create a new table.
	*
	* ### Examples
	*
	* This example creates a new table with columns `id`, `first_name`,
	* `last_name` and `gender`:
	*
	* ```ts
	* await db.schema
	*   .createTable('person')
	*   .addColumn('id', 'integer', col => col.primaryKey().autoIncrement())
	*   .addColumn('first_name', 'varchar', col => col.notNull())
	*   .addColumn('last_name', 'varchar', col => col.notNull())
	*   .addColumn('gender', 'varchar')
	*   .execute()
	* ```
	*
	* This example creates a table with a foreign key. Not all database
	* engines support column-level foreign key constraint definitions.
	* For example if you are using MySQL 5.X see the next example after
	* this one.
	*
	* ```ts
	* await db.schema
	*   .createTable('pet')
	*   .addColumn('id', 'integer', col => col.primaryKey().autoIncrement())
	*   .addColumn('owner_id', 'integer', col => col
	*     .references('person.id')
	*     .onDelete('cascade')
	*   )
	*   .execute()
	* ```
	*
	* This example adds a foreign key constraint for a columns just
	* like the previous example, but using a table-level statement.
	* On MySQL 5.X you need to define foreign key constraints like
	* this:
	*
	* ```ts
	* await db.schema
	*   .createTable('pet')
	*   .addColumn('id', 'integer', col => col.primaryKey().autoIncrement())
	*   .addColumn('owner_id', 'integer')
	*   .addForeignKeyConstraint(
	*     'pet_owner_id_foreign', ['owner_id'], 'person', ['id'],
	*     (constraint) => constraint.onDelete('cascade')
	*   )
	*   .execute()
	* ```
	*/
	createTable(table) {
		return new CreateTableBuilder({
			queryId: createQueryId(),
			executor: this.#executor,
			node: CreateTableNode.create(parseTable(table))
		});
	}
	/**
	* Drop a table.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .dropTable('person')
	*   .execute()
	* ```
	*/
	dropTable(table) {
		return new DropTableBuilder({
			queryId: createQueryId(),
			executor: this.#executor,
			node: DropTableNode.create(parseTable(table))
		});
	}
	/**
	* Create a new index.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .createIndex('person_full_name_unique_index')
	*   .on('person')
	*   .columns(['first_name', 'last_name'])
	*   .execute()
	* ```
	*/
	createIndex(indexName) {
		return new CreateIndexBuilder({
			queryId: createQueryId(),
			executor: this.#executor,
			node: CreateIndexNode.create(indexName)
		});
	}
	/**
	* Drop an index.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .dropIndex('person_full_name_unique_index')
	*   .execute()
	* ```
	*/
	dropIndex(indexName) {
		return new DropIndexBuilder({
			queryId: createQueryId(),
			executor: this.#executor,
			node: DropIndexNode.create(indexName)
		});
	}
	/**
	* Create a new schema.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .createSchema('some_schema')
	*   .execute()
	* ```
	*/
	createSchema(schema) {
		return new CreateSchemaBuilder({
			queryId: createQueryId(),
			executor: this.#executor,
			node: CreateSchemaNode.create(schema)
		});
	}
	/**
	* Drop a schema.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .dropSchema('some_schema')
	*   .execute()
	* ```
	*/
	dropSchema(schema) {
		return new DropSchemaBuilder({
			queryId: createQueryId(),
			executor: this.#executor,
			node: DropSchemaNode.create(schema)
		});
	}
	/**
	* Alter a table.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .alterTable('person')
	*   .alterColumn('first_name', (ac) => ac.setDataType('text'))
	*   .execute()
	* ```
	*/
	alterTable(table) {
		return new AlterTableBuilder({
			queryId: createQueryId(),
			executor: this.#executor,
			node: AlterTableNode.create(parseTable(table))
		});
	}
	/**
	* Create a new view.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .createView('dogs')
	*   .orReplace()
	*   .as(db.selectFrom('pet').selectAll().where('species', '=', 'dog'))
	*   .execute()
	* ```
	*/
	createView(viewName) {
		return new CreateViewBuilder({
			queryId: createQueryId(),
			executor: this.#executor,
			node: CreateViewNode.create(viewName)
		});
	}
	/**
	* Refresh a materialized view.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .refreshMaterializedView('my_view')
	*   .concurrently()
	*   .execute()
	* ```
	*/
	refreshMaterializedView(viewName) {
		return new RefreshMaterializedViewBuilder({
			queryId: createQueryId(),
			executor: this.#executor,
			node: RefreshMaterializedViewNode.create(viewName)
		});
	}
	/**
	* Drop a view.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .dropView('dogs')
	*   .ifExists()
	*   .execute()
	* ```
	*/
	dropView(viewName) {
		return new DropViewBuilder({
			queryId: createQueryId(),
			executor: this.#executor,
			node: DropViewNode.create(viewName)
		});
	}
	/**
	* Create a new type.
	*
	* Only some dialects like PostgreSQL have user-defined types.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .createType('species')
	*   .asEnum(['dog', 'cat', 'frog'])
	*   .execute()
	* ```
	*/
	createType(typeName) {
		return new CreateTypeBuilder({
			queryId: createQueryId(),
			executor: this.#executor,
			node: CreateTypeNode.create(parseSchemableIdentifier(typeName))
		});
	}
	/**
	* Alter a type. Rename it, change schema or add/rename enum type values.
	*
	* Only some dialects like PostgreSQL have user-defined types.
	*
	* ```ts
	* await db.schema
	*   .alterType('species')
	*   .addValue('capybara')
	*   .execute()
	* ```
	*/
	alterType(name) {
		return new AlterTypeBuilder({
			executor: this.#executor,
			node: AlterTypeNode.create(parseSchemableIdentifier(name)),
			queryId: createQueryId()
		});
	}
	/**
	* Drop a type.
	*
	* Only some dialects like PostgreSQL have user-defined types.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .dropType('species')
	*   .ifExists()
	*   .execute()
	* ```
	*
	* You can also provide multiple type names:
	*
	* ```ts
	* await db.schema
	*   .dropType(['species', 'colors'])
	*   .ifExists()
	*   .cascade()
	*   .execute()
	* ```
	*/
	dropType(typeName) {
		return new DropTypeBuilder({
			queryId: createQueryId(),
			executor: this.#executor,
			node: DropTypeNode.create(parseSchemableIdentifierArray(typeName))
		});
	}
	/**
	* Returns a copy of this schema module with the given plugin installed.
	*/
	withPlugin(plugin) {
		return new SchemaModule(this.#executor.withPlugin(plugin));
	}
	/**
	* Returns a copy of this schema module  without any plugins.
	*/
	withoutPlugins() {
		return new SchemaModule(this.#executor.withoutPlugins());
	}
	/**
	* See {@link QueryCreator.withSchema}
	*/
	withSchema(schema) {
		return new SchemaModule(this.#executor.withPluginAtFront(new WithSchemaPlugin(schema)));
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/dynamic/dynamic.js
var DynamicModule = class {
	/**
	* Creates a dynamic reference to a column that is not know at compile time.
	*
	* Kysely is built in a way that by default you can't refer to tables or columns
	* that are not actually visible in the current query and context. This is all
	* done by TypeScript at compile time, which means that you need to know the
	* columns and tables at compile time. This is not always the case of course.
	*
	* This method is meant to be used in those cases where the column names
	* come from the user input or are not otherwise known at compile time.
	*
	* WARNING! Unlike values, column names are not escaped by the database engine
	* or Kysely and if you pass in unchecked column names using this method, you
	* create an SQL injection vulnerability. Always __always__ validate the user
	* input before passing it to this method.
	*
	* There are couple of examples below for some use cases, but you can pass
	* `ref` to other methods as well. If the types allow you to pass a `ref`
	* value to some place, it should work.
	*
	* ### Examples
	*
	* Filter by a column not know at compile time:
	*
	* ```ts
	* async function someQuery(filterColumn: string, filterValue: string) {
	*   const { ref } = db.dynamic
	*
	*   return await db
	*     .selectFrom('person')
	*     .selectAll()
	*     .where(ref(filterColumn), '=', filterValue)
	*     .execute()
	* }
	*
	* someQuery('first_name', 'Arnold')
	* someQuery('person.last_name', 'Aniston')
	* ```
	*
	* Order by a column not know at compile time:
	*
	* ```ts
	* async function someQuery(orderBy: string) {
	*   const { ref } = db.dynamic
	*
	*   return await db
	*     .selectFrom('person')
	*     .select('person.first_name as fn')
	*     .orderBy(ref(orderBy))
	*     .execute()
	* }
	*
	* someQuery('fn')
	* ```
	*
	* In this example we add selections dynamically:
	*
	* ```ts
	* const { ref } = db.dynamic
	*
	* // Some column name provided by the user. Value not known at compile time.
	* const columnFromUserInput: PossibleColumns = 'birthdate';
	*
	* // A type that lists all possible values `columnFromUserInput` can have.
	* // You can use `keyof Person` if any column of an interface is allowed.
	* type PossibleColumns = 'last_name' | 'first_name' | 'birthdate'
	*
	* const [person] = await db.selectFrom('person')
	*   .select([
	*     ref<PossibleColumns>(columnFromUserInput),
	*     'id'
	*   ])
	*   .execute()
	*
	* // The resulting type contains all `PossibleColumns` as optional fields
	* // because we cannot know which field was actually selected before
	* // running the code.
	* const lastName: string | null | undefined = person?.last_name
	* const firstName: string | undefined = person?.first_name
	* const birthDate: Date | null | undefined = person?.birthdate
	*
	* // The result type also contains the compile time selection `id`.
	* person?.id
	* ```
	*/
	ref(reference) {
		return new DynamicReferenceBuilder(reference);
	}
	/**
	* Creates a table reference to a table that's not fully known at compile time.
	*
	* The type `T` is allowed to be a union of multiple tables.
	*
	* <!-- siteExample("select", "Generic find query", 130) -->
	*
	* A generic type-safe helper function for finding a row by a column value:
	*
	* ```ts
	* import { SelectType } from 'kysely'
	* import { Database } from 'type-editor'
	*
	* async function getRowByColumn<
	*   T extends keyof Database,
	*   C extends keyof Database[T] & string,
	*   V extends SelectType<Database[T][C]>,
	* >(t: T, c: C, v: V) {
	*   // We need to use the dynamic module since the table name
	*   // is not known at compile time.
	*   const { table, ref } = db.dynamic
	*
	*   return await db
	*     .selectFrom(table(t).as('t'))
	*     .selectAll()
	*     .where(ref(c), '=', v)
	*     .orderBy('t.id')
	*     .executeTakeFirstOrThrow()
	* }
	*
	* const person = await getRowByColumn('person', 'first_name', 'Arnold')
	* ```
	*/
	table(table) {
		return new DynamicTableBuilder(table);
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/driver/default-connection-provider.js
var DefaultConnectionProvider = class {
	#driver;
	constructor(driver) {
		this.#driver = driver;
	}
	async provideConnection(consumer, options) {
		const connection = await this.#driver.acquireConnection(options);
		try {
			return await consumer(connection);
		} finally {
			await this.#driver.releaseConnection(connection, options);
		}
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/query-executor/default-query-executor.js
var DefaultQueryExecutor = class DefaultQueryExecutor extends QueryExecutorBase {
	#compiler;
	#adapter;
	#connectionProvider;
	constructor(compiler, adapter, connectionProvider, plugins = []) {
		super(plugins);
		this.#compiler = compiler;
		this.#adapter = adapter;
		this.#connectionProvider = connectionProvider;
	}
	get adapter() {
		return this.#adapter;
	}
	compileQuery(node, queryId) {
		return this.#compiler.compileQuery(node, queryId);
	}
	provideConnection(consumer, options) {
		return this.#connectionProvider.provideConnection(consumer, options);
	}
	withPlugins(plugins) {
		return new DefaultQueryExecutor(this.#compiler, this.#adapter, this.#connectionProvider, [...this.plugins, ...plugins]);
	}
	withPlugin(plugin) {
		return new DefaultQueryExecutor(this.#compiler, this.#adapter, this.#connectionProvider, [...this.plugins, plugin]);
	}
	withPluginAtFront(plugin) {
		return new DefaultQueryExecutor(this.#compiler, this.#adapter, this.#connectionProvider, [plugin, ...this.plugins]);
	}
	withConnectionProvider(connectionProvider) {
		return new DefaultQueryExecutor(this.#compiler, this.#adapter, connectionProvider, [...this.plugins]);
	}
	withoutPlugins() {
		return new DefaultQueryExecutor(this.#compiler, this.#adapter, this.#connectionProvider, []);
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/util/performance-now.js
function performanceNow() {
	if (typeof performance !== "undefined" && isFunction(performance.now)) return performance.now();
	else return Date.now();
}
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/driver/connection-mutex.js
/**
* This mutex is used to ensure that only one operation at a time can
* acquire a connection from the driver. This is necessary when the
* driver only has a single connection, like SQLite and PGlite.
*
* @internal
*/
var ConnectionMutex = class {
	#promise;
	#resolve;
	async obtainLock() {
		while (this.#promise) await this.#promise;
		this.#promise = new Promise((resolve) => {
			this.#resolve = resolve;
		});
	}
	releaseLock() {
		const resolve = this.#resolve;
		this.#promise = void 0;
		this.#resolve = void 0;
		resolve?.();
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/driver/runtime-driver.js
/**
* A small wrapper around {@link Driver} that makes sure the driver is
* initialized before it is used, only initialized and destroyed
* once etc.
*/
var RuntimeDriver = class {
	#driver;
	#log;
	#initPromise;
	#initDone;
	#destroyPromise;
	#connections = /* @__PURE__ */ new WeakSet();
	#connectionMutex;
	constructor(driver, adapter, log) {
		this.#driver = driver;
		this.#initDone = false;
		this.#log = log;
		if (adapter.supportsMultipleConnections === false) this.#connectionMutex = new ConnectionMutex();
	}
	async init(options) {
		if (this.#destroyPromise) throw new Error("driver has already been destroyed");
		this.#initPromise ??= this.#driver.init(options).then(() => {
			this.#initDone = true;
		}).catch((reason) => {
			this.#initPromise = void 0;
			throw reason;
		});
		await waitOrAbort(this.#initPromise, options?.signal, "init");
	}
	async acquireConnection(options) {
		if (this.#destroyPromise) throw new Error("driver has already been destroyed");
		if (!this.#initDone) await this.init(options);
		if (this.#connectionMutex) {
			const lockPromise = this.#connectionMutex.obtainLock();
			await waitOrAbort(lockPromise, options?.signal, "acquireConnection:mutex", () => lockPromise.then(() => this.#connectionMutex?.releaseLock()));
		}
		const connectionPromise = this.#driver.acquireConnection(options);
		const connection = await waitOrAbort(connectionPromise, options?.signal, "acquireConnection:acquire", () => connectionPromise?.then((connection) => this.releaseConnection(connection).catch(printBackgroundFail("driver.releaseConnection"))).catch(printBackgroundFail("driver.acquireConnection")));
		if (!this.#connections.has(connection)) {
			if (this.#needsLogging()) this.#addLogging(connection);
			this.#connections.add(connection);
		}
		return connection;
	}
	async releaseConnection(connection, options) {
		await this.#driver.releaseConnection(connection, options);
		this.#connectionMutex?.releaseLock();
	}
	async beginTransaction(connection, settings) {
		return await this.#driver.beginTransaction(connection, settings);
	}
	async commitTransaction(connection) {
		return await this.#driver.commitTransaction(connection);
	}
	async rollbackTransaction(connection) {
		return await this.#driver.rollbackTransaction(connection);
	}
	async savepoint(connection, savepointName, compileQuery) {
		if (this.#driver.savepoint) return await this.#driver.savepoint(connection, savepointName, compileQuery);
		throw new Error("The `savepoint` method is not supported by this driver");
	}
	async rollbackToSavepoint(connection, savepointName, compileQuery) {
		if (this.#driver.rollbackToSavepoint) return await this.#driver.rollbackToSavepoint(connection, savepointName, compileQuery);
		throw new Error("The `rollbackToSavepoint` method is not supported by this driver");
	}
	async releaseSavepoint(connection, savepointName, compileQuery) {
		if (this.#driver.releaseSavepoint) return await this.#driver.releaseSavepoint(connection, savepointName, compileQuery);
		throw new Error("The `releaseSavepoint` method is not supported by this driver");
	}
	async destroy(options) {
		if (!this.#initPromise) return;
		await waitOrAbort(this.#initPromise, options?.signal, "destroy:initPromise");
		this.#destroyPromise ??= this.#driver.destroy(options).catch((reason) => {
			this.#destroyPromise = void 0;
			throw reason;
		});
		await waitOrAbort(this.#destroyPromise, options?.signal, "destroy");
	}
	#needsLogging() {
		return this.#log.isLevelEnabled("query") || this.#log.isLevelEnabled("error");
	}
	#addLogging(connection) {
		const executeQuery = connection.executeQuery;
		const streamQuery = connection.streamQuery;
		const dis = this;
		connection.executeQuery = async (compiledQuery, options) => {
			let caughtError;
			const startTime = performanceNow();
			try {
				return await executeQuery.call(connection, compiledQuery, options);
			} catch (error) {
				caughtError = error;
				await dis.#logError(error, compiledQuery, startTime);
				throw error;
			} finally {
				if (!caughtError) await dis.#logQuery(compiledQuery, startTime);
			}
		};
		connection.streamQuery = async function* (compiledQuery, chunkSize, options) {
			let caughtError;
			const startTime = performanceNow();
			try {
				for await (const result of streamQuery.call(connection, compiledQuery, chunkSize, options)) yield result;
			} catch (error) {
				caughtError = error;
				await dis.#logError(error, compiledQuery, startTime);
				throw error;
			} finally {
				if (!caughtError) await dis.#logQuery(compiledQuery, startTime, true);
			}
		};
	}
	async #logError(error, compiledQuery, startTime) {
		await this.#log.error(() => ({
			level: "error",
			error,
			query: compiledQuery,
			queryDurationMillis: this.#calculateDurationMillis(startTime)
		}));
	}
	async #logQuery(compiledQuery, startTime, isStream = false) {
		await this.#log.query(() => ({
			level: "query",
			isStream,
			query: compiledQuery,
			queryDurationMillis: this.#calculateDurationMillis(startTime)
		}));
	}
	#calculateDurationMillis(startTime) {
		return performanceNow() - startTime;
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/driver/single-connection-provider.js
var ignoreError = () => {};
var SingleConnectionProvider = class {
	#connection;
	#runningPromise;
	constructor(connection) {
		this.#connection = connection;
	}
	async provideConnection(consumer) {
		while (this.#runningPromise) await this.#runningPromise.catch(ignoreError);
		this.#runningPromise = this.#run(consumer).finally(() => {
			this.#runningPromise = void 0;
		});
		return this.#runningPromise;
	}
	async #run(runner) {
		return await runner(this.#connection);
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/driver/driver.js
var TRANSACTION_ACCESS_MODES = ["read only", "read write"];
var TRANSACTION_ISOLATION_LEVELS = [
	"read uncommitted",
	"read committed",
	"repeatable read",
	"serializable",
	"snapshot"
];
function validateTransactionSettings(settings) {
	if (settings.accessMode && !TRANSACTION_ACCESS_MODES.includes(settings.accessMode)) throw new Error(`invalid transaction access mode ${settings.accessMode}`);
	if (settings.isolationLevel && !TRANSACTION_ISOLATION_LEVELS.includes(settings.isolationLevel)) throw new Error(`invalid transaction isolation level ${settings.isolationLevel}`);
}
freeze(["query", "error"]);
var Log = class {
	#levels;
	#logger;
	constructor(config) {
		if (isFunction(config)) {
			this.#logger = config;
			this.#levels = freeze({
				query: true,
				error: true
			});
		} else {
			this.#logger = defaultLogger;
			this.#levels = freeze({
				query: config.includes("query"),
				error: config.includes("error")
			});
		}
	}
	isLevelEnabled(level) {
		return this.#levels[level];
	}
	async query(getEvent) {
		if (this.#levels.query) await this.#logger(getEvent());
	}
	async error(getEvent) {
		if (this.#levels.error) await this.#logger(getEvent());
	}
};
function defaultLogger(event) {
	if (event.level === "query") {
		const prefix = `kysely:query:${event.isStream ? "stream:" : ""}`;
		console.log(`${prefix} ${event.query.sql}`);
		console.log(`${prefix} duration: ${event.queryDurationMillis.toFixed(1)}ms`);
	} else if (event.level === "error") {
		if (event.error instanceof Error) console.error(`kysely:error: ${event.error.stack ?? event.error.message}`);
		else console.error(`kysely:error: ${JSON.stringify({
			error: event.error,
			query: event.query.sql,
			queryDurationMillis: event.queryDurationMillis
		})}`);
	}
}
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/util/compilable.js
function isCompilable(value) {
	return isObject(value) && isFunction(value.compile);
}
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/kysely.js
Symbol.asyncDispose ??= Symbol("Symbol.asyncDispose");
/**
* The main Kysely class.
*
* You should create one instance of `Kysely` per database using the {@link Kysely}
* constructor. Each `Kysely` instance maintains its own connection pool.
*
* ### Examples
*
* This example assumes your database has a "person" table:
*
* ```ts
* import * as Sqlite from 'better-sqlite3'
* import { type Generated, Kysely, SqliteDialect } from 'kysely'
*
* interface Database {
*   person: {
*     id: Generated<number>
*     first_name: string
*     last_name: string | null
*   }
* }
*
* const db = new Kysely<Database>({
*   dialect: new SqliteDialect({
*     database: new Sqlite(':memory:'),
*   })
* })
* ```
*
* @typeParam DB - The database interface type. Keys of this type must be table names
*    in the database and values must be interfaces that describe the rows in those
*    tables. See the examples above.
*/
var Kysely = class Kysely extends QueryCreator {
	#props;
	constructor(args) {
		let superProps;
		let props;
		if (isKyselyProps(args)) {
			superProps = { executor: args.executor };
			props = { ...args };
		} else {
			const dialect = args.dialect;
			const driver = dialect.createDriver();
			const compiler = dialect.createQueryCompiler();
			const adapter = dialect.createAdapter();
			const runtimeDriver = new RuntimeDriver(driver, adapter, new Log(args.log ?? []));
			const executor = new DefaultQueryExecutor(compiler, adapter, new DefaultConnectionProvider(runtimeDriver), args.plugins ?? []);
			superProps = { executor };
			props = {
				config: args,
				executor,
				dialect,
				driver: runtimeDriver
			};
		}
		super(superProps);
		this.#props = freeze(props);
	}
	/**
	* Returns the {@link SchemaModule} module for building database schema.
	*/
	get schema() {
		return new SchemaModule(this.#props.executor);
	}
	/**
	* Returns a the {@link DynamicModule} module.
	*
	* The {@link DynamicModule} module can be used to bypass strict typing and
	* passing in dynamic values for the queries.
	*/
	get dynamic() {
		return new DynamicModule();
	}
	/**
	* Returns a {@link DatabaseIntrospector | database introspector}.
	*/
	get introspection() {
		return this.#props.dialect.createIntrospector(this.withoutPlugins());
	}
	case(value) {
		return new CaseBuilder({ node: CaseNode.create(isUndefined(value) ? void 0 : parseExpression(value)) });
	}
	/**
	* Returns a {@link FunctionModule} that can be used to write somewhat type-safe function
	* calls.
	*
	* ```ts
	* const { count } = db.fn
	*
	* await db.selectFrom('person')
	*   .innerJoin('pet', 'pet.owner_id', 'person.id')
	*   .select([
	*     'id',
	*     count('pet.id').as('person_count'),
	*   ])
	*   .groupBy('person.id')
	*   .having(count('pet.id'), '>', 10)
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* select "person"."id", count("pet"."id") as "person_count"
	* from "person"
	* inner join "pet" on "pet"."owner_id" = "person"."id"
	* group by "person"."id"
	* having count("pet"."id") > $1
	* ```
	*
	* Why "somewhat" type-safe? Because the function calls are not bound to the
	* current query context. They allow you to reference columns and tables that
	* are not in the current query. E.g. remove the `innerJoin` from the previous
	* query and TypeScript won't even complain.
	*
	* If you want to make the function calls fully type-safe, you can use the
	* {@link ExpressionBuilder.fn} getter for a query context-aware, stricter {@link FunctionModule}.
	*
	* ```ts
	* await db.selectFrom('person')
	*   .innerJoin('pet', 'pet.owner_id', 'person.id')
	*   .select((eb) => [
	*     'person.id',
	*     eb.fn.count('pet.id').as('pet_count')
	*   ])
	*   .groupBy('person.id')
	*   .having((eb) => eb.fn.count('pet.id'), '>', 10)
	*   .execute()
	* ```
	*/
	get fn() {
		return createFunctionModule();
	}
	/**
	* Creates a {@link TransactionBuilder} that can be used to run queries inside a transaction.
	*
	* The returned {@link TransactionBuilder} can be used to configure the transaction. The
	* {@link TransactionBuilder.execute} method can then be called to run the transaction.
	* {@link TransactionBuilder.execute} takes a function that is run inside the
	* transaction. If the function throws an exception,
	* 1. the exception is caught,
	* 2. the transaction is rolled back, and
	* 3. the exception is thrown again.
	* Otherwise the transaction is committed.
	*
	* The callback function passed to the {@link TransactionBuilder.execute | execute}
	* method gets the transaction object as its only argument. The transaction is
	* of type {@link Transaction} which inherits {@link Kysely}. Any query
	* started through the transaction object is executed inside the transaction.
	*
	* To run a controlled transaction, allowing you to commit and rollback manually,
	* use {@link startTransaction} instead.
	*
	* ### Examples
	*
	* <!-- siteExample("transactions", "Simple transaction", 10) -->
	*
	* This example inserts two rows in a transaction. If an exception is thrown inside
	* the callback passed to the `execute` method,
	* 1. the exception is caught,
	* 2. the transaction is rolled back, and
	* 3. the exception is thrown again.
	* Otherwise the transaction is committed.
	*
	* ```ts
	* const catto = await db.transaction().execute(async (trx) => {
	*   const jennifer = await trx.insertInto('person')
	*     .values({
	*       first_name: 'Jennifer',
	*       last_name: 'Aniston',
	*       age: 40,
	*     })
	*     .returning('id')
	*     .executeTakeFirstOrThrow()
	*
	*   return await trx.insertInto('pet')
	*     .values({
	*       owner_id: jennifer.id,
	*       name: 'Catto',
	*       species: 'cat',
	*       is_favorite: false,
	*     })
	*     .returningAll()
	*     .executeTakeFirst()
	* })
	* ```
	*
	* Setting the isolation level:
	*
	* ```ts
	* import type { Kysely } from 'kysely'
	*
	* await db
	*   .transaction()
	*   .setIsolationLevel('serializable')
	*   .execute(async (trx) => {
	*     await doStuff(trx)
	*   })
	*
	* async function doStuff(kysely: typeof db) {
	*   // ...
	* }
	* ```
	*/
	transaction() {
		return new TransactionBuilder({ ...this.#props });
	}
	/**
	* Creates a {@link ControlledTransactionBuilder} that can be used to run queries inside a controlled transaction.
	*
	* The returned {@link ControlledTransactionBuilder} can be used to configure the transaction.
	* The {@link ControlledTransactionBuilder.execute} method can then be called
	* to start the transaction and return a {@link ControlledTransaction}.
	*
	* A {@link ControlledTransaction} allows you to commit and rollback manually,
	* execute savepoint commands. It extends {@link Transaction} which extends {@link Kysely},
	* so you can run queries inside the transaction. Once the transaction is committed,
	* or rolled back, it can't be used anymore - all queries will throw an error.
	* This is to prevent accidentally running queries outside the transaction - where
	* atomicity is not guaranteed anymore.
	*
	* ### Examples
	*
	* <!-- siteExample("transactions", "Controlled transaction", 11) -->
	*
	* A controlled transaction allows you to commit and rollback manually, execute
	* savepoint commands, and queries in general.
	*
	* In this example we start a transaction, use it to insert two rows and then commit
	* the transaction. If an error is thrown, we catch it and rollback the transaction.
	*
	* ```ts
	* const trx = await db.startTransaction().execute()
	*
	* try {
	*   const jennifer = await trx.insertInto('person')
	*     .values({
	*       first_name: 'Jennifer',
	*       last_name: 'Aniston',
	*       age: 40,
	*     })
	*     .returning('id')
	*     .executeTakeFirstOrThrow()
	*
	*   const catto = await trx.insertInto('pet')
	*     .values({
	*       owner_id: jennifer.id,
	*       name: 'Catto',
	*       species: 'cat',
	*       is_favorite: false,
	*     })
	*     .returningAll()
	*     .executeTakeFirstOrThrow()
	*
	*   await trx.commit().execute()
	*
	*   // ...
	* } catch (error) {
	*   await trx.rollback().execute()
	* }
	* ```
	*
	* <!-- siteExample("transactions", "Controlled transaction /w savepoints", 12) -->
	*
	* A controlled transaction allows you to commit and rollback manually, execute
	* savepoint commands, and queries in general.
	*
	* In this example we start a transaction, insert a person, create a savepoint,
	* try inserting a toy and a pet, and if an error is thrown, we rollback to the
	* savepoint. Eventually we release the savepoint, insert an audit record and
	* commit the transaction. If an error is thrown, we catch it and rollback the
	* transaction.
	*
	* ```ts
	* const trx = await db.startTransaction().execute()
	*
	* try {
	*   const jennifer = await trx
	*     .insertInto('person')
	*     .values({
	*       first_name: 'Jennifer',
	*       last_name: 'Aniston',
	*       age: 40,
	*     })
	*     .returning('id')
	*     .executeTakeFirstOrThrow()
	*
	*   const trxAfterJennifer = await trx.savepoint('after_jennifer').execute()
	*
	*   try {
	*     const catto = await trxAfterJennifer
	*       .insertInto('pet')
	*       .values({
	*         owner_id: jennifer.id,
	*         name: 'Catto',
	*         species: 'cat',
	*       })
	*       .returning('id')
	*       .executeTakeFirstOrThrow()
	*
	*     await trxAfterJennifer
	*       .insertInto('toy')
	*       .values({ name: 'Bone', price: 1.99, pet_id: catto.id })
	*       .execute()
	*   } catch (error) {
	*     await trxAfterJennifer.rollbackToSavepoint('after_jennifer').execute()
	*   }
	*
	*   await trxAfterJennifer.releaseSavepoint('after_jennifer').execute()
	*
	*   await trx.insertInto('audit').values({ action: 'added Jennifer' }).execute()
	*
	*   await trx.commit().execute()
	* } catch (error) {
	*   await trx.rollback().execute()
	* }
	* ```
	*/
	startTransaction() {
		return new ControlledTransactionBuilder({ ...this.#props });
	}
	/**
	* Provides a kysely instance bound to a single database connection.
	*
	* ### Examples
	*
	* ```ts
	* await db
	*   .connection()
	*   .execute(async (db) => {
	*     // `db` is an instance of `Kysely` that's bound to a single
	*     // database connection. All queries executed through `db` use
	*     // the same connection.
	*     await doStuff(db)
	*   })
	*
	* async function doStuff(kysely: typeof db) {
	*   // ...
	* }
	* ```
	*/
	connection() {
		return new ConnectionBuilder({ ...this.#props });
	}
	/**
	* Returns a copy of this Kysely instance with the given plugin installed.
	*/
	withPlugin(plugin) {
		return new Kysely({
			...this.#props,
			executor: this.#props.executor.withPlugin(plugin)
		});
	}
	/**
	* Returns a copy of this Kysely instance without any plugins.
	*/
	withoutPlugins() {
		return new Kysely({
			...this.#props,
			executor: this.#props.executor.withoutPlugins()
		});
	}
	/**
	* @override
	*/
	withSchema(schema) {
		return new Kysely({
			...this.#props,
			executor: this.#props.executor.withPluginAtFront(new WithSchemaPlugin(schema))
		});
	}
	/**
	* Returns a copy of this Kysely instance with tables added to its
	* database type.
	*
	* This method only modifies the types and doesn't affect any of the
	* executed queries in any way.
	*
	* ### Examples
	*
	* The following example adds and uses a temporary table:
	*
	* ```ts
	* await db.schema
	*   .createTable('temp_table')
	*   .temporary()
	*   .addColumn('some_column', 'integer')
	*   .execute()
	*
	* const tempDb = db.$extendTables<{
	*   temp_table: {
	*     some_column: number
	*   }
	* }>()
	*
	* await tempDb
	*   .insertInto('temp_table')
	*   .values({ some_column: 100 })
	*   .execute()
	* ```
	*/
	$extendTables() {
		return new Kysely({ ...this.#props });
	}
	/**
	* Returns a copy of this Kysely instance without the given tables (provided as
	* a union type of table names).
	*
	* This method only modifies the types and doesn't affect any of the executed
	* queries in any way.
	*
	* See also {@link $pickTables} and {@link $extendTables}.
	*
	* ### Examples
	*
	* The following example omits tables not used in the downstream query. This
	* can help with compile-time performance as downstream checks and calculations
	* work against a smaller scope of the database - less tables and columns.
	*
	* Don't optimize prematurely! Build your queries first, measure later. If you
	* realize the query has a noticeable impact on compilation - try the helper.
	*
	* ```ts
	* const results = await db
	*   .$omitTables<'toy'>()
	*   .selectFrom('person')
	*   .innerJoin('pet', 'pet.owner_id', 'person.id')
	*   .selectAll()
	*   .execute()
	* ```
	*
	* The query is arguably less readable now, and changing it is less obvious -
	* e.g. adding another table.
	*/
	$omitTables() {
		return new Kysely({ ...this.#props });
	}
	/**
	* Returns a copy of this Kysely instance with just the given tables (provided as
	* a union type of table names).
	*
	* This method only modifies the types and doesn't affect any of the executed
	* queries in any way.
	*
	* See also {@link $omitTables} and {@link $extendTables}.
	*
	* ### Examples
	*
	* The following example picks the tables used in the downstream query. This
	* can help with compile-time performance as downstream checks and calculations
	* work against a smaller scope of the database - less tables and columns.
	*
	* Don't optimize prematurely! Build your queries first, measure later. If you
	* realize the query has a noticeable impact on compilation - try the helper.
	*
	* ```ts
	* const results = await db
	*   .$pickTables<'person' | 'pet'>()
	*   .selectFrom('person')
	*   .innerJoin('pet', 'pet.owner_id', 'person.id')
	*   .selectAll()
	*   .execute()
	* ```
	*
	* The query is arguably less readable now, and changing it is less obvious -
	* e.g. adding another table.
	*/
	$pickTables() {
		return new Kysely({ ...this.#props });
	}
	/**
	* @deprecated use {@link $extendTables} instead.
	*/
	withTables() {
		return this.$extendTables();
	}
	/**
	* Releases all resources and disconnects from the database.
	*
	* You need to call this when you are done using the `Kysely` instance.
	*/
	async destroy() {
		await this.#props.driver.destroy();
	}
	/**
	* Returns true if this `Kysely` instance is a transaction.
	*
	* You can also use `db instanceof Transaction`.
	*/
	get isTransaction() {
		return false;
	}
	/**
	* @internal
	* @private
	*/
	getExecutor() {
		return this.#props.executor;
	}
	/**
	* Executes a given compiled query or query builder.
	*
	* See {@link https://github.com/kysely-org/kysely/blob/master/site/docs/recipes/0004-splitting-query-building-and-execution.md#execute-compiled-queries splitting build, compile and execute code recipe} for more information.
	*/
	async executeQuery(query, options) {
		const compiledQuery = isCompilable(query) ? query.compile() : query;
		return await this.#props.executor.executeQuery(compiledQuery, options);
	}
	async [Symbol.asyncDispose]() {
		await this.destroy();
	}
};
var Transaction = class Transaction extends Kysely {
	#props;
	constructor(props) {
		super(props);
		this.#props = props;
	}
	get isTransaction() {
		return true;
	}
	/**
	* @deprecated calling the transaction method for a Transaction is not supported
	*/
	transaction() {
		throw new Error("calling the transaction method for a Transaction is not supported");
	}
	/**
	* @deprecated calling the controlled transaction method for a Transaction is not supported
	*/
	startTransaction() {
		throw new Error("calling the controlled transaction method for a Transaction is not supported");
	}
	/**
	* @deprecated calling the connection method for a Transaction is not supported
	*/
	connection() {
		throw new Error("calling the connection method for a Transaction is not supported");
	}
	/**
	* @deprecated calling the destroy method for a Transaction is not supported
	*/
	destroy() {
		throw new Error("calling the destroy method for a Transaction is not supported");
	}
	/**
	* Similar to {@link Kysely.withPlugin} but returns the transaction.
	*/
	withPlugin(plugin) {
		return new Transaction({
			...this.#props,
			executor: this.#props.executor.withPlugin(plugin)
		});
	}
	/**
	* Similar to {@link Kysely.withoutPlugins} but returns the transaction.
	*/
	withoutPlugins() {
		return new Transaction({
			...this.#props,
			executor: this.#props.executor.withoutPlugins()
		});
	}
	/**
	* Similar to {@link Kysely.withSchema} but returns the transaction.
	*/
	withSchema(schema) {
		return new Transaction({
			...this.#props,
			executor: this.#props.executor.withPluginAtFront(new WithSchemaPlugin(schema))
		});
	}
	/**
	* Similar to {@link Kysely.withTables} but returns the transaction.
	*
	* @deprecated use {@link $extendTables} instead.
	*/
	withTables() {
		return new Transaction({ ...this.#props });
	}
	/**
	* Similar to {@link Kysely.$extendTables} but returns the transaction.
	*/
	$extendTables() {
		return new Transaction({ ...this.#props });
	}
	/**
	* Similar to {@link Kysely.$omitTables} but returns the transaction.
	*/
	$omitTables() {
		return new Transaction({ ...this.#props });
	}
	/**
	* Similar to {@link Kysely.$pickTables} but returns the transaction.
	*/
	$pickTables() {
		return new Transaction({ ...this.#props });
	}
};
function isKyselyProps(obj) {
	return isObject(obj) && isObject(obj.config) && isObject(obj.driver) && isObject(obj.executor) && isObject(obj.dialect);
}
var ConnectionBuilder = class {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	async execute(callback, options) {
		return this.#props.executor.provideConnection(async (connection) => {
			const executor = this.#props.executor.withConnectionProvider(new SingleConnectionProvider(connection));
			return await callback(new Kysely({
				...this.#props,
				executor
			}));
		}, freeze({ signal: options?.signal }));
	}
};
var TransactionBuilder = class TransactionBuilder {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	setAccessMode(accessMode) {
		return new TransactionBuilder({
			...this.#props,
			accessMode
		});
	}
	setIsolationLevel(isolationLevel) {
		return new TransactionBuilder({
			...this.#props,
			isolationLevel
		});
	}
	async execute(callback) {
		const { isolationLevel, accessMode, ...kyselyProps } = this.#props;
		const settings = {
			isolationLevel,
			accessMode
		};
		validateTransactionSettings(settings);
		return this.#props.executor.provideConnection(async (connection) => {
			const state = {
				isCommitted: false,
				isRolledBack: false
			};
			const executor = new NotCommittedOrRolledBackAssertingExecutor(this.#props.executor.withConnectionProvider(new SingleConnectionProvider(connection)), state);
			const transaction = new Transaction({
				...kyselyProps,
				executor
			});
			let transactionBegun = false;
			try {
				await this.#props.driver.beginTransaction(connection, settings);
				transactionBegun = true;
				const result = await callback(transaction);
				await this.#props.driver.commitTransaction(connection);
				state.isCommitted = true;
				return result;
			} catch (error) {
				if (transactionBegun) {
					await this.#props.driver.rollbackTransaction(connection);
					state.isRolledBack = true;
				}
				throw error;
			}
		});
	}
};
var ControlledTransactionBuilder = class ControlledTransactionBuilder {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	setAccessMode(accessMode) {
		return new ControlledTransactionBuilder({
			...this.#props,
			accessMode
		});
	}
	setIsolationLevel(isolationLevel) {
		return new ControlledTransactionBuilder({
			...this.#props,
			isolationLevel
		});
	}
	async execute() {
		const { isolationLevel, accessMode, ...props } = this.#props;
		const settings = {
			isolationLevel,
			accessMode
		};
		validateTransactionSettings(settings);
		const connection = await provideControlledConnection(this.#props.executor);
		await this.#props.driver.beginTransaction(connection.connection, settings);
		return new ControlledTransaction({
			...props,
			connection,
			executor: this.#props.executor.withConnectionProvider(new SingleConnectionProvider(connection.connection))
		});
	}
};
var ControlledTransaction = class ControlledTransaction extends Transaction {
	#props;
	#compileQuery;
	#state;
	constructor(props) {
		const state = {
			isCommitted: false,
			isRolledBack: false
		};
		props = {
			...props,
			executor: new NotCommittedOrRolledBackAssertingExecutor(props.executor, state)
		};
		const { connection, ...transactionProps } = props;
		super(transactionProps);
		this.#props = freeze(props);
		this.#state = state;
		const queryId = createQueryId();
		this.#compileQuery = (node) => props.executor.compileQuery(node, queryId);
	}
	get isCommitted() {
		return this.#state.isCommitted;
	}
	get isRolledBack() {
		return this.#state.isRolledBack;
	}
	/**
	* Commits the transaction.
	*
	* See {@link rollback}.
	*
	* ### Examples
	*
	* ```ts
	* import type { Kysely } from 'kysely'
	* import type { Database } from 'type-editor' // imaginary module
	*
	* const trx = await db.startTransaction().execute()
	*
	* try {
	*   await doSomething(trx)
	*
	*   await trx.commit().execute()
	* } catch (error) {
	*   await trx.rollback().execute()
	* }
	*
	* async function doSomething(kysely: Kysely<Database>) {}
	* ```
	*/
	commit() {
		assertNotCommittedOrRolledBack(this.#state);
		return new Command(async () => {
			await this.#props.driver.commitTransaction(this.#props.connection.connection);
			this.#state.isCommitted = true;
			this.#props.connection.release();
		});
	}
	/**
	* Rolls back the transaction.
	*
	* See {@link commit} and {@link rollbackToSavepoint}.
	*
	* ### Examples
	*
	* ```ts
	* import type { Kysely } from 'kysely'
	* import type { Database } from 'type-editor' // imaginary module
	*
	* const trx = await db.startTransaction().execute()
	*
	* try {
	*   await doSomething(trx)
	*
	*   await trx.commit().execute()
	* } catch (error) {
	*   await trx.rollback().execute()
	* }
	*
	* async function doSomething(kysely: Kysely<Database>) {}
	* ```
	*/
	rollback() {
		assertNotCommittedOrRolledBack(this.#state);
		return new Command(async () => {
			await this.#props.driver.rollbackTransaction(this.#props.connection.connection);
			this.#state.isRolledBack = true;
			this.#props.connection.release();
		});
	}
	/**
	* Creates a savepoint with a given name.
	*
	* See {@link rollbackToSavepoint} and {@link releaseSavepoint}.
	*
	* For a type-safe experience, you should use the returned instance from now on.
	*
	* ### Examples
	*
	* ```ts
	* import type { Kysely } from 'kysely'
	* import type { Database } from 'type-editor' // imaginary module
	*
	* const trx = await db.startTransaction().execute()
	*
	* await insertJennifer(trx)
	*
	* const trxAfterJennifer = await trx.savepoint('after_jennifer').execute()
	*
	* try {
	*   await doSomething(trxAfterJennifer)
	* } catch (error) {
	*   await trxAfterJennifer.rollbackToSavepoint('after_jennifer').execute()
	* }
	*
	* async function insertJennifer(kysely: Kysely<Database>) {}
	* async function doSomething(kysely: Kysely<Database>) {}
	* ```
	*/
	savepoint(savepointName) {
		assertNotCommittedOrRolledBack(this.#state);
		return new Command(async () => {
			await this.#props.driver.savepoint?.(this.#props.connection.connection, savepointName, this.#compileQuery);
			return new ControlledTransaction({ ...this.#props });
		});
	}
	/**
	* Rolls back to a savepoint with a given name.
	*
	* See {@link savepoint} and {@link releaseSavepoint}.
	*
	* You must use the same instance returned by {@link savepoint}, or
	* escape the type-check by using `as any`.
	*
	* ### Examples
	*
	* ```ts
	* import type { Kysely } from 'kysely'
	* import type { Database } from 'type-editor' // imaginary module
	*
	* const trx = await db.startTransaction().execute()
	*
	* await insertJennifer(trx)
	*
	* const trxAfterJennifer = await trx.savepoint('after_jennifer').execute()
	*
	* try {
	*   await doSomething(trxAfterJennifer)
	* } catch (error) {
	*   await trxAfterJennifer.rollbackToSavepoint('after_jennifer').execute()
	* }
	*
	* async function insertJennifer(kysely: Kysely<Database>) {}
	* async function doSomething(kysely: Kysely<Database>) {}
	* ```
	*/
	rollbackToSavepoint(savepointName) {
		assertNotCommittedOrRolledBack(this.#state);
		return new Command(async () => {
			await this.#props.driver.rollbackToSavepoint?.(this.#props.connection.connection, savepointName, this.#compileQuery);
			return new ControlledTransaction({ ...this.#props });
		});
	}
	/**
	* Releases a savepoint with a given name.
	*
	* See {@link savepoint} and {@link rollbackToSavepoint}.
	*
	* You must use the same instance returned by {@link savepoint}, or
	* escape the type-check by using `as any`.
	*
	* ### Examples
	*
	* ```ts
	* import type { Kysely } from 'kysely'
	* import type { Database } from 'type-editor' // imaginary module
	*
	* const trx = await db.startTransaction().execute()
	*
	* await insertJennifer(trx)
	*
	* const trxAfterJennifer = await trx.savepoint('after_jennifer').execute()
	*
	* try {
	*   await doSomething(trxAfterJennifer)
	* } catch (error) {
	*   await trxAfterJennifer.rollbackToSavepoint('after_jennifer').execute()
	* }
	*
	* await trxAfterJennifer.releaseSavepoint('after_jennifer').execute()
	*
	* await doSomethingElse(trx)
	*
	* async function insertJennifer(kysely: Kysely<Database>) {}
	* async function doSomething(kysely: Kysely<Database>) {}
	* async function doSomethingElse(kysely: Kysely<Database>) {}
	* ```
	*/
	releaseSavepoint(savepointName) {
		assertNotCommittedOrRolledBack(this.#state);
		return new Command(async () => {
			await this.#props.driver.releaseSavepoint?.(this.#props.connection.connection, savepointName, this.#compileQuery);
			return new ControlledTransaction({ ...this.#props });
		});
	}
	withPlugin(plugin) {
		return new ControlledTransaction({
			...this.#props,
			executor: this.#props.executor.withPlugin(plugin)
		});
	}
	withoutPlugins() {
		return new ControlledTransaction({
			...this.#props,
			executor: this.#props.executor.withoutPlugins()
		});
	}
	withSchema(schema) {
		return new ControlledTransaction({
			...this.#props,
			executor: this.#props.executor.withPluginAtFront(new WithSchemaPlugin(schema))
		});
	}
	withTables() {
		return new ControlledTransaction({ ...this.#props });
	}
	$extendTables() {
		return new ControlledTransaction({ ...this.#props });
	}
	$omitTables() {
		return new ControlledTransaction({ ...this.#props });
	}
	$pickTables() {
		return new ControlledTransaction({ ...this.#props });
	}
};
var Command = class {
	#cb;
	constructor(cb) {
		this.#cb = cb;
	}
	/**
	* Executes the command.
	*/
	async execute() {
		return await this.#cb();
	}
};
function assertNotCommittedOrRolledBack(state) {
	if (state.isCommitted) throw new Error("Transaction is already committed");
	if (state.isRolledBack) throw new Error("Transaction is already rolled back");
}
/**
* An executor wrapper that asserts that the transaction state is not committed
* or rolled back when a query is executed.
*
* @internal
*/
var NotCommittedOrRolledBackAssertingExecutor = class NotCommittedOrRolledBackAssertingExecutor {
	#executor;
	#state;
	constructor(executor, state) {
		this.#executor = executor instanceof NotCommittedOrRolledBackAssertingExecutor ? executor.#executor : executor;
		this.#state = state;
	}
	get adapter() {
		return this.#executor.adapter;
	}
	get plugins() {
		return this.#executor.plugins;
	}
	transformQuery(node, queryId) {
		return this.#executor.transformQuery(node, queryId);
	}
	compileQuery(node, queryId) {
		return this.#executor.compileQuery(node, queryId);
	}
	provideConnection(consumer, options) {
		return this.#executor.provideConnection(consumer, options);
	}
	executeQuery(compiledQuery, options) {
		assertNotCommittedOrRolledBack(this.#state);
		return this.#executor.executeQuery(compiledQuery, options);
	}
	stream(compiledQuery, chunkSize, options) {
		assertNotCommittedOrRolledBack(this.#state);
		return this.#executor.stream(compiledQuery, chunkSize, options);
	}
	withConnectionProvider(connectionProvider) {
		return new NotCommittedOrRolledBackAssertingExecutor(this.#executor.withConnectionProvider(connectionProvider), this.#state);
	}
	withPlugin(plugin) {
		return new NotCommittedOrRolledBackAssertingExecutor(this.#executor.withPlugin(plugin), this.#state);
	}
	withPlugins(plugins) {
		return new NotCommittedOrRolledBackAssertingExecutor(this.#executor.withPlugins(plugins), this.#state);
	}
	withPluginAtFront(plugin) {
		return new NotCommittedOrRolledBackAssertingExecutor(this.#executor.withPluginAtFront(plugin), this.#state);
	}
	withoutPlugins() {
		return new NotCommittedOrRolledBackAssertingExecutor(this.#executor.withoutPlugins(), this.#state);
	}
};
//#endregion
export { ColumnDefinitionBuilder as $, DropViewNode as A, DropColumnBuilder as B, RefreshMaterializedViewBuilder as C, CreateTypeBuilder as D, DropTypeNode as E, CreateTableBuilder as F, AlteredColumnBuilder as G, AddIndexNode as H, CreateSchemaBuilder as I, UniqueConstraintNode as J, AlterColumnNode as K, CreateIndexBuilder as L, DropTableBuilder as M, DropSchemaBuilder as N, CreateTypeNode as O, DropIndexBuilder as P, ModifyColumnNode as Q, AlterTableBuilder as R, AlterTypeNode as S, DropTypeBuilder as T, PrimaryKeyConstraintNode as U, RenameConstraintNode as V, AlterColumnBuilder as W, ForeignKeyConstraintBuilder as X, AddConstraintNode as Y, ForeignKeyConstraintNode as Z, DynamicModule as _, Kysely as a, RenameColumnNode as at, QueryFinalizer as b, isKyselyProps as c, AddColumnNode as ct, TRANSACTION_ACCESS_MODES as d, DropIndexNode as dt, DefaultValueNode as et, TRANSACTION_ISOLATION_LEVELS as f, CreateSchemaNode as ft, DefaultConnectionProvider as g, DefaultQueryExecutor as h, ControlledTransactionBuilder as i, CheckConstraintNode as it, CreateViewBuilder as j, DropViewBuilder as k, isCompilable as l, DropTableNode as lt, SingleConnectionProvider as m, AlterTableNode as mt, ConnectionBuilder as n, ReferencesNode as nt, Transaction as o, DropColumnNode as ot, validateTransactionSettings as p, CreateIndexNode as pt, DropConstraintNode as q, ControlledTransaction as r, isOnModifyForeignAction as rt, TransactionBuilder as s, ColumnDefinitionNode as st, Command as t, GeneratedNode as tt, Log as u, DropSchemaNode as ut, SchemaModule as v, RefreshMaterializedViewNode as w, AddValueNode as x, RenameValueNode as y, AlterTableColumnAlteringBuilder as z };
