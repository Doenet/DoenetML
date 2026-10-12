import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

// The DoenetML parser is the workspace's @doenet/parser, resolved through node_modules.
const repoRoot = resolve(__dirname, "..");
const monorepoRoot = resolve(repoRoot, "../..");

export default defineConfig({
    plugins: [react()],
    publicDir: resolve(repoRoot, "fixtures"),
    // COOP/COEP make the page cross-origin isolated so SharedArrayBuffer exists.
    server: {
        port: 5173,
        fs: { allow: [repoRoot, monorepoRoot] },
        headers: {
            "Cross-Origin-Opener-Policy": "same-origin",
            "Cross-Origin-Embedder-Policy": "require-corp",
        },
    },
    preview: {
        headers: {
            "Cross-Origin-Opener-Policy": "same-origin",
            "Cross-Origin-Embedder-Policy": "require-corp",
        },
    },
    worker: { format: "es" },
    build: { target: "esnext" },
});
