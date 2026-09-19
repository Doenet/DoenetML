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

    /**
     * `<searchSorted>` answers a question about a sorted list, so a list that
     * is not sorted is one it declines rather than answers.
     *
     * The distinction matters because the search is a count — the number of
     * entries below the target — and a count is perfectly happy with an
     * unordered list. It returns a number that looks like a position and is
     * not one, and a document can come to depend on it without anyone
     * noticing. An unordered list gets 0, the same "no position" every other
     * unanswerable question here gets.
     *
     * Only a strict inversion counts, so equal neighbors are in order (a run
     * of equal values is what `side` is about) and a `NaN` neighbor is left
     * alone. `NaN` compares neither above nor below anything, so a list
     * holding one can be neither confirmed sorted nor shown unsorted; a
     * `<number>` whose content does not parse would otherwise turn every
     * `<searchSorted>` around it into a warning, and the counting search
     * already ignores such an entry rather than misplacing it.
     */
    static validateValues({ values, numeric }) {
        for (let ind = 1; ind < values.length; ind++) {
            if (
                compareExtractedValues(values[ind - 1], values[ind], numeric) >
                0
            ) {
                return "unsortedValues";
            }
        }
    }

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
                    // The list is known to be sorted by the time this runs, so
                    // bisecting would give the same answer; counting is kept
                    // because it is not the cost. A four-thousand-entry scan is
                    // about a millisecond, while building the `<math>`
                    // replacement for a single target costs a tenth of that —
                    // so the per-target bookkeeping, which bisecting does not
                    // touch, dominates until lists reach the thousands with
                    // comparably many targets.
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
