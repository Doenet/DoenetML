import me, { isTree, Expression } from "math-expressions";

export function normalizeMathExpression({
    value,
    simplify,
    expand = false,
    createVectors = false,
    createIntervals = false,
    assumptions = null,
}: {
    value: any;
    simplify?: string;
    expand?: boolean;
    createVectors?: boolean;
    createIntervals?: boolean;
    assumptions?: Expression | null;
}): any {
    if (assumptions && assumptions.tree !== "\uFF3F") {
        // long underscore

        const assumptionsToAdd = [];
        if (Array.isArray(assumptions.tree) && assumptions.tree[0] === "list") {
            for (let i = 1; i < assumptions.tree.length; i++) {
                assumptionsToAdd.push(me.fromAst(assumptions.tree[i]));
            }
        } else {
            assumptionsToAdd.push(assumptions);
        }

        for (const assumption of assumptionsToAdd) {
            me.add_assumption(assumption);
        }
    }

    if (createVectors) {
        value = value.tuples_to_vectors();
    }
    if (createIntervals) {
        value = value.to_intervals();
    }
    if (expand) {
        value = value.expand();
    }
    if (simplify === "full") {
        value = value.simplify();
    } else if (simplify === "numbers") {
        value = value.evaluate_numbers();
    } else if (simplify === "numberspreserveorder") {
        value = value.evaluate_numbers({ skip_ordering: true });
    } else if (simplify === "normalizeorder") {
        value = value.default_order();
    }

    me.clear_assumptions();

    return value;
}

export function convertValueToMathExpression(value: any): any {
    if (value instanceof me.class) {
        return value;
    } else if (typeof value === "number" || typeof value === "string") {
        // let value be math-expression based on value
        return me.fromAst(value);
    } else if (isTree(value)) {
        // let value be math-expression based on value
        return me.fromAst(value);
    } else {
        return me.fromAst("\uFF3F"); // long underscore
    }
}

export const vectorOperators = ["vector", "altvector", "tuple"];

/**
 * Whether a value is a number we can actually compute with.
 *
 * `evaluate_to_constant()` returns `number | Complex`, and `NaN` is how it says
 * "no numeric value" — a free variable, a blank `＿`, a matrix, a stray unit,
 * an indeterminate form. Both halves of this test are load-bearing:
 *
 * - `typeof value === "number"` rejects the `Complex` arm. `{re, im} >= -3` is
 *   an answer JavaScript will happily invent, and a complex value put into a
 *   real-valued state variable is structure-cloned to the main thread and
 *   arrives prototype-stripped.
 * - `!Number.isNaN(value)` rejects the no-value marker.
 *
 * It used to have a third job. The engine answered `null` rather than `NaN` for
 * most of what it could not evaluate, and `null` is the one marker that does
 * *not* poison what it touches: `Number.isNaN(null)` is `false`, `null` coerces
 * to `0`, and `＿ < 1` was `null < 1`, which is `true` — a blank answer scoring
 * full credit. The engine answers `NaN` now (math-expressions#84), so a site
 * that forgets this guard degrades loudly instead of silently. That is a reason
 * to keep using it, not to stop: the `Complex` arm is still here.
 *
 * Use this anywhere the result feeds arithmetic, a comparison, or a sort.
 * `±Infinity` passes deliberately: it is not finite, but it *is* ordered, which
 * is all a comparison or a domain check needs.
 *
 * This lives here, in `@doenet/utils`, because it is needed on both sides of
 * the dependency edge — `doenetml-worker-javascript` imports this package, so
 * this is the only end that both can reach.
 */
export function isNumericConstant(value: unknown): value is number {
    return typeof value === "number" && !Number.isNaN(value);
}

/**
 * Anything that is not a plain number reported as `NaN`.
 *
 * The other half of {@link isNumericConstant}: that one asks the question, this
 * one answers it with a value a numeric state variable can hold. What it is
 * still for, now that `evaluate_to_constant()` answers `NaN` rather than `null`
 * for an expression with no value, is everything that is not a number at all —
 * a `Complex`, an `me.class` that was never evaluated, an `undefined` from a
 * missing array key.
 */
export function toNumberOrNaN(value: unknown): number {
    return typeof value === "number" ? value : NaN;
}
