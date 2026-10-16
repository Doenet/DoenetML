import ValueListComponent from "./abstract/ValueListComponent";
import { returnSortAttributes, returnSortedValuesDefinition } from "./Sort";
import {
    returnBreakStringsIntoTypeSugarInstruction,
    returnListValueStateVariableDefinitions,
} from "../utils/listValues";

/**
 * `<sortIndices>` reports the permutation that `<sort>` applies, rather than
 * the sorted values themselves: the list of positions of the original children
 * in sorted order (NumPy's `argsort`, R's `order`).
 *
 * It shares `<sort>`'s attributes and its sorted values, so that every way of
 * deciding what to sort by — `type`, `sortByProp`, points via
 * `sortByComponent`, vectors via `sortVectorsBy` — behaves identically in both
 * components, and so that the two can never disagree about an ordering.
 *
 * The positions are a list component of numbers (`ValueListComponent`), which
 * a parent sees as one `<number>` per position. Because DoenetML indexes
 * dynamically, `$data[$perm[1]]` sorts one list by another list's ordering,
 * which is otherwise not expressible.
 */
export default class SortIndices extends ValueListComponent {
    static componentType = "sortIndices";

    static componentDocs = {
        summary:
            "The indices that put a list in sorted order, rather than the sorted values",
    };

    static listEntryComponentType = "number";

    static listEntryValuesVariable = "sortedIndices";

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        Object.assign(attributes, returnSortAttributes());

        return attributes;
    }

    static returnSugarInstructions() {
        let sugarInstructions = super.returnSugarInstructions();

        sugarInstructions.push(
            returnBreakStringsIntoTypeSugarInstruction(this.componentType),
        );

        return sugarInstructions;
    }

    static returnChildGroups() {
        return [
            {
                group: "anything",
                componentTypes: ["_base"],
            },
        ];
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        Object.assign(
            stateVariableDefinitions,
            returnListValueStateVariableDefinitions({
                componentName: this.componentType,
                supportProps: true,
            }),
        );

        stateVariableDefinitions.sortedValues = returnSortedValuesDefinition();

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
                // Map each sorted value back to where it started. Each child
                // contributes exactly one entry to `componentIndicesForValues`,
                // so the indices are distinct and the lookup is unambiguous;
                // the guard below merely keeps the earlier position should that
                // ever cease to hold. An entry of a list component is named by
                // the list and its index in it.
                let originalPosition = new Map();
                for (let [
                    ind,
                    item,
                ] of dependencyValues.componentIndicesForValues.entries()) {
                    const key =
                        typeof item === "object"
                            ? `${item.componentIdx}|${item.listInd}`
                            : item;
                    if (!originalPosition.has(key)) {
                        originalPosition.set(key, ind + 1);
                    }
                }

                let sortedIndices = [];
                for (let valueObj of dependencyValues.sortedValues) {
                    const key =
                        valueObj.listInd !== undefined
                            ? `${valueObj.componentIdx}|${valueObj.listInd}`
                            : valueObj.componentIdx;
                    let position = originalPosition.get(key);
                    if (position !== undefined) {
                        sortedIndices.push(position);
                    }
                }

                return { setValue: { sortedIndices } };
            },
        };

        return stateVariableDefinitions;
    }
}
