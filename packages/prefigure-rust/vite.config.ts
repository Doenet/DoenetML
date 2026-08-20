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
                    src: "pkg/prefig_wasm_bg.wasm*",
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
            formats: ["es"],
            name: "prefigureRust",
        },
    },
    esbuild: {
        // Remove all legal comments, reducing output size.
        legalComments: "none",
    },
});

/**
 * Prevent `prefig_wasm.js` (wasm-bindgen's `--target web` glue code) from
 * bundling the associated WASM file, since it will be included manually
 * in the build process (see `viteStaticCopy` above).
 */
function preventWasmBundlingPlugin(): Plugin {
    return {
        name: "prevent-wasm-bundling",
        transform(code, id, _options) {
            if (id.endsWith("prefig_wasm.js")) {
                return {
                    // WARNING: This code is very fragile and depends on modifying line:
                    // ```
                    // if (module_or_path === undefined) {
                    //     module_or_path = new URL('prefig_wasm_bg.wasm', import.meta.url);
                    // }
                    // ```
                    // of `prefig_wasm.js` to prevent vite from bundling the WASM file.
                    // If there is a better way to do this, fix this code. (Mirrors the
                    // identical workaround in packages/doenetml-worker-rust/vite.config.ts.)
                    code: code.replaceAll(
                        /(.* new URL\('prefig_wasm_bg.wasm', import\.meta\.url\);.*)/g,
                        "// $1",
                    ),
                    map: null,
                };
            }
        },
    };
}
