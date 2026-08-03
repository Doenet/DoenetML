import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const SUBMODULE = fileURLToPath(
    new URL("../../vendor/math-expressions/", import.meta.url),
);
const JS_COMPAT = resolve(SUBMODULE, "packages/math-expressions-js-compat");
const RS_WASM = resolve(SUBMODULE, "packages/math-expressions-rs-wasm");

export default defineConfig({
    base: "./",
    plugins: [
        // Our own `src/` only. The compat layer's `lib/**` is loosely typed
        // JS-in-TS and is an implementation detail of this package; consumers
        // are typed by `src/types.ts`, and the submodule modules we import are
        // declared in `src/vendor-shims.d.ts` rather than walked.
        dts({ include: ["src"] }),
    ],
    resolve: {
        alias: [
            {
                find: /^math-expressions-js-compat\/lib\/(.*)$/,
                replacement: resolve(JS_COMPAT, "lib/$1"),
            },
            {
                find: /^math-expressions-js-compat$/,
                replacement: resolve(JS_COMPAT, "lib/math-expressions.ts"),
            },
            {
                find: /^math-expressions-rs-wasm$/,
                replacement: resolve(RS_WASM, "src-js/index.ts"),
            },
            // The generated wasm-bindgen glue for the `web` target. Built by
            // scripts/build-wasm.mjs; git-ignored.
            {
                find: /^math-expressions-wasm-glue$/,
                replacement: resolve(RS_WASM, "pkg/math_expressions_wasm.js"),
            },
        ],
    },
    build: {
        minify: false,
        sourcemap: true,
        lib: {
            entry: {
                index: "./src/index.ts",
                "engine-rust": "./src/engine-rust.ts",
            },
            formats: ["es"],
        },
        rollupOptions: {
            // math.js stays a bare import: every consumer of this package
            // already resolves it, and a second copy would be pure bundle
            // weight. The WASM core is the opposite case — it is inlined on
            // purpose (see scripts/build-wasm.mjs).
            external: ["mathjs"],
        },
    },
});
