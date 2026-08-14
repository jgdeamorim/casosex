// @ts-check
import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import react from "@astrojs/react";
import emdash, { local } from "emdash/astro";
import { sqlite } from "emdash/db";

// https://astro.build/config
export default defineConfig({
	output: "server",
	adapter: node({
		mode: "standalone",
	}),
	integrations: [
		react(),
		emdash({
			database: sqlite({ url: "file:./data.db" }),
			storage: local({
				directory: "./uploads",
				baseUrl: "/_emdash/api/media/file",
			}),
		}),
	],
	devToolbar: { enabled: false },
});