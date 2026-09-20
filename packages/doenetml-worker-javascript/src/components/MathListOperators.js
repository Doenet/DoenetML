import me from "math-expressions";
import MathBaseListOperator from "./abstract/MathBaseListOperator";

/**
 * Scan operators: math operators whose result is a list rather than a single
 * value. See `MathBaseListOperator` for the shared machinery.
 *
 * Each operator supplies two implementations of the same idea — one over plain
 * numbers and one over math-expressions — and the base class picks between them
 * based on whether every input is a number.
 */

/**
 * The running result of folding `combine` over ever-longer prefixes of
 * `inputs`. The first entry is `inputs[0]` itself, so the result is always the
 * same length as the input and never introduces an identity element the author
 * did not write.
 */
function runningFold(inputs, combine) {
    let results = [];
    let running;
    for (let [ind, input] of inputs.entries()) {
        running = ind === 0 ? input : combine(running, input);
        results.push(running);
    }
    return results;
}

/**
 * The differences between successive entries of `inputs`, using `subtract` to
 * take each one. One shorter than the input, and empty for a single value.
 */
function successiveDifferences(inputs, subtract) {
    return inputs.slice(1).map((input, ind) => subtract(input, inputs[ind]));
}

/**
 * Running `min`/`max` over a prefix, built symbolically. Built directly from
 * the whole prefix rather than by folding, so that the result is a single
 * `min(a, b, c)` rather than a nest of two-argument calls. A one-element prefix
 * is returned as itself rather than as `min(a)`, which is correct but reads
 * badly.
 */
function symbolicExtremesOfPrefixes(inputs, operatorName) {
    return inputs.map((input, ind) => {
        if (ind === 0) {
            return input;
        }
        return me.fromAst([
            "apply",
            operatorName,
            ["tuple", ...inputs.slice(0, ind + 1).map((x) => x.tree)],
        ]);
    });
}

/**
 * The pair of state variables every scan operator overrides: `numericListOperator`
 * (numbers in, numbers out) and `listOperator` (math-expressions in and out).
 */
function returnScanStateVariableDefinitions({ numeric, symbolic }) {
    return {
        numericListOperator: {
            returnDependencies: () => ({}),
            definition: () => ({ setValue: { numericListOperator: numeric } }),
        },
        listOperator: {
            returnDependencies: () => ({}),
            definition: () => ({ setValue: { listOperator: symbolic } }),
        },
    };
}

export class CumulativeSum extends MathBaseListOperator {
    static componentType = "cumulativeSum";

    static componentDocs = {
        summary:
            "Running total of the child math or number values: the list of partial sums",
    };

    static returnStateVariableDefinitions() {
        return Object.assign(
            super.returnStateVariableDefinitions(),
            returnScanStateVariableDefinitions({
                numeric: (inputs) => runningFold(inputs, (a, b) => a + b),
                symbolic: (inputs) => runningFold(inputs, (a, b) => a.add(b)),
            }),
        );
    }
}

export class CumulativeProduct extends MathBaseListOperator {
    static componentType = "cumulativeProduct";

    static componentDocs = {
        summary:
            "Running product of the child math or number values: the list of partial products",
    };

    static returnStateVariableDefinitions() {
        return Object.assign(
            super.returnStateVariableDefinitions(),
            returnScanStateVariableDefinitions({
                numeric: (inputs) => runningFold(inputs, (a, b) => a * b),
                symbolic: (inputs) =>
                    runningFold(inputs, (a, b) => a.multiply(b)),
            }),
        );
    }
}

export class CumulativeMin extends MathBaseListOperator {
    static componentType = "cumulativeMin";

    static componentDocs = {
        summary: "Running minimum of the child math or number values",
    };

    static returnStateVariableDefinitions() {
        return Object.assign(
            super.returnStateVariableDefinitions(),
            returnScanStateVariableDefinitions({
                numeric: (inputs) => runningFold(inputs, Math.min),
                symbolic: (inputs) => symbolicExtremesOfPrefixes(inputs, "min"),
            }),
        );
    }
}

export class CumulativeMax extends MathBaseListOperator {
    static componentType = "cumulativeMax";

    static componentDocs = {
        summary: "Running maximum of the child math or number values",
    };

    static returnStateVariableDefinitions() {
        return Object.assign(
            super.returnStateVariableDefinitions(),
            returnScanStateVariableDefinitions({
                numeric: (inputs) => runningFold(inputs, Math.max),
                symbolic: (inputs) => symbolicExtremesOfPrefixes(inputs, "max"),
            }),
        );
    }
}

export class Differences extends MathBaseListOperator {
    static componentType = "differences";

    static componentDocs = {
        summary:
            "Differences between successive child math or number values; one shorter than the input",
    };

    static returnStateVariableDefinitions() {
        return Object.assign(
            super.returnStateVariableDefinitions(),
            returnScanStateVariableDefinitions({
                numeric: (inputs) =>
                    successiveDifferences(inputs, (a, b) => a - b),
                symbolic: (inputs) =>
                    successiveDifferences(inputs, (a, b) => a.subtract(b)),
            }),
        );
    }
}
