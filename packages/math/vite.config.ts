import { defineConfig, type Plugin } from "vite";
import dts from "vite-plugin-dts";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const SUBMODULE = fileURLToPath(
    new URL("../../vendor/math-expressions/", import.meta.url),
);
const JS_COMPAT = resolve(SUBMODULE, "packages/math-expressions-js-compat");
const RS_WASM = resolve(SUBMODULE, "packages/math-expressions-rs-wasm");
// Written by scripts/build-wasm.mjs; git-ignored.
const GENERATED = fileURLToPath(new URL("src/generated/", import.meta.url));

/**
 * Drop the wasm-bindgen glue's *default* WASM path.
 *
 * The generated `web`-target glue ends its init with
 *
 *     if (module_or_path === undefined)
 *         module_or_path = new URL('math_expressions_wasm_bg.wasm', import.meta.url);
 *
 * In library mode Vite resolves that `new URL(..., import.meta.url)` to an
 * asset and, having nowhere to emit a sibling file, inlines it as a
 * `data:application/wasm;base64` URI. The result is the core embedded *twice* —
 * once as `WASM_BASE64` in `src/generated/wasm-bytes.ts`, which is the copy we
 * actually use, and once here, which nothing ever reads: `wasm-loader.ts`
 * always passes explicit bytes, so `module_or_path` is never undefined.
 *
 * That dead copy cost ~2.24 MiB — the 1.68 MiB core, base64-encoded — in this
 * bundle and again in every bundle that embeds it. Replacing the expression with a throw keeps the branch honest —
 * if a future caller does reach it, it fails with a clear message instead of
 * silently fetching a URL that will not resolve in a worker.
 */
function dropDefaultWasmPath(): Plugin {
    const NEEDLE =
        "module_or_path = new URL('math_expressions_wasm_bg.wasm', import.meta.url);";
    let hits = 0;
    return {
        name: "doenet:drop-default-wasm-path",
        enforce: "pre",
        transform(code, id) {
            if (!id.startsWith(GENERATED) || !code.includes(NEEDLE)) {
                return null;
            }
            hits++;
            return {
                code: code.replace(
                    NEEDLE,
                    'throw new Error("@doenet/math: the WASM core must be ' +
                        "initialized with explicit bytes (see wasm-loader.ts); " +
                        "the bundled default path was removed to avoid embedding " +
                        'the core twice.");',
                ),
                map: null,
            };
        },
        buildEnd(error) {
            // Rollup calls `buildEnd(error)` on failure too, and reporting
            // "the glue changed shape" would then bury the real error — which
            // is very likely why nothing was transformed. Only claim a miss
            // when the build otherwise succeeded.
            //
            // A silent no-op here would put the duplicate straight back, so
            // fail the build rather than regress by ~2.24 MiB unnoticed.
            if (!error && hits === 0) {
                this.error(
                    "doenet:drop-default-wasm-path matched nothing — the " +
                        "wasm-bindgen glue changed shape. Re-check the default " +
                        "`module_or_path` assignment before shipping, or the core " +
                        "will be inlined twice.",
                );
            }
        },
    };
}

export default defineConfig({
    base: "./",
    plugins: [
        dropDefaultWasmPath(),
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
            // The generated wasm-bindgen glue for the `web` target, copied
            // into this package by scripts/build-wasm.mjs.
            {
                find: /^math-expressions-wasm-glue$/,
                replacement: resolve(GENERATED, "math_expressions_wasm.js"),
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
