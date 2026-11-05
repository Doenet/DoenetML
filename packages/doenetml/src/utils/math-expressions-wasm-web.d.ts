/**
 * The published `math-expressions`'s `--target web` wasm-bindgen glue.
 *
 * Declared here because *in this repository* the specifier resolves to the
 * wrong module: `math-expressions` is `file:../math` in every workspace, and
 * `@doenet/math` answers this subpath with a stub that throws
 * (`packages/math/src/wasm-web-stub.ts`), since it inlines the core instead of
 * shipping one beside the bundle. Typing the import from that stub would
 * describe the placeholder rather than the module the code actually calls,
 * which only ever happens outside this repository — on the path where the
 * published `math-expressions` is what satisfied the peer dependency.
 *
 * So this describes the published glue, and it is the narrowest description
 * that compiles: the fallback calls `default()` with no argument and passes
 * the namespace to upstream's `setWasmModule`, which takes an opaque module.
 * Nothing reads an individual binding off it, so nothing more needs
 * describing.
 */
declare module "math-expressions/wasm-web/math_expressions_wasm.js" {
    /**
     * Instantiate the module. With no argument the glue resolves
     * `new URL("math_expressions_wasm_bg.wasm", import.meta.url)`, which a
     * bundler rewrites to the asset it emitted beside the chunk.
     */
    export default function init(module_or_path?: unknown): Promise<unknown>;
}
