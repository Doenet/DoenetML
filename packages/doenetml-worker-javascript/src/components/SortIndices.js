import Sort from "./Sort";
import {
    calculateValueListReplacementChanges,
    createValueListReplacements,
} from "../utils/valueListReplacements";

/**
 * `<sortIndices>` reports the permutation that `<sort>` applies, rather than
 * the sorted values themselves: the list of positions of the original children
 * in sorted order (NumPy's `argsort`, R's `order`).
 *
 * It extends `<sort>` so that every way of deciding what to sort by —
 * `type`, `sortByProp`, points via `sortByComponent`, vectors via
 * `sortVectorsBy` — behaves identically in both components, and so that the
 * two can never disagree about an ordering.
 *
 * Its value is the composition of everything else: because DoenetML indexes
 * dynamically, `$data[$perm[1]]` sorts one list by another list's ordering,
 * which is otherwise not expressible.
 */
export default class SortIndices extends Sort {
    static componentType = "sortIndices";

    static componentDocs = {
        summary:
            "The indices that put a list in sorted order, rather than the sorted values",
    };

    static allowInSchemaAsComponent = ["number"];

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.sortedIndices = {
            returnDependencies: () => ({
                sortedValues: {
                    dependencyType: "stateVariable",
                    variableName: "sortedValues",
                },
                componentIndicesForValues: {
                    dependencyType: "stateVariable",
                    variableName: "componentIndicesForValues",
                },
            }),
            definition({ dependencyValues }) {
                // Map each sorted value back to where it started. Component
                // indices are unique — list children contribute one index per
                // item via `componentIndicesInList` — so position lookup is
                // unambiguous.
                let originalPosition = new Map();
                for (let [
                    ind,
                    cIdx,
                ] of dependencyValues.componentIndicesForValues.entries()) {
                    if (!originalPosition.has(cIdx)) {
                        originalPosition.set(cIdx, ind + 1);
                    }
                }

                let sortedIndices = [];
                for (let valueObj of dependencyValues.sortedValues) {
                    let position = originalPosition.get(valueObj.componentIdx);
                    if (position !== undefined) {
                        sortedIndices.push(position);
                    }
                }

                return { setValue: { sortedIndices } };
            },
        };

        stateVariableDefinitions.readyToExpandWhenResolved = {
            returnDependencies: () => ({
                sortedIndices: {
                    dependencyType: "stateVariable",
                    variableName: "sortedIndices",
                },
            }),
            markStale: () => ({ updateReplacements: true }),
            definition: function () {
                return { setValue: { readyToExpandWhenResolved: true } };
            },
        };

        return stateVariableDefinitions;
    }

    static async createSerializedReplacements({
        component,
        componentInfoObjects,
        workspace,
        nComponents,
    }) {
        return createValueListReplacements({
            component,
            values: await component.stateValues.sortedIndices,
            componentType: "number",
            componentInfoObjects,
            workspace,
            nComponents,
        });
    }

    static async calculateReplacementChanges({
        component,
        componentInfoObjects,
        workspace,
        nComponents,
    }) {
        return calculateValueListReplacementChanges({
            component,
            values: await component.stateValues.sortedIndices,
            componentType: "number",
            componentInfoObjects,
            workspace,
            nComponents,
        });
    }
}
