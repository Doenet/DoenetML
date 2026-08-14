/**
 * Ambient declarations for the modules this package pulls out of the
 * `vendor/math-expressions` submodule at build time.
 *
 * We deliberately do *not* point tsconfig `paths` at the submodule's TypeScript
 * sources. Doing so drags its whole source tree into our program — it sits
 * outside `rootDir`, it is loosely typed JS-in-TS, and its internal layout is
 * upstream's business, not ours. Declaring only the surface we actually consume
 * keeps the type-check fast and, more importantly, means an upstream
 * reorganization breaks the build at a named contract here rather than
 * scattering errors through files we do not own.
 *
 * Each declaration below is a contract we depend on. If one drifts, that is a
 * real integration failure and should be fixed deliberately.
 */

declare module "math-expressions-js-compat" {
    import type { Context, Tree } from "./vendored/math-expressions";
    import type { WasmModule } from "math-expressions-rs-wasm";

    /** The compat `Expression` class. Structurally the legacy `Expression`. */
    export const Expression: {
        new (handle: unknown, context?: unknown): unknown;
        prototype: Record<string, unknown>;
    };

    export function isTree(value: unknown): value is Tree;

    /**
     * Supply the WASM module the compat layer runs on. Must be called before
     * anything parses an expression, or compat falls back to its node-only
     * vendored build. Re-exported by the barrel from `lib/_wasm`;
     * `./wasm-loader` is the only caller and imports it from here rather than
     * from the leaf, so nothing has to reach past the package entry point.
     */
    export function setWasmModule(mod: WasmModule): void;

    const context: Context;
    export default context;
}

declare module "math-expressions-rs-wasm" {
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
        parse_text_with_options(
            source: string,
            optionsJson: string,
        ): RustExprLike;
        parse_latex_with_options(
            source: string,
            optionsJson: string,
        ): RustExprLike;
        from_ast(treeJson: string): RustExprLike;
        [key: string]: unknown;
    }
}

declare module "math-expressions-wasm-glue" {
    export function initSync(options: {
        module: Uint8Array | ArrayBuffer;
    }): unknown;
    export default function init(options?: {
        module_or_path?: Uint8Array | ArrayBuffer | string | URL;
    }): Promise<unknown>;
}
