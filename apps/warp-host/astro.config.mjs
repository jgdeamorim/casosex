// @ts-check
import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import react from "@astrojs/react";
import emdash, { local } from "emdash/astro";
import { sqlite } from "emdash/db";
import { resolve } from "node:path";
import { passwordAuth } from "./src/auth/passwordProvider";

// https://astro.build/config
export default defineConfig({
	output: "server",
	adapter: node({
		mode: "standalone",
	}),
	vite: {
		resolve: {
			alias: [
				{
					find: /^@emdash-cms\/admin\/styles\.css/,
					replacement: resolve(
						process.cwd(),
						"node_modules/@emdash-cms/admin/dist/styles.css"
					),
				},
			],
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
			authProviders: [passwordAuth()],
		}),
	],
	devToolbar: { enabled: false },
});