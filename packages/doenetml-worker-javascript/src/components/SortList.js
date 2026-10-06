import {
    RegisteredNumberEntries,
    reorderedValueListClass,
} from "./abstract/ReorderedValueList";
import { entryKind } from "./abstract/ValueListComponent";
import { returnSortAttributes } from "./Sort";
import { compareExtractedValues } from "../utils/listValues";
import { coordinatesOf, coordinatesValue } from "./abstract/GraphicalValueList";

/**
 * The list form of `<sort>` (`reorderedValueListClass`): the values of its
 * children, sorted as `<sort>` sorts them (`compareExtractedValues`), by
 * value when every value is a number and as text otherwise; points and
 * vectors by one coordinate (`sortByComponent`), of a vector's displacement
 * or, with `sortVectorsBy="tail"`, its tail. Equal values keep the order of
 * the children.
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
            const entryType = this.listEntryComponentType;
            const kind = entryKind(entryType);
            const componentGroups = this.listChildGroups.map((x) => x.group);
            const definitions = {
                entryOrder: {
                    stateVariablesDeterminingDependencies: ["sortVectorsBy"],
                    returnDependencies: ({ stateValues }) => ({
                        childOrderValues: {
                            dependencyType: "stateVariable",
                            variableName: "childOrderValues",
                        },
                        sortByComponent: {
                            dependencyType: "stateVariable",
                            variableName: "sortByComponent",
                        },
                        ...(entryType === "vector" &&
                        stateValues.sortVectorsBy === "tail"
                            ? {
                                  childOrderTails: {
                                      dependencyType: "stateVariable",
                                      variableName: "childOrderTails",
                                  },
                              }
                            : {}),
                    }),
                    definition({ dependencyValues }) {
                        const sortedValues =
                            dependencyValues.childOrderTails ??
                            dependencyValues.childOrderValues;
                        const comparables = sortedValues.map((value) =>
                            entryType === "point" || entryType === "vector"
                                ? comparableCoordinate(
                                      value,
                                      dependencyValues.sortByComponent,
                                  )
                                : comparableEntryValue(value, kind),
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
            if (entryType === "vector") {
                // The tail of each vector, in the order of the children, by
                // which `sortVectorsBy="tail"` sorts: a child's, the entry of
                // a list among them, and the origin for a vector written as
                // text.
                definitions.childOrderTails = {
                    returnDependencies: () => ({
                        entryStructure: {
                            dependencyType: "stateVariable",
                            variableName: "childOrderEntryStructure",
                        },
                        children: {
                            dependencyType: "child",
                            childGroups: componentGroups,
                            variableNames: ["tail"],
                            variablesOptional: true,
                        },
                    }),
                    definition: ({ dependencyValues }) => ({
                        setValue: {
                            childOrderTails:
                                dependencyValues.entryStructure.map((source) =>
                                    coordinatesValue(
                                        dependencyValues.children[
                                            source.componentInd
                                        ]?.stateValues.tail ?? [0, 0, 0],
                                    ),
                                ),
                        },
                    }),
                };
            }
            return definitions;
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

/**
 * What a point or vector is compared by, as `extractComparableValue`
 * compares one: coordinate `sortByComponent` of `value` (its coordinates, or
 * a vector's displacement or tail). A coordinate it does not have compares
 * as no value without making the list compare as text.
 */
function comparableCoordinate(value, sortByComponent) {
    const coordinate = coordinatesOf(value)[sortByComponent - 1];
    if (!coordinate) {
        return { numericalValue: NaN, textValue: "", numeric: true };
    }
    const numericalValue = coordinate.evaluate_to_constant();
    return {
        numericalValue,
        textValue: coordinate.toString(),
        numeric: !Number.isNaN(numericalValue),
    };
}

export default class SortList extends sortListClass(RegisteredNumberEntries) {}
