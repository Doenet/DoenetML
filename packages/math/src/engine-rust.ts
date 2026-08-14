/**
 * The Rust/WASM engine: `math-expressions-js-compat` (published upstream as
 * `math-expressions` v3), used unmodified from the `vendor/math-expressions`
 * submodule.
 *
 * This module is now a straight re-export. It previously carried four gap
 * fills, all of which landed upstream (math-expressions PR #84) and have been
 * deleted here in turn:
 *
 *   - `Expression#f()`, which compiles an expression to a numeric function.
 *   - The context-level operation family — `me.simplify(expr)` alongside
 *     `expr.simplify()`.
 *   - `fromAst` losing `NaN` and `±Infinity`, which `JSON.stringify` renders as
 *     the literal `null`. The compat layer now serializes through an
 *     `astReplacer` that spells all three as the `{"$":…}` specials Rust's
 *     `from_ast` reads back — so the boundary is tagged in both directions and
 *     `fromAst(x).tree` is a fixpoint.
 *   - `fromAst` rejecting an `Expression` where a tree was expected. DoenetML
 *     relies on that in both directions — a math-valued state variable *holds*
 *     an `Expression`, and code that re-wraps one hands it straight back. The
 *     same `astReplacer` now unwraps it, reading the holder rather than the
 *     value because `toJSON()` runs first. Ours cost a second full traversal.
 *
 * Deleting them is how we verify each upstream fix actually covers our usage;
 * that is what the seam is for. The one thing still supplied locally is the
 * WASM itself, injected by `./wasm-loader` through upstream's `setWasmModule`.
 *
 * The loader is imported *first*, and purely for that side effect: it must have
 * injected a module before anything below can parse. ES modules evaluate in
 * import order, so this line is load-bearing — do not reorder it below the
 * `Context` import.
 */
import "./wasm-loader";
import CompatContext, {
    isTree as compatIsTree,
} from "math-expressions-js-compat";
import type {
    Bindings,
    Context as ContextType,
    Dopri,
    Expression as ExpressionType,
    Tree,
} from "./types";

/**
 * The Dormand-Prince integrator, re-exported as a named export. The legacy
 * library reached numeric.js's copy through `me.math.dopri`; this engine has no
 * `me.math` entry for it and supplies its own `solve_ode`-backed equivalent on
 * the context. Callers (`ODESystem.js`, `packages/utils/src/components/function.ts`)
 * write `import me, { dopri } from "math-expressions"` rather than reaching into
 * the context, so the import survives whatever the seam resolves to.
 */
export const dopri = (CompatContext as unknown as { dopri: Dopri }).dopri;

export {
    initMathWasm,
    initMathWasmSync,
    isMathWasmInitialized,
} from "./wasm-loader";

/*
 * The two re-exports below are restated against types from `./types` rather
 * than handed straight back out, and that is the whole point of them.
 *
 * Re-exporting the imported bindings directly makes the emitted `.d.ts` say
 * `import { default as Context, isTree } from
 * '../../../vendor/math-expressions/.../lib/math-expressions.ts'` — a relative
 * path into the submodule's *source*. Since `index.d.ts` → `engine.d.ts` →
 * `engine-rust.d.ts`, every consumer of `@doenet/math` then type-checks that
 * file, and the 18 packages here running `dts({ rollupTypes: true })` run
 * API Extractor over it. One upstream commit adding a construct API Extractor
 * cannot analyse (an object binding pattern, as it happens) took out
 * `@doenet/utils`, and with it `build:all` and every Cypress run.
 *
 * `./vendor-shims.d.ts` was meant to be the single named contract with the
 * submodule, but it only governs what we *import*: node resolution finds the
 * real package and wins, and nothing constrained what we *emit*. Naming local
 * types here is what actually keeps the submodule's source out of consumers'
 * type programs.
 */
export const isTree = compatIsTree as unknown as (
    value: unknown,
) => value is Tree;
export const engineName = "rust" as const;
export type { ExpressionType as Expression, Tree, Bindings, Dopri };
const context = CompatContext as unknown as ContextType;
export default context;
