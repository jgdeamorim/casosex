import { B as SchemableIdentifierNode, H as freeze } from "./migrator_BiAfLowp.mjs";
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/create-table-node.js
var ON_COMMIT_ACTIONS = [
	"preserve rows",
	"delete rows",
	"drop"
];
/**
* @internal
*/
var CreateTableNode = freeze({
	is(node) {
		return node.kind === "CreateTableNode";
	},
	create(table) {
		return freeze({
			kind: "CreateTableNode",
			table,
			columns: freeze([])
		});
	},
	cloneWithColumn(node, column) {
		return freeze({
			...node,
			columns: freeze([...node.columns, column])
		});
	},
	cloneWithConstraint(node, constraint) {
		return freeze({
			...node,
			constraints: node.constraints ? freeze([...node.constraints, constraint]) : freeze([constraint])
		});
	},
	cloneWithIndex(node, index) {
		return freeze({
			...node,
			indexes: node.indexes ? freeze([...node.indexes, index]) : freeze([index])
		});
	},
	cloneWithFrontModifier(node, modifier) {
		return freeze({
			...node,
			frontModifiers: node.frontModifiers ? freeze([...node.frontModifiers, modifier]) : freeze([modifier])
		});
	},
	cloneWithEndModifier(node, modifier) {
		return freeze({
			...node,
			endModifiers: node.endModifiers ? freeze([...node.endModifiers, modifier]) : freeze([modifier])
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
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/create-view-node.js
/**
* @internal
*/
var CreateViewNode = freeze({
	is(node) {
		return node.kind === "CreateViewNode";
	},
	create(name) {
		return freeze({
			kind: "CreateViewNode",
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
export { CreateTableNode as n, ON_COMMIT_ACTIONS as r, CreateViewNode as t };
