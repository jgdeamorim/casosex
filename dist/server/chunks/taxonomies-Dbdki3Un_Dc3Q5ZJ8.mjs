import { c as resolveConfiguredLocale, r as __exportAll } from "./runner-BsI18UgP_DY3LBvkk.mjs";
import { n as ulid } from "./node_BucsvNi-.mjs";
import { t as TaxonomyRepository } from "./taxonomy-DvwWAPvA_9icPwnll.mjs";
import { d as invalidateTermCache, t as fetchVisibleTermCounts, u as invalidateTaxonomyDefsCache } from "./taxonomies-B61CRSha_D_3qZCRf.mjs";
//#region self-essentials/emdash-main/packages/core/dist/taxonomies-Dbdki3Un.mjs
var taxonomies_exports = /* @__PURE__ */ __exportAll({
	handleTaxonomyCreate: () => handleTaxonomyCreate,
	handleTaxonomyList: () => handleTaxonomyList,
	handleTermCreate: () => handleTermCreate,
	handleTermDelete: () => handleTermDelete,
	handleTermGet: () => handleTermGet,
	handleTermList: () => handleTermList,
	handleTermTranslations: () => handleTermTranslations,
	handleTermUpdate: () => handleTermUpdate
});
var NAME_PATTERN = /^[a-z][a-z0-9_]*$/;
/**
* Build tree structure from flat terms
*/
function buildTree(flatTerms) {
	const byLocaleGroup = /* @__PURE__ */ new Map();
	const roots = [];
	for (const term of flatTerms) byLocaleGroup.set(`${term.locale}::${term.translationGroup ?? term.id}`, term);
	for (const term of flatTerms) {
		const parent = term.parentId ? byLocaleGroup.get(`${term.locale}::${term.parentId}`) : void 0;
		if (parent) parent.children.push(term);
		else roots.push(term);
	}
	return roots;
}
/**
* Look up a taxonomy definition by name (optionally scoped to a locale).
* Returns the lowest-locale match when no locale is provided.
*/
async function requireTaxonomyDef(db, name, locale) {
	let query = db.selectFrom("_emdash_taxonomy_defs").selectAll().where("name", "=", name);
	if (locale !== void 0) query = query.where("locale", "=", locale);
	const def = await query.orderBy("locale", "asc").executeTakeFirst();
	if (!def) return {
		success: false,
		error: {
			code: "NOT_FOUND",
			message: `Taxonomy '${name}' not found`
		}
	};
	return {
		success: true,
		def
	};
}
/** Declared collections of a taxonomy def row (deduped, parsed from JSON). */
function defCollections(def) {
	const parsed = def.collections ? JSON.parse(def.collections) : [];
	return [...new Set(parsed)];
}
function rowToDef(row) {
	return {
		id: row.id,
		name: row.name,
		label: row.label,
		labelSingular: row.label_singular ?? void 0,
		hierarchical: row.hierarchical === 1,
		collections: row.collections ? JSON.parse(row.collections) : [],
		locale: row.locale,
		translationGroup: row.translation_group
	};
}
/**
* List all taxonomy definitions
*/
async function handleTaxonomyList(db, options = {}) {
	try {
		const locale = options.locale ? resolveConfiguredLocale(options.locale) : void 0;
		let query = db.selectFrom("_emdash_taxonomy_defs").selectAll();
		if (locale !== void 0) query = query.where("locale", "=", locale);
		const [rows, collectionRows] = await Promise.all([query.execute(), db.selectFrom("_emdash_collections").select("slug").execute()]);
		const realCollections = new Set(collectionRows.map((r) => r.slug));
		return {
			success: true,
			data: { taxonomies: rows.map((row) => {
				const def = rowToDef(row);
				return {
					...def,
					collections: def.collections.filter((slug) => realCollections.has(slug))
				};
			}) }
		};
	} catch {
		return {
			success: false,
			error: {
				code: "TAXONOMY_LIST_ERROR",
				message: "Failed to list taxonomies"
			}
		};
	}
}
/**
* Create a new taxonomy definition
*/
async function handleTaxonomyCreate(db, input) {
	try {
		const locale = input.locale ? resolveConfiguredLocale(input.locale) : void 0;
		if (!NAME_PATTERN.test(input.name)) return {
			success: false,
			error: {
				code: "VALIDATION_ERROR",
				message: "Taxonomy name must start with a letter and contain only lowercase letters, numbers, and underscores"
			}
		};
		const collections = [...new Set(input.collections ?? [])];
		if (collections.length > 0) {
			const existingCollections = await db.selectFrom("_emdash_collections").select("slug").where("slug", "in", collections).execute();
			const existingSlugs = new Set(existingCollections.map((c) => c.slug));
			const invalid = collections.filter((c) => !existingSlugs.has(c));
			if (invalid.length > 0) return {
				success: false,
				error: {
					code: "VALIDATION_ERROR",
					message: `Unknown collection(s): ${invalid.join(", ")}`
				}
			};
		}
		let translationGroup = null;
		if (input.translationOf) {
			const source = await db.selectFrom("_emdash_taxonomy_defs").selectAll().where("id", "=", input.translationOf).executeTakeFirst();
			if (!source) return {
				success: false,
				error: {
					code: "NOT_FOUND",
					message: "Source taxonomy for translation not found"
				}
			};
			translationGroup = source.translation_group ?? source.id;
		}
		if (locale !== void 0) {
			if (await db.selectFrom("_emdash_taxonomy_defs").select("id").where("name", "=", input.name).where("locale", "=", locale).executeTakeFirst()) return {
				success: false,
				error: {
					code: "CONFLICT",
					message: `Taxonomy '${input.name}' already exists in locale '${locale}'`
				}
			};
		}
		const id = ulid();
		await db.insertInto("_emdash_taxonomy_defs").values({
			id,
			name: input.name,
			label: input.label,
			label_singular: input.labelSingular ?? null,
			hierarchical: input.hierarchical ? 1 : 0,
			collections: JSON.stringify(collections),
			...locale !== void 0 ? { locale } : {},
			translation_group: translationGroup ?? id
		}).execute();
		invalidateTaxonomyDefsCache();
		return {
			success: true,
			data: { taxonomy: rowToDef(await db.selectFrom("_emdash_taxonomy_defs").selectAll().where("id", "=", id).executeTakeFirstOrThrow()) }
		};
	} catch (error) {
		if (error instanceof Error && error.message.includes("UNIQUE constraint failed")) return {
			success: false,
			error: {
				code: "CONFLICT",
				message: `Taxonomy '${input.name}' already exists`
			}
		};
		return {
			success: false,
			error: {
				code: "TAXONOMY_CREATE_ERROR",
				message: "Failed to create taxonomy"
			}
		};
	}
}
/**
* List all terms for a taxonomy (returns tree for hierarchical taxonomies)
*/
async function handleTermList(db, taxonomyName, options = {}) {
	try {
		const lookup = await requireTaxonomyDef(db, taxonomyName);
		if (!lookup.success) return lookup;
		const repo = new TaxonomyRepository(db);
		const locale = options.locale ? resolveConfiguredLocale(options.locale) : void 0;
		const terms = await repo.findByName(taxonomyName, { locale });
		const countsByGroup = options.includeCounts ?? true ? await fetchVisibleTermCounts(db, taxonomyName, defCollections(lookup.def)) : void 0;
		const termData = terms.map((term) => ({
			id: term.id,
			name: term.name,
			slug: term.slug,
			label: term.label,
			parentId: term.parentId,
			description: typeof term.data?.description === "string" ? term.data.description : void 0,
			children: [],
			...countsByGroup && { count: countsByGroup.get(term.translationGroup ?? term.id) ?? 0 },
			locale: term.locale,
			translationGroup: term.translationGroup
		}));
		return {
			success: true,
			data: { terms: lookup.def.hierarchical === 1 ? buildTree(termData) : termData }
		};
	} catch (error) {
		console.error("[taxonomies] term list failed:", error);
		return {
			success: false,
			error: {
				code: "TERM_LIST_ERROR",
				message: "Failed to list terms"
			}
		};
	}
}
/**
* Validate a parent term reference for create/update.
*
* Returns `null` on success or a structured error message that callers
* wrap in their own ApiResult.
*
*   - `parentId === undefined` -> no-op (no parent change requested).
*   - `parentId === null` -> caller intends to detach; no-op here.
*   - parent must exist (FK exists -> term row not soft-deleted).
*   - parent must live in the same taxonomy.
*   - reject a parent in the term's own translation_group (self-parent),
*     including the create path: a translation inherits its source's group, so
*     `selfGroup` carries that prospective group when `termId` is absent.
*   - on update, walk up the parent chain to detect cycles.
*/
async function validateParentTerm(repo, taxonomyName, termId, parentId, selfGroup) {
	if (parentId === void 0 || parentId === null) return null;
	const parent = await repo.findById(parentId);
	if (!parent) return {
		code: "VALIDATION_ERROR",
		message: `Parent term '${parentId}' not found`
	};
	if (parent.name !== taxonomyName) return {
		code: "VALIDATION_ERROR",
		message: `Parent term '${parentId}' belongs to taxonomy '${parent.name}', not '${taxonomyName}'`
	};
	const parentGroup = parent.translationGroup ?? parent.id;
	let termGroup = selfGroup ?? null;
	if (termId !== void 0) {
		const term = await repo.findById(termId);
		termGroup = term ? term.translationGroup ?? term.id : termId;
	}
	if (termGroup !== null && parentGroup === termGroup) return {
		code: "VALIDATION_ERROR",
		message: "A term cannot be its own parent"
	};
	const MAX_DEPTH = 100;
	let cursor = parent.parentId;
	let steps = 0;
	while (cursor !== null && steps < MAX_DEPTH) {
		if (termGroup !== null && cursor === termGroup) return {
			code: "VALIDATION_ERROR",
			message: "Cycle detected: cannot make a descendant the parent"
		};
		const next = await repo.findById(cursor);
		if (!next) break;
		cursor = next.parentId;
		steps++;
	}
	if (cursor !== null && steps >= MAX_DEPTH) return {
		code: "VALIDATION_ERROR",
		message: "Parent chain exceeds maximum depth"
	};
	return null;
}
/**
* Create a new term in a taxonomy
*/
async function handleTermCreate(db, taxonomyName, input) {
	try {
		const locale = input.locale ? resolveConfiguredLocale(input.locale) : void 0;
		const lookup = await requireTaxonomyDef(db, taxonomyName);
		if (!lookup.success) return lookup;
		const repo = new TaxonomyRepository(db);
		const parentId = input.parentId === "" || input.parentId === void 0 ? void 0 : input.parentId;
		if (await repo.findBySlug(taxonomyName, input.slug, locale)) return {
			success: false,
			error: {
				code: "CONFLICT",
				message: locale ? `Term '${input.slug}' already exists in '${taxonomyName}' (${locale})` : `Term with slug '${input.slug}' already exists in taxonomy '${taxonomyName}'`
			}
		};
		let selfGroup = null;
		if (input.translationOf) {
			const source = await repo.findById(input.translationOf);
			selfGroup = source ? source.translationGroup ?? source.id : null;
		}
		const parentError = await validateParentTerm(repo, taxonomyName, void 0, parentId, selfGroup);
		if (parentError) return {
			success: false,
			error: parentError
		};
		const term = await repo.create({
			name: taxonomyName,
			slug: input.slug,
			label: input.label,
			parentId: parentId ?? void 0,
			data: input.description ? { description: input.description } : void 0,
			locale,
			translationOf: input.translationOf
		});
		invalidateTermCache();
		return {
			success: true,
			data: { term: {
				id: term.id,
				name: term.name,
				slug: term.slug,
				label: term.label,
				parentId: term.parentId,
				description: typeof term.data?.description === "string" ? term.data.description : void 0,
				locale: term.locale,
				translationGroup: term.translationGroup
			} }
		};
	} catch {
		return {
			success: false,
			error: {
				code: "TERM_CREATE_ERROR",
				message: "Failed to create term"
			}
		};
	}
}
/**
* Get a single term by slug
*/
async function handleTermGet(db, taxonomyName, termSlug, options = {}) {
	try {
		const repo = new TaxonomyRepository(db);
		const locale = options.locale ? resolveConfiguredLocale(options.locale) : void 0;
		const term = await repo.findBySlug(taxonomyName, termSlug, locale);
		if (!term) return {
			success: false,
			error: {
				code: "NOT_FOUND",
				message: `Term '${termSlug}' not found in taxonomy '${taxonomyName}'`
			}
		};
		const lookup = await requireTaxonomyDef(db, taxonomyName);
		const count = (await fetchVisibleTermCounts(db, taxonomyName, lookup.success ? defCollections(lookup.def) : [])).get(term.translationGroup ?? term.id) ?? 0;
		const children = await repo.findChildren(term.id, term.locale);
		return {
			success: true,
			data: { term: {
				id: term.id,
				name: term.name,
				slug: term.slug,
				label: term.label,
				parentId: term.parentId,
				description: typeof term.data?.description === "string" ? term.data.description : void 0,
				count,
				children: children.map((c) => ({
					id: c.id,
					slug: c.slug,
					label: c.label
				})),
				locale: term.locale,
				translationGroup: term.translationGroup
			} }
		};
	} catch {
		return {
			success: false,
			error: {
				code: "TERM_GET_ERROR",
				message: "Failed to get term"
			}
		};
	}
}
/** List every translation of a term (by id or translation_group). */
async function handleTermTranslations(db, idOrGroup) {
	try {
		const anchor = await db.selectFrom("taxonomies").selectAll().where((eb) => eb.or([eb("id", "=", idOrGroup), eb("translation_group", "=", idOrGroup)])).executeTakeFirst();
		if (!anchor) return {
			success: false,
			error: {
				code: "NOT_FOUND",
				message: "Term not found"
			}
		};
		const group = anchor.translation_group ?? anchor.id;
		return {
			success: true,
			data: {
				translationGroup: group,
				translations: (await db.selectFrom("taxonomies").selectAll().where("translation_group", "=", group).orderBy("locale", "asc").execute()).map((r) => ({
					id: r.id,
					slug: r.slug,
					label: r.label,
					locale: r.locale
				}))
			}
		};
	} catch {
		return {
			success: false,
			error: {
				code: "TERM_TRANSLATIONS_ERROR",
				message: "Failed to list term translations"
			}
		};
	}
}
/**
* Update a term
*/
async function handleTermUpdate(db, taxonomyName, termSlug, input, options = {}) {
	try {
		const repo = new TaxonomyRepository(db);
		const locale = options.locale ? resolveConfiguredLocale(options.locale) : void 0;
		const term = await repo.findBySlug(taxonomyName, termSlug, locale);
		if (!term) return {
			success: false,
			error: {
				code: "NOT_FOUND",
				message: `Term '${termSlug}' not found in taxonomy '${taxonomyName}'`
			}
		};
		const newSlug = input.slug === "" || input.slug === void 0 ? void 0 : input.slug;
		const newParentId = input.parentId === "" || input.parentId === void 0 ? void 0 : input.parentId;
		if (newSlug !== void 0 && newSlug !== termSlug) {
			const existing = await repo.findBySlug(taxonomyName, newSlug, locale);
			if (existing && existing.id !== term.id) return {
				success: false,
				error: {
					code: "CONFLICT",
					message: `Term with slug '${newSlug}' already exists in taxonomy '${taxonomyName}'`
				}
			};
		}
		const parentError = await validateParentTerm(repo, taxonomyName, term.id, newParentId);
		if (parentError) return {
			success: false,
			error: parentError
		};
		const updated = await repo.update(term.id, {
			slug: newSlug,
			label: input.label,
			parentId: newParentId,
			data: input.description !== void 0 ? { description: input.description } : void 0
		});
		invalidateTermCache();
		if (!updated) return {
			success: false,
			error: {
				code: "TERM_UPDATE_ERROR",
				message: "Failed to update term"
			}
		};
		return {
			success: true,
			data: { term: {
				id: updated.id,
				name: updated.name,
				slug: updated.slug,
				label: updated.label,
				parentId: updated.parentId,
				description: typeof updated.data?.description === "string" ? updated.data.description : void 0,
				locale: updated.locale,
				translationGroup: updated.translationGroup
			} }
		};
	} catch {
		return {
			success: false,
			error: {
				code: "TERM_UPDATE_ERROR",
				message: "Failed to update term"
			}
		};
	}
}
/**
* Delete a term
*/
async function handleTermDelete(db, taxonomyName, termSlug, options = {}) {
	try {
		const repo = new TaxonomyRepository(db);
		const locale = options.locale ? resolveConfiguredLocale(options.locale) : void 0;
		const term = await repo.findBySlug(taxonomyName, termSlug, locale);
		if (!term) return {
			success: false,
			error: {
				code: "NOT_FOUND",
				message: `Term '${termSlug}' not found in taxonomy '${taxonomyName}'`
			}
		};
		if ((await repo.findChildren(term.id)).length > 0) return {
			success: false,
			error: {
				code: "VALIDATION_ERROR",
				message: "Cannot delete term with children. Delete children first."
			}
		};
		if (!await repo.delete(term.id)) return {
			success: false,
			error: {
				code: "TERM_DELETE_ERROR",
				message: "Failed to delete term"
			}
		};
		invalidateTermCache();
		return {
			success: true,
			data: { deleted: true }
		};
	} catch {
		return {
			success: false,
			error: {
				code: "TERM_DELETE_ERROR",
				message: "Failed to delete term"
			}
		};
	}
}
//#endregion
export { handleTermGet as a, handleTermUpdate as c, handleTermDelete as i, taxonomies_exports as l, handleTaxonomyList as n, handleTermList as o, handleTermCreate as r, handleTermTranslations as s, handleTaxonomyCreate as t };
