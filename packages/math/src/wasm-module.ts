/**
 * The shape of the wasm-bindgen module `wasm-loader.ts` injects.
 *
 * Hand-written, and the one declaration here that is not upstream's. The
 * published `math-expressions` types `setWasmModule` as taking an opaque
 * module, which is honest about what it does with the argument but says
 * nothing about what the argument has to be. This describes the members the
 * compat layer actually calls, so the `guarded` Proxy in `wasm-loader.ts` has
 * a type to stand behind rather than `any`.
 *
 * It lived in `vendor-shims.d.ts` as `declare module "math-expressions-rs-wasm"`
 * while that was a real package inside the `vendor/math-expressions` submodule.
 * It is not one any more — its bindings are bundled into the published
 * `math-expressions` dist — so declaring the name would be describing a module
 * nothing can import.
 */

/** Minimal shape of a wasm-bindgen `Expression` handle. */
export interface RustExprLike {
    tree_json(): string;
    normalize_function_names(): RustExprLike;
    free?(): void;
    readonly __wbg_ptr?: number;
}

/** The free functions the wasm module exports. */
export interface WasmModule {
    parse_text(source: string): RustExprLike;
    parse_latex(source: string): RustExprLike;
    parse_text_with_options(source: string, optionsJson: string): RustExprLike;
    parse_latex_with_options(source: string, optionsJson: string): RustExprLike;
    from_ast(treeJson: string): RustExprLike;
    [key: string]: unknown;
}
