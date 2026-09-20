import { Plugin, defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { suppressLogPlugin } from "../../scripts/vite-plugins";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { version as standaloneVersion } from "../standalone/package.json";

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        // `math-expressions` (the `@doenet/math` seam) arrives here through
        // several dependencies, each of which externalizes it. This entry is
        // **defensive**, not a fix for an observed duplication: every one of
        // those dependencies declares the identical `file:../math` range, so
        // npm hoists a single `node_modules/math-expressions` symlink and vite
        // resolves it to one realpath for all of them. What it guards is a
        // future in which that stops being true — a differing range nests a
        // second install, and this bundle picks up two copies of the engine
        // (~4.5 MiB of duplicated inlined WASM, and two WASM instantiations at
        // runtime) with nothing to make that visible but the bundle size.
        //
        // The seam is deliberately NOT externalized here: this bundle is
        // fetched on its own by URL and has to stay self-contained (see the
        // viteStaticCopy note in packages/standalone/vite.config.ts). One copy
        // is correct; two is a bug.
        dedupe: ["math-expressions"],
    },
    // Note: for some reason {rollupTypes: true} causes an extra `.d` to be added to the types file name.
    // So, it becomes `index.d.d.ts` instead of `index.d.ts`. So avoid rolling up the types until this can be resolved.
    plugins: [
        dts(),
        suppressLogPlugin(),
        viteStaticCopy({
            targets: [
                {
                    // Copy the WASM into the dist directory. This is the copy
                    // the worker fetches at run time: the WASM is served
                    // beside `index.js` rather than inlined into it (#1438),
                    // so the browser's URL-keyed machine-code cache shares
                    // one compilation across workers, iframes, and page
                    // views. See the loading ladder in `src/wasmLoading.ts`.
                    src: "../doenetml-worker-rust/lib-js-wasm-binding/pkg/lib_doenetml_worker_bg.wasm*",
                    dest: "./",
                },
            ],
        }),
    ],
    base: "./",
    define: {
        // The worker's last-resort WASM URL names the @doenet/standalone
        // release it was built as — that package carries the deployed copy of
        // the worker directory, and the published packages version together.
        // See the loading ladder in `src/wasmLoading.ts`.
        __DOENET_STANDALONE_VERSION__: JSON.stringify(standaloneVersion),
        // The worker is one file — an IIFE started from a blob URL in some
        // variants — so it can neither code-split nor fetch. It never needs
        // to: the main thread negotiates the content locale, loads the
        // catalog, and hands it over as `LocaleData.resources`. Switching
        // `@doenet/i18n`'s lazy-catalog glob off makes that branch dead code,
        // which is what keeps every translation out of this bundle.
        __DOENET_CODE_SPLIT_CATALOGS__: "false",
    },
    build: {
        minify: true,
        sourcemap: true,
        lib: {
            entry: "src/index.ts",
            fileName: (_format, _entryName) => "index.js",
            formats: ["iife"],
            name: "doenetmlWorker",
        },
    },
    esbuild: {
        // Remove all legal comments, reducing output size.
        legalComments: "none",
    },
});
