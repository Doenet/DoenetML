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
 * Whether `evaluate_to_constant()` produced a number we can actually compute
 * with.
 *
 * It reports `null` — not `NaN` — for most of what it cannot evaluate: a free
 * variable, a blank `＿`, an unevaluable head. (Not all of it: a stray scaling
 * unit such as `2$` answers `NaN`.) `Number.isNaN(null)` is `false` and `null`
 * coerces to `0` in arithmetic and comparisons, so testing only for `NaN` lets
 * an unevaluable expression pass as numeric and then silently behave like zero.
 * `＿ < 1` became `null < 1`, which is `true`, and a blank answer scored full
 * credit. A complex `{re, im}` is a "no" for the same reason: `null >= -3` and
 * `{re,im} >= -3` are both answers JavaScript will happily invent.
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
 * one answers it with a value a numeric state variable can hold. `null` — what
 * `evaluate_to_constant()` returns for an expression it cannot evaluate — is
 * the case that matters, because `Number.isNaN(null)` is `false` and `null`
 * coerces to `0`, so passing it on reads a blank input as zero.
 *
 * Code that needs to tell "evaluates to NaN" from "cannot be evaluated" apart
 * should call `evaluate_to_constant()` and test with {@link isNumericConstant}
 * instead.
 */
export function toNumberOrNaN(value: unknown): number {
    return typeof value === "number" ? value : NaN;
}
