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
