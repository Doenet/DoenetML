import { defineConfig } from "vite";
import { suppressLogPlugin } from "../../scripts/vite-plugins";

// Builds the activity coordinator (dist/coordinator.js): a small classic
// script — no React, no dependence on the main bundle — that a static host
// page (e.g. a PreTeXt book) adds alongside its DoenetML activity iframes.
// See src/coordinator.ts. Runs AFTER the main build (wireit dependency)
// into the same dist/, so the file publishes next to doenet-standalone.js.
export default defineConfig({
    plugins: [suppressLogPlugin()],
    build: {
        minify: true,
        sourcemap: true,
        emptyOutDir: false,
        lib: {
            entry: { coordinator: "./src/coordinator.ts" },
            formats: ["iife"],
            name: "DoenetCoordinator",
        },
        rollupOptions: {
            output: {
                entryFileNames: "coordinator.js",
            },
        },
    },
    define: {
        "process.env.NODE_ENV": '"production"',
    },
});
