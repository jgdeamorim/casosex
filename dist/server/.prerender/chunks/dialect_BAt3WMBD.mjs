import { i as __toESM, r as __require, t as __commonJSMin } from "./rolldown-runtime_B4iAMlE-.mjs";
import { D as ParensNode, G as isDate, H as freeze, J as isNumber, K as isFunction, P as RawNode, R as OperatorNode, S as SelectQueryNode, T as InsertQueryNode, U as isBigInt, V as IdentifierNode, W as isBoolean, X as isString, a as sql, i as DialectAdapterBase, n as DEFAULT_MIGRATION_TABLE, p as SetOperationNode, q as isNull, t as DEFAULT_MIGRATION_LOCK_TABLE, w as WhenNode, x as createQueryId } from "./migrator_BiAfLowp.mjs";
import { n as CreateTableNode, t as CreateViewNode } from "./create-view-node_dP95zztS.mjs";
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/operation-node-visitor.js
var OperationNodeVisitor = class {
	nodeStack = [];
	get parentNode() {
		return this.nodeStack[this.nodeStack.length - 2];
	}
	#visitors = freeze({
		AliasNode: this.visitAlias.bind(this),
		ColumnNode: this.visitColumn.bind(this),
		IdentifierNode: this.visitIdentifier.bind(this),
		SchemableIdentifierNode: this.visitSchemableIdentifier.bind(this),
		RawNode: this.visitRaw.bind(this),
		ReferenceNode: this.visitReference.bind(this),
		SelectQueryNode: this.visitSelectQuery.bind(this),
		SelectionNode: this.visitSelection.bind(this),
		TableNode: this.visitTable.bind(this),
		FromNode: this.visitFrom.bind(this),
		SelectAllNode: this.visitSelectAll.bind(this),
		AndNode: this.visitAnd.bind(this),
		OrNode: this.visitOr.bind(this),
		ValueNode: this.visitValue.bind(this),
		ValueListNode: this.visitValueList.bind(this),
		PrimitiveValueListNode: this.visitPrimitiveValueList.bind(this),
		ParensNode: this.visitParens.bind(this),
		JoinNode: this.visitJoin.bind(this),
		OperatorNode: this.visitOperator.bind(this),
		WhereNode: this.visitWhere.bind(this),
		InsertQueryNode: this.visitInsertQuery.bind(this),
		DeleteQueryNode: this.visitDeleteQuery.bind(this),
		ReturningNode: this.visitReturning.bind(this),
		CreateTableNode: this.visitCreateTable.bind(this),
		AddColumnNode: this.visitAddColumn.bind(this),
		ColumnDefinitionNode: this.visitColumnDefinition.bind(this),
		DropTableNode: this.visitDropTable.bind(this),
		DataTypeNode: this.visitDataType.bind(this),
		OrderByNode: this.visitOrderBy.bind(this),
		OrderByItemNode: this.visitOrderByItem.bind(this),
		GroupByNode: this.visitGroupBy.bind(this),
		GroupByItemNode: this.visitGroupByItem.bind(this),
		UpdateQueryNode: this.visitUpdateQuery.bind(this),
		ColumnUpdateNode: this.visitColumnUpdate.bind(this),
		LimitNode: this.visitLimit.bind(this),
		OffsetNode: this.visitOffset.bind(this),
		OnConflictNode: this.visitOnConflict.bind(this),
		OnDuplicateKeyNode: this.visitOnDuplicateKey.bind(this),
		CreateIndexNode: this.visitCreateIndex.bind(this),
		DropIndexNode: this.visitDropIndex.bind(this),
		ListNode: this.visitList.bind(this),
		PrimaryKeyConstraintNode: this.visitPrimaryKeyConstraint.bind(this),
		UniqueConstraintNode: this.visitUniqueConstraint.bind(this),
		ReferencesNode: this.visitReferences.bind(this),
		CheckConstraintNode: this.visitCheckConstraint.bind(this),
		WithNode: this.visitWith.bind(this),
		CommonTableExpressionNode: this.visitCommonTableExpression.bind(this),
		CommonTableExpressionNameNode: this.visitCommonTableExpressionName.bind(this),
		HavingNode: this.visitHaving.bind(this),
		CreateSchemaNode: this.visitCreateSchema.bind(this),
		DropSchemaNode: this.visitDropSchema.bind(this),
		AlterTableNode: this.visitAlterTable.bind(this),
		DropColumnNode: this.visitDropColumn.bind(this),
		RenameColumnNode: this.visitRenameColumn.bind(this),
		AlterColumnNode: this.visitAlterColumn.bind(this),
		ModifyColumnNode: this.visitModifyColumn.bind(this),
		AddConstraintNode: this.visitAddConstraint.bind(this),
		DropConstraintNode: this.visitDropConstraint.bind(this),
		RenameConstraintNode: this.visitRenameConstraint.bind(this),
		ForeignKeyConstraintNode: this.visitForeignKeyConstraint.bind(this),
		CreateViewNode: this.visitCreateView.bind(this),
		RefreshMaterializedViewNode: this.visitRefreshMaterializedView.bind(this),
		DropViewNode: this.visitDropView.bind(this),
		GeneratedNode: this.visitGenerated.bind(this),
		DefaultValueNode: this.visitDefaultValue.bind(this),
		OnNode: this.visitOn.bind(this),
		ValuesNode: this.visitValues.bind(this),
		SelectModifierNode: this.visitSelectModifier.bind(this),
		CreateTypeNode: this.visitCreateType.bind(this),
		DropTypeNode: this.visitDropType.bind(this),
		ExplainNode: this.visitExplain.bind(this),
		DefaultInsertValueNode: this.visitDefaultInsertValue.bind(this),
		AggregateFunctionNode: this.visitAggregateFunction.bind(this),
		OverNode: this.visitOver.bind(this),
		PartitionByNode: this.visitPartitionBy.bind(this),
		PartitionByItemNode: this.visitPartitionByItem.bind(this),
		SetOperationNode: this.visitSetOperation.bind(this),
		BinaryOperationNode: this.visitBinaryOperation.bind(this),
		UnaryOperationNode: this.visitUnaryOperation.bind(this),
		UsingNode: this.visitUsing.bind(this),
		FunctionNode: this.visitFunction.bind(this),
		CaseNode: this.visitCase.bind(this),
		WhenNode: this.visitWhen.bind(this),
		JSONReferenceNode: this.visitJSONReference.bind(this),
		JSONPathNode: this.visitJSONPath.bind(this),
		JSONPathLegNode: this.visitJSONPathLeg.bind(this),
		JSONOperatorChainNode: this.visitJSONOperatorChain.bind(this),
		TupleNode: this.visitTuple.bind(this),
		MergeQueryNode: this.visitMergeQuery.bind(this),
		MatchedNode: this.visitMatched.bind(this),
		AddIndexNode: this.visitAddIndex.bind(this),
		CastNode: this.visitCast.bind(this),
		FetchNode: this.visitFetch.bind(this),
		TopNode: this.visitTop.bind(this),
		OutputNode: this.visitOutput.bind(this),
		OrActionNode: this.visitOrAction.bind(this),
		CollateNode: this.visitCollate.bind(this),
		AlterTypeNode: this.visitAlterType.bind(this),
		AddValueNode: this.visitAddValue.bind(this),
		RenameValueNode: this.visitRenameValue.bind(this)
	});
	visitNode = (node) => {
		this.nodeStack.push(node);
		this.#visitors[node.kind](node);
		this.nodeStack.pop();
	};
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/query-compiler/default-query-compiler.js
var LIT_WRAP_REGEX = /'/g;
var JSON_PATH_MEMBER_WRAP_REGEX = /['"]/g;
var DefaultQueryCompiler = class extends OperationNodeVisitor {
	#sql = "";
	#parameters = [];
	get numParameters() {
		return this.#parameters.length;
	}
	compileQuery(node, queryId) {
		this.#sql = "";
		this.#parameters = [];
		this.nodeStack.splice(0, this.nodeStack.length);
		this.visitNode(node);
		return freeze({
			query: node,
			queryId,
			sql: this.getSql(),
			parameters: [...this.#parameters]
		});
	}
	getSql() {
		return this.#sql;
	}
	visitSelectQuery(node) {
		const wrapInParens = this.parentNode !== void 0 && !ParensNode.is(this.parentNode) && !InsertQueryNode.is(this.parentNode) && !CreateTableNode.is(this.parentNode) && !CreateViewNode.is(this.parentNode) && !SetOperationNode.is(this.parentNode);
		if (this.parentNode === void 0 && node.explain) {
			this.visitNode(node.explain);
			this.append(" ");
		}
		if (wrapInParens) this.append("(");
		if (node.with) {
			this.visitNode(node.with);
			this.append(" ");
		}
		this.append("select");
		if (node.distinctOn) {
			this.append(" ");
			this.compileDistinctOn(node.distinctOn);
		}
		if (node.frontModifiers?.length) {
			this.append(" ");
			this.compileList(node.frontModifiers, " ");
		}
		if (node.top) {
			this.append(" ");
			this.visitNode(node.top);
		}
		if (node.selections) {
			this.append(" ");
			this.compileList(node.selections);
		}
		if (node.from) {
			this.append(" ");
			this.visitNode(node.from);
		}
		if (node.joins) {
			this.append(" ");
			this.compileList(node.joins, " ");
		}
		if (node.where) {
			this.append(" ");
			this.visitNode(node.where);
		}
		if (node.groupBy) {
			this.append(" ");
			this.visitNode(node.groupBy);
		}
		if (node.having) {
			this.append(" ");
			this.visitNode(node.having);
		}
		if (node.setOperations) {
			this.append(" ");
			this.compileList(node.setOperations, " ");
		}
		if (node.orderBy) {
			this.append(" ");
			this.visitNode(node.orderBy);
		}
		if (node.limit) {
			this.append(" ");
			this.visitNode(node.limit);
		}
		if (node.offset) {
			this.append(" ");
			this.visitNode(node.offset);
		}
		if (node.fetch) {
			this.append(" ");
			this.visitNode(node.fetch);
		}
		if (node.endModifiers?.length) {
			this.append(" ");
			this.compileList(this.sortSelectModifiers(node.endModifiers), " ");
		}
		if (wrapInParens) this.append(")");
	}
	visitFrom(node) {
		this.append("from ");
		this.compileList(node.froms);
	}
	visitSelection(node) {
		this.visitNode(node.selection);
	}
	visitColumn(node) {
		this.visitNode(node.column);
	}
	compileDistinctOn(expressions) {
		this.append("distinct on (");
		this.compileList(expressions);
		this.append(")");
	}
	compileList(nodes, separator = ", ") {
		const lastIndex = nodes.length - 1;
		for (let i = 0; i <= lastIndex; i++) {
			this.visitNode(nodes[i]);
			if (i < lastIndex) this.append(separator);
		}
	}
	visitWhere(node) {
		this.append("where ");
		this.visitNode(node.where);
	}
	visitHaving(node) {
		this.append("having ");
		this.visitNode(node.having);
	}
	visitInsertQuery(node) {
		const wrapInParens = this.parentNode !== void 0 && !ParensNode.is(this.parentNode) && !RawNode.is(this.parentNode) && !WhenNode.is(this.parentNode);
		if (this.parentNode === void 0 && node.explain) {
			this.visitNode(node.explain);
			this.append(" ");
		}
		if (wrapInParens) this.append("(");
		if (node.with) {
			this.visitNode(node.with);
			this.append(" ");
		}
		this.append(node.replace ? "replace" : "insert");
		if (node.orAction) {
			this.append(" ");
			this.visitNode(node.orAction);
		}
		if (node.top) {
			this.append(" ");
			this.visitNode(node.top);
		}
		if (node.into) {
			this.append(" into ");
			this.visitNode(node.into);
		}
		if (node.columns) {
			this.append(" (");
			this.compileList(node.columns);
			this.append(")");
		}
		if (node.output) {
			this.append(" ");
			this.visitNode(node.output);
		}
		if (node.values) {
			this.append(" ");
			this.visitNode(node.values);
		}
		if (node.defaultValues) {
			this.append(" ");
			this.append("default values");
		}
		if (node.onConflict) {
			this.append(" ");
			this.visitNode(node.onConflict);
		}
		if (node.onDuplicateKey) {
			this.append(" ");
			this.visitNode(node.onDuplicateKey);
		}
		if (node.returning) {
			this.append(" ");
			this.visitNode(node.returning);
		}
		if (wrapInParens) this.append(")");
		if (node.endModifiers?.length) {
			this.append(" ");
			this.compileList(node.endModifiers, " ");
		}
	}
	visitValues(node) {
		this.append("values ");
		this.compileList(node.values);
	}
	visitDeleteQuery(node) {
		const wrapInParens = this.parentNode !== void 0 && !ParensNode.is(this.parentNode) && !RawNode.is(this.parentNode);
		if (this.parentNode === void 0 && node.explain) {
			this.visitNode(node.explain);
			this.append(" ");
		}
		if (wrapInParens) this.append("(");
		if (node.with) {
			this.visitNode(node.with);
			this.append(" ");
		}
		this.append("delete ");
		if (node.top) {
			this.visitNode(node.top);
			this.append(" ");
		}
		this.visitNode(node.from);
		if (node.output) {
			this.append(" ");
			this.visitNode(node.output);
		}
		if (node.using) {
			this.append(" ");
			this.visitNode(node.using);
		}
		if (node.joins) {
			this.append(" ");
			this.compileList(node.joins, " ");
		}
		if (node.where) {
			this.append(" ");
			this.visitNode(node.where);
		}
		if (node.returning) {
			this.append(" ");
			this.visitNode(node.returning);
		}
		if (node.orderBy) {
			this.append(" ");
			this.visitNode(node.orderBy);
		}
		if (node.limit) {
			this.append(" ");
			this.visitNode(node.limit);
		}
		if (wrapInParens) this.append(")");
		if (node.endModifiers?.length) {
			this.append(" ");
			this.compileList(node.endModifiers, " ");
		}
	}
	visitReturning(node) {
		this.append("returning ");
		this.compileList(node.selections);
	}
	visitAlias(node) {
		this.visitNode(node.node);
		this.append(" as ");
		this.visitNode(node.alias);
	}
	visitReference(node) {
		if (node.table) {
			this.visitNode(node.table);
			this.append(".");
		}
		this.visitNode(node.column);
	}
	visitSelectAll(_) {
		this.append("*");
	}
	visitIdentifier(node) {
		this.append(this.getLeftIdentifierWrapper());
		this.compileUnwrappedIdentifier(node);
		this.append(this.getRightIdentifierWrapper());
	}
	compileUnwrappedIdentifier(node) {
		if (!isString(node.name)) throw new Error("a non-string identifier was passed to compileUnwrappedIdentifier.");
		this.append(this.sanitizeIdentifier(node.name));
	}
	visitAnd(node) {
		this.visitNode(node.left);
		this.append(" and ");
		this.visitNode(node.right);
	}
	visitOr(node) {
		this.visitNode(node.left);
		this.append(" or ");
		this.visitNode(node.right);
	}
	visitValue(node) {
		if (node.immediate) this.appendImmediateValue(node.value);
		else this.appendValue(node.value);
	}
	visitValueList(node) {
		this.append("(");
		this.compileList(node.values);
		this.append(")");
	}
	visitTuple(node) {
		this.append("(");
		this.compileList(node.values);
		this.append(")");
	}
	visitPrimitiveValueList(node) {
		this.append("(");
		const { values } = node;
		for (let i = 0; i < values.length; ++i) {
			this.appendValue(values[i]);
			if (i !== values.length - 1) this.append(", ");
		}
		this.append(")");
	}
	visitParens(node) {
		this.append("(");
		this.visitNode(node.node);
		this.append(")");
	}
	visitJoin(node) {
		this.append(JOIN_TYPE_SQL[node.joinType]);
		this.append(" ");
		this.visitNode(node.table);
		if (node.on) {
			this.append(" ");
			this.visitNode(node.on);
		}
	}
	visitOn(node) {
		this.append("on ");
		this.visitNode(node.on);
	}
	visitRaw(node) {
		const { sqlFragments, parameters: params } = node;
		for (let i = 0; i < sqlFragments.length; ++i) {
			this.append(sqlFragments[i]);
			if (params.length > i) this.visitNode(params[i]);
		}
	}
	visitOperator(node) {
		this.append(node.operator);
	}
	visitTable(node) {
		this.visitNode(node.table);
	}
	visitSchemableIdentifier(node) {
		if (node.schema) {
			this.visitNode(node.schema);
			this.append(".");
		}
		this.visitNode(node.identifier);
	}
	visitCreateTable(node) {
		this.append("create ");
		if (node.frontModifiers?.length) {
			this.compileList(node.frontModifiers, " ");
			this.append(" ");
		}
		if (node.temporary) this.append("temporary ");
		this.append("table ");
		if (node.ifNotExists) this.append("if not exists ");
		this.visitNode(node.table);
		if (!node.selectQuery) {
			this.append(" (");
			this.compileList([
				...node.columns,
				...node.constraints ?? [],
				...node.indexes ?? []
			]);
			this.append(")");
		}
		if (node.onCommit) {
			this.append(" on commit ");
			this.append(node.onCommit);
		}
		if (node.endModifiers?.length) {
			this.append(" ");
			this.compileList(node.endModifiers, " ");
		}
		if (node.selectQuery) {
			this.append(" as ");
			this.visitNode(node.selectQuery);
		}
	}
	visitColumnDefinition(node) {
		if (node.ifNotExists) this.append("if not exists ");
		this.visitNode(node.column);
		this.append(" ");
		this.visitNode(node.dataType);
		if (node.unsigned) this.append(" unsigned");
		if (node.frontModifiers && node.frontModifiers.length > 0) {
			this.append(" ");
			this.compileList(node.frontModifiers, " ");
		}
		if (node.generated) {
			this.append(" ");
			this.visitNode(node.generated);
		}
		if (node.identity) this.append(" identity");
		if (node.defaultTo) {
			this.append(" ");
			this.visitNode(node.defaultTo);
		}
		if (node.notNull) this.append(" not null");
		if (node.unique) this.append(" unique");
		if (node.nullsNotDistinct) this.append(" nulls not distinct");
		if (node.primaryKey) this.append(" primary key");
		if (node.autoIncrement) {
			this.append(" ");
			this.append(this.getAutoIncrement());
		}
		if (node.references) {
			this.append(" ");
			this.visitNode(node.references);
		}
		if (node.check) {
			this.append(" ");
			this.visitNode(node.check);
		}
		if (node.endModifiers && node.endModifiers.length > 0) {
			this.append(" ");
			this.compileList(node.endModifiers, " ");
		}
	}
	getAutoIncrement() {
		return "auto_increment";
	}
	visitReferences(node) {
		this.append("references ");
		this.visitNode(node.table);
		this.append(" (");
		this.compileList(node.columns);
		this.append(")");
		if (node.onDelete) {
			this.append(" on delete ");
			this.append(node.onDelete);
		}
		if (node.onUpdate) {
			this.append(" on update ");
			this.append(node.onUpdate);
		}
	}
	visitDropTable(node) {
		this.append("drop ");
		if (node.temporary) this.append("temporary ");
		this.append("table ");
		if (node.ifExists) this.append("if exists ");
		this.visitNode(node.table);
		if (node.cascade) this.append(" cascade");
	}
	visitDataType(node) {
		this.append(node.dataType);
	}
	visitOrderBy(node) {
		this.append("order by ");
		this.compileList(node.items);
	}
	visitOrderByItem(node) {
		this.visitNode(node.orderBy);
		if (node.collation) {
			this.append(" ");
			this.visitNode(node.collation);
		}
		if (node.direction) {
			this.append(" ");
			this.visitNode(node.direction);
		}
		if (node.nulls) {
			this.append(" nulls ");
			this.append(node.nulls);
		}
	}
	visitGroupBy(node) {
		this.append("group by ");
		this.compileList(node.items);
	}
	visitGroupByItem(node) {
		this.visitNode(node.groupBy);
	}
	visitUpdateQuery(node) {
		const wrapInParens = this.parentNode !== void 0 && !ParensNode.is(this.parentNode) && !RawNode.is(this.parentNode) && !WhenNode.is(this.parentNode);
		if (this.parentNode === void 0 && node.explain) {
			this.visitNode(node.explain);
			this.append(" ");
		}
		if (wrapInParens) this.append("(");
		if (node.with) {
			this.visitNode(node.with);
			this.append(" ");
		}
		this.append("update ");
		if (node.top) {
			this.visitNode(node.top);
			this.append(" ");
		}
		if (node.table) {
			this.visitNode(node.table);
			this.append(" ");
		}
		this.append("set ");
		if (node.updates) this.compileList(node.updates);
		if (node.output) {
			this.append(" ");
			this.visitNode(node.output);
		}
		if (node.from) {
			this.append(" ");
			this.visitNode(node.from);
		}
		if (node.joins) {
			if (!node.from) throw new Error("Joins in an update query are only supported as a part of a PostgreSQL 'update set from join' query. If you want to create a MySQL 'update join set' query, see https://kysely.dev/docs/examples/update/my-sql-joins");
			this.append(" ");
			this.compileList(node.joins, " ");
		}
		if (node.where) {
			this.append(" ");
			this.visitNode(node.where);
		}
		if (node.returning) {
			this.append(" ");
			this.visitNode(node.returning);
		}
		if (node.orderBy) {
			this.append(" ");
			this.visitNode(node.orderBy);
		}
		if (node.limit) {
			this.append(" ");
			this.visitNode(node.limit);
		}
		if (wrapInParens) this.append(")");
		if (node.endModifiers?.length) {
			this.append(" ");
			this.compileList(node.endModifiers, " ");
		}
	}
	visitColumnUpdate(node) {
		this.visitNode(node.column);
		this.append(" = ");
		this.visitNode(node.value);
	}
	visitLimit(node) {
		this.append("limit ");
		this.visitNode(node.limit);
	}
	visitOffset(node) {
		this.append("offset ");
		this.visitNode(node.offset);
	}
	visitOnConflict(node) {
		this.append("on conflict");
		if (node.columns) {
			this.append(" (");
			this.compileList(node.columns);
			this.append(")");
		} else if (node.constraint) {
			this.append(" on constraint ");
			this.visitNode(node.constraint);
		} else if (node.indexExpression) {
			this.append(" (");
			this.visitNode(node.indexExpression);
			this.append(")");
		}
		if (node.indexWhere) {
			this.append(" ");
			this.visitNode(node.indexWhere);
		}
		if (node.doNothing === true) this.append(" do nothing");
		else if (node.updates) {
			this.append(" do update set ");
			this.compileList(node.updates);
			if (node.updateWhere) {
				this.append(" ");
				this.visitNode(node.updateWhere);
			}
		}
	}
	visitOnDuplicateKey(node) {
		this.append("on duplicate key update ");
		this.compileList(node.updates);
	}
	visitCreateIndex(node) {
		this.append("create ");
		if (node.unique) this.append("unique ");
		this.append("index ");
		if (node.ifNotExists) this.append("if not exists ");
		this.visitNode(node.name);
		if (node.table) {
			this.append(" on ");
			this.visitNode(node.table);
		}
		if (node.using) {
			this.append(" using ");
			this.visitNode(node.using);
		}
		if (node.columns) {
			this.append(" (");
			this.compileList(node.columns);
			this.append(")");
		}
		if (node.nullsNotDistinct) this.append(" nulls not distinct");
		if (node.where) {
			this.append(" ");
			this.visitNode(node.where);
		}
	}
	visitDropIndex(node) {
		this.append("drop index ");
		if (node.ifExists) this.append("if exists ");
		this.visitNode(node.name);
		if (node.table) {
			this.append(" on ");
			this.visitNode(node.table);
		}
		if (node.cascade) this.append(" cascade");
	}
	visitCreateSchema(node) {
		this.append("create schema ");
		if (node.ifNotExists) this.append("if not exists ");
		this.visitNode(node.schema);
	}
	visitDropSchema(node) {
		this.append("drop schema ");
		if (node.ifExists) this.append("if exists ");
		this.visitNode(node.schema);
		if (node.cascade) this.append(" cascade");
	}
	visitPrimaryKeyConstraint(node) {
		if (node.name) {
			this.append("constraint ");
			this.visitNode(node.name);
			this.append(" ");
		}
		this.append("primary key (");
		this.compileList(node.columns);
		this.append(")");
		this.buildDeferrable(node);
	}
	buildDeferrable(node) {
		if (node.deferrable !== void 0) {
			if (node.deferrable) this.append(" deferrable");
			else this.append(" not deferrable");
		}
		if (node.initiallyDeferred !== void 0) {
			if (node.initiallyDeferred) this.append(" initially deferred");
			else this.append(" initially immediate");
		}
	}
	visitUniqueConstraint(node) {
		if (node.name) {
			this.append("constraint ");
			this.visitNode(node.name);
			this.append(" ");
		}
		this.append("unique");
		if (node.nullsNotDistinct) this.append(" nulls not distinct");
		this.append(" (");
		this.compileList(node.columns);
		this.append(")");
		this.buildDeferrable(node);
	}
	visitCheckConstraint(node) {
		if (node.name) {
			this.append("constraint ");
			this.visitNode(node.name);
			this.append(" ");
		}
		this.append("check (");
		this.visitNode(node.expression);
		this.append(")");
	}
	visitForeignKeyConstraint(node) {
		if (node.name) {
			this.append("constraint ");
			this.visitNode(node.name);
			this.append(" ");
		}
		this.append("foreign key (");
		this.compileList(node.columns);
		this.append(") ");
		this.visitNode(node.references);
		if (node.onDelete) {
			this.append(" on delete ");
			this.append(node.onDelete);
		}
		if (node.onUpdate) {
			this.append(" on update ");
			this.append(node.onUpdate);
		}
		this.buildDeferrable(node);
	}
	visitList(node) {
		this.compileList(node.items);
	}
	visitWith(node) {
		this.append("with ");
		if (node.recursive) this.append("recursive ");
		this.compileList(node.expressions);
	}
	visitCommonTableExpression(node) {
		this.visitNode(node.name);
		this.append(" as ");
		if (isBoolean(node.materialized)) {
			if (!node.materialized) this.append("not ");
			this.append("materialized ");
		}
		this.visitNode(node.expression);
	}
	visitCommonTableExpressionName(node) {
		this.visitNode(node.table);
		if (node.columns) {
			this.append("(");
			this.compileList(node.columns);
			this.append(")");
		}
	}
	visitAlterTable(node) {
		this.append("alter table ");
		this.visitNode(node.table);
		this.append(" ");
		if (node.renameTo) {
			this.append("rename to ");
			this.visitNode(node.renameTo);
		}
		if (node.setSchema) {
			this.append("set schema ");
			this.visitNode(node.setSchema);
		}
		if (node.addConstraint) this.visitNode(node.addConstraint);
		if (node.dropConstraint) this.visitNode(node.dropConstraint);
		if (node.renameConstraint) this.visitNode(node.renameConstraint);
		if (node.columnAlterations) this.compileColumnAlterations(node.columnAlterations);
		if (node.addIndex) this.visitNode(node.addIndex);
		if (node.dropIndex) this.visitNode(node.dropIndex);
	}
	visitAddColumn(node) {
		this.append("add column ");
		this.visitNode(node.column);
	}
	visitRenameColumn(node) {
		this.append("rename column ");
		this.visitNode(node.column);
		this.append(" to ");
		this.visitNode(node.renameTo);
	}
	visitDropColumn(node) {
		this.append("drop column ");
		if (node.ifExists) this.append("if exists ");
		this.visitNode(node.column);
	}
	visitAlterColumn(node) {
		this.append("alter column ");
		this.visitNode(node.column);
		this.append(" ");
		if (node.dataType) {
			if (this.announcesNewColumnDataType()) this.append("type ");
			this.visitNode(node.dataType);
			if (node.dataTypeExpression) {
				this.append("using ");
				this.visitNode(node.dataTypeExpression);
			}
		}
		if (node.setDefault) {
			this.append("set default ");
			this.visitNode(node.setDefault);
		}
		if (node.dropDefault) this.append("drop default");
		if (node.setNotNull) this.append("set not null");
		if (node.dropNotNull) this.append("drop not null");
	}
	visitModifyColumn(node) {
		this.append("modify column ");
		this.visitNode(node.column);
	}
	visitAddConstraint(node) {
		this.append("add ");
		this.visitNode(node.constraint);
	}
	visitDropConstraint(node) {
		this.append("drop constraint ");
		if (node.ifExists) this.append("if exists ");
		this.visitNode(node.constraintName);
		if (node.modifier === "cascade") this.append(" cascade");
		else if (node.modifier === "restrict") this.append(" restrict");
	}
	visitRenameConstraint(node) {
		this.append("rename constraint ");
		this.visitNode(node.oldName);
		this.append(" to ");
		this.visitNode(node.newName);
	}
	visitSetOperation(node) {
		this.append(node.operator);
		this.append(" ");
		if (node.all) this.append("all ");
		this.visitNode(node.expression);
	}
	visitCreateView(node) {
		this.append("create ");
		if (node.orReplace) this.append("or replace ");
		if (node.materialized) this.append("materialized ");
		if (node.temporary) this.append("temporary ");
		this.append("view ");
		if (node.ifNotExists) this.append("if not exists ");
		this.visitNode(node.name);
		this.append(" ");
		if (node.columns) {
			this.append("(");
			this.compileList(node.columns);
			this.append(") ");
		}
		if (node.as) {
			this.append("as ");
			this.visitNode(node.as);
		}
	}
	visitRefreshMaterializedView(node) {
		this.append("refresh materialized view ");
		if (node.concurrently) this.append("concurrently ");
		this.visitNode(node.name);
		if (node.withNoData) this.append(" with no data");
		else this.append(" with data");
	}
	visitDropView(node) {
		this.append("drop ");
		if (node.materialized) this.append("materialized ");
		this.append("view ");
		if (node.ifExists) this.append("if exists ");
		this.visitNode(node.name);
		if (node.cascade) this.append(" cascade");
	}
	visitGenerated(node) {
		this.append("generated ");
		if (node.always) this.append("always ");
		if (node.byDefault) this.append("by default ");
		this.append("as ");
		if (node.identity) this.append("identity");
		if (node.expression) {
			this.append("(");
			this.visitNode(node.expression);
			this.append(")");
		}
		if (node.stored) this.append(" stored");
	}
	visitDefaultValue(node) {
		this.append("default ");
		this.visitNode(node.defaultValue);
	}
	visitSelectModifier(node) {
		if (node.rawModifier) this.visitNode(node.rawModifier);
		else this.append(SELECT_MODIFIER_SQL[node.modifier]);
		if (node.of) {
			this.append(" of ");
			this.compileList(node.of, ", ");
		}
	}
	visitCreateType(node) {
		this.append("create type ");
		this.visitNode(node.name);
		if (node.enum) {
			this.append(" as enum ");
			this.visitNode(node.enum);
		}
	}
	visitDropType(node) {
		this.append("drop type ");
		if (node.ifExists) this.append("if exists ");
		this.visitNode(node.name);
		if (node.additionalNames?.length) {
			this.append(", ");
			this.compileList(node.additionalNames);
		}
		if (node.cascade) this.append(" cascade");
	}
	visitAlterType(node) {
		this.append("alter type ");
		this.visitNode(node.name);
		this.append(" ");
		if (node.addValue) this.visitNode(node.addValue);
		else if (node.renameTo) {
			this.append("rename to ");
			this.visitNode(node.renameTo);
		} else if (node.renameValue) this.visitNode(node.renameValue);
		else if (node.setSchema) {
			this.append("set schema ");
			this.visitNode(node.setSchema);
		}
	}
	visitAddValue(node) {
		this.append("add value ");
		if (node.ifNotExists) this.append("if not exists ");
		this.visitNode(node.value);
		if (node.neighborValue) {
			this.append(node.isBefore ? " before " : " after ");
			this.visitNode(node.neighborValue);
		}
	}
	visitRenameValue(node) {
		this.append("rename value ");
		this.visitNode(node.oldValue);
		this.append(" to ");
		this.visitNode(node.newValue);
	}
	visitExplain(node) {
		this.append("explain");
		if (node.options || node.format) {
			this.append(" ");
			this.append(this.getLeftExplainOptionsWrapper());
			if (node.options) {
				this.visitNode(node.options);
				if (node.format) this.append(this.getExplainOptionsDelimiter());
			}
			if (node.format) {
				this.append("format");
				this.append(this.getExplainOptionAssignment());
				this.append(node.format);
			}
			this.append(this.getRightExplainOptionsWrapper());
		}
	}
	visitDefaultInsertValue(_) {
		this.append("default");
	}
	visitAggregateFunction(node) {
		this.append(node.func);
		this.append("(");
		if (node.distinct) this.append("distinct ");
		this.compileList(node.aggregated);
		if (node.orderBy) {
			this.append(" ");
			this.visitNode(node.orderBy);
		}
		this.append(")");
		if (node.withinGroup) {
			this.append(" within group (");
			this.visitNode(node.withinGroup);
			this.append(")");
		}
		if (node.filter) {
			this.append(" filter(");
			this.visitNode(node.filter);
			this.append(")");
		}
		if (node.over) {
			this.append(" ");
			this.visitNode(node.over);
		}
	}
	visitOver(node) {
		this.append("over(");
		if (node.partitionBy) {
			this.visitNode(node.partitionBy);
			if (node.orderBy) this.append(" ");
		}
		if (node.orderBy) this.visitNode(node.orderBy);
		this.append(")");
	}
	visitPartitionBy(node) {
		this.append("partition by ");
		this.compileList(node.items);
	}
	visitPartitionByItem(node) {
		this.visitNode(node.partitionBy);
	}
	visitBinaryOperation(node) {
		this.visitNode(node.leftOperand);
		this.append(" ");
		this.visitNode(node.operator);
		this.append(" ");
		this.visitNode(node.rightOperand);
	}
	visitUnaryOperation(node) {
		this.visitNode(node.operator);
		if (!this.isMinusOperator(node.operator)) this.append(" ");
		this.visitNode(node.operand);
	}
	isMinusOperator(node) {
		return OperatorNode.is(node) && node.operator === "-";
	}
	visitUsing(node) {
		this.append("using ");
		this.compileList(node.tables);
	}
	visitFunction(node) {
		this.append(node.func);
		this.append("(");
		this.compileList(node.arguments);
		this.append(")");
	}
	visitCase(node) {
		this.append("case");
		if (node.value) {
			this.append(" ");
			this.visitNode(node.value);
		}
		if (node.when) {
			this.append(" ");
			this.compileList(node.when, " ");
		}
		if (node.else) {
			this.append(" else ");
			this.visitNode(node.else);
		}
		this.append(" end");
		if (node.isStatement) this.append(" case");
	}
	visitWhen(node) {
		this.append("when ");
		this.visitNode(node.condition);
		if (node.result) {
			this.append(" then ");
			this.visitNode(node.result);
		}
	}
	visitJSONReference(node) {
		this.visitNode(node.reference);
		this.visitNode(node.traversal);
	}
	visitJSONPath(node) {
		if (node.inOperator) this.visitNode(node.inOperator);
		this.append("'$");
		for (const pathLeg of node.pathLegs) this.visitNode(pathLeg);
		this.append("'");
	}
	visitJSONPathLeg(node) {
		const isArrayLocation = node.type === "ArrayLocation";
		const value = String(node.value);
		if (isArrayLocation) {
			this.append("[");
			this.append(this.sanitizeStringLiteral(value));
			this.append("]");
		} else {
			this.append(".\"");
			this.append(this.sanitizeJSONPathMemberValue(value));
			this.append("\"");
		}
	}
	visitJSONOperatorChain(node) {
		for (let i = 0, len = node.values.length; i < len; i++) {
			if (i === len - 1) this.visitNode(node.operator);
			else this.append("->");
			this.visitNode(node.values[i]);
		}
	}
	visitMergeQuery(node) {
		if (node.with) {
			this.visitNode(node.with);
			this.append(" ");
		}
		this.append("merge ");
		if (node.top) {
			this.visitNode(node.top);
			this.append(" ");
		}
		this.append("into ");
		this.visitNode(node.into);
		if (node.using) {
			this.append(" ");
			this.visitNode(node.using);
		}
		if (node.whens) {
			this.append(" ");
			this.compileList(node.whens, " ");
		}
		if (node.returning) {
			this.append(" ");
			this.visitNode(node.returning);
		}
		if (node.output) {
			this.append(" ");
			this.visitNode(node.output);
		}
		if (node.endModifiers?.length) {
			this.append(" ");
			this.compileList(node.endModifiers, " ");
		}
	}
	visitMatched(node) {
		if (node.not) this.append("not ");
		this.append("matched");
		if (node.bySource) this.append(" by source");
	}
	visitAddIndex(node) {
		if (!this.parentNode || !CreateTableNode.is(this.parentNode)) this.append("add ");
		if (node.unique) this.append("unique ");
		this.append("index ");
		this.visitNode(node.name);
		if (node.columns) {
			this.append(" (");
			this.compileList(node.columns);
			this.append(")");
		}
		if (node.using) {
			this.append(" using ");
			this.visitNode(node.using);
		}
	}
	visitCast(node) {
		this.append("cast(");
		this.visitNode(node.expression);
		this.append(" as ");
		this.visitNode(node.dataType);
		this.append(")");
	}
	visitFetch(node) {
		this.append("fetch next ");
		this.visitNode(node.rowCount);
		this.append(` rows ${node.modifier}`);
	}
	visitOutput(node) {
		this.append("output ");
		this.compileList(node.selections);
	}
	visitTop(node) {
		this.append(`top(${node.expression})`);
		if (node.modifiers) this.append(` ${node.modifiers}`);
	}
	visitOrAction(node) {
		this.append(node.action);
	}
	visitCollate(node) {
		this.append("collate ");
		this.visitNode(node.collation);
	}
	append(str) {
		this.#sql += str;
	}
	appendValue(parameter) {
		this.addParameter(parameter);
		this.append(this.getCurrentParameterPlaceholder());
	}
	getLeftIdentifierWrapper() {
		return "\"";
	}
	getRightIdentifierWrapper() {
		return "\"";
	}
	getCurrentParameterPlaceholder() {
		return "$" + this.numParameters;
	}
	getLeftExplainOptionsWrapper() {
		return "(";
	}
	getExplainOptionAssignment() {
		return " ";
	}
	getExplainOptionsDelimiter() {
		return ", ";
	}
	getRightExplainOptionsWrapper() {
		return ")";
	}
	sanitizeIdentifier(identifier) {
		const leftWrap = this.getLeftIdentifierWrapper();
		const rightWrap = this.getRightIdentifierWrapper();
		let sanitized = "";
		for (const c of identifier) {
			sanitized += c;
			if (c === leftWrap) sanitized += leftWrap;
			else if (c === rightWrap) sanitized += rightWrap;
		}
		return sanitized;
	}
	sanitizeStringLiteral(value) {
		return value.replace(LIT_WRAP_REGEX, "''");
	}
	sanitizeJSONPathMemberValue(value) {
		return value.replace(JSON_PATH_MEMBER_WRAP_REGEX, (char) => char === "'" ? "''" : "\\\"");
	}
	addParameter(parameter) {
		this.#parameters.push(parameter);
	}
	appendImmediateValue(value) {
		if (isString(value)) this.appendStringLiteral(value);
		else if (isNumber(value) || isBoolean(value) || isBigInt(value)) this.append(value.toString());
		else if (isNull(value)) this.append("null");
		else if (isDate(value)) this.appendImmediateValue(value.toISOString());
		else throw new Error(`invalid immediate value ${value}`);
	}
	appendStringLiteral(value) {
		this.append("'");
		this.append(this.sanitizeStringLiteral(value));
		this.append("'");
	}
	sortSelectModifiers(arr) {
		return freeze(arr.toSorted((left, right) => left.modifier && right.modifier ? SELECT_MODIFIER_PRIORITY[left.modifier] - SELECT_MODIFIER_PRIORITY[right.modifier] : 1));
	}
	compileColumnAlterations(columnAlterations) {
		this.compileList(columnAlterations);
	}
	/**
	* controls whether the dialect adds a "type" keyword before a column's new data
	* type in an ALTER TABLE statement.
	*/
	announcesNewColumnDataType() {
		return true;
	}
};
var SELECT_MODIFIER_SQL = freeze({
	ForKeyShare: "for key share",
	ForNoKeyUpdate: "for no key update",
	ForUpdate: "for update",
	ForShare: "for share",
	NoWait: "nowait",
	SkipLocked: "skip locked",
	Distinct: "distinct"
});
var SELECT_MODIFIER_PRIORITY = freeze({
	ForKeyShare: 1,
	ForNoKeyUpdate: 1,
	ForUpdate: 1,
	ForShare: 1,
	NoWait: 2,
	SkipLocked: 2,
	Distinct: 0
});
var JOIN_TYPE_SQL = freeze({
	InnerJoin: "inner join",
	LeftJoin: "left join",
	RightJoin: "right join",
	FullJoin: "full join",
	CrossJoin: "cross join",
	LateralInnerJoin: "inner join lateral",
	LateralLeftJoin: "left join lateral",
	LateralCrossJoin: "cross join lateral",
	OuterApply: "outer apply",
	CrossApply: "cross apply",
	Using: "using"
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/query-compiler/compiled-query.js
var CompiledQuery = freeze({ raw(sql, parameters = []) {
	return freeze({
		sql,
		query: RawNode.createWithSql(sql),
		parameters: freeze(parameters),
		queryId: createQueryId()
	});
} });
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/parser/savepoint-parser.js
function parseSavepointCommand(command, savepointName) {
	return RawNode.createWithChildren([RawNode.createWithSql(`${command} `), IdentifierNode.create(savepointName)]);
}
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/dialect/sqlite/sqlite-driver.js
var SqliteDriver = class {
	#config;
	#db;
	#connection;
	constructor(config) {
		this.#config = freeze({ ...config });
	}
	async init(options) {
		this.#db = isFunction(this.#config.database) ? await this.#config.database(options) : this.#config.database;
		this.#connection = new SqliteConnection(this.#db);
		if (this.#config.onCreateConnection) await this.#config.onCreateConnection(this.#connection, options);
	}
	async acquireConnection() {
		return this.#connection;
	}
	async beginTransaction(connection) {
		await connection.executeQuery(CompiledQuery.raw("begin"));
	}
	async commitTransaction(connection) {
		await connection.executeQuery(CompiledQuery.raw("commit"));
	}
	async rollbackTransaction(connection) {
		await connection.executeQuery(CompiledQuery.raw("rollback"));
	}
	async savepoint(connection, savepointName, compileQuery) {
		await connection.executeQuery(compileQuery(parseSavepointCommand("savepoint", savepointName), createQueryId()));
	}
	async rollbackToSavepoint(connection, savepointName, compileQuery) {
		await connection.executeQuery(compileQuery(parseSavepointCommand("rollback to", savepointName), createQueryId()));
	}
	async releaseSavepoint(connection, savepointName, compileQuery) {
		await connection.executeQuery(compileQuery(parseSavepointCommand("release", savepointName), createQueryId()));
	}
	async releaseConnection() {}
	async destroy() {
		this.#db?.close();
	}
};
var SqliteConnection = class {
	#db;
	constructor(db) {
		this.#db = db;
	}
	async executeQuery(compiledQuery) {
		const { sql, parameters } = compiledQuery;
		const stmt = this.#db.prepare(sql);
		if (stmt.reader) return { rows: stmt.all(parameters) };
		const { changes, lastInsertRowid } = stmt.run(parameters);
		return {
			insertId: lastInsertRowid != null ? BigInt(lastInsertRowid) : void 0,
			numAffectedRows: changes != null ? BigInt(changes) : void 0,
			rows: []
		};
	}
	async *streamQuery(compiledQuery, _chunkSize) {
		const { sql, parameters, query } = compiledQuery;
		const stmt = this.#db.prepare(sql);
		if (!SelectQueryNode.is(query)) throw new Error("Sqlite driver only supports streaming of select queries");
		const iter = stmt.iterate(parameters);
		for (const row of iter) yield { rows: [row] };
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/dialect/sqlite/sqlite-query-compiler.js
var ID_WRAP_REGEX = /"/g;
var JSON_PATH_MEMBER_ESCAPE_REGEX = /[\\'"]/g;
var SqliteQueryCompiler = class extends DefaultQueryCompiler {
	visitOrAction(node) {
		this.append("or ");
		this.append(node.action);
	}
	getCurrentParameterPlaceholder() {
		return "?";
	}
	getLeftExplainOptionsWrapper() {
		return "";
	}
	getRightExplainOptionsWrapper() {
		return "";
	}
	getLeftIdentifierWrapper() {
		return "\"";
	}
	getRightIdentifierWrapper() {
		return "\"";
	}
	getAutoIncrement() {
		return "autoincrement";
	}
	sanitizeIdentifier(identifier) {
		return identifier.replace(ID_WRAP_REGEX, "\"\"");
	}
	sanitizeJSONPathMemberValue(value) {
		return value.replace(JSON_PATH_MEMBER_ESCAPE_REGEX, (char) => char === "\\" ? "\\\\" : char === "'" ? "''" : "\\\"");
	}
	visitDefaultInsertValue(_) {
		this.append("null");
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/dialect/sqlite/sqlite-introspector.js
var SqliteIntrospector = class {
	#db;
	constructor(db) {
		this.#db = db;
	}
	async getSchemas() {
		return [];
	}
	async getTables(options = { withInternalKyselyTables: false }) {
		return await this.#getTableMetadata(options);
	}
	#tablesQuery(qb, options) {
		let tablesQuery = qb.selectFrom("sqlite_master").where("type", "in", ["table", "view"]).where("name", "not like", "sqlite_%").select([
			"name",
			"sql",
			"type"
		]).orderBy("name");
		if (!options.withInternalKyselyTables) tablesQuery = tablesQuery.where("name", "!=", DEFAULT_MIGRATION_TABLE).where("name", "!=", DEFAULT_MIGRATION_LOCK_TABLE);
		return tablesQuery;
	}
	async #getTableMetadata(options) {
		const tablesResult = await this.#tablesQuery(this.#db, options).execute();
		const tableMetadata = await this.#db.with("table_list", (qb) => this.#tablesQuery(qb, options)).selectFrom(["table_list as tl", sql`pragma_table_info(tl.name)`.as("p")]).select([
			"tl.name as table",
			"p.cid",
			"p.name",
			"p.type",
			"p.notnull",
			"p.dflt_value",
			"p.pk"
		]).orderBy("tl.name").orderBy("p.cid").execute();
		const columnsByTable = {};
		for (const row of tableMetadata) {
			columnsByTable[row.table] ??= [];
			columnsByTable[row.table].push(row);
		}
		return tablesResult.map(({ name, sql, type }) => {
			let autoIncrementCol = sql?.split(/[\(\),]/)?.find((it) => it.toLowerCase().includes("autoincrement"))?.trimStart()?.split(/\s+/)?.[0]?.replace(/["`]/g, "");
			const columns = columnsByTable[name] ?? [];
			if (!autoIncrementCol) {
				const pkCols = columns.filter((r) => r.pk > 0);
				if (pkCols.length === 1 && pkCols[0].type.toLowerCase() === "integer") autoIncrementCol = pkCols[0].name;
			}
			return {
				name,
				isView: type === "view",
				isForeign: false,
				columns: columns.map((col) => ({
					name: col.name,
					dataType: col.type,
					isNullable: !col.notnull,
					isAutoIncrementing: col.name === autoIncrementCol,
					hasDefaultValue: col.dflt_value != null,
					comment: void 0
				}))
			};
		});
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/dialect/sqlite/sqlite-adapter.js
var SqliteAdapter = class extends DialectAdapterBase {
	get supportsMultipleConnections() {
		return false;
	}
	get supportsTransactionalDdl() {
		return false;
	}
	get supportsReturning() {
		return true;
	}
	async acquireMigrationLock(_db, _opt) {}
	async releaseMigrationLock(_db, _opt) {}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/dialect/sqlite/sqlite-dialect.js
/**
* SQLite dialect that uses the [better-sqlite3](https://github.com/JoshuaWise/better-sqlite3) library.
*
* The constructor takes an instance of {@link SqliteDialectConfig}.
*
* ```ts
* import Database from 'better-sqlite3'
*
* new SqliteDialect({
*   database: new Database('db.sqlite')
* })
* ```
*
* If you want the pool to only be created once it's first used, `database`
* can be a function:
*
* ```ts
* import Database from 'better-sqlite3'
*
* new SqliteDialect({
*   database: async () => new Database('db.sqlite')
* })
* ```
*/
var SqliteDialect = class {
	#config;
	constructor(config) {
		this.#config = freeze({ ...config });
	}
	createDriver() {
		return new SqliteDriver(this.#config);
	}
	createQueryCompiler() {
		return new SqliteQueryCompiler();
	}
	createAdapter() {
		return new SqliteAdapter();
	}
	createIntrospector(db) {
		return new SqliteIntrospector(db);
	}
};
//#endregion
//#region node_modules/.pnpm/better-sqlite3@12.11.1/node_modules/better-sqlite3/lib/util.js
var require_util = /* @__PURE__ */ __commonJSMin(((exports) => {
	exports.getBooleanOption = (options, key) => {
		let value = false;
		if (key in options && typeof (value = options[key]) !== "boolean") throw new TypeError(`Expected the "${key}" option to be a boolean`);
		return value;
	};
	exports.cppdb = Symbol();
	exports.inspect = Symbol.for("nodejs.util.inspect.custom");
}));
//#endregion
//#region node_modules/.pnpm/better-sqlite3@12.11.1/node_modules/better-sqlite3/lib/sqlite-error.js
var require_sqlite_error = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var descriptor = {
		value: "SqliteError",
		writable: true,
		enumerable: false,
		configurable: true
	};
	function SqliteError(message, code) {
		if (new.target !== SqliteError) return new SqliteError(message, code);
		if (typeof code !== "string") throw new TypeError("Expected second argument to be a string");
		Error.call(this, message);
		descriptor.value = "" + message;
		Object.defineProperty(this, "message", descriptor);
		Error.captureStackTrace(this, SqliteError);
		this.code = code;
	}
	Object.setPrototypeOf(SqliteError, Error);
	Object.setPrototypeOf(SqliteError.prototype, Error.prototype);
	Object.defineProperty(SqliteError.prototype, "name", descriptor);
	module.exports = SqliteError;
}));
//#endregion
//#region node_modules/.pnpm/file-uri-to-path@1.0.0/node_modules/file-uri-to-path/index.js
var require_file_uri_to_path = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Module dependencies.
	*/
	var sep = __require("path").sep || "/";
	/**
	* Module exports.
	*/
	module.exports = fileUriToPath;
	/**
	* File URI to Path function.
	*
	* @param {String} uri
	* @return {String} path
	* @api public
	*/
	function fileUriToPath(uri) {
		if ("string" != typeof uri || uri.length <= 7 || "file://" != uri.substring(0, 7)) throw new TypeError("must pass in a file:// URI to convert to a file path");
		var rest = decodeURI(uri.substring(7));
		var firstSlash = rest.indexOf("/");
		var host = rest.substring(0, firstSlash);
		var path = rest.substring(firstSlash + 1);
		if ("localhost" == host) host = "";
		if (host) host = sep + sep + host;
		path = path.replace(/^(.+)\|/, "$1:");
		if (sep == "\\") path = path.replace(/\//g, "\\");
		if (/^.+\:/.test(path)) {} else path = sep + path;
		return host + path;
	}
}));
//#endregion
//#region node_modules/.pnpm/bindings@1.5.0/node_modules/bindings/bindings.js
var require_bindings = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Module dependencies.
	*/
	var fs$2 = __require("fs");
	var path$2 = __require("path");
	var fileURLToPath = require_file_uri_to_path();
	var join = path$2.join;
	var dirname = path$2.dirname;
	var exists = fs$2.accessSync && function(path) {
		try {
			fs$2.accessSync(path);
		} catch (e) {
			return false;
		}
		return true;
	} || fs$2.existsSync || path$2.existsSync;
	var defaults = {
		arrow: process.env.NODE_BINDINGS_ARROW || " → ",
		compiled: process.env.NODE_BINDINGS_COMPILED_DIR || "compiled",
		platform: process.platform,
		arch: process.arch,
		nodePreGyp: "node-v" + process.versions.modules + "-" + process.platform + "-" + process.arch,
		version: process.versions.node,
		bindings: "bindings.node",
		try: [
			[
				"module_root",
				"build",
				"bindings"
			],
			[
				"module_root",
				"build",
				"Debug",
				"bindings"
			],
			[
				"module_root",
				"build",
				"Release",
				"bindings"
			],
			[
				"module_root",
				"out",
				"Debug",
				"bindings"
			],
			[
				"module_root",
				"Debug",
				"bindings"
			],
			[
				"module_root",
				"out",
				"Release",
				"bindings"
			],
			[
				"module_root",
				"Release",
				"bindings"
			],
			[
				"module_root",
				"build",
				"default",
				"bindings"
			],
			[
				"module_root",
				"compiled",
				"version",
				"platform",
				"arch",
				"bindings"
			],
			[
				"module_root",
				"addon-build",
				"release",
				"install-root",
				"bindings"
			],
			[
				"module_root",
				"addon-build",
				"debug",
				"install-root",
				"bindings"
			],
			[
				"module_root",
				"addon-build",
				"default",
				"install-root",
				"bindings"
			],
			[
				"module_root",
				"lib",
				"binding",
				"nodePreGyp",
				"bindings"
			]
		]
	};
	/**
	* The main `bindings()` function loads the compiled bindings for a given module.
	* It uses V8's Error API to determine the parent filename that this function is
	* being invoked from, which is then used to find the root directory.
	*/
	function bindings(opts) {
		if (typeof opts == "string") opts = { bindings: opts };
		else if (!opts) opts = {};
		Object.keys(defaults).map(function(i) {
			if (!(i in opts)) opts[i] = defaults[i];
		});
		if (!opts.module_root) opts.module_root = exports.getRoot(exports.getFileName());
		if (path$2.extname(opts.bindings) != ".node") opts.bindings += ".node";
		var requireFunc = typeof __webpack_require__ === "function" ? __non_webpack_require__ : __require;
		var tries = [], i = 0, l = opts.try.length, n, b, err;
		for (; i < l; i++) {
			n = join.apply(null, opts.try[i].map(function(p) {
				return opts[p] || p;
			}));
			tries.push(n);
			try {
				b = opts.path ? requireFunc.resolve(n) : requireFunc(n);
				if (!opts.path) b.path = n;
				return b;
			} catch (e) {
				if (e.code !== "MODULE_NOT_FOUND" && e.code !== "QUALIFIED_PATH_RESOLUTION_FAILED" && !/not find/i.test(e.message)) throw e;
			}
		}
		err = /* @__PURE__ */ new Error("Could not locate the bindings file. Tried:\n" + tries.map(function(a) {
			return opts.arrow + a;
		}).join("\n"));
		err.tries = tries;
		throw err;
	}
	module.exports = exports = bindings;
	/**
	* Gets the filename of the JavaScript file that invokes this function.
	* Used to help find the root directory of a module.
	* Optionally accepts an filename argument to skip when searching for the invoking filename
	*/
	exports.getFileName = function getFileName(calling_file) {
		var origPST = Error.prepareStackTrace, origSTL = Error.stackTraceLimit, dummy = {}, fileName;
		Error.stackTraceLimit = 10;
		Error.prepareStackTrace = function(e, st) {
			for (var i = 0, l = st.length; i < l; i++) {
				fileName = st[i].getFileName();
				if (fileName !== __filename) {
					if (calling_file) {
						if (fileName !== calling_file) return;
					} else return;
				}
			}
		};
		Error.captureStackTrace(dummy);
		dummy.stack;
		Error.prepareStackTrace = origPST;
		Error.stackTraceLimit = origSTL;
		if (fileName.indexOf("file://") === 0) fileName = fileURLToPath(fileName);
		return fileName;
	};
	/**
	* Gets the root directory of a module, given an arbitrary filename
	* somewhere in the module tree. The "root directory" is the directory
	* containing the `package.json` file.
	*
	*   In:  /home/nate/node-native-module/lib/index.js
	*   Out: /home/nate/node-native-module
	*/
	exports.getRoot = function getRoot(file) {
		var dir = dirname(file), prev;
		while (true) {
			if (dir === ".") dir = process.cwd();
			if (exists(join(dir, "package.json")) || exists(join(dir, "node_modules"))) return dir;
			if (prev === dir) throw new Error("Could not find module root given file: \"" + file + "\". Do you have a `package.json` file? ");
			prev = dir;
			dir = join(dir, "..");
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/better-sqlite3@12.11.1/node_modules/better-sqlite3/lib/methods/wrappers.js
var require_wrappers = /* @__PURE__ */ __commonJSMin(((exports) => {
	var { cppdb } = require_util();
	exports.prepare = function prepare(sql) {
		return this[cppdb].prepare(sql, this, false);
	};
	exports.exec = function exec(sql) {
		this[cppdb].exec(sql);
		return this;
	};
	exports.close = function close() {
		this[cppdb].close();
		return this;
	};
	exports.loadExtension = function loadExtension(...args) {
		this[cppdb].loadExtension(...args);
		return this;
	};
	exports.defaultSafeIntegers = function defaultSafeIntegers(...args) {
		this[cppdb].defaultSafeIntegers(...args);
		return this;
	};
	exports.unsafeMode = function unsafeMode(...args) {
		this[cppdb].unsafeMode(...args);
		return this;
	};
	exports.getters = {
		name: {
			get: function name() {
				return this[cppdb].name;
			},
			enumerable: true
		},
		open: {
			get: function open() {
				return this[cppdb].open;
			},
			enumerable: true
		},
		inTransaction: {
			get: function inTransaction() {
				return this[cppdb].inTransaction;
			},
			enumerable: true
		},
		readonly: {
			get: function readonly() {
				return this[cppdb].readonly;
			},
			enumerable: true
		},
		memory: {
			get: function memory() {
				return this[cppdb].memory;
			},
			enumerable: true
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/better-sqlite3@12.11.1/node_modules/better-sqlite3/lib/methods/transaction.js
var require_transaction = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { cppdb } = require_util();
	var controllers = /* @__PURE__ */ new WeakMap();
	module.exports = function transaction(fn) {
		if (typeof fn !== "function") throw new TypeError("Expected first argument to be a function");
		const db = this[cppdb];
		const controller = getController(db, this);
		const { apply } = Function.prototype;
		const properties = {
			default: { value: wrapTransaction(apply, fn, db, controller.default) },
			deferred: { value: wrapTransaction(apply, fn, db, controller.deferred) },
			immediate: { value: wrapTransaction(apply, fn, db, controller.immediate) },
			exclusive: { value: wrapTransaction(apply, fn, db, controller.exclusive) },
			database: {
				value: this,
				enumerable: true
			}
		};
		Object.defineProperties(properties.default.value, properties);
		Object.defineProperties(properties.deferred.value, properties);
		Object.defineProperties(properties.immediate.value, properties);
		Object.defineProperties(properties.exclusive.value, properties);
		return properties.default.value;
	};
	var getController = (db, self) => {
		let controller = controllers.get(db);
		if (!controller) {
			const shared = {
				commit: db.prepare("COMMIT", self, false),
				rollback: db.prepare("ROLLBACK", self, false),
				savepoint: db.prepare("SAVEPOINT `	_bs3.	`", self, false),
				release: db.prepare("RELEASE `	_bs3.	`", self, false),
				rollbackTo: db.prepare("ROLLBACK TO `	_bs3.	`", self, false)
			};
			controllers.set(db, controller = {
				default: Object.assign({ begin: db.prepare("BEGIN", self, false) }, shared),
				deferred: Object.assign({ begin: db.prepare("BEGIN DEFERRED", self, false) }, shared),
				immediate: Object.assign({ begin: db.prepare("BEGIN IMMEDIATE", self, false) }, shared),
				exclusive: Object.assign({ begin: db.prepare("BEGIN EXCLUSIVE", self, false) }, shared)
			});
		}
		return controller;
	};
	var wrapTransaction = (apply, fn, db, { begin, commit, rollback, savepoint, release, rollbackTo }) => function sqliteTransaction() {
		let before, after, undo;
		if (db.inTransaction) {
			before = savepoint;
			after = release;
			undo = rollbackTo;
		} else {
			before = begin;
			after = commit;
			undo = rollback;
		}
		before.run();
		try {
			const result = apply.call(fn, this, arguments);
			if (result && typeof result.then === "function") throw new TypeError("Transaction function cannot return a promise");
			after.run();
			return result;
		} catch (ex) {
			if (db.inTransaction) {
				undo.run();
				if (undo !== rollback) after.run();
			}
			throw ex;
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/better-sqlite3@12.11.1/node_modules/better-sqlite3/lib/methods/pragma.js
var require_pragma = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { getBooleanOption, cppdb } = require_util();
	module.exports = function pragma(source, options) {
		if (options == null) options = {};
		if (typeof source !== "string") throw new TypeError("Expected first argument to be a string");
		if (typeof options !== "object") throw new TypeError("Expected second argument to be an options object");
		const simple = getBooleanOption(options, "simple");
		const stmt = this[cppdb].prepare(`PRAGMA ${source}`, this, true);
		return simple ? stmt.pluck().get() : stmt.all();
	};
}));
//#endregion
//#region node_modules/.pnpm/better-sqlite3@12.11.1/node_modules/better-sqlite3/lib/methods/backup.js
var require_backup = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var fs$1 = __require("fs");
	var path$1 = __require("path");
	var { promisify } = __require("util");
	var { cppdb } = require_util();
	var fsAccess = promisify(fs$1.access);
	module.exports = async function backup(filename, options) {
		if (options == null) options = {};
		if (typeof filename !== "string") throw new TypeError("Expected first argument to be a string");
		if (typeof options !== "object") throw new TypeError("Expected second argument to be an options object");
		filename = filename.trim();
		const attachedName = "attached" in options ? options.attached : "main";
		const handler = "progress" in options ? options.progress : null;
		if (!filename) throw new TypeError("Backup filename cannot be an empty string");
		if (filename === ":memory:") throw new TypeError("Invalid backup filename \":memory:\"");
		if (typeof attachedName !== "string") throw new TypeError("Expected the \"attached\" option to be a string");
		if (!attachedName) throw new TypeError("The \"attached\" option cannot be an empty string");
		if (handler != null && typeof handler !== "function") throw new TypeError("Expected the \"progress\" option to be a function");
		await fsAccess(path$1.dirname(filename)).catch(() => {
			throw new TypeError("Cannot save backup because the directory does not exist");
		});
		const isNewFile = await fsAccess(filename).then(() => false, () => true);
		return runBackup(this[cppdb].backup(this, attachedName, filename, isNewFile), handler || null);
	};
	var runBackup = (backup, handler) => {
		let rate = 0;
		let useDefault = true;
		return new Promise((resolve, reject) => {
			setImmediate(function step() {
				try {
					const progress = backup.transfer(rate);
					if (!progress.remainingPages) {
						backup.close();
						resolve(progress);
						return;
					}
					if (useDefault) {
						useDefault = false;
						rate = 100;
					}
					if (handler) {
						const ret = handler(progress);
						if (ret !== void 0) {
							if (typeof ret === "number" && ret === ret) rate = Math.max(0, Math.min(2147483647, Math.round(ret)));
							else throw new TypeError("Expected progress callback to return a number or undefined");
						}
					}
					setImmediate(step);
				} catch (err) {
					backup.close();
					reject(err);
				}
			});
		});
	};
}));
//#endregion
//#region node_modules/.pnpm/better-sqlite3@12.11.1/node_modules/better-sqlite3/lib/methods/serialize.js
var require_serialize = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { cppdb } = require_util();
	module.exports = function serialize(options) {
		if (options == null) options = {};
		if (typeof options !== "object") throw new TypeError("Expected first argument to be an options object");
		const attachedName = "attached" in options ? options.attached : "main";
		if (typeof attachedName !== "string") throw new TypeError("Expected the \"attached\" option to be a string");
		if (!attachedName) throw new TypeError("The \"attached\" option cannot be an empty string");
		return this[cppdb].serialize(attachedName);
	};
}));
//#endregion
//#region node_modules/.pnpm/better-sqlite3@12.11.1/node_modules/better-sqlite3/lib/methods/function.js
var require_function = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { getBooleanOption, cppdb } = require_util();
	module.exports = function defineFunction(name, options, fn) {
		if (options == null) options = {};
		if (typeof options === "function") {
			fn = options;
			options = {};
		}
		if (typeof name !== "string") throw new TypeError("Expected first argument to be a string");
		if (typeof fn !== "function") throw new TypeError("Expected last argument to be a function");
		if (typeof options !== "object") throw new TypeError("Expected second argument to be an options object");
		if (!name) throw new TypeError("User-defined function name cannot be an empty string");
		const safeIntegers = "safeIntegers" in options ? +getBooleanOption(options, "safeIntegers") : 2;
		const deterministic = getBooleanOption(options, "deterministic");
		const directOnly = getBooleanOption(options, "directOnly");
		const varargs = getBooleanOption(options, "varargs");
		let argCount = -1;
		if (!varargs) {
			argCount = fn.length;
			if (!Number.isInteger(argCount) || argCount < 0) throw new TypeError("Expected function.length to be a positive integer");
			if (argCount > 100) throw new RangeError("User-defined functions cannot have more than 100 arguments");
		}
		this[cppdb].function(fn, name, argCount, safeIntegers, deterministic, directOnly);
		return this;
	};
}));
//#endregion
//#region node_modules/.pnpm/better-sqlite3@12.11.1/node_modules/better-sqlite3/lib/methods/aggregate.js
var require_aggregate = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { getBooleanOption, cppdb } = require_util();
	module.exports = function defineAggregate(name, options) {
		if (typeof name !== "string") throw new TypeError("Expected first argument to be a string");
		if (typeof options !== "object" || options === null) throw new TypeError("Expected second argument to be an options object");
		if (!name) throw new TypeError("User-defined function name cannot be an empty string");
		const start = "start" in options ? options.start : null;
		const step = getFunctionOption(options, "step", true);
		const inverse = getFunctionOption(options, "inverse", false);
		const result = getFunctionOption(options, "result", false);
		const safeIntegers = "safeIntegers" in options ? +getBooleanOption(options, "safeIntegers") : 2;
		const deterministic = getBooleanOption(options, "deterministic");
		const directOnly = getBooleanOption(options, "directOnly");
		const varargs = getBooleanOption(options, "varargs");
		let argCount = -1;
		if (!varargs) {
			argCount = Math.max(getLength(step), inverse ? getLength(inverse) : 0);
			if (argCount > 0) argCount -= 1;
			if (argCount > 100) throw new RangeError("User-defined functions cannot have more than 100 arguments");
		}
		this[cppdb].aggregate(start, step, inverse, result, name, argCount, safeIntegers, deterministic, directOnly);
		return this;
	};
	var getFunctionOption = (options, key, required) => {
		const value = key in options ? options[key] : null;
		if (typeof value === "function") return value;
		if (value != null) throw new TypeError(`Expected the "${key}" option to be a function`);
		if (required) throw new TypeError(`Missing required option "${key}"`);
		return null;
	};
	var getLength = ({ length }) => {
		if (Number.isInteger(length) && length >= 0) return length;
		throw new TypeError("Expected function.length to be a positive integer");
	};
}));
//#endregion
//#region node_modules/.pnpm/better-sqlite3@12.11.1/node_modules/better-sqlite3/lib/methods/table.js
var require_table = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { cppdb } = require_util();
	module.exports = function defineTable(name, factory) {
		if (typeof name !== "string") throw new TypeError("Expected first argument to be a string");
		if (!name) throw new TypeError("Virtual table module name cannot be an empty string");
		let eponymous = false;
		if (typeof factory === "object" && factory !== null) {
			eponymous = true;
			factory = defer(parseTableDefinition(factory, "used", name));
		} else {
			if (typeof factory !== "function") throw new TypeError("Expected second argument to be a function or a table definition object");
			factory = wrapFactory(factory);
		}
		this[cppdb].table(factory, name, eponymous);
		return this;
	};
	function wrapFactory(factory) {
		return function virtualTableFactory(moduleName, databaseName, tableName, ...args) {
			const thisObject = {
				module: moduleName,
				database: databaseName,
				table: tableName
			};
			const def = apply.call(factory, thisObject, args);
			if (typeof def !== "object" || def === null) throw new TypeError(`Virtual table module "${moduleName}" did not return a table definition object`);
			return parseTableDefinition(def, "returned", moduleName);
		};
	}
	function parseTableDefinition(def, verb, moduleName) {
		if (!hasOwnProperty.call(def, "rows")) throw new TypeError(`Virtual table module "${moduleName}" ${verb} a table definition without a "rows" property`);
		if (!hasOwnProperty.call(def, "columns")) throw new TypeError(`Virtual table module "${moduleName}" ${verb} a table definition without a "columns" property`);
		const rows = def.rows;
		if (typeof rows !== "function" || Object.getPrototypeOf(rows) !== GeneratorFunctionPrototype) throw new TypeError(`Virtual table module "${moduleName}" ${verb} a table definition with an invalid "rows" property (should be a generator function)`);
		let columns = def.columns;
		if (!Array.isArray(columns) || !(columns = [...columns]).every((x) => typeof x === "string")) throw new TypeError(`Virtual table module "${moduleName}" ${verb} a table definition with an invalid "columns" property (should be an array of strings)`);
		if (columns.length !== new Set(columns).size) throw new TypeError(`Virtual table module "${moduleName}" ${verb} a table definition with duplicate column names`);
		if (!columns.length) throw new RangeError(`Virtual table module "${moduleName}" ${verb} a table definition with zero columns`);
		let parameters;
		if (hasOwnProperty.call(def, "parameters")) {
			parameters = def.parameters;
			if (!Array.isArray(parameters) || !(parameters = [...parameters]).every((x) => typeof x === "string")) throw new TypeError(`Virtual table module "${moduleName}" ${verb} a table definition with an invalid "parameters" property (should be an array of strings)`);
		} else parameters = inferParameters(rows);
		if (parameters.length !== new Set(parameters).size) throw new TypeError(`Virtual table module "${moduleName}" ${verb} a table definition with duplicate parameter names`);
		if (parameters.length > 32) throw new RangeError(`Virtual table module "${moduleName}" ${verb} a table definition with more than the maximum number of 32 parameters`);
		for (const parameter of parameters) if (columns.includes(parameter)) throw new TypeError(`Virtual table module "${moduleName}" ${verb} a table definition with column "${parameter}" which was ambiguously defined as both a column and parameter`);
		let safeIntegers = 2;
		if (hasOwnProperty.call(def, "safeIntegers")) {
			const bool = def.safeIntegers;
			if (typeof bool !== "boolean") throw new TypeError(`Virtual table module "${moduleName}" ${verb} a table definition with an invalid "safeIntegers" property (should be a boolean)`);
			safeIntegers = +bool;
		}
		let directOnly = false;
		if (hasOwnProperty.call(def, "directOnly")) {
			directOnly = def.directOnly;
			if (typeof directOnly !== "boolean") throw new TypeError(`Virtual table module "${moduleName}" ${verb} a table definition with an invalid "directOnly" property (should be a boolean)`);
		}
		return [
			`CREATE TABLE x(${[...parameters.map(identifier).map((str) => `${str} HIDDEN`), ...columns.map(identifier)].join(", ")});`,
			wrapGenerator(rows, new Map(columns.map((x, i) => [x, parameters.length + i])), moduleName),
			parameters,
			safeIntegers,
			directOnly
		];
	}
	function wrapGenerator(generator, columnMap, moduleName) {
		return function* virtualTable(...args) {
			const output = args.map((x) => Buffer.isBuffer(x) ? Buffer.from(x) : x);
			for (let i = 0; i < columnMap.size; ++i) output.push(null);
			for (const row of generator(...args)) if (Array.isArray(row)) {
				extractRowArray(row, output, columnMap.size, moduleName);
				yield output;
			} else if (typeof row === "object" && row !== null) {
				extractRowObject(row, output, columnMap, moduleName);
				yield output;
			} else throw new TypeError(`Virtual table module "${moduleName}" yielded something that isn't a valid row object`);
		};
	}
	function extractRowArray(row, output, columnCount, moduleName) {
		if (row.length !== columnCount) throw new TypeError(`Virtual table module "${moduleName}" yielded a row with an incorrect number of columns`);
		const offset = output.length - columnCount;
		for (let i = 0; i < columnCount; ++i) output[i + offset] = row[i];
	}
	function extractRowObject(row, output, columnMap, moduleName) {
		let count = 0;
		for (const key of Object.keys(row)) {
			const index = columnMap.get(key);
			if (index === void 0) throw new TypeError(`Virtual table module "${moduleName}" yielded a row with an undeclared column "${key}"`);
			output[index] = row[key];
			count += 1;
		}
		if (count !== columnMap.size) throw new TypeError(`Virtual table module "${moduleName}" yielded a row with missing columns`);
	}
	function inferParameters({ length }) {
		if (!Number.isInteger(length) || length < 0) throw new TypeError("Expected function.length to be a positive integer");
		const params = [];
		for (let i = 0; i < length; ++i) params.push(`$${i + 1}`);
		return params;
	}
	var { hasOwnProperty } = Object.prototype;
	var { apply } = Function.prototype;
	var GeneratorFunctionPrototype = Object.getPrototypeOf(function* () {});
	var identifier = (str) => `"${str.replace(/"/g, "\"\"")}"`;
	var defer = (x) => () => x;
}));
//#endregion
//#region node_modules/.pnpm/better-sqlite3@12.11.1/node_modules/better-sqlite3/lib/methods/inspect.js
var require_inspect = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var DatabaseInspection = function Database() {};
	module.exports = function inspect(depth, opts) {
		return Object.assign(new DatabaseInspection(), this);
	};
}));
//#endregion
//#region node_modules/.pnpm/better-sqlite3@12.11.1/node_modules/better-sqlite3/lib/database.js
var require_database = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var fs = __require("fs");
	var path = __require("path");
	var util = require_util();
	var SqliteError = require_sqlite_error();
	var DEFAULT_ADDON;
	function Database(filenameGiven, options) {
		if (new.target == null) return new Database(filenameGiven, options);
		let buffer;
		if (Buffer.isBuffer(filenameGiven)) {
			buffer = filenameGiven;
			filenameGiven = ":memory:";
		}
		if (filenameGiven == null) filenameGiven = "";
		if (options == null) options = {};
		if (typeof filenameGiven !== "string") throw new TypeError("Expected first argument to be a string");
		if (typeof options !== "object") throw new TypeError("Expected second argument to be an options object");
		if ("readOnly" in options) throw new TypeError("Misspelled option \"readOnly\" should be \"readonly\"");
		if ("memory" in options) throw new TypeError("Option \"memory\" was removed in v7.0.0 (use \":memory:\" filename instead)");
		const filename = filenameGiven.trim();
		const anonymous = filename === "" || filename === ":memory:";
		const readonly = util.getBooleanOption(options, "readonly");
		const fileMustExist = util.getBooleanOption(options, "fileMustExist");
		const timeout = "timeout" in options ? options.timeout : 5e3;
		const verbose = "verbose" in options ? options.verbose : null;
		const nativeBinding = "nativeBinding" in options ? options.nativeBinding : null;
		if (readonly && anonymous && !buffer) throw new TypeError("In-memory/temporary databases cannot be readonly");
		if (!Number.isInteger(timeout) || timeout < 0) throw new TypeError("Expected the \"timeout\" option to be a positive integer");
		if (timeout > 2147483647) throw new RangeError("Option \"timeout\" cannot be greater than 2147483647");
		if (verbose != null && typeof verbose !== "function") throw new TypeError("Expected the \"verbose\" option to be a function");
		if (nativeBinding != null && typeof nativeBinding !== "string" && typeof nativeBinding !== "object") throw new TypeError("Expected the \"nativeBinding\" option to be a string or addon object");
		let addon;
		if (nativeBinding == null) addon = DEFAULT_ADDON || (DEFAULT_ADDON = require_bindings()("better_sqlite3.node"));
		else if (typeof nativeBinding === "string") addon = (typeof __non_webpack_require__ === "function" ? __non_webpack_require__ : __require)(path.resolve(nativeBinding).replace(/(\.node)?$/, ".node"));
		else addon = nativeBinding;
		if (!addon.isInitialized) {
			addon.setErrorConstructor(SqliteError);
			addon.isInitialized = true;
		}
		if (!anonymous && !filename.startsWith("file:") && !fs.existsSync(path.dirname(filename))) throw new TypeError("Cannot open database because the directory does not exist");
		Object.defineProperties(this, {
			[util.cppdb]: { value: new addon.Database(filename, filenameGiven, anonymous, readonly, fileMustExist, timeout, verbose || null, buffer || null) },
			...wrappers.getters
		});
	}
	var wrappers = require_wrappers();
	Database.prototype.prepare = wrappers.prepare;
	Database.prototype.transaction = require_transaction();
	Database.prototype.pragma = require_pragma();
	Database.prototype.backup = require_backup();
	Database.prototype.serialize = require_serialize();
	Database.prototype.function = require_function();
	Database.prototype.aggregate = require_aggregate();
	Database.prototype.table = require_table();
	Database.prototype.loadExtension = wrappers.loadExtension;
	Database.prototype.exec = wrappers.exec;
	Database.prototype.close = wrappers.close;
	Database.prototype.defaultSafeIntegers = wrappers.defaultSafeIntegers;
	Database.prototype.unsafeMode = wrappers.unsafeMode;
	Database.prototype[util.inspect] = require_inspect();
	module.exports = Database;
}));
//#endregion
//#region self-essentials/emdash-main/packages/core/dist/db/sqlite.mjs
var import_lib = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require_database();
	module.exports.SqliteError = require_sqlite_error();
})))(), 1);
/**
* SQLite runtime adapter
*
* Creates a Kysely dialect for better-sqlite3.
* Loaded at runtime via virtual module.
*/
/**
* Create a SQLite dialect from config
*/
function createDialect$1(config) {
	const url = config.url;
	return new SqliteDialect({ database: new import_lib.default(url.startsWith("file:") ? url.slice(5) : url) });
}
//#endregion
//#region \0virtual:emdash/dialect
var createDialect = createDialect$1;
var createRequestScopedDb = (_opts) => null;
//#endregion
export { createRequestScopedDb as n, createDialect as t };
