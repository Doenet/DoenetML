import { defineConfig, type Plugin } from "vite";
import dts from "vite-plugin-dts";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { createPackageJsonTransformer } from "../../scripts/transform-package-json";
import {
    ignoreWireitCachesPlugin,
    suppressLogPlugin,
} from "../../scripts/vite-plugins";

// Left as bare imports and declared as peer dependencies, as in
// `packages/doenetml/vite.config.ts`: `math-expressions` is the math engine
// (inside this repository the `@doenet/math` seam; for a consumer the
// published package), and a host that also runs `@doenet/doenetml` resolves
// one copy of it.
const EXTERNAL_DEPS = ["math-expressions"];

// The published range, named here for the reason given beside
// `MATH_EXPRESSIONS_PUBLISHED_RANGE` in `packages/doenetml/vite.config.ts`
// (`package.json` says `file:../math`, which is what makes the specifier
// resolve to the seam in this repository). Keep the two in step.
const MATH_EXPRESSIONS_PUBLISHED_RANGE = "^3.0.0-alpha.1";

/**
 * Keep the resolver WASM out of the bundle.
 *
 * The wasm-bindgen glue's fallback, `new URL("lib_doenetml_worker_bg.wasm",
 * import.meta.url)`, is an asset reference to Vite, which in library mode
 * inlines it as a ~10 MB base64 `data:` URL. The WASM is shipped as a file
 * beside the bundle instead (the copy below) and handed to `init`
 * explicitly, so the reference is marked for Vite to leave alone; left as it
 * is, it also names that same file.
 */
function keepResolverWasmExternal(): Plugin {
    return {
        name: "keep-resolver-wasm-external",
        enforce: "pre",
        transform(code, id) {
            if (!id.endsWith("lib_doenetml_worker.js")) {
                return null;
            }
            const replaced = code.replace(
                /new URL\((['"])lib_doenetml_worker_bg\.wasm\1, import\.meta\.url\)/,
                "new URL(/* @vite-ignore */ $1lib_doenetml_worker_bg.wasm$1, import.meta.url)",
            );
            if (replaced === code) {
                this.error(
                    "keep-resolver-wasm-external: the wasm-bindgen glue no longer names its WASM the way this plugin expects; update the pattern, or the WASM will be inlined into the bundle.",
                );
            }
            return { code: replaced, map: null };
        },
    };
}

// https://vitejs.dev/config/
export default defineConfig({
    base: "./",
    plugins: [
        ignoreWireitCachesPlugin(),
        suppressLogPlugin(),
        keepResolverWasmExternal(),
        dts({ rollupTypes: true }),
        viteStaticCopy({
            targets: [
                {
                    // The resolver WASM, beside the code that reads it
                    // (`src/resolverWasm.ts`): a file read from disk in Node,
                    // rather than ~MBs of base64 inlined into the bundle.
                    src: "../doenetml-worker-rust/lib-js-wasm-binding/pkg/lib_doenetml_worker_bg.wasm",
                    dest: "./",
                },
                {
                    src: "package.json",
                    dest: "./",
                    transform: createPackageJsonTransformer({
                        externalDeps: EXTERNAL_DEPS,
                        publishRanges: {
                            "math-expressions":
                                MATH_EXPRESSIONS_PUBLISHED_RANGE,
                        },
                    }),
                },
                { src: "README.md", dest: "./" },
            ],
        }),
    ],
    define: {
        // As in the worker builds: the message catalogs stay out of the
        // bundle; the core computes its prose in English unless given others.
        __DOENET_CODE_SPLIT_CATALOGS__: "false",
    },
    build: {
        minify: false,
        sourcemap: true,
        target: "node20",
        lib: {
            entry: {
                index: "./src/index.ts",
            },
            formats: ["es"],
        },
        rollupOptions: {
            external: [...EXTERNAL_DEPS, /^math-expressions\//, /^node:/],
        },
    },
});
