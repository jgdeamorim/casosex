import node from "@astrojs/node";
import react from "@astrojs/react";
import auditLog from "@emdash-cms/plugin-audit-log";
import { mcpSmokePlugin } from "@emdash-cms/plugin-mcp-smoke";
import { defineConfig, fontProviders } from "astro/config";
import emdash, { local } from "emdash/astro";
import { sqlite } from "emdash/db";

import { dashcommerce } from "../../../dashcommerce-main/packages/core/src/index.ts";

import path from "node:path";

export default defineConfig({
	output: "server",
	adapter: node({
		mode: "standalone",
	}),
	vite: {
		ssr: {
			noExternal: ["@dashcommerce/core"],
		},
		resolve: {
			alias: {
				"@dashcommerce/core/sandbox": path.resolve("../../../dashcommerce-main/packages/core/dist/sandbox-entry.js"),
				"@dashcommerce/core/admin": path.resolve("../../../dashcommerce-main/packages/core/dist/admin/entry.js"),
				"@dashcommerce/core": path.resolve("../../../dashcommerce-main/packages/core/dist/index.js"),
			},
		},
		server: {
			fs: {
				allow: ["/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX"],
			},
		},
	},
	image: {
		layout: "constrained",
		responsiveStyles: true,
	},
	integrations: [
		react(),
		emdash({
			database: sqlite({ url: "file:./data.db" }),
			storage: local({
				directory: "./uploads",
				baseUrl: "/_emdash/api/media/file",
			}),
			plugins: [auditLog, mcpSmokePlugin(), dashcommerce()],
		}),
	],
	fonts: [
		{
			provider: fontProviders.google(),
			name: "Inter",
			cssVariable: "--font-sans",
			weights: [400, 500, 600, 700],
			fallbacks: ["sans-serif"],
		},
		{
			provider: fontProviders.google(),
			name: "JetBrains Mono",
			cssVariable: "--font-mono",
			weights: [400, 500],
			fallbacks: ["monospace"],
		},
	],
	devToolbar: { enabled: false },
});
