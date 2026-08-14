import { C as date, _ as record, c as boolean, g as preprocess, h as object, i as _enum, m as number, n as ZodNumber, r as ZodString, s as array, w as datetime, x as unknown, y as string } from "./schemas_Cq5OeI4c.mjs";
import "./runner-BsI18UgP_CTLRmh7U.mjs";
//#region self-essentials/emdash-main/packages/core/dist/zod-generator-DMzfga3g.mjs
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
//#endregion
export { generateZodSchema as t };
