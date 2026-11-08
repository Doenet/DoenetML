import BaseComponent from "./BaseComponent";
import { returnGroupIntoListEntriesOfComponentType } from "../commonsugar/lists";

export default class LineListComponent extends BaseComponent {
    static componentType = "_lineListComponent";
    static rendererType = "containerInline";
    static renderChildren = true;

    // Include children that can be added due to sugar
    static additionalSchemaChildren = ["math", "string"];

    static returnSugarInstructions() {
        let sugarInstructions = super.returnSugarInstructions();

        // Break the children into the entries of a list by the one rule for
        // lists (Doenet/DoenetML#2492) and wrap each in a line, so an
        // equation can hold spaces: `y = x + 1, y = 2x`.
        const groupIntoListEntries = returnGroupIntoListEntriesOfComponentType({
            componentType: "line",
            componentsAreEntries: true,
        });

        let breakStringsIntoLinesBySpaces = function ({
            matchedChildren,
            componentInfoObjects,
            nComponents,
            stateIdInfo,
            parentComponentType,
        }) {
            return groupIntoListEntries({
                matchedChildren,
                componentInfoObjects,
                nComponents,
                stateIdInfo,
                parentComponentType,
            });
        };

        sugarInstructions.push({
            replacementFunction: breakStringsIntoLinesBySpaces,
        });

        return sugarInstructions;
    }

    static returnChildGroups() {
        return [
            {
                group: "lines",
                componentTypes: ["line"],
            },
        ];
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.numLines = {
            returnDependencies: () => ({
                lineChildren: {
                    dependencyType: "child",
                    childGroups: ["lines"],
                    skipComponentIndices: true,
                },
            }),
            definition: function ({ dependencyValues }) {
                return {
                    setValue: {
                        numLines: dependencyValues.lineChildren.length,
                    },
                    checkForActualChange: { numLines: true },
                };
            },
        };

        stateVariableDefinitions.lineNames = {
            isArray: true,
            entryPrefixes: ["lineName"],
            returnArraySizeDependencies: () => ({
                numLines: {
                    dependencyType: "stateVariable",
                    variableName: "numLines",
                },
            }),
            returnArraySize({ dependencyValues }) {
                return [dependencyValues.numLines];
            },
            returnArrayDependenciesByKey({ arrayKeys }) {
                let dependenciesByKey = {};
                for (let arrayKey of arrayKeys) {
                    dependenciesByKey[arrayKey] = {
                        lineChild: {
                            dependencyType: "child",
                            childGroups: ["lines"],
                            childIndices: [arrayKey],
                        },
                    };
                }

                return { dependenciesByKey };
            },
            arrayDefinitionByKey({ dependencyValuesByKey, arrayKeys }) {
                let lineNames = {};

                for (let arrayKey of arrayKeys) {
                    let lineChild =
                        dependencyValuesByKey[arrayKey].lineChild[0];
                    if (lineChild) {
                        lineNames[arrayKey] = lineChild.componentIdx;
                    }
                }

                return { setValue: { lineNames } };
            },
        };

        return stateVariableDefinitions;
    }
}
