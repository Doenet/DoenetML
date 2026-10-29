import { defineConfig } from "vite";
import {
    cellsWasmNotInlinedPlugin,
    suppressLogPlugin,
} from "../../scripts/vite-plugins";
import { version as standaloneVersion } from "../standalone/package.json";

// Build the cells core's own worker (cells-worker.js), beside the worker
// that hosts every core (ADR 0020 in packages/cells-core). One IIFE file,
// as that worker is; its WASM is fetched from beside it, as that worker's is
// (src/wasmLoading.ts), and was copied there by vite.config.ts.
export default defineConfig({
    plugins: [suppressLogPlugin(), cellsWasmNotInlinedPlugin()],
    base: "./",
    define: {
        // As in the IIFE build: the last-resort WASM URL (unused for the
        // cells core's, which only its own directory serves).
        __DOENET_STANDALONE_VERSION__: JSON.stringify(standaloneVersion),
    },
    build: {
        minify: true,
        sourcemap: true,
        // Do NOT clear the output directory: the other builds' files are
        // already there.
        emptyOutDir: false,
        lib: {
            entry: "src/cells/worker.ts",
            fileName: () => "cells-worker.js",
            formats: ["iife"],
            name: "doenetmlCellsWorker",
        },
    },
    esbuild: { legalComments: "none" },
});
