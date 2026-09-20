/**
 * Component access, as a test rather than as an exception.
 *
 * `me`'s own `Expression#get_component` is a *throwing* accessor. It rejects a
 * receiver whose tree head is not a container — list, tuple, vector, altvector
 * or array — and rejects an index with no operand behind it. DoenetML's one
 * caller wants the opposite shape: `EssentialValueWriter.ts` is deciding
 * whether an inverse definition should write a slot at all, and "this
 * expression has no such component" is an ordinary answer there rather than an
 * error. So this is a thin adapter that spells that answer `undefined`.
 *
 * That contract used to be *restated* here — an explicit container set plus a
 * range check — because the Rust engine had briefly relaxed it: an out-of-range
 * index answered `undefined`, and *any* operator node answered a component, so
 * a scalar receiver quietly produced a value where the legacy library threw and
 * the caller would have written that value into the slot. math-expressions
 * PR #84 restored the legacy behavior (`get_component` in
 * `lib/math-expressions.ts`, against the same container set), so the
 * restatement is gone. Keeping it bought a second copy of the container set to
 * hold in sync, and three extra reads of `expr.tree` — each of which crosses
 * the WASM boundary and re-parses the whole tree — on a path that runs once per
 * array key of every inverse write.
 *
 * The two guards below are the part upstream does *not* cover.
 *
 * **Why the other call sites still say `get_component` directly, and should.**
 * They are not an unconverted backlog. Counted at the tenth review pass:
 *
 *   - **36 in `packages/doenetml/src`**, every one of them an `anchor`
 *     coordinate read inside a `try`/`catch`, with `Number.isFinite` or
 *     `?? NaN` on the result. The `catch` is the point: a non-container anchor
 *     falls back to `[NaN, NaN]` and hides the label, which is a better answer
 *     than `undefined`.
 *   - **4 in `@doenet/utils`'s `function.ts`**, which wrap the call in a
 *     `try`/`catch` that returns a *meaningful* fallback for an out-of-range
 *     component (`() => NaN`, or a blank-valued function). Routing those
 *     through this adapter would replace a fallback with `undefined` and move
 *     the failure one line later.
 *   - **22 in `packages/doenetml-worker-javascript/src`**, which reach the same
 *     end by three different routes: a shape test at the call (against
 *     `vectorOperators` in `Point.js`, `FunctionOperators.js` and `Vector.js`'s
 *     displacement branch; against `tree[0] === "list"` in `MathList.js` and
 *     `NumberList.js`; against `["vector","tuple"]` in `Polyline.js`), a
 *     `try`/`catch` around the read (`Parabola.js`), or a boolean settled
 *     earlier in the definition (`haveVector` in the two
 *     `DiscreteSimulationResult*` files). `DirectionComponent.js:274` takes the
 *     first of those routes too — a `vectorOperators.includes` test at `:265`.
 *
 * Nine reads take none of those routes. Five are shadow reads: `headShadow`
 * and `tailShadow` (`Vector.js:1768`, `:1986`), `directionShadow`,
 * `throughShadow` and `endpointShadow` (`Ray.js:806`, `:1058`, `:1287`). The
 * other four read something else unguarded:
 * `desiredStateVariableValues.parallelCoords` (`LineSegment.js:1581`, `:1588`,
 * `Line.js:1656`) and `globalDependencyValues.unnormalizedDirection`
 * (`DirectionComponent.js:322`). They rest on a point-valued state variable
 * always being a container, which is true of every route found so far but is an
 * invariant nothing states or checks. Noted rather than converted, because
 * `undefined` is not obviously the right answer there either — see follow-up 2
 * in `MATH_EXPRESSIONS_ENGINE_NOTES.md` ("Follow-up PRs, written up so they can
 * be opened from here") at the repository root.
 *
 * The shape here is wanted only where "no such component" is an ordinary
 * answer that the caller then acts on, which so far is
 * `EssentialValueWriter.ts` alone.
 */
import type { Expression } from "./types";

/**
 * Component `index` of a container-valued expression, or `undefined` when the
 * receiver is not a container, is not an expression at all, or has no operand
 * at `index`.
 *
 * Never throws.
 */
export function getComponent(
    expr: Expression | undefined | null,
    index: number,
): Expression | undefined {
    // The caller passes whatever the inverse definition produced, which may be
    // a plain number, string or array rather than an `Expression`. Probing the
    // method is deliberate: the obvious `expr.tree === undefined` test would
    // materialize the whole tree across the WASM boundary just to type-check.
    if (typeof expr?.get_component !== "function") {
        return undefined;
    }
    // `me` converts the index with `Uint32Array.from`, which turns a
    // non-integer into `0` rather than into a miss — so `NaN` would read
    // component 0 and `1.5` would read component 1.
    if (!Number.isInteger(index) || index < 0) {
        return undefined;
    }
    try {
        // Not `?? undefined`: upstream's `get_component` throws rather than
        // returning `undefined` when the wasm entry point declines, so there
        // is no nullish case to fold.
        return expr.get_component(index);
    } catch (e) {
        // An uninitialized engine reaches here too — the `guarded` Proxy in
        // `wasm-loader.ts` throws on every property access — and answering
        // "no such component" to that would turn a setup error into a silently
        // dropped value. Only the container/range failure is an ordinary
        // answer.
        if (e instanceof Error && e.message.startsWith("@doenet/math:")) {
            throw e;
        }
        // Not a container, or no operand at `index`.
        return undefined;
    }
}
