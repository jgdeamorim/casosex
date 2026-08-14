import { t as sql } from "./dist_D4nVBoqy.mjs";
import { b as validateIdentifier, r as __exportAll } from "./runner-BsI18UgP_DY3LBvkk.mjs";
import { n as InvalidCursorError } from "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { n as ulid } from "./node_BucsvNi-.mjs";
import { t as chunks } from "./chunks-D5dlPeRb_ZNPg27dD.mjs";
import { t as MediaRepository } from "./media-tQDZEdu7_D9hYcuMC.mjs";
import { a as MediaUsageRepository, d as loadContentMediaUsageSnapshots, h as withContentUsageCollectionLock, i as MediaUsageFieldDiscoveryError, n as CONTENT_MEDIA_USAGE_COLLECTION_SCOPE, o as buildContentMediaUsageSourceKey, r as MEDIA_USAGE_CONTENT_SOURCE_VARIANTS, t as CONTENT_MEDIA_USAGE_ADAPTER_ID, u as loadContentMediaUsageFields } from "./content-refresh-DgqUBeTv_rkjORcMb.mjs";
import { t as ErrorCode } from "./errors-DtEXIQQV_DXdZZdDL.mjs";
//#region self-essentials/emdash-main/packages/core/dist/media-usage-DPJcNaAq.mjs
var CONTENT_MEDIA_USAGE_REPAIR_ERROR = {
	COLLECTION_NOT_FOUND: "COLLECTION_NOT_FOUND",
	CONTENT_NOT_FOUND: "CONTENT_NOT_FOUND",
	DRAFT_REVISION_NOT_FOUND: "DRAFT_REVISION_NOT_FOUND",
	DRAFT_REVISION_MISMATCH: "DRAFT_REVISION_MISMATCH",
	DRAFT_REVISION_INVALID: "DRAFT_REVISION_INVALID",
	CONTENT_USAGE_REPAIR_ERROR: "CONTENT_USAGE_REPAIR_ERROR",
	CONTENT_USAGE_REPAIR_CONFLICT: "CONTENT_USAGE_REPAIR_CONFLICT",
	INVALID_REPEATER_VALIDATION: "INVALID_REPEATER_VALIDATION"
};
async function repairContentMediaUsageAll(db) {
	const collections = await loadContentMediaUsageCollectionRecords(db);
	const results = [];
	for (const collection of collections) results.push({
		collection,
		result: await repairContentMediaUsageCollectionSafely(db, collection.slug)
	});
	return aggregateContentMediaUsageRepairAll(await filterExistingContentMediaUsageCollectionResults(db, results));
}
async function scanContentMediaUsageCollection(db, collectionSlug) {
	validateIdentifier(collectionSlug, "collection slug");
	if (!await db.selectFrom("_emdash_collections").select("id").where("slug", "=", collectionSlug).executeTakeFirst()) return null;
	const tableName = getContentTableName(collectionSlug);
	return {
		collectionSlug,
		contentIds: (await sql`
		SELECT id
		FROM ${sql.ref(tableName)}
		ORDER BY id ASC
	`.execute(db)).rows.map((row) => row.id)
	};
}
async function repairContentMediaUsageCollection(db, input) {
	validateIdentifier(input.collectionSlug, "collection slug");
	return withContentUsageCollectionLock(input.collectionSlug, () => repairContentMediaUsageCollectionUnlocked(db, input.collectionSlug));
}
async function loadContentMediaUsageCollectionRecords(db) {
	return db.selectFrom("_emdash_collections").select(["id", "slug"]).orderBy("slug", "asc").execute();
}
async function repairContentMediaUsageCollectionSafely(db, collectionSlug) {
	try {
		return await repairContentMediaUsageCollection(db, { collectionSlug });
	} catch (error) {
		console.error(`[media-usage] Failed to repair collection ${collectionSlug}:`, error);
		const now = (/* @__PURE__ */ new Date()).toISOString();
		return {
			scope: contentMediaUsageCollectionScope(collectionSlug),
			status: "failed",
			indexedSourceCount: 0,
			failedSourceCount: 0,
			skippedSourceCount: 0,
			deletedSourceCount: 0,
			lastErrorCode: CONTENT_MEDIA_USAGE_REPAIR_ERROR.CONTENT_USAGE_REPAIR_ERROR,
			startedAt: now,
			completedAt: now
		};
	}
}
async function filterExistingContentMediaUsageCollectionResults(db, results) {
	const currentCollections = await loadContentMediaUsageCollectionRecordsSafely(db);
	const currentIdsBySlug = new Map(currentCollections.map((collection) => [collection.slug, collection.id]));
	const includedResults = [];
	const excludedResults = [];
	for (const { collection, result } of results) if (currentIdsBySlug.get(collection.slug) === collection.id) includedResults.push(result);
	else excludedResults.push(result);
	if (excludedResults.length > 0) {
		const repo = new MediaUsageRepository(db);
		for (const result of excludedResults) await repo.deleteIndexStatus(result.scope);
	}
	return includedResults;
}
async function loadContentMediaUsageCollectionRecordsSafely(db) {
	try {
		return await loadContentMediaUsageCollectionRecords(db);
	} catch {}
	try {
		return await loadContentMediaUsageCollectionRecords(db);
	} catch (error) {
		console.error("[media-usage] Failed to reconcile all-content repair collections:", error);
		throw error;
	}
}
function aggregateContentMediaUsageRepairAll(collections) {
	return {
		status: determineRepairAllStatus(collections),
		collections: [...collections],
		indexedSourceCount: sumCollectionRepairCount(collections, "indexedSourceCount"),
		failedSourceCount: sumCollectionRepairCount(collections, "failedSourceCount"),
		skippedSourceCount: sumCollectionRepairCount(collections, "skippedSourceCount"),
		deletedSourceCount: sumCollectionRepairCount(collections, "deletedSourceCount")
	};
}
function determineRepairAllStatus(collections) {
	if (collections.length === 0) return "complete";
	if (collections.every((collection) => collection.status === "complete")) return "complete";
	if (collections.some((collection) => collection.status === "stale")) return "stale";
	if (collections.some((collection) => collection.status === "partial")) return "partial";
	if (collections.every((collection) => collection.status === "failed")) return "failed";
	return "partial";
}
function sumCollectionRepairCount(collections, key) {
	return collections.reduce((sum, collection) => sum + collection[key], 0);
}
async function repairContentMediaUsageCollectionUnlocked(db, collectionSlug) {
	const startedAt = (/* @__PURE__ */ new Date()).toISOString();
	const scope = contentMediaUsageCollectionScope(collectionSlug);
	if (!await contentCollectionExists(db, collectionSlug)) return {
		scope,
		status: "failed",
		indexedSourceCount: 0,
		failedSourceCount: 0,
		skippedSourceCount: 0,
		deletedSourceCount: 0,
		lastErrorCode: CONTENT_MEDIA_USAGE_REPAIR_ERROR.COLLECTION_NOT_FOUND,
		startedAt,
		completedAt: startedAt
	};
	const repo = new MediaUsageRepository(db);
	const runToken = ulid();
	await repo.beginIndexStatusRepair({
		...scope,
		runToken,
		schemaVersion: 1,
		startedAt
	});
	try {
		const scan = await scanContentMediaUsageCollection(db, collectionSlug);
		if (!scan) {
			const completedAt = (/* @__PURE__ */ new Date()).toISOString();
			return await finalizeRepairStatus(repo, {
				...scope,
				runToken,
				counts: {
					indexedSourceCount: 0,
					failedSourceCount: 0,
					skippedSourceCount: 0,
					deletedSourceCount: 0,
					lastErrorCode: CONTENT_MEDIA_USAGE_REPAIR_ERROR.COLLECTION_NOT_FOUND,
					missingContentIds: /* @__PURE__ */ new Set()
				},
				status: "failed",
				startedAt,
				completedAt
			});
		}
		const counts = await repairScannedContentSources(db, repo, scan);
		const finalScan = await scanContentMediaUsageCollection(db, collectionSlug);
		if (!finalScan) {
			counts.failedSourceCount++;
			counts.lastErrorCode = CONTENT_MEDIA_USAGE_REPAIR_ERROR.COLLECTION_NOT_FOUND;
		} else if (!sameContentIds(repairedContentIds(scan.contentIds, counts), finalScan.contentIds)) markRepairConflict(counts);
		const completedAt = (/* @__PURE__ */ new Date()).toISOString();
		const status = determineRepairStatus(counts);
		return await finalizeRepairStatus(repo, {
			...scope,
			runToken,
			counts,
			status,
			startedAt,
			completedAt
		});
	} catch (error) {
		if (!(error instanceof MediaUsageFieldDiscoveryError)) console.error(`[media-usage] Failed to repair collection ${collectionSlug}:`, error);
		const completedAt = (/* @__PURE__ */ new Date()).toISOString();
		const lastErrorCode = error instanceof MediaUsageFieldDiscoveryError ? error.code : CONTENT_MEDIA_USAGE_REPAIR_ERROR.CONTENT_USAGE_REPAIR_ERROR;
		return finalizeRepairStatus(repo, {
			...scope,
			runToken,
			counts: {
				indexedSourceCount: 0,
				failedSourceCount: 0,
				skippedSourceCount: 0,
				deletedSourceCount: 0,
				lastErrorCode,
				missingContentIds: /* @__PURE__ */ new Set()
			},
			status: "failed",
			startedAt,
			completedAt
		});
	}
}
async function repairScannedContentSources(db, repo, scan) {
	const counts = {
		indexedSourceCount: 0,
		failedSourceCount: 0,
		skippedSourceCount: 0,
		deletedSourceCount: 0,
		lastErrorCode: null,
		missingContentIds: /* @__PURE__ */ new Set()
	};
	const fieldDiscovery = await loadContentMediaUsageFields(db, scan.collectionSlug);
	const observedSources = await repo.findSources(buildContentSourceKeysForScan(scan));
	for (const contentId of scan.contentIds) await repairContentSource(db, repo, scan.collectionSlug, contentId, fieldDiscovery, observedSources, counts);
	await reconcileOrphanedContentSources(db, repo, scan.collectionSlug, counts);
	return counts;
}
async function repairContentSource(db, repo, collectionSlug, contentId, fieldDiscovery, observedSources, counts) {
	const sourceKeys = buildContentSourceKeys(collectionSlug, contentId);
	const snapshotsResult = await loadContentMediaUsageSnapshots(db, collectionSlug, contentId, fieldDiscovery);
	if (!snapshotsResult.success) {
		if (snapshotsResult.error === CONTENT_MEDIA_USAGE_REPAIR_ERROR.CONTENT_NOT_FOUND) {
			markRepairConflict(counts);
			counts.missingContentIds.add(contentId);
			return;
		}
		counts.lastErrorCode = snapshotsResult.error;
		if (snapshotsResult.snapshots) await repairSnapshotSources(repo, snapshotsResult.snapshots, observedSources, counts);
		if (snapshotsResult.source) {
			if ((await repo.markSourceAttemptedIfMatching({
				...snapshotsResult.source,
				sourceCompleteness: "failed",
				lastErrorCode: snapshotsResult.error
			}, observedSources.get(snapshotsResult.source.sourceKey) ?? null)).attempted) counts.failedSourceCount++;
			else markRepairConflict(counts);
			return;
		}
		counts.failedSourceCount++;
		return;
	}
	const expectedSourceKeys = await repairSnapshotSources(repo, snapshotsResult.snapshots, observedSources, counts);
	for (const sourceKey of sourceKeys) {
		if (expectedSourceKeys.has(sourceKey)) continue;
		const observedSource = observedSources.get(sourceKey);
		if (!observedSource) continue;
		await deleteObservedSource(repo, sourceKey, observedSource, counts);
	}
}
async function repairSnapshotSources(repo, snapshots, observedSources, counts) {
	const expectedSourceKeys = /* @__PURE__ */ new Set();
	for (const snapshot of snapshots) {
		expectedSourceKeys.add(snapshot.source.sourceKey);
		if ((await repo.replaceSourceIfMatching(snapshot.source, snapshot.occurrences, observedSources.get(snapshot.source.sourceKey) ?? null)).replaced) counts.indexedSourceCount++;
		else markRepairConflict(counts);
	}
	return expectedSourceKeys;
}
function markRepairConflict(counts) {
	counts.skippedSourceCount++;
	counts.lastErrorCode ??= CONTENT_MEDIA_USAGE_REPAIR_ERROR.CONTENT_USAGE_REPAIR_CONFLICT;
}
async function reconcileOrphanedContentSources(db, repo, collectionSlug, counts) {
	const sources = await repo.findCollectionContentSources(collectionSlug);
	const existingContentIds = await findExistingContentIds(db, collectionSlug, sources.flatMap((source) => source.contentId ? [source.contentId] : []));
	for (const source of sources) {
		if (!source.contentId) {
			await deleteObservedSource(repo, source.sourceKey, source, counts);
			continue;
		}
		if (existingContentIds.has(source.contentId)) continue;
		await deleteObservedSourceIfContentAbsent(repo, collectionSlug, source, counts);
	}
}
async function findExistingContentIds(db, collectionSlug, contentIds) {
	validateIdentifier(collectionSlug, "collection slug");
	const existingContentIds = /* @__PURE__ */ new Set();
	const uniqueContentIds = [...new Set(contentIds)];
	if (uniqueContentIds.length === 0) return existingContentIds;
	const tableName = getContentTableName(collectionSlug);
	for (const contentIdBatch of chunks(uniqueContentIds, 50)) {
		const result = await sql`
			SELECT id
			FROM ${sql.ref(tableName)}
			WHERE id IN (${sql.join(contentIdBatch)})
		`.execute(db);
		for (const row of result.rows) existingContentIds.add(row.id);
	}
	return existingContentIds;
}
async function deleteObservedSourceIfContentAbsent(repo, collectionSlug, observedSource, counts) {
	if (!observedSource.contentId) return;
	const result = await repo.deleteSourceIfMatchingContentAbsent(observedSource.sourceKey, observedSource, collectionSlug, observedSource.contentId);
	if (result.deleted) {
		counts.deletedSourceCount++;
		return;
	}
	if (result.contentPresent) return;
	if (result.source) markRepairConflict(counts);
}
async function deleteObservedSource(repo, sourceKey, observedSource, counts) {
	const result = await repo.deleteSourceIfMatching(sourceKey, observedSource);
	if (result.deleted) {
		counts.deletedSourceCount++;
		return;
	}
	if (result.source) markRepairConflict(counts);
}
async function finalizeRepairStatus(repo, input) {
	const result = await repo.finalizeIndexStatusRepairIfRunning({
		adapterId: input.adapterId,
		scopeType: input.scopeType,
		scopeKey: input.scopeKey,
		runToken: input.runToken,
		status: input.status,
		schemaVersion: 1,
		completedAt: input.completedAt,
		indexedSourceCount: input.counts.indexedSourceCount,
		failedSourceCount: input.counts.failedSourceCount,
		lastErrorCode: input.counts.lastErrorCode
	});
	return {
		scope: {
			adapterId: input.adapterId,
			scopeType: input.scopeType,
			scopeKey: input.scopeKey
		},
		status: result.finalized ? input.status : "stale",
		indexedSourceCount: input.counts.indexedSourceCount,
		failedSourceCount: input.counts.failedSourceCount,
		skippedSourceCount: input.counts.skippedSourceCount,
		deletedSourceCount: input.counts.deletedSourceCount,
		lastErrorCode: result.finalized ? input.counts.lastErrorCode : result.status?.lastErrorCode ?? CONTENT_MEDIA_USAGE_REPAIR_ERROR.CONTENT_USAGE_REPAIR_CONFLICT,
		startedAt: input.startedAt,
		completedAt: result.finalized ? input.completedAt : null
	};
}
function determineRepairStatus(counts) {
	if (counts.failedSourceCount === 0 && counts.skippedSourceCount === 0) return "complete";
	const trustedProgress = counts.indexedSourceCount + counts.deletedSourceCount;
	if (counts.failedSourceCount > 0 && trustedProgress === 0) return "failed";
	return "partial";
}
function buildContentSourceKeys(collectionSlug, contentId) {
	return MEDIA_USAGE_CONTENT_SOURCE_VARIANTS.map((sourceVariant) => buildContentMediaUsageSourceKey({
		collectionSlug,
		contentId,
		sourceVariant
	}));
}
function buildContentSourceKeysForScan(scan) {
	return scan.contentIds.flatMap((contentId) => buildContentSourceKeys(scan.collectionSlug, contentId));
}
async function contentCollectionExists(db, collectionSlug) {
	return await db.selectFrom("_emdash_collections").select("id").where("slug", "=", collectionSlug).executeTakeFirst() !== void 0;
}
function sameContentIds(left, right) {
	if (left.length !== right.length) return false;
	const rightIds = new Set(right);
	return left.every((id) => rightIds.has(id));
}
function repairedContentIds(contentIds, counts) {
	if (counts.missingContentIds.size === 0) return [...contentIds];
	return contentIds.filter((contentId) => !counts.missingContentIds.has(contentId));
}
function contentMediaUsageCollectionScope(collectionSlug) {
	return {
		adapterId: CONTENT_MEDIA_USAGE_ADAPTER_ID,
		scopeType: CONTENT_MEDIA_USAGE_COLLECTION_SCOPE,
		scopeKey: collectionSlug
	};
}
function getContentTableName(collectionSlug) {
	validateIdentifier(collectionSlug, "collection slug");
	return `ec_${collectionSlug}`;
}
var media_usage_exports = /* @__PURE__ */ __exportAll({
	aggregateMediaUsageCoverageStatus: () => aggregateMediaUsageCoverageStatus,
	handleMediaUsageDetails: () => handleMediaUsageDetails,
	handleMediaUsageRepair: () => handleMediaUsageRepair,
	handleMediaUsageSummaries: () => handleMediaUsageSummaries,
	toMediaUsageRepairResponse: () => toMediaUsageRepairResponse
});
function aggregateMediaUsageCoverageStatus(scopes) {
	const statuses = scopes.map(normalizeMediaUsageCoverageStatus);
	if (statuses.every((status) => status === "complete")) return "complete";
	if (statuses.includes("unknown")) return "unknown";
	if (statuses.includes("running")) return "running";
	if (statuses.includes("stale")) return "stale";
	if (statuses.includes("partial")) return "partial";
	if (statuses.every((status) => status === "never")) return "never";
	if (statuses.every((status) => status === "failed")) return "failed";
	return "partial";
}
async function handleMediaUsageSummaries(db, mediaIds, options) {
	if (mediaIds.length === 0) return {
		success: true,
		data: {}
	};
	try {
		const repository = new MediaUsageRepository(db);
		const coverage = await loadMediaUsageCoverage(repository);
		const counts = options.includeCount ? await repository.findActiveEntryCountsByMediaIds(mediaIds) : null;
		const summaries = {};
		for (const mediaId of new Set(mediaIds)) summaries[mediaId] = {
			count: counts ? counts.get(mediaId) ?? 0 : null,
			coverage
		};
		return {
			success: true,
			data: summaries
		};
	} catch (error) {
		console.error("[media-usage] summary read failed:", error);
		return {
			success: false,
			error: {
				code: ErrorCode.MEDIA_USAGE_READ_ERROR,
				message: "Failed to read media usage"
			}
		};
	}
}
async function handleMediaUsageDetails(db, mediaId, options) {
	try {
		if (!await new MediaRepository(db).findById(mediaId)) return {
			success: false,
			error: {
				code: ErrorCode.NOT_FOUND,
				message: `Media item not found: ${mediaId}`
			}
		};
		const repository = new MediaUsageRepository(db);
		const coverage = await loadMediaUsageCoverage(repository);
		const page = await repository.findCurrentEntryUsagePageByMediaId(mediaId, options);
		return {
			success: true,
			data: {
				items: page.items.map(toMediaUsageEntryDetail),
				...page.nextCursor ? { nextCursor: page.nextCursor } : {},
				coverage
			}
		};
	} catch (error) {
		if (error instanceof InvalidCursorError) return {
			success: false,
			error: {
				code: ErrorCode.INVALID_CURSOR,
				message: error.message
			}
		};
		console.error("[media-usage] detail read failed:", error);
		return {
			success: false,
			error: {
				code: ErrorCode.MEDIA_USAGE_READ_ERROR,
				message: "Failed to read media usage"
			}
		};
	}
}
async function handleMediaUsageRepair(db, input) {
	try {
		let result;
		if (input.scope === "collection") result = await repairContentMediaUsageCollection(db, { collectionSlug: input.collection });
		else if (input.scope === "all") result = await repairContentMediaUsageAll(db);
		else return {
			success: false,
			error: {
				code: ErrorCode.VALIDATION_ERROR,
				message: "Invalid media usage repair request"
			}
		};
		return {
			success: true,
			data: toMediaUsageRepairResponse(result)
		};
	} catch (error) {
		console.error("[media-usage] repair failed:", error);
		return {
			success: false,
			error: {
				code: ErrorCode.MEDIA_USAGE_REPAIR_ERROR,
				message: "Failed to repair media usage"
			}
		};
	}
}
function toMediaUsageRepairResponse(result) {
	const collections = "collections" in result ? result.collections : [result];
	return {
		status: result.status,
		indexedSourceCount: result.indexedSourceCount,
		failedSourceCount: result.failedSourceCount,
		skippedSourceCount: result.skippedSourceCount,
		deletedSourceCount: result.deletedSourceCount,
		collections: collections.map(toMediaUsageRepairCollectionSummary)
	};
}
function toMediaUsageRepairCollectionSummary(result) {
	return {
		collection: result.scope.scopeKey,
		status: result.status,
		indexedSourceCount: result.indexedSourceCount,
		failedSourceCount: result.failedSourceCount,
		skippedSourceCount: result.skippedSourceCount,
		deletedSourceCount: result.deletedSourceCount,
		lastErrorCode: result.lastErrorCode,
		startedAt: result.startedAt,
		completedAt: result.completedAt
	};
}
function normalizeMediaUsageCoverageStatus(scope) {
	if (scope.status === null) return "never";
	if (scope.status === "complete") return scope.schemaVersion === 1 ? "complete" : "stale";
	if (scope.status === "never" || scope.status === "running" || scope.status === "partial" || scope.status === "failed" || scope.status === "stale") return scope.status;
	return "unknown";
}
async function loadMediaUsageCoverage(repository) {
	return {
		scope: "all_content_collections",
		status: aggregateMediaUsageCoverageStatus(await repository.findCollectionIndexStatusScopes({
			adapterId: CONTENT_MEDIA_USAGE_ADAPTER_ID,
			scopeType: CONTENT_MEDIA_USAGE_COLLECTION_SCOPE
		}))
	};
}
function toMediaUsageEntryDetail(group) {
	const preferred = group.sources.find(({ source }) => source.sourceVariant === "draft_overlay") ?? group.sources.find(({ source }) => source.sourceVariant === "columns");
	if (!preferred) throw new Error("Media usage entry has no supported source");
	return {
		collection: group.collectionSlug,
		contentId: group.contentId,
		title: preferred.source.contentTitle,
		slug: preferred.source.contentSlug,
		locale: preferred.source.locale,
		status: preferred.source.contentStatus,
		scheduledAt: preferred.source.contentScheduledAt,
		deletedAt: group.contentDeletedAt,
		sources: group.sources.flatMap(({ source, occurrences }) => {
			if (source.sourceVariant !== "columns" && source.sourceVariant !== "draft_overlay") return [];
			return [{
				variant: source.sourceVariant,
				occurrences: occurrences.map((occurrence) => ({
					fieldSlug: occurrence.fieldSlug,
					fieldPath: occurrence.fieldPath,
					occurrenceIndex: occurrence.occurrenceIndex,
					referenceType: normalizeMediaUsageReferenceType(occurrence.referenceType)
				}))
			}];
		})
	};
}
function normalizeMediaUsageReferenceType(referenceType) {
	if (referenceType === "image_field" || referenceType === "file_field" || referenceType === "portable_text_image") return referenceType;
	return "unknown";
}
//#endregion
export { media_usage_exports as i, handleMediaUsageRepair as n, handleMediaUsageSummaries as r, handleMediaUsageDetails as t };
