import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import { T as createAstro, _ as addAttribute, d as renderTemplate, g as renderHead } from "./server_Lac7W6ZE.mjs";
import { t as createComponent } from "./astro-component_CcaHMe5u.mjs";
import "./compiler_BPLn2J1w.mjs";
//#region src/pages/sandbox-plugin-test.astro
var sandbox_plugin_test_exports = /* @__PURE__ */ __exportAll({
	default: () => $$SandboxPluginTest,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://astro.build");
var $$SandboxPluginTest = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$SandboxPluginTest;
	const results = [];
	const cfContext = Astro.locals.cfContext;
	const loader = (await import("cloudflare:workers")).env.LOADER;
	if (!loader) results.push({
		step: "Check LOADER binding",
		success: false,
		error: "LOADER not available"
	});
	else results.push({
		step: "Check LOADER binding",
		success: true
	});
	if (!cfContext) results.push({
		step: "Check cfContext",
		success: false,
		error: "cfContext not available"
	});
	else results.push({
		step: "Check cfContext",
		success: true
	});
	const exports = cfContext?.exports;
	if (!exports) results.push({
		step: "Check ctx.exports",
		success: false,
		error: "ctx.exports not available - need enable_ctx_exports flag"
	});
	else results.push({
		step: "Check ctx.exports",
		success: true
	});
	const PluginBridge = exports?.PluginBridge;
	if (!PluginBridge) results.push({
		step: "Check PluginBridge export",
		success: false,
		error: "PluginBridge not in ctx.exports"
	});
	else results.push({
		step: "Check PluginBridge export",
		success: true
	});
	if (PluginBridge) try {
		const bridge = PluginBridge({ props: {
			pluginId: "test-plugin",
			pluginVersion: "1.0.0",
			capabilities: ["read:content"],
			allowedHosts: [],
			storageCollections: ["logs"]
		} });
		results.push({
			step: "Create bridge instance",
			success: true
		});
		try {
			await bridge.kvSet("test-key", { hello: "world" });
			const value = await bridge.kvGet("test-key");
			await bridge.kvDelete("test-key");
			results.push({
				step: "Bridge KV operations",
				success: value?.hello === "world",
				data: {
					stored: { hello: "world" },
					retrieved: value
				}
			});
		} catch (e) {
			results.push({
				step: "Bridge KV operations",
				success: false,
				error: e instanceof Error ? e.message : String(e)
			});
		}
		try {
			await bridge.storagePut("logs", "test-id", { message: "test log" });
			const value = await bridge.storageGet("logs", "test-id");
			await bridge.storageDelete("logs", "test-id");
			results.push({
				step: "Bridge storage operations",
				success: value?.message === "test log",
				data: value
			});
		} catch (e) {
			results.push({
				step: "Bridge storage operations",
				success: false,
				error: e instanceof Error ? e.message : String(e)
			});
		}
		try {
			await bridge.storageGet("undeclared", "test");
			results.push({
				step: "Block undeclared storage",
				success: false,
				error: "Should have thrown"
			});
		} catch (e) {
			results.push({
				step: "Block undeclared storage",
				success: true,
				data: {
					blocked: true,
					error: e instanceof Error ? e.message : String(e)
				}
			});
		}
		try {
			await bridge.httpFetch("https://example.com");
			results.push({
				step: "Block network without capability",
				success: false,
				error: "Should have thrown"
			});
		} catch (e) {
			results.push({
				step: "Block network without capability",
				success: true,
				data: {
					blocked: true,
					error: e instanceof Error ? e.message : String(e)
				}
			});
		}
	} catch (e) {
		results.push({
			step: "Create bridge instance",
			success: false,
			error: e instanceof Error ? e.message : String(e)
		});
	}
	if (loader && PluginBridge) try {
		const bridgeBinding = PluginBridge({ props: {
			pluginId: "sandbox-test",
			pluginVersion: "1.0.0",
			capabilities: ["read:content"],
			allowedHosts: [],
			storageCollections: ["logs"]
		} });
		const sandboxCode = `
			import { WorkerEntrypoint } from "cloudflare:workers";
			
			export default class PluginEntrypoint extends WorkerEntrypoint {
				async test() {
					return {
						success: true,
						message: "Hello from sandbox!",
						pluginId: this.env.PLUGIN_ID,
					};
				}
				
				async testKv() {
					const bridge = this.env.BRIDGE;
					await bridge.kvSet("sandbox-test", { from: "sandbox" });
					const value = await bridge.kvGet("sandbox-test");
					await bridge.kvDelete("sandbox-test");
					return { success: true, value };
				}
				
				async testStorage() {
					const bridge = this.env.BRIDGE;
					await bridge.storagePut("logs", "sandbox-log", { ts: Date.now() });
					const value = await bridge.storageGet("logs", "sandbox-log");
					await bridge.storageDelete("logs", "sandbox-log");
					return { success: true, value };
				}
				
				async testBlockedStorage() {
					const bridge = this.env.BRIDGE;
					try {
						await bridge.storageGet("undeclared", "test");
						return { success: false, error: "Should have been blocked" };
					} catch (e) {
						return { success: true, blocked: true, error: e.message };
					}
				}
				
				async testBlockedNetwork() {
					const bridge = this.env.BRIDGE;
					try {
						await bridge.httpFetch("https://example.com");
						return { success: false, error: "Should have been blocked" };
					} catch (e) {
						return { success: true, blocked: true, error: e.message };
					}
				}
				
				// ISOLATION TESTS - verify sandbox can't bypass bridge
				
				async testDirectFetchBlocked() {
					// Sandbox has globalOutbound: null, so fetch should fail
					try {
						const resp = await fetch("https://example.com");
						return { success: false, error: "Direct fetch should be blocked but got: " + resp.status };
					} catch (e) {
						return { success: true, blocked: true, error: e.message };
					}
				}
				
				async testNoDbBinding() {
					// Sandbox should NOT have DB binding - only BRIDGE
					const hasDb = !!this.env.DB;
					const hasMedia = !!this.env.MEDIA;
					const bindings = Object.keys(this.env);
					return { 
						success: !hasDb && !hasMedia,
						hasDb,
						hasMedia,
						bindings,
						error: hasDb || hasMedia ? "Sandbox should not have direct DB/MEDIA bindings" : null
					};
				}
				
				async testNoGlobals() {
					// Check that dangerous globals are not available
					const checks = {
						hasGlobalFetch: typeof globalThis.fetch === "function",
						// After globalOutbound: null, fetch exists but should fail
					};
					return { success: true, checks };
				}
			}
		`;
		const worker = loader.get("sandbox-full-test-" + Date.now(), () => ({
			compatibilityDate: "2025-01-01",
			mainModule: "plugin.js",
			modules: { "plugin.js": { js: sandboxCode } },
			globalOutbound: null,
			env: {
				PLUGIN_ID: "sandbox-test",
				BRIDGE: bridgeBinding
			}
		}));
		results.push({
			step: "Spawn sandbox with bridge",
			success: true
		});
		const getEp = () => worker.getEntrypoint("default");
		try {
			const testResult = await getEp().test();
			results.push({
				step: "Sandbox basic RPC",
				success: testResult?.success === true,
				data: testResult
			});
		} catch (e) {
			results.push({
				step: "Sandbox basic RPC",
				success: false,
				error: e instanceof Error ? e.message : String(e)
			});
		}
		try {
			const kvResult = await getEp().testKv();
			results.push({
				step: "Sandbox KV via bridge",
				success: kvResult?.success === true,
				data: kvResult
			});
		} catch (e) {
			results.push({
				step: "Sandbox KV via bridge",
				success: false,
				error: e instanceof Error ? e.message : String(e)
			});
		}
		try {
			const storageResult = await getEp().testStorage();
			results.push({
				step: "Sandbox storage via bridge",
				success: storageResult?.success === true,
				data: storageResult
			});
		} catch (e) {
			results.push({
				step: "Sandbox storage via bridge",
				success: false,
				error: e instanceof Error ? e.message : String(e)
			});
		}
		try {
			const blockedResult = await getEp().testBlockedStorage();
			results.push({
				step: "Sandbox blocked storage",
				success: blockedResult?.blocked === true,
				data: blockedResult
			});
		} catch (e) {
			results.push({
				step: "Sandbox blocked storage",
				success: false,
				error: e instanceof Error ? e.message : String(e)
			});
		}
		try {
			const networkResult = await getEp().testBlockedNetwork();
			results.push({
				step: "Sandbox blocked network",
				success: networkResult?.blocked === true,
				data: networkResult
			});
		} catch (e) {
			results.push({
				step: "Sandbox blocked network",
				success: false,
				error: e instanceof Error ? e.message : String(e)
			});
		}
		try {
			const fetchResult = await getEp().testDirectFetchBlocked();
			results.push({
				step: "Sandbox direct fetch blocked",
				success: fetchResult?.blocked === true,
				data: fetchResult
			});
		} catch (e) {
			results.push({
				step: "Sandbox direct fetch blocked",
				success: false,
				error: e instanceof Error ? e.message : String(e)
			});
		}
		try {
			const bindingsResult = await getEp().testNoDbBinding();
			results.push({
				step: "Sandbox no direct DB access",
				success: bindingsResult?.success === true && !bindingsResult?.hasDb,
				data: bindingsResult
			});
		} catch (e) {
			results.push({
				step: "Sandbox no direct DB access",
				success: false,
				error: e instanceof Error ? e.message : String(e)
			});
		}
	} catch (e) {
		results.push({
			step: "Spawn sandbox with bridge",
			success: false,
			error: e instanceof Error ? e.message : String(e)
		});
	}
	const allPassed = results.every((r) => r.success);
	const passCount = results.filter((r) => r.success).length;
	const failCount = results.filter((r) => !r.success).length;
	return renderTemplate`<html lang="en" data-astro-cid-ktcmxv63><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Sandbox Plugin Test</title>${renderHead($$result)}</head><body data-astro-cid-ktcmxv63><h1 data-astro-cid-ktcmxv63>Sandbox Plugin Test</h1><div${addAttribute(`summary ${allPassed ? "pass" : "fail"}`, "class")} data-astro-cid-ktcmxv63>${allPassed ? "All Tests Passed!" : "Some Tests Failed"}<div class="stats" data-astro-cid-ktcmxv63>${passCount} passed, ${failCount} failed</div></div><h2 data-astro-cid-ktcmxv63>Infrastructure</h2>${results.filter((r) => r.step.startsWith("Check")).map((r) => renderTemplate`<div${addAttribute(`result ${r.success ? "success" : "error"}`, "class")} data-astro-cid-ktcmxv63><div class="step-name" data-astro-cid-ktcmxv63>${r.success ? "✓" : "✗"} ${r.step}</div>${r.error && renderTemplate`<pre data-astro-cid-ktcmxv63>Error: ${r.error}</pre>`}${r.data && renderTemplate`<pre data-astro-cid-ktcmxv63>${JSON.stringify(r.data, null, 2)}</pre>`}</div>`)}<h2 data-astro-cid-ktcmxv63>Bridge Direct Tests</h2>${results.filter((r) => r.step.startsWith("Bridge") || r.step.startsWith("Block") || r.step === "Create bridge instance").map((r) => renderTemplate`<div${addAttribute(`result ${r.success ? "success" : "error"}`, "class")} data-astro-cid-ktcmxv63><div class="step-name" data-astro-cid-ktcmxv63>${r.success ? "✓" : "✗"} ${r.step}</div>${r.error && renderTemplate`<pre data-astro-cid-ktcmxv63>Error: ${r.error}</pre>`}${r.data && renderTemplate`<pre data-astro-cid-ktcmxv63>${JSON.stringify(r.data, null, 2)}</pre>`}</div>`)}<h2 data-astro-cid-ktcmxv63>Sandbox Tests (via Worker Loader)</h2>${results.filter((r) => (r.step.startsWith("Sandbox") || r.step.startsWith("Spawn")) && !r.step.includes("direct") && !r.step.includes("no direct")).map((r) => renderTemplate`<div${addAttribute(`result ${r.success ? "success" : "error"}`, "class")} data-astro-cid-ktcmxv63><div class="step-name" data-astro-cid-ktcmxv63>${r.success ? "✓" : "✗"} ${r.step}</div>${r.error && renderTemplate`<pre data-astro-cid-ktcmxv63>Error: ${r.error}</pre>`}${r.data && renderTemplate`<pre data-astro-cid-ktcmxv63>${JSON.stringify(r.data, null, 2)}</pre>`}</div>`)}<h2 data-astro-cid-ktcmxv63>Isolation Tests (sandbox can't bypass bridge)</h2>${results.filter((r) => r.step.includes("direct") || r.step.includes("no direct")).map((r) => renderTemplate`<div${addAttribute(`result ${r.success ? "success" : "error"}`, "class")} data-astro-cid-ktcmxv63><div class="step-name" data-astro-cid-ktcmxv63>${r.success ? "✓" : "✗"} ${r.step}</div>${r.error && renderTemplate`<pre data-astro-cid-ktcmxv63>Error: ${r.error}</pre>`}${r.data && renderTemplate`<pre data-astro-cid-ktcmxv63>${JSON.stringify(r.data, null, 2)}</pre>`}</div>`)}<h2 data-astro-cid-ktcmxv63>Architecture</h2><pre data-astro-cid-ktcmxv63>${`
┌─────────────────────────────────────────────────────────────┐
│                    HOST WORKER (Astro)                       │
│                                                              │
│  ┌──────────────────┐     ┌─────────────────────────────┐   │
│  │  PluginBridge    │     │       EmDash CMS          │   │
│  │  (Entrypoint)    │     │                             │   │
│  │                  │     │  - Routes/Pages             │   │
│  │  - kvGet/Set     │◄────│  - Middleware               │   │
│  │  - storageQuery  │     │  - API handlers             │   │
│  │  - contentList   │     │                             │   │
│  │  - httpFetch     │     └─────────────────────────────┘   │
│  │                  │                                        │
│  │  (has DB access) │     ┌─────────────────────────────┐   │
│  └────────▲─────────┘     │     Worker Loader           │   │
│           │               │                             │   │
│           │ RPC           │  Spawns sandboxed isolates  │   │
│           │               └──────────────┬──────────────┘   │
└───────────┼──────────────────────────────┼──────────────────┘
            │                              │
            │                              ▼
┌───────────┴──────────────────────────────────────────────────┐
│                    SANDBOX ISOLATE                           │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Plugin Code                                            │ │
│  │                                                         │ │
│  │  - NO direct DB access                                  │ │
│  │  - NO direct network (globalOutbound: null)             │ │
│  │  - Only has BRIDGE service binding                      │ │
│  │                                                         │ │
│  │  ctx.kv.get() ──► env.BRIDGE.kvGet() ──► Host DB        │ │
│  │  ctx.http.fetch() ──► env.BRIDGE.httpFetch() ──► Host   │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
		`}</pre></body></html>`;
}, "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/src/pages/sandbox-plugin-test.astro", void 0);
var $$file = "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/src/pages/sandbox-plugin-test.astro";
var $$url = "/sandbox-plugin-test";
//#endregion
//#region \0virtual:astro:page:src/pages/sandbox-plugin-test@_@astro
var page = () => sandbox_plugin_test_exports;
//#endregion
export { page };
