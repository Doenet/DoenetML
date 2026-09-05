import ListIndexBaseOperator from "./abstract/ListIndexBaseOperator";
import ListIndexBaseListOperator from "./abstract/ListIndexBaseListOperator";
import { compareExtractedValues } from "../utils/listValues";

/**
 * Operators that report a position within a list.
 *
 * `<argMin>` and `<argMax>` need nothing but the list and report one index, so
 * they are `<math>` components (`ListIndexBaseOperator`). `<indexOf>` and
 * `<searchSorted>` search for a target, and since a target may be a list they
 * report one index per target, so they are composites
 * (`ListIndexBaseListOperator`).
 *
 * All indices are 1-based, matching `$list[1]`; `0` means "no such element".
 */

/**
 * The `indexOperator` state variable of an operator that needs nothing beyond
 * the list itself — `<argMin>` and `<argMax>`.
 */
function returnConstantIndexOperatorDefinition(indexOperator) {
    return {
        returnDependencies: () => ({}),
        definition: () => ({ setValue: { indexOperator } }),
    };
}

/**
 * The `locate` state variable of an operator that searches the list for one of
 * the values of its `target` attribute — `<indexOf>` and `<searchSorted>`.
 *
 * `locate` is called with `{ values, target, numeric, dependencyValues }` once
 * per target; `extraDependencies` names any further state variables it reads
 * from the last of those.
 */
function returnLocateDefinition(locate, extraDependencies = {}) {
    return {
        returnDependencies: () => ({ ...extraDependencies }),
        definition({ dependencyValues }) {
            return {
                setValue: {
                    locate: (args) => locate({ ...args, dependencyValues }),
                },
            };
        },
    };
}

/**
 * The 1-based index of the smallest value when `wantSmaller`, and of the
 * largest otherwise. An empty list gives 0.
 */
function indexOfExtreme({ values, numeric, wantSmaller }) {
    if (values.length === 0) {
        return { index: 0, reason: "noValues" };
    }

    let bestInd = 0;
    for (let ind = 1; ind < values.length; ind++) {
        let comparison = compareExtractedValues(
            values[ind],
            values[bestInd],
            numeric,
        );
        // Strict comparison, so ties resolve to the earlier element.
        if (wantSmaller ? comparison < 0 : comparison > 0) {
            bestInd = ind;
        }
    }

    return { index: bestInd + 1 };
}

export class ArgMin extends ListIndexBaseOperator {
    static componentType = "argMin";

    static componentDocs = {
        summary: "The index of the smallest value in a list",
    };

    static returnStateVariableDefinitions() {
        return Object.assign(super.returnStateVariableDefinitions(), {
            indexOperator: returnConstantIndexOperatorDefinition(
                ({ values, numeric }) =>
                    indexOfExtreme({ values, numeric, wantSmaller: true }),
            ),
        });
    }
}

export class ArgMax extends ListIndexBaseOperator {
    static componentType = "argMax";

    static componentDocs = {
        summary: "The index of the largest value in a list",
    };

    static returnStateVariableDefinitions() {
        return Object.assign(super.returnStateVariableDefinitions(), {
            indexOperator: returnConstantIndexOperatorDefinition(
                ({ values, numeric }) =>
                    indexOfExtreme({ values, numeric, wantSmaller: false }),
            ),
        });
    }
}

export class IndexOf extends ListIndexBaseListOperator {
    static componentType = "indexOf";

    static componentDocs = {
        summary:
            "The index of the first value in a list equal to each target, or 0 where there is none",
    };

    static returnStateVariableDefinitions() {
        return Object.assign(super.returnStateVariableDefinitions(), {
            locate: returnLocateDefinition(({ values, target, numeric }) => {
                for (let [ind, value] of values.entries()) {
                    if (compareExtractedValues(value, target, numeric) === 0) {
                        return { index: ind + 1 };
                    }
                }
                // A target that is not in the list is the documented answer of
                // `<indexOf>`, not a problem, so no reason is attached and
                // nothing is reported.
                return { index: 0 };
            }),
        });
    }
}

export class SearchSorted extends ListIndexBaseListOperator {
    static componentType = "searchSorted";

    static componentDocs = {
        summary:
            "The position at which each target would be inserted to keep a sorted list sorted",
    };

    static targetDescription =
        "The value, or list of values, to locate within the sorted list.";

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        attributes.side = {
            createComponentOfType: "text",
            createStateVariable: "side",
            defaultValue: "left",
            public: true,
            highlighted: true,
            toLowerCase: true,
            description:
                "Which end of a run of equal values the target is placed at.",
            validValues: [
                {
                    value: "left",
                    description:
                        "Insert before any equal values, so the result is the index of the first entry greater than or equal to the target.",
                },
                {
                    value: "right",
                    description:
                        "Insert after any equal values, so the result is the index of the first entry strictly greater than the target.",
                },
            ],
        };

        return attributes;
    }

    static returnStateVariableDefinitions() {
        return Object.assign(super.returnStateVariableDefinitions(), {
            locate: returnLocateDefinition(
                ({ values, target, numeric, dependencyValues }) => {
                    // The number of entries that sort before the target, plus
                    // one, is the 1-based position the target would occupy.
                    // Counting rather than bisecting keeps the result well
                    // defined even when the input is not actually sorted.
                    let count = 0;
                    for (let value of values) {
                        let comparison = compareExtractedValues(
                            value,
                            target,
                            numeric,
                        );
                        if (
                            comparison < 0 ||
                            (dependencyValues.side === "right" &&
                                comparison === 0)
                        ) {
                            count++;
                        }
                    }

                    return { index: count + 1 };
                },
                {
                    side: {
                        dependencyType: "stateVariable",
                        variableName: "side",
                    },
                },
            ),
        });
    }
}
