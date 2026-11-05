/**
 * The Rust/WASM engine: the published `math-expressions` package (upstream
 * v3), used unmodified.
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
import CompatContext, { isTree as compatIsTree } from "math-expressions";
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
 * The two re-exports below are restated against types from `./types`, so that
 * `./types` is the one place in this package where the upstream names are
 * bound and a narrowing or substitution is made once.
 *
 * It no longer keeps upstream's declarations out of a consumer's type program,
 * and it used to: `./types` re-exports them from the package now that the
 * vendored copy is gone, and `dopri` above is emitted as
 * `typeof import('math-expressions').dopri`. Since `index.d.ts` →
 * `engine.d.ts` → `engine-rust.d.ts`, every consumer of `@doenet/math` loads
 * upstream's `types/math-expressions.d.ts` — `tsc --listFiles -p
 * packages/doenetml` lists it — and the 18 packages here running
 * `dts({ rollupTypes: true })` run API Extractor over it. That is a real
 * exposure: one upstream commit adding a construct API Extractor cannot
 * analyse (an object binding pattern, as it happens) took out `@doenet/utils`,
 * and with it `build:all` and every Cypress run. It is the price of typing
 * against the package's own declarations, which `./types` argues for.
 */
export const isTree = compatIsTree as unknown as (
    value: unknown,
) => value is Tree;
export const engineName = "rust" as const;
export type { ExpressionType as Expression, Tree, Bindings, Dopri };
const context = CompatContext as unknown as ContextType;
export default context;
