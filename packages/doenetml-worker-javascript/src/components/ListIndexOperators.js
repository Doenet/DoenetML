import ListIndexBaseOperator, {
    returnTargetAttribute,
    returnTargetStateVariableDefinition,
} from "./abstract/ListIndexBaseOperator";
import { compareExtractedValues } from "../utils/listValues";

/**
 * Operators that report a position within a list. See `ListIndexBaseOperator`.
 *
 * All indices are 1-based, matching `$list[1]`; `0` means "no such element".
 */

/** The index of the first value for which `isBetter` prefers it over the running best. */
function indexOfExtreme({ values, numeric, wantSmaller }) {
    if (values.length === 0) {
        return 0;
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

    return bestInd + 1;
}

export class ArgMin extends ListIndexBaseOperator {
    static componentType = "argMin";

    static componentDocs = {
        summary: "The index of the smallest value in a list",
    };

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.indexOperator = {
            returnDependencies: () => ({}),
            definition: () => ({
                setValue: {
                    indexOperator: ({ values, numeric }) =>
                        indexOfExtreme({ values, numeric, wantSmaller: true }),
                },
            }),
        };

        return stateVariableDefinitions;
    }
}

export class ArgMax extends ListIndexBaseOperator {
    static componentType = "argMax";

    static componentDocs = {
        summary: "The index of the largest value in a list",
    };

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.indexOperator = {
            returnDependencies: () => ({}),
            definition: () => ({
                setValue: {
                    indexOperator: ({ values, numeric }) =>
                        indexOfExtreme({ values, numeric, wantSmaller: false }),
                },
            }),
        };

        return stateVariableDefinitions;
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
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        Object.assign(
            stateVariableDefinitions,
            returnTargetStateVariableDefinition(),
        );

        stateVariableDefinitions.indexOperator = {
            returnDependencies: () => ({
                comparableTarget: {
                    dependencyType: "stateVariable",
                    variableName: "comparableTarget",
                },
            }),
            definition({ dependencyValues }) {
                const target = dependencyValues.comparableTarget;

                return {
                    setValue: {
                        indexOperator: ({ values, numeric }) => {
                            if (target === null) {
                                return 0;
                            }

                            // Compare numerically only if both sides are
                            // numeric; otherwise fall back to text, so that
                            // <indexOf target="b">a b c</indexOf> works.
                            const compareNumerically =
                                numeric && target.isNumeric;

                            for (let [ind, value] of values.entries()) {
                                if (
                                    compareExtractedValues(
                                        value,
                                        target,
                                        compareNumerically,
                                    ) === 0
                                ) {
                                    return ind + 1;
                                }
                            }
                            return 0;
                        },
                    },
                };
            },
        };

        return stateVariableDefinitions;
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
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        Object.assign(
            stateVariableDefinitions,
            returnTargetStateVariableDefinition(),
        );

        stateVariableDefinitions.indexOperator = {
            returnDependencies: () => ({
                comparableTarget: {
                    dependencyType: "stateVariable",
                    variableName: "comparableTarget",
                },
                side: {
                    dependencyType: "stateVariable",
                    variableName: "side",
                },
            }),
            definition({ dependencyValues }) {
                const target = dependencyValues.comparableTarget;
                const side = dependencyValues.side;

                return {
                    setValue: {
                        indexOperator: ({ values, numeric }) => {
                            if (target === null) {
                                return 0;
                            }

                            const compareNumerically =
                                numeric && target.isNumeric;

                            // The number of entries that sort before the
                            // target, plus one, is the 1-based position the
                            // target would occupy. Counting rather than
                            // bisecting keeps the result well defined even
                            // when the input is not actually sorted.
                            let count = 0;
                            for (let value of values) {
                                let comparison = compareExtractedValues(
                                    value,
                                    target,
                                    compareNumerically,
                                );
                                if (
                                    comparison < 0 ||
                                    (side === "right" && comparison === 0)
                                ) {
                                    count++;
                                }
                            }

                            return count + 1;
                        },
                    },
                };
            },
        };

        return stateVariableDefinitions;
    }
}
