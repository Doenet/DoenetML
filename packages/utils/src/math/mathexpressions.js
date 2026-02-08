import me from "math-expressions";

export function normalizeMathExpression({
    value,
    simplify,
    expand = false,
    createVectors = false,
    createIntervals = false,
}) {
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
        return value.simplify();
    } else if (simplify === "numbers") {
        return value.evaluate_numbers();
    } else if (simplify === "numberspreserveorder") {
        return value.evaluate_numbers({ skip_ordering: true });
    } else if (simplify === "normalizeorder") {
        return value.default_order();
    }
    return value;
}

export function convertValueToMathExpression(value) {
    if (value instanceof me.class) {
        return value;
    } else if (typeof value === "number" || typeof value === "string") {
        // let value be math-expression based on value
        return me.fromAst(value);
    } else if (Array.isArray(value)) {
        // let value be math-expression based on value
        return me.fromAst(value);
    } else {
        return me.fromAst("\uFF3F"); // long underscore
    }
}

export const vectorOperators = ["vector", "altvector", "tuple"];
