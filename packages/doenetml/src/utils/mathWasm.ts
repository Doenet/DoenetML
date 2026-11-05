/**
 * Bring the math engine up on the browser main thread, whichever
 * `math-expressions` the host supplied.
 *
 * The renderers reach for math on the main thread — tick labels, graph
 * controls, the `<label>` of a point, a disabled input's styling — and the
 * engine refuses a synchronous compile of a binary that size off-worker. So
 * something has to await an async compile before the first render. Inside this
 * repository `@doenet/math` does it; for a consumer of the published library
 * there is no `@doenet/math`, and this module is the difference.
 *
 * `math-expressions` is externalized (see `EXTERNAL_DEPS` in `vite.config.ts`),
 * so the built bundle keeps a bare `import ... from "math-expressions"` and the
 * module behind it is whatever satisfied the peer dependency:
 *
 *   - **In this repository**, `@doenet/math`: the seam that base64-inlines the
 *     WASM core into the bundle, because `fetch` of a blob/data URL is blocked
 *     in the VS Code web-worker extension host (#1375). It exports
 *     `initMathWasm`, which is that inlined core's initializer.
 *   - **For a consumer**, the published `math-expressions` package. It has no
 *     `initMathWasm` — the inlining is this repository's decision, not
 *     upstream's — but it ships the `--target web` wasm-bindgen build and
 *     upstream's `setWasmModule` injection point, which is enough to do the
 *     same job from the sibling `.wasm` it carries.
 *
 * So the module is reached by `import()` below rather than by a static named
 * import. `import { initMathWasm } from "math-expressions"` — which is what
 * this used to be — resolves in every build in this repository and fails
 * against the published package, so the one bundle it breaks is the one
 * nobody here runs.
 *
 * What a consumer has to do is therefore `npm install math-expressions` and
 * nothing else. Their bundler turns the glue's
 * `new URL("math_expressions_wasm_bg.wasm", import.meta.url)` into an emitted
 * asset — Vite and webpack 5 both do — and the fetch below is an ordinary
 * same-origin request for it.
 */
/**
 * What the peer turned out to be. Loaded with a dynamic `import()` rather than
 * a static one so that a bundler does not try to *match* a named binding
 * against it: reading `initMathWasm` off a statically imported namespace made
 * rolldown warn `Import \`initMathWasm\` will always be undefined` in every
 * consumer's build, which is true of the published package, expected, and
 * exactly the condition the branch below tests. A dynamic import is settled at
 * run time, so the check happens where it belongs and no consumer sees a
 * warning about a fallback working as designed.
 *
 * `math-expressions` is externalized, so this stays a bare specifier in the
 * built bundle and resolves to whatever satisfied the peer dependency.
 */
type MathExpressionsModule = {
    /** `@doenet/math`'s initializer for the core it inlined. Absent upstream. */
    initMathWasm?: () => Promise<void>;
    /** Upstream's injection point. Not re-exported by `@doenet/math`. */
    setWasmModule?: (mod: unknown) => void;
};

let fallbackReady: Promise<void> | null = null;

/**
 * Instantiate the published package's `--target web` build and hand it to
 * upstream's injection point.
 *
 * Single-flight, because wasm-bindgen's `init` only guards *completed*
 * initializations: two concurrent callers would otherwise instantiate twice and
 * the second would replace the module-level instance the first had already
 * handed over. The cached promise is cleared on failure so a later caller can
 * retry rather than inheriting one rejection forever.
 */
function initFromPublishedPackage(
    mathExpressions: MathExpressionsModule,
): Promise<void> {
    if (!fallbackReady) {
        fallbackReady = (async () => {
            const { setWasmModule } = mathExpressions;
            if (!setWasmModule) {
                // Names no version. The range a consumer needs is already
                // stated authoritatively in this package's published
                // `peerDependencies` — written there from
                // `MATH_EXPRESSIONS_PUBLISHED_RANGE` in `vite.config.ts` — and
                // restating it here would be a second copy that goes stale
                // silently, since nothing reaches this message on a version
                // that works.
                throw new Error(
                    "@doenet/doenetml: the `math-expressions` package supplying this " +
                        "peer dependency exports neither `initMathWasm` nor " +
                        "`setWasmModule`, so the math engine cannot be started. " +
                        "Install the version named in @doenet/doenetml's peerDependencies.",
                );
            }
            // No argument: the glue falls back to
            // `new URL("math_expressions_wasm_bg.wasm", import.meta.url)`, the
            // pattern bundlers rewrite to the asset they emitted beside this
            // chunk. Async rather than `initSync`, because this runs on the
            // browser main thread where a synchronous compile is refused.
            const glue =
                await import("math-expressions/wasm-web/math_expressions_wasm.js");
            await glue.default();
            setWasmModule(glue);
        })().catch((e) => {
            fallbackReady = null;
            throw e;
        });
    }
    return fallbackReady;
}

/**
 * Resolve once the engine can be used from this realm. Idempotent, and cheap
 * after the first call on both paths.
 */
export async function initMathEngine(): Promise<void> {
    const mathExpressions: MathExpressionsModule =
        await import("math-expressions");
    return mathExpressions.initMathWasm
        ? mathExpressions.initMathWasm()
        : initFromPublishedPackage(mathExpressions);
}
