import me from "math-expressions";
import MathBaseListOperator from "./abstract/MathBaseListOperator";

/**
 * Scan operators: math operators whose result is a list rather than a single
 * value. See `MathBaseListOperator` for the shared machinery.
 */

/**
 * Running `min`/`max` over a prefix, built symbolically. A one-element prefix
 * is returned as itself rather than as `min(a)`, which is correct but reads
 * badly.
 */
function symbolicExtremeOfPrefix(prefix, operatorName) {
    if (prefix.length === 1) {
        return prefix[0];
    }
    return me.fromAst([
        "apply",
        operatorName,
        ["tuple", ...prefix.map((x) => x.tree)],
    ]);
}

export class CumulativeSum extends MathBaseListOperator {
    static componentType = "cumulativeSum";

    static componentDocs = {
        summary:
            "Running total of the child math or number values: the list of partial sums",
    };

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.numericListOperator = {
            returnDependencies: () => ({}),
            definition: () => ({
                setValue: {
                    numericListOperator: function (inputs) {
                        let results = [];
                        let total = 0;
                        for (let input of inputs) {
                            total += input;
                            results.push(total);
                        }
                        return results;
                    },
                },
            }),
        };

        stateVariableDefinitions.listOperator = {
            returnDependencies: () => ({}),
            definition: () => ({
                setValue: {
                    listOperator: function (inputs) {
                        let results = [];
                        let total = null;
                        for (let input of inputs) {
                            total = total === null ? input : total.add(input);
                            results.push(total);
                        }
                        return results;
                    },
                },
            }),
        };

        return stateVariableDefinitions;
    }
}

export class CumulativeProduct extends MathBaseListOperator {
    static componentType = "cumulativeProduct";

    static componentDocs = {
        summary:
            "Running product of the child math or number values: the list of partial products",
    };

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.numericListOperator = {
            returnDependencies: () => ({}),
            definition: () => ({
                setValue: {
                    numericListOperator: function (inputs) {
                        let results = [];
                        let total = 1;
                        for (let input of inputs) {
                            total *= input;
                            results.push(total);
                        }
                        return results;
                    },
                },
            }),
        };

        stateVariableDefinitions.listOperator = {
            returnDependencies: () => ({}),
            definition: () => ({
                setValue: {
                    listOperator: function (inputs) {
                        let results = [];
                        let total = null;
                        for (let input of inputs) {
                            total =
                                total === null ? input : total.multiply(input);
                            results.push(total);
                        }
                        return results;
                    },
                },
            }),
        };

        return stateVariableDefinitions;
    }
}

export class CumulativeMin extends MathBaseListOperator {
    static componentType = "cumulativeMin";

    static componentDocs = {
        summary: "Running minimum of the child math or number values",
    };

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.numericListOperator = {
            returnDependencies: () => ({}),
            definition: () => ({
                setValue: {
                    numericListOperator: function (inputs) {
                        let results = [];
                        let running = Infinity;
                        for (let input of inputs) {
                            running = Math.min(running, input);
                            results.push(running);
                        }
                        return results;
                    },
                },
            }),
        };

        stateVariableDefinitions.listOperator = {
            returnDependencies: () => ({}),
            definition: () => ({
                setValue: {
                    listOperator: function (inputs) {
                        return inputs.map((_, ind) =>
                            symbolicExtremeOfPrefix(
                                inputs.slice(0, ind + 1),
                                "min",
                            ),
                        );
                    },
                },
            }),
        };

        return stateVariableDefinitions;
    }
}

export class CumulativeMax extends MathBaseListOperator {
    static componentType = "cumulativeMax";

    static componentDocs = {
        summary: "Running maximum of the child math or number values",
    };

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.numericListOperator = {
            returnDependencies: () => ({}),
            definition: () => ({
                setValue: {
                    numericListOperator: function (inputs) {
                        let results = [];
                        let running = -Infinity;
                        for (let input of inputs) {
                            running = Math.max(running, input);
                            results.push(running);
                        }
                        return results;
                    },
                },
            }),
        };

        stateVariableDefinitions.listOperator = {
            returnDependencies: () => ({}),
            definition: () => ({
                setValue: {
                    listOperator: function (inputs) {
                        return inputs.map((_, ind) =>
                            symbolicExtremeOfPrefix(
                                inputs.slice(0, ind + 1),
                                "max",
                            ),
                        );
                    },
                },
            }),
        };

        return stateVariableDefinitions;
    }
}

export class Differences extends MathBaseListOperator {
    static componentType = "differences";

    static componentDocs = {
        summary:
            "Differences between successive child math or number values; one shorter than the input",
    };

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.numericListOperator = {
            returnDependencies: () => ({}),
            definition: () => ({
                setValue: {
                    numericListOperator: function (inputs) {
                        let results = [];
                        for (let ind = 1; ind < inputs.length; ind++) {
                            results.push(inputs[ind] - inputs[ind - 1]);
                        }
                        return results;
                    },
                },
            }),
        };

        stateVariableDefinitions.listOperator = {
            returnDependencies: () => ({}),
            definition: () => ({
                setValue: {
                    listOperator: function (inputs) {
                        let results = [];
                        for (let ind = 1; ind < inputs.length; ind++) {
                            results.push(inputs[ind].subtract(inputs[ind - 1]));
                        }
                        return results;
                    },
                },
            }),
        };

        return stateVariableDefinitions;
    }
}
