import { defineConfig } from "vite";
import { suppressLogPlugin } from "../../scripts/vite-plugins";

// Build a self-contained ES-module version of the worker (index.esm.js).
// This is required for type: "module" web workers (e.g. Deno) as opposed to
// the IIFE build (index.js) used by classic workers.
//
// The entry is src/CoreWorker.ts rather than src/index.ts so that Rollup
// does not see a barrel re-export and split the output into multiple chunks.
export default defineConfig({
    plugins: [suppressLogPlugin()],
    base: "./",
    build: {
        minify: true,
        sourcemap: true,
        // Do NOT clear the output directory: the IIFE build (index.js) must
        // already be there when this second build runs.
        emptyOutDir: false,
        lib: {
            entry: "src/CoreWorker.ts",
            fileName: () => "index.esm.js",
            formats: ["es"],
        },
        rollupOptions: {
            output: {
                // Force everything into a single file so it can be loaded as a
                // Blob URL (a chunked ESM build can't resolve sibling chunk URLs
                // from a blob: URL).
                inlineDynamicImports: true,
            },
        },
    },
    esbuild: {
        legalComments: "none",
    },
});
