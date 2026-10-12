import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

// The DoenetML parser is imported from a sibling checkout (see scripts/parse-dast.mjs).
const doenetml = process.env.DOENETML_DIR ?? resolve(__dirname, "../../../ml");
const repoRoot = resolve(__dirname, "..");

export default defineConfig({
  plugins: [react()],
  publicDir: resolve(repoRoot, "fixtures"),
  resolve: {
    alias: {
      "@doenet/parser": resolve(doenetml, "packages/parser/dist/index.js"),
      "@doenet/static-assets/schema": resolve(doenetml, "packages/static-assets/dist/schema.js"),
      "@doenet/static-assets/entity-map": resolve(doenetml, "packages/static-assets/dist/entity-map.js"),
    },
  },
  // COOP/COEP make the page cross-origin isolated so SharedArrayBuffer exists.
  server: {
    port: 5173,
    fs: { allow: [repoRoot, doenetml] },
    headers: { "Cross-Origin-Opener-Policy": "same-origin", "Cross-Origin-Embedder-Policy": "require-corp" },
  },
  preview: {
    headers: { "Cross-Origin-Opener-Policy": "same-origin", "Cross-Origin-Embedder-Policy": "require-corp" },
  },
  worker: { format: "es" },
  build: { target: "esnext" },
});
