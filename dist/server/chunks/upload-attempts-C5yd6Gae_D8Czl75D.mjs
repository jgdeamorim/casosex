//#region self-essentials/emdash-main/packages/core/dist/upload-attempts-C5yd6Gae.mjs
async function removeUploadAttempt(storage, repo, storageKey, options = {}) {
	try {
		if (!await repo.claimUploadAttemptForCleanup(storageKey)) {
			if (await repo.hasUploadAttempt(storageKey) || !options.allowUntracked) return false;
		}
	} catch (error) {
		console.error("[media] upload cleanup claim failed:", error);
		return false;
	}
	try {
		await storage.delete(storageKey);
	} catch (error) {
		console.error("[media] upload cleanup failed:", error);
		return false;
	}
	try {
		await repo.deleteUploadAttempt(storageKey);
	} catch (error) {
		console.error("[media] upload cleanup record deletion failed:", error);
	}
	return true;
}
//#endregion
export { removeUploadAttempt as t };
