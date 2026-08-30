import react from "@vitejs/plugin-react-swc";
import * as dotenv from "dotenv";
import path from "path";
import { defineConfig, loadEnv } from "vite";
import istanbul from "vite-plugin-istanbul";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";
import {
  API_ROUTES,
  BASENAME,
  PORT,
  PROXY_TARGET,
} from "./src/customization/config-constants";
import { createAccessTokenExpireSecondsDefinition } from "./vite-env-definitions";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const envLangflowResult = dotenv.config({
    path: path.resolve(__dirname, "../../.env"),
  });

  const envLangflow = envLangflowResult.parsed || {};

  const apiRoutes = API_ROUTES || ["^/api/v1/", "^/api/v2/", "/health", "/health_check"];

  const target =
    env.VITE_PROXY_TARGET || PROXY_TARGET || "http://localhost:7860";

  const port = Number(env.VITE_PORT) || 5556;

  const proxyTargets = apiRoutes.reduce((proxyObj, route) => {
    proxyObj[route] = {
      target: target,
      changeOrigin: true,
      secure: false,
      ws: true,
    };
    return proxyObj;
  }, {});

  return {
    base: BASENAME || "",
    build: {
      outDir: "build",
      target: "esnext",
      modulePreload: false,
      sourcemap: false,
      reportCompressedSize: false,
      chunkSizeWarningLimit: 1000,
      cssMinify: "esbuild",
      minify: "esbuild",
      maxParallelFileOps: 2,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              if (id.includes("react-dom") || id.includes("react-router")) {
                return "vendor-react";
              }
              if (id.includes("lucide-react")) {
                return "vendor-lucide";
              }
              if (id.includes("@dnd-kit")) {
                return "vendor-dndkit";
              }
              if (id.includes("@radix-ui") || id.includes("framer-motion")) {
                return "vendor-ui";
              }
              if (id.includes("monaco-editor") || id.includes("ace-builds")) {
                return "vendor-editors";
              }
              return "vendor-others";
            }
          },
        },
      },
    },
    define: {
      ...createAccessTokenExpireSecondsDefinition(
        envLangflow.ACCESS_TOKEN_EXPIRE_SECONDS,
      ),
      "import.meta.env.BACKEND_URL": JSON.stringify(
        envLangflow.BACKEND_URL ?? "http://localhost:7860",
      ),
      "import.meta.env.CI": JSON.stringify(envLangflow.CI ?? false),
      __LANGFLOW_AUTO_LOGIN__: JSON.stringify(
        envLangflow.LANGFLOW_AUTO_LOGIN ?? true,
      ),
      "import.meta.env.LANGFLOW_MCP_COMPOSER_ENABLED": JSON.stringify(
        envLangflow.LANGFLOW_MCP_COMPOSER_ENABLED ?? "true",
      ),
      "import.meta.env.LANGFLOW_EXTENSION_RELOAD_ENABLED": JSON.stringify(
        envLangflow.LANGFLOW_EXTENSION_RELOAD_ENABLED ?? "true",
      ),
      "import.meta.env.LANGFLOW_WXO_UTM_SOURCE": JSON.stringify(
        envLangflow.LANGFLOW_WXO_UTM_SOURCE ?? "langflow",
      ),
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@queries": path.resolve(__dirname, "./src/controllers/API/queries"),
      },
    },
    plugins: [
      tsconfigPaths(),
      react(),
      svgr(),
      process.env.VITE_COVERAGE
        ? istanbul({
            include: "src/**/*",
            extension: [".ts", ".tsx", ".js", ".jsx"],
          })
        : null,
    ].filter(Boolean),
    server: {
      port: port,
      host: "127.0.0.1",
      strictPort: true,
      hmr: {
        host: "127.0.0.1",
        port: port,
      },
      proxy: {
        ...proxyTargets,
      },
    },
    optimizeDeps: {
      holdUntilCrawlEnd: false,
    },
  };
});
