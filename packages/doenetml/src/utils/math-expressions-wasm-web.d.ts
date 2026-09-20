/**
 * The published `math-expressions`'s `--target web` wasm-bindgen glue.
 *
 * Declared here because the specifier does not resolve *in this repository*:
 * `math-expressions` is `file:../math` in every workspace, and `@doenet/math`
 * has no `./wasm-web/*` export — it inlines the core instead of shipping one
 * beside the bundle. The published package does export that subpath, and
 * `./mathWasm.ts` reaches for it only on the path where the published package
 * is what satisfied the peer dependency, which by construction never runs
 * here.
 *
 * So this is a declaration of something absent on purpose, and it is the
 * narrowest one that compiles: the fallback calls `default()` with no argument
 * and passes the namespace to upstream's `setWasmModule`, which takes an
 * opaque module. Nothing reads an individual binding off it, so nothing more
 * needs describing.
 */
declare module "math-expressions/wasm-web/math_expressions_wasm.js" {
    /**
     * Instantiate the module. With no argument the glue resolves
     * `new URL("math_expressions_wasm_bg.wasm", import.meta.url)`, which a
     * bundler rewrites to the asset it emitted beside the chunk.
     */
    export default function init(module_or_path?: unknown): Promise<unknown>;
}
