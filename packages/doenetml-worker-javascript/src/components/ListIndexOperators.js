import ListIndexBaseOperator, {
    returnTargetAttribute,
    returnTargetSearchingIndexOperator,
    returnTargetStateVariableDefinition,
} from "./abstract/ListIndexBaseOperator";
import { compareExtractedValues } from "../utils/listValues";

/**
 * Operators that report a position within a list. See `ListIndexBaseOperator`.
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
 * The `indexOperator` state variable of an operator that searches the list for
 * the value of its `target` attribute — `<indexOf>` and `<searchSorted>`.
 *
 * `locate` is called with `{ values, target, numeric, dependencyValues }`;
 * `extraDependencies` names any further state variables it reads from the last
 * of those.
 */
function returnTargetSearchingIndexOperatorDefinition(
    locate,
    extraDependencies = {},
) {
    return {
        returnDependencies: () => ({
            comparableTarget: {
                dependencyType: "stateVariable",
                variableName: "comparableTarget",
            },
            ...extraDependencies,
        }),
        definition({ dependencyValues }) {
            return {
                setValue: {
                    indexOperator: returnTargetSearchingIndexOperator(
                        dependencyValues.comparableTarget,
                        (args) => locate({ ...args, dependencyValues }),
                    ),
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

export class IndexOf extends ListIndexBaseOperator {
    static componentType = "indexOf";

    static componentDocs = {
        summary:
            "The index of the first value in a list equal to a target, or 0 if there is none",
    };

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        attributes.target = returnTargetAttribute("The value to look for.");

        return attributes;
    }

    static returnStateVariableDefinitions() {
        return Object.assign(
            super.returnStateVariableDefinitions(),
            returnTargetStateVariableDefinition(),
            {
                indexOperator: returnTargetSearchingIndexOperatorDefinition(
                    ({ values, target, numeric }) => {
                        for (let [ind, value] of values.entries()) {
                            if (
                                compareExtractedValues(
                                    value,
                                    target,
                                    numeric,
                                ) === 0
                            ) {
                                return { index: ind + 1 };
                            }
                        }
                        // A target that is not in the list is the documented
                        // answer of `<indexOf>`, not a problem, so no reason
                        // is attached and nothing is reported.
                        return { index: 0 };
                    },
                ),
            },
        );
    }
}

export class SearchSorted extends ListIndexBaseOperator {
    static componentType = "searchSorted";

    static componentDocs = {
        summary:
            "The position at which a target would be inserted to keep a sorted list sorted",
    };

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        attributes.target = returnTargetAttribute(
            "The value to locate within the sorted list.",
        );

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
        return Object.assign(
            super.returnStateVariableDefinitions(),
            returnTargetStateVariableDefinition(),
            {
                indexOperator: returnTargetSearchingIndexOperatorDefinition(
                    ({ values, target, numeric, dependencyValues }) => {
                        // The number of entries that sort before the target,
                        // plus one, is the 1-based position the target would
                        // occupy. Counting rather than bisecting keeps the
                        // result well defined even when the input is not
                        // actually sorted.
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
            },
        );
    }
}
