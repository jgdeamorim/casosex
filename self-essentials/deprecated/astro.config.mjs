import node from "@astrojs/node";
import react from "@astrojs/react";
import { defineConfig } from "astro/config";
import emdash, { local } from "emdash/astro";
import { sqlite } from "emdash/db";

import { dashcommerce } from "./self-essentials/dashcommerce-main/packages/core/dist/index.js";

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
			alias: [
				{ find: /^@emdash-cms\/admin\/styles\.css/, replacement: path.resolve("./self-essentials/emdash-main/packages/admin/dist/styles.css") },
				{ find: "@emdash-cms/admin", replacement: path.resolve("./self-essentials/emdash-main/packages/admin/dist/index.js") },
				{ find: "@dashcommerce/core/sandbox", replacement: path.resolve("./self-essentials/dashcommerce-main/packages/core/dist/sandbox-entry.js") },
				{ find: "@dashcommerce/core/admin", replacement: path.resolve("./self-essentials/dashcommerce-main/packages/core/dist/admin/entry.js") },
				{ find: "@dashcommerce/core/astro/components", replacement: path.resolve("./self-essentials/dashcommerce-main/packages/core/src/astro/components") },
				{ find: "@dashcommerce/core/astro/islands", replacement: path.resolve("./self-essentials/dashcommerce-main/packages/core/src/astro/islands") },
				{ find: "@dashcommerce/core/astro", replacement: path.resolve("./self-essentials/dashcommerce-main/packages/core/src/astro/index.ts") },
				{ find: "@dashcommerce/core", replacement: path.resolve("./self-essentials/dashcommerce-main/packages/core/dist/index.js") },
			],
		},
		server: {
			fs: {
				allow: ["/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX"],
			},
			watch: {
				ignored: ["**/.pnpm-store/**", "**/node_modules/**"],
			},
		},
	},
	i18n: {
		defaultLocale: "pt-BR",
		locales: ["pt-BR", "en"],
		fallback: {
			en: "pt-BR",
		},
	},
	integrations: [
		react(),
		emdash({
			database: sqlite({ url: "file:./data.db" }),
			storage: local({
				directory: "./uploads",
				baseUrl: "/_emdash/api/media/file",
			}),
			plugins: [dashcommerce()],
		}),
	],
	devToolbar: { enabled: false },
});
