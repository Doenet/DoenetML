/**
 * Ambient declarations for the three modules this package pulls out of the
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

    const context: Context;
    export default context;
}

declare module "math-expressions-js-compat/lib/mathjs" {
    const math: unknown;
    export default math;
}

declare module "math-expressions-js-compat/lib/_wasm" {
    import type { WasmModule } from "math-expressions-rs-wasm";

    /**
     * Supply the WASM module the compat layer runs on. Must be called before
     * the `math-expressions-js-compat` barrel is evaluated — see the note in
     * `./wasm-loader` — otherwise compat falls back to its node-only vendored
     * build. `./wasm-loader` is the only caller.
     */
    export function setWasmModule(mod: WasmModule): void;
}

declare module "math-expressions-rs-wasm" {
    /** Minimal shape of a wasm-bindgen `Expression` handle. */
    export interface RustExprLike {
        tree_json(): string;
        normalize_function_names(): RustExprLike;
        free?(): void;
        readonly __wbg_ptr?: number;
    }

    /** A compiled math.js evaluator. */
    export interface EvalFunction {
        evaluate(scope?: Record<string, unknown>): unknown;
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

    export function compileRustExpr(
        math: unknown,
        expr: RustExprLike,
        options?: { normalize?: boolean },
    ): EvalFunction;
}

declare module "math-expressions-wasm-glue" {
    export function initSync(options: {
        module: Uint8Array | ArrayBuffer;
    }): unknown;
    export default function init(options?: {
        module_or_path?: Uint8Array | ArrayBuffer | string | URL;
    }): Promise<unknown>;
}
