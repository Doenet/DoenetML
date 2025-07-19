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
        preventWasmBundlingPlugin(),
        suppressLogPlugin(),
        viteStaticCopy({
            targets: [
                {
                    // Copy the WASM bundle into the dist directory.
                    src: "lib-js-wasm-binding/pkg/lib_doenetml_worker_bg.wasm*",
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
            entry: "lib-js-wasm-binding/src/index.ts",
            fileName: (_format, _entryName) => "index.js",
            formats: ["es"],
            name: "doenetmlWorker",
        },
    },
    esbuild: {
        // Remove all legal comments, reducing output size.
        legalComments: "none",
    },
});

/**
 * Prevent `lib_doenetml_worker.js` from bundling the associated WASM file,
 * since it will be included manually in the build process.
 */
function preventWasmBundlingPlugin(): Plugin {
    return {
        name: "prevent-wasm-bundling",
        transform(code, id, options) {
            if (id.endsWith("lib_doenetml_worker.js")) {
                return {
                    // 2025-07-02
                    // WARNING: This code is very fragile and depends on modifying line:
                    // ```
                    // if (typeof module_or_path === 'undefined') {
                    //       module_or_path = new URL('lib_doenetml_worker_bg.wasm', import.meta.url);
                    //   }
                    // ```
                    // of `lib_doenetml_worker.js` to prevent vite from bundling the WASM file.
                    // If there is a better way to do this, fix this code
                    code: code.replaceAll(
                        /(.* new URL\('lib_doenetml_worker_bg.wasm', import\.meta\.url\);.*)/g,
                        "// $1",
                    ),
                    // TODO: This is a small change, and I'm not sure how to make a source map for it.
                    map: null,
                };
            }
        },
    };
}
