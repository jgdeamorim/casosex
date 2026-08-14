import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import { _ as addAttribute, d as renderTemplate, g as renderHead } from "./server_Lac7W6ZE.mjs";
import { t as createComponent } from "./astro-component_CcaHMe5u.mjs";
import "./compiler_BPLn2J1w.mjs";
import { env } from "cloudflare:workers";
//#region src/pages/sandbox-test.astro
var sandbox_test_exports = /* @__PURE__ */ __exportAll({
	default: () => $$SandboxTest,
	file: () => $$file,
	url: () => $$url
});
var $$SandboxTest = createComponent(async ($$result, $$props, $$slots) => {
	const results = {
		loaderAvailable: false,
		isolateSpawned: false,
		rpcWorked: false
	};
	try {
		const loader = env.LOADER;
		results.loaderAvailable = !!loader;
		if (loader) {
			const testCode = `
			import { WorkerEntrypoint } from "cloudflare:workers";
			
			export default class TestEntrypoint extends WorkerEntrypoint {
				async test(input) {
					return {
						success: true,
						message: "Hello from sandbox!",
						received: input,
						timestamp: Date.now()
					};
				}
			}
		`;
			const worker = loader.get("sandbox-test-" + Date.now(), () => ({
				compatibilityDate: "2025-01-01",
				mainModule: "test.js",
				modules: { "test.js": { js: testCode } },
				globalOutbound: null,
				env: {}
			}));
			results.isolateSpawned = true;
			const rpcResult = await worker.getEntrypoint("default").test({ test: "data" });
			results.rpcWorked = rpcResult?.success === true;
			results.result = rpcResult;
		}
	} catch (e) {
		results.error = e instanceof Error ? e.message : String(e);
	}
	return renderTemplate`<html lang="en" data-astro-cid-4modh6fp><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Sandbox Test</title>${renderHead($$result)}</head><body data-astro-cid-4modh6fp><h1 data-astro-cid-4modh6fp>Worker Loader Sandbox Test</h1><div${addAttribute(`result ${results.loaderAvailable ? "success" : "error"}`, "class")} data-astro-cid-4modh6fp><strong data-astro-cid-4modh6fp>LOADER Binding:</strong>${results.loaderAvailable ? "Available" : "Not available"}</div><div${addAttribute(`result ${results.isolateSpawned ? "success" : results.loaderAvailable ? "error" : "pending"}`, "class")} data-astro-cid-4modh6fp><strong data-astro-cid-4modh6fp>Isolate Spawned:</strong>${results.isolateSpawned ? "Yes" : "No"}</div><div${addAttribute(`result ${results.rpcWorked ? "success" : results.isolateSpawned ? "error" : "pending"}`, "class")} data-astro-cid-4modh6fp><strong data-astro-cid-4modh6fp>RPC Call:</strong>${results.rpcWorked ? "Success" : "Failed"}</div>${results.error && renderTemplate`<div class="result error" data-astro-cid-4modh6fp><strong data-astro-cid-4modh6fp>Error:</strong><pre data-astro-cid-4modh6fp>${results.error}</pre></div>`}${results.result && renderTemplate`<div class="result success" data-astro-cid-4modh6fp><strong data-astro-cid-4modh6fp>Result from Sandbox:</strong><pre data-astro-cid-4modh6fp>${JSON.stringify(results.result, null, 2)}</pre></div>`}<h2 data-astro-cid-4modh6fp>Next Steps</h2><p data-astro-cid-4modh6fp>If all tests pass, the Worker Loader is working correctly. This means we can run sandboxed plugins in isolated V8 isolates.</p><h2 data-astro-cid-4modh6fp>Raw Results</h2><pre data-astro-cid-4modh6fp>${JSON.stringify(results, null, 2)}</pre></body></html>`;
}, "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/src/pages/sandbox-test.astro", void 0);
var $$file = "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/src/pages/sandbox-test.astro";
var $$url = "/sandbox-test";
//#endregion
//#region \0virtual:astro:page:src/pages/sandbox-test@_@astro
var page = () => sandbox_test_exports;
//#endregion
export { page };
