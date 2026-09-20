import { defineConfig } from "vite";
import { suppressLogPlugin } from "../../scripts/vite-plugins";
import { version as standaloneVersion } from "../standalone/package.json";

// Build a single-file ES-module version of the worker (index.esm.js).
// This is required for type: "module" web workers (e.g. Deno) as opposed to
// the IIFE build (index.js) used by classic workers. Like that build, this
// one does not carry the WASM: the worker locates it at run time (see the
// loading ladder in `src/wasmLoading.ts`), and a consumer that boots this file
// from a blob URL supplies it via `self.__doenetWorkerWasmUrl`.
//
// The entry is src/CoreWorker.ts rather than src/index.ts so that Rollup
// does not see a barrel re-export and split the output into multiple chunks.
export default defineConfig({
    plugins: [suppressLogPlugin()],
    base: "./",
    define: {
        // As in the IIFE build: the worker's last-resort WASM URL names the
        // @doenet/standalone release it was built as.
        __DOENET_STANDALONE_VERSION__: JSON.stringify(standaloneVersion),
        // As in the IIFE build: `inlineDynamicImports` below would fold every
        // message catalog into this file, and the worker is handed the one
        // catalog it needs as `LocaleData.resources` anyway.
        __DOENET_CODE_SPLIT_CATALOGS__: "false",
    },
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
