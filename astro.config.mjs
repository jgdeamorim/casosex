import node from "@astrojs/node";
import react from "@astrojs/react";
import { defineConfig } from "astro/config";

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
				"@dashcommerce/core/sandbox": path.resolve("./self-essentials/dashcommerce-main/packages/core/dist/sandbox-entry.js"),
				"@dashcommerce/core/admin": path.resolve("./self-essentials/dashcommerce-main/packages/core/dist/admin/entry.js"),
				"@dashcommerce/core/astro/components": path.resolve("./self-essentials/dashcommerce-main/packages/core/src/astro/components"),
				"@dashcommerce/core/astro/islands": path.resolve("./self-essentials/dashcommerce-main/packages/core/src/astro/islands"),
				"@dashcommerce/core/astro": path.resolve("./self-essentials/dashcommerce-main/packages/core/src/astro/index.ts"),
				"@dashcommerce/core": path.resolve("./self-essentials/dashcommerce-main/packages/core/dist/index.js"),
			},
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
	],
	devToolbar: { enabled: false },
});
