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
        return expr.get_component(index) ?? undefined;
    } catch {
        // Not a container, or no operand at `index`.
        return undefined;
    }
}
