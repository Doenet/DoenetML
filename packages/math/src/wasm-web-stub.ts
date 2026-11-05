/**
 * Stands in for the published `math-expressions`'s
 * `./wasm-web/math_expressions_wasm.js` subpath, which this package does not
 * have and does not need.
 *
 * `@doenet/doenetml`'s `utils/mathWasm.ts` starts the engine one of two ways:
 * through `initMathWasm`, which this package exports and which initializes the
 * core it inlined, or — when the peer is the published package, which has no
 * such export — by instantiating that package's `--target web` wasm-bindgen
 * glue and handing it to upstream's `setWasmModule`. Only the second path
 * names this subpath, and only outside this repository.
 *
 * It still has to *resolve* here. `@doenet/doenetml` externalizes
 * `math-expressions`, so its built bundle keeps the `import()` as a bare
 * specifier, and every bundler that later consumes that bundle —
 * `@doenet/standalone`, `@doenet/test-cypress`, a consumer's app — resolves it
 * eagerly whether or not the branch guarding it can ever be taken. Against
 * this package that resolution used to fail the build outright:
 * `Missing "./wasm-web/math_expressions_wasm.js" specifier in "@doenet/math"`.
 *
 * So: a module that exists, costs a few bytes, and says what happened if it is
 * ever actually called. It cannot be, because reaching it requires
 * `initMathWasm` to be absent from the module this file is part of.
 */

/**
 * @throws always. Reaching this means the fallback path ran against
 * `@doenet/math`, which cannot happen while this package exports
 * `initMathWasm`.
 */
export default function init(): Promise<never> {
    return Promise.reject(
        new Error(
            "@doenet/math: the published math-expressions' web wasm glue was " +
                "requested, but this package inlines its own core and exports " +
                "`initMathWasm` to start it. Nothing should reach this module; " +
                "see src/wasm-web-stub.ts.",
        ),
    );
}
