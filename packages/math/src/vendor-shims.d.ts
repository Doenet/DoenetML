/**
 * The one module specifier in this package that no package supplies.
 *
 * `math-expressions-wasm-glue` is a `vite.config.ts` alias for
 * `src/generated/math_expressions_wasm.js`, the wasm-bindgen glue that
 * `scripts/build-wasm.mjs` copies out of the published `math-expressions`
 * tarball. It is aliased rather than imported from `node_modules` directly
 * because `dropDefaultWasmPath` matches on `src/generated/`, and a module
 * resolved past it would carry a second ~2.25 MiB copy of the core.
 *
 * Everything else this package once declared here now comes from the
 * `math-expressions` package itself — the compat surface from its own
 * `types/math-expressions.d.ts`, and the injected module's shape from
 * `./wasm-module.ts`.
 */

declare module "math-expressions-wasm-glue" {
    export function initSync(options: {
        module: Uint8Array | ArrayBuffer;
    }): unknown;
    export default function init(options?: {
        module_or_path?: Uint8Array | ArrayBuffer | string | URL;
    }): Promise<unknown>;
}
