import { Plugin, defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { suppressLogPlugin } from "../../scripts/vite-plugins";
import { viteStaticCopy } from "vite-plugin-static-copy";

// https://vitejs.dev/config/
export default defineConfig({
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
