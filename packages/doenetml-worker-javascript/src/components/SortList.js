import {
    RegisteredNumberEntries,
    reorderedValueListClass,
} from "./abstract/ReorderedValueList";
import { entryKind } from "./abstract/ValueListComponent";
import { returnSortAttributes } from "./Sort";
import { compareExtractedValues } from "../utils/listValues";

/**
 * The list form of `<sort>` (`reorderedValueListClass`): the values of its
 * children, sorted as `<sort>` sorts them (`compareExtractedValues`), by
 * value when every value is a number and as text otherwise. Equal values
 * keep the order of the children.
 */
function sortListClass(Base) {
    return class SortList extends reorderedValueListClass(Base) {
        static componentType = "_sortList";

        static createAttributesObject() {
            let attributes = super.createAttributesObject();
            Object.assign(attributes, returnSortAttributes());
            return attributes;
        }

        static reorderedListClassFor(ListBase) {
            return sortListClass(ListBase);
        }

        static returnEntryOrderDefinitions() {
            const kind = entryKind(this.listEntryComponentType);
            return {
                entryOrder: {
                    returnDependencies: () => ({
                        childOrderValues: {
                            dependencyType: "stateVariable",
                            variableName: "childOrderValues",
                        },
                    }),
                    definition({ dependencyValues }) {
                        const comparables =
                            dependencyValues.childOrderValues.map((value) =>
                                comparableEntryValue(value, kind),
                            );
                        const numeric = comparables.every((x) => x.numeric);
                        const entryOrder = [...comparables.keys()].sort(
                            (a, b) =>
                                compareExtractedValues(
                                    comparables[a],
                                    comparables[b],
                                    numeric,
                                ),
                        );
                        return {
                            setValue: { entryOrder },
                            checkForActualChange: { entryOrder: true },
                        };
                    },
                },
            };
        }
    };
}

/**
 * What an entry of `kind` is compared by, as `extractComparableValue`
 * compares a component of its type: a number by its value, a math by the
 * number it evaluates to (or as text, if any value is not a number), a text
 * and a boolean as text.
 */
function comparableEntryValue(value, kind) {
    if (kind === "number") {
        return {
            numericalValue: value,
            textValue: String(value),
            numeric: true,
        };
    }
    if (kind === "math") {
        const numericalValue = value.evaluate_to_constant();
        return {
            numericalValue,
            textValue: value.toString(),
            numeric: !Number.isNaN(numericalValue),
        };
    }
    return {
        numericalValue: NaN,
        textValue: String(value),
        numeric: false,
    };
}

export default class SortList extends sortListClass(RegisteredNumberEntries) {}
