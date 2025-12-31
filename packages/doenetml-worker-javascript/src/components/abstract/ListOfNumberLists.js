import { breakEmbeddedStringsIntoParensPieces } from "../commonsugar/breakstrings";
import InlineComponent from "./InlineComponent";

export default class ListOfNumberLists extends InlineComponent {
    static componentType = "_listOfNumberLists";

    static includeBlankStringChildren = true;
    static removeBlankStringChildrenPostSugar = true;

    // Include children that can be added due to sugar
    static additionalSchemaChildren = ["math", "string"];

    static returnSugarInstructions() {
        let sugarInstructions = [];

        let breakIntoNumberListsByParens = function ({
            matchedChildren,
            nComponents,
            stateIdInfo,
        }) {
            let results = breakEmbeddedStringsIntoParensPieces({
                componentList: matchedChildren,
                removeParens: true,
            });

            if (results.success !== true) {
                return { success: false };
            }

            return {
                success: true,
                newChildren: results.pieces.map((x) => ({
                    type: "serialized",
                    componentType: "numberList",
                    componentIdx: nComponents++,
                    stateId: stateIdInfo
                        ? `${stateIdInfo.prefix}${stateIdInfo.num++}`
                        : undefined,
                    children: x,
                    attributes: {},
                    doenetAttributes: {},
                    state: {},
                })),
                nComponents,
            };
        };

        sugarInstructions.push({
            replacementFunction: breakIntoNumberListsByParens,
        });

        return sugarInstructions;
    }

    static returnChildGroups() {
        return [
            {
                group: "lists",
                componentTypes: ["numberList"],
            },
        ];
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        delete stateVariableDefinitions.value;

        stateVariableDefinitions.numLists = {
            returnDependencies: () => ({
                listChildren: {
                    dependencyType: "child",
                    childGroups: ["lists"],
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        numLists: dependencyValues.listChildren.length,
                    },
                };
            },
        };

        stateVariableDefinitions.lists = {
            isArray: true,
            entryPrefixes: ["list"],
            returnArraySizeDependencies: () => ({
                numLists: {
                    dependencyType: "stateVariable",
                    variableName: "numLists",
                },
            }),
            returnArraySize({ dependencyValues }) {
                return [dependencyValues.numLists];
            },
            returnArrayDependenciesByKey({ arrayKeys }) {
                let dependenciesByKey = {};
                for (let arrayKey of arrayKeys) {
                    dependenciesByKey[arrayKey] = {
                        listChildren: {
                            dependencyType: "child",
                            childGroups: ["lists"],
                            variableNames: ["values"],
                            childIndices: [arrayKey],
                        },
                    };
                }

                return { dependenciesByKey };
            },
            arrayDefinitionByKey({ dependencyValuesByKey, arrayKeys }) {
                let lists = {};

                for (let arrayKey of arrayKeys) {
                    if (
                        dependencyValuesByKey[arrayKey].listChildren &&
                        dependencyValuesByKey[arrayKey].listChildren.length ===
                            1
                    ) {
                        let listChild =
                            dependencyValuesByKey[arrayKey].listChildren[0];
                        lists[arrayKey] = listChild.stateValues.values;
                    }
                }

                return {
                    setValue: { lists },
                };
            },
        };

        return stateVariableDefinitions;
    }
}
