import { C as string, D as date, O as datetime, T as unknown, _ as number, a as _enum, b as preprocess, c as array, i as ZodString, l as boolean, n as ZodNumber, v as object, x as record } from "./schemas_CzTFUUcv.mjs";
import "./runner-BsI18UgP_DY3LBvkk.mjs";
//#region self-essentials/emdash-main/packages/core/dist/zod-generator-DMzfga3g.mjs
/** Pattern to split on underscores, hyphens, and spaces for PascalCase conversion */
var PASCAL_CASE_SPLIT_PATTERN = /[_\-\s]+/;
/**
* Generate a Zod schema from a collection's field definitions
*
* This allows runtime validation of content based on dynamically
* defined schemas stored in D1.
*/
function generateZodSchema(collection) {
	const shape = {};
	for (const field of collection.fields) shape[field.slug] = generateFieldSchema(field);
	return object(shape);
}
/**
* Generate Zod schema for a single field
*/
function generateFieldSchema(field) {
	let schema = getBaseSchema(field.type, field);
	if (field.validation) schema = applyValidation(schema, field);
	if (!field.required) schema = schema.nullish();
	if (field.defaultValue !== void 0) schema = schema.default(field.defaultValue);
	return schema;
}
/**
* Get base Zod schema for a field type
*/
function getBaseSchema(type, field) {
	switch (type) {
		case "url": return string().url();
		case "string":
		case "text":
		case "slug": return string();
		case "number": return number();
		case "integer": return number().int();
		case "boolean": return preprocess((v) => v === 0 || v === 1 ? Boolean(v) : v, boolean());
		case "datetime": return datetime({
			offset: true,
			local: true
		}).or(date());
		case "select": {
			const options = field.validation?.options;
			if (options && options.length > 0) {
				const [first, ...rest] = options;
				return _enum([first, ...rest]);
			}
			return string();
		}
		case "multiSelect": {
			const multiOptions = field.validation?.options;
			if (multiOptions && multiOptions.length > 0) {
				const [first, ...rest] = multiOptions;
				return array(_enum([first, ...rest]));
			}
			return array(string());
		}
		case "portableText": return array(object({
			_type: string(),
			_key: string().optional()
		}).passthrough());
		case "image": return object({
			id: string(),
			src: string().optional(),
			alt: string().optional(),
			width: number().optional(),
			height: number().optional(),
			provider: string().optional(),
			previewUrl: string().optional(),
			meta: record(string(), unknown()).optional()
		});
		case "file": return object({
			id: string(),
			src: string().optional(),
			filename: string().optional(),
			mimeType: string().optional(),
			size: number().optional(),
			provider: string().optional(),
			meta: record(string(), unknown()).optional()
		});
		case "reference": return string();
		case "json": return unknown();
		default: return unknown();
	}
}
/**
* Apply validation rules to a schema
*/
function applyValidation(schema, field) {
	const validation = field.validation;
	if (!validation) return schema;
	if (schema instanceof ZodString) {
		let strSchema = schema;
		if (validation.minLength !== void 0) strSchema = strSchema.min(validation.minLength);
		if (validation.maxLength !== void 0) strSchema = strSchema.max(validation.maxLength);
		if (validation.pattern) strSchema = strSchema.regex(new RegExp(validation.pattern));
		return strSchema;
	}
	if (schema instanceof ZodNumber) {
		let numSchema = schema;
		if (validation.min !== void 0) numSchema = numSchema.min(validation.min);
		if (validation.max !== void 0) numSchema = numSchema.max(validation.max);
		return numSchema;
	}
	return schema;
}
/**
* Generate TypeScript interface from field definitions
* Used by CLI `emdash types` to generate types
*/
function generateTypeScript(collection, interfaceName = getInterfaceName(collection)) {
	const lines = [];
	lines.push(`export interface ${interfaceName} {`);
	lines.push(`  id: string;`);
	lines.push(`  slug: string | null;`);
	lines.push(`  status: string;`);
	for (const field of collection.fields) {
		const tsType = fieldTypeToTypeScript(field);
		const optional = field.required ? "" : "?";
		lines.push(`  ${field.slug}${optional}: ${tsType};`);
	}
	lines.push(`  createdAt: Date;`);
	lines.push(`  updatedAt: Date;`);
	lines.push(`  publishedAt: Date | null;`);
	lines.push(`  bylines?: ContentBylineCredit[];`);
	lines.push(`  terms?: Record<string, TaxonomyTerm[]>;`);
	lines.push(`}`);
	return lines.join("\n");
}
/**
* Map field type to TypeScript type
*/
function fieldTypeToTypeScript(field) {
	switch (field.type) {
		case "string":
		case "text":
		case "slug":
		case "url":
		case "datetime": return "string";
		case "number":
		case "integer": return "number";
		case "boolean": return "boolean";
		case "select":
			const options = field.validation?.options;
			if (options && options.length > 0) return options.map((o) => `"${o}"`).join(" | ");
			return "string";
		case "multiSelect":
			const multiOptions = field.validation?.options;
			if (multiOptions && multiOptions.length > 0) return `(${multiOptions.map((o) => `"${o}"`).join(" | ")})[]`;
			return "string[]";
		case "portableText": return "PortableTextBlock[]";
		case "image": return "{ id: string; src?: string; alt?: string; width?: number; height?: number; provider?: string; previewUrl?: string; meta?: Record<string, unknown> }";
		case "file": return "{ id: string; src?: string; filename?: string; mimeType?: string; size?: number; provider?: string; meta?: Record<string, unknown> }";
		case "reference": return "string";
		case "json": return "unknown";
		default: return "unknown";
	}
}
/**
* Convert string to PascalCase (handles slugs, spaces, etc.)
*/
function pascalCase(str) {
	return str.split(PASCAL_CASE_SPLIT_PATTERN).filter(Boolean).map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join("");
}
/**
* Naive singularization for slug-derived interface names. Handles the common
* English plural endings; intentionally simple, not a full inflector.
*/
function singularize(str) {
	if (str.endsWith("ies")) return str.slice(0, -3) + "y";
	if (str.endsWith("es") && (str.endsWith("sses") || str.endsWith("xes") || str.endsWith("ches") || str.endsWith("shes"))) return str.slice(0, -2);
	if (str.endsWith("s") && !str.endsWith("ss")) return str.slice(0, -1);
	return str;
}
/**
* Get the interface name for a collection.
*
* Derived from the slug, not the human label. Slugs are constrained to
* `/^[a-z][a-z0-9_]*$/`, so PascalCasing one always yields a valid TS
* identifier; labels are arbitrary and user-controlled (punctuation, spaces,
* duplicates across collections), which produced syntactically invalid or
* duplicate interface names. The slug is singularized first because the
* interface describes a single entry, not the collection (`posts` -> `Post`).
*
* Singularization can map two distinct slugs onto the same name, so callers
* generating more than one interface must dedupe -- see `uniqueInterfaceNames`.
*/
function getInterfaceName(collection) {
	return pascalCase(singularize(collection.slug));
}
/**
* Resolve interface names for a set of collections, guaranteeing each is
* unique within the file. Collisions (from singularization or PascalCasing
* collapsing distinct slugs) get a numeric suffix in collection order, so the
* generated `.d.ts` never declares two interfaces with the same identifier.
*
* The suffix is chosen against the set of names already emitted, not a
* per-base counter, so a generated name can't collide with another slug's
* base name (e.g. slugs `book`, `books`, `book2`: `books` -> `Book2` would
* clash with `book2`, so it advances to `Book3`).
*/
function uniqueInterfaceNames(collections) {
	const used = /* @__PURE__ */ new Set();
	const names = /* @__PURE__ */ new Map();
	for (const collection of collections) {
		const base = getInterfaceName(collection);
		let name = base;
		let suffix = 2;
		while (used.has(name)) {
			name = `${base}${suffix}`;
			suffix++;
		}
		used.add(name);
		names.set(collection.slug, name);
	}
	return names;
}
//#endregion
export { generateZodSchema as n, uniqueInterfaceNames as r, generateTypeScript as t };
