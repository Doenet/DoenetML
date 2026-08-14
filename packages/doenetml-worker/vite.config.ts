import { Plugin, defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { suppressLogPlugin } from "../../scripts/vite-plugins";
import { viteStaticCopy } from "vite-plugin-static-copy";

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        // `math-expressions` (the `@doenet/math` seam) arrives here through
        // several dependencies, each of which externalizes it. Without dedupe
        // they resolve to distinct module instances and this bundle ends up
        // with two copies of the engine — ~4.5 MiB of duplicated inlined WASM,
        // and two separate WASM instantiations at runtime.
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
                    // Copy the WASM bundle into the dist directory.
                    src: "../doenetml-worker-rust/lib-js-wasm-binding/pkg/lib_doenetml_worker_bg.wasm*",
                    dest: "./",
                },
            ],
        }),
    ],
    base: "./",
    define: {
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
