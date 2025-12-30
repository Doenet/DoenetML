import { stat } from "node:fs";
import CompositeComponent from "./abstract/CompositeComponent";

export default class Split extends CompositeComponent {
    static componentType = "split";

    static allowInSchemaAsComponent = ["_inline", "_block", "_graphical"];

    static stateVariableToEvaluateAfterReplacements =
        "readyToExpandWhenResolved";

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        // TODO: other types than text or eliminate type attribute
        attributes.type = {
            createPrimitiveOfType: "string",
            createStateVariable: "type",
            defaultPrimitiveValue: "text",
            toLowerCase: true,
            validValues: ["text"],
        };

        attributes.splitBy = {
            createComponentOfType: "text",
            createStateVariable: "splitBy",
            defaultValue: "letter",
            toLowerCase: true,
            validValues: ["letter", "word", "comma"],
        };

        attributes.asList = {
            createPrimitiveOfType: "boolean",
            createStateVariable: "asList",
            defaultValue: true,
        };

        return attributes;
    }

    static returnSugarInstructions() {
        let sugarInstructions = [];

        function addType({
            matchedChildren,
            componentAttributes,
            nComponents,
            stateIdInfo,
        }) {
            let type = componentAttributes.type;
            if (!["text"].includes(type)) {
                type = "text";
            }

            return {
                success: true,
                newChildren: [
                    {
                        type: "serialized",
                        componentType: type,
                        componentIdx: nComponents++,
                        stateId: stateIdInfo
                            ? `${stateIdInfo.prefix}${stateIdInfo.num++}`
                            : undefined,
                        children: matchedChildren,
                        attributes: {},
                        doenetAttributes: {},
                        state: {},
                    },
                ],
                nComponents,
            };
        }

        sugarInstructions.push({
            replacementFunction: addType,
        });

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

        stateVariableDefinitions.originalValue = {
            returnDependencies: () => ({
                child: {
                    dependencyType: "child",
                    childGroups: ["anything"],
                    variableNames: ["value"],
                },
            }),
            definition({ dependencyValues }) {
                if (dependencyValues.child.length > 0) {
                    return {
                        setValue: {
                            originalValue:
                                dependencyValues.child[0].stateValues.value,
                        },
                    };
                } else {
                    return { setValue: { originalValue: null } };
                }
            },
            inverseDefinition({
                desiredStateVariableValues,
                dependencyValues,
            }) {
                if (dependencyValues.child.length > 0) {
                    return {
                        success: true,
                        instructions: [
                            {
                                setDependency: "child",
                                desiredValue:
                                    desiredStateVariableValues.originalValue,
                                childIndex: 0,
                                variableIndex: 0,
                            },
                        ],
                    };
                } else {
                    return { success: false };
                }
            },
        };

        stateVariableDefinitions.allSplitValues = {
            returnDependencies: () => ({
                type: {
                    dependencyType: "stateVariable",
                    variableName: "type",
                },
                originalValue: {
                    dependencyType: "stateVariable",
                    variableName: "originalValue",
                },
                splitBy: {
                    dependencyType: "stateVariable",
                    variableName: "splitBy",
                },
            }),
            definition({ dependencyValues }) {
                if (dependencyValues.originalValue === null) {
                    return {
                        setValue: { allSplitValues: [] },
                    };
                }

                let allSplitValues = [];

                if (dependencyValues.splitBy === "letter") {
                    allSplitValues = [...dependencyValues.originalValue];
                } else if (dependencyValues.splitBy === "word") {
                    allSplitValues =
                        dependencyValues.originalValue.split(/\s+/);
                } else if (dependencyValues.splitBy === "comma") {
                    allSplitValues =
                        dependencyValues.originalValue.split(/\s*,\s*/);
                } else {
                    allSplitValues = [dependencyValues.originalValue];
                }

                return {
                    setValue: { allSplitValues },
                };
            },
        };

        stateVariableDefinitions.numValues = {
            returnDependencies: () => ({
                allSplitValues: {
                    dependencyType: "stateVariable",
                    variableName: "allSplitValues",
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        numValues: dependencyValues.allSplitValues.length,
                    },
                };
            },
        };

        stateVariableDefinitions.values = {
            isArray: true,
            entryPrefixes: ["value"],
            returnArraySizeDependencies: () => ({
                numValues: {
                    dependencyType: "stateVariable",
                    variableName: "numValues",
                },
            }),
            returnArraySize({ dependencyValues }) {
                return [dependencyValues.numValues];
            },

            returnArrayDependenciesByKey() {
                let globalDependencies = {
                    allSplitValues: {
                        dependencyType: "stateVariable",
                        variableName: "allSplitValues",
                    },
                };

                return { globalDependencies };
            },
            arrayDefinitionByKey({ globalDependencyValues, arrayKeys }) {
                let values = {};

                for (let arrayKey of arrayKeys) {
                    values[arrayKey] =
                        globalDependencyValues.allSplitValues[arrayKey];
                }

                return { setValue: { values } };
            },
        };

        stateVariableDefinitions.readyToExpandWhenResolved = {
            returnDependencies: () => ({
                values: {
                    dependencyType: "stateVariable",
                    variableName: "values",
                },
            }),
            // when this state variable is marked stale
            // it indicates we should update replacement
            // For this to work, must get value in replacement functions
            // so that the variable is marked fresh
            markStale: () => ({ updateReplacements: true }),
            definition: function () {
                return { setValue: { readyToExpandWhenResolved: true } };
            },
        };

        return stateVariableDefinitions;
    }

    static async createSerializedReplacements({
        component,
        nComponents,
        workspace,
    }) {
        if (workspace.replacementsCreated === undefined) {
            workspace.replacementsCreated = 0;
        }

        const stateIdInfo = {
            prefix: `${component.stateId}|`,
            num: workspace.replacementsCreated,
        };

        const errors = [];
        const warnings = [];

        const values = await component.stateValues.values;

        const replacements = values.map((value, i) => ({
            type: "serialized",
            componentType: "text",
            componentIdx: nComponents++,
            stateId: `${stateIdInfo.prefix}${stateIdInfo.num++}`,
            attributes: {},
            doenetAttributes: {},
            children: [],
            state: { value },
            downstreamDependencies: {
                [component.componentIdx]: [
                    {
                        dependencyType: "referenceShadow",
                        compositeIdx: component.componentIdx,
                        propVariable: `value${i + 1}`,
                    },
                ],
            },
        }));

        workspace.values = [...values];

        workspace.replacementsCreated = stateIdInfo.num;

        return {
            replacements,
            errors,
            warnings,
            nComponents,
        };
    }

    static async calculateReplacementChanges({
        component,
        components,
        workspace,
        nComponents,
    }) {
        // TODO: don't yet have a way to return errors and warnings!
        let errors = [];
        let warnings = [];

        const values = await component.stateValues.values;

        if (
            values.length === workspace.values.length &&
            workspace.values.every((s, i) => s === values[i])
        ) {
            return { replacementChanges: [] };
        }

        // recreate if something changed
        let replacementResults = await this.createSerializedReplacements({
            component,
            components,
            workspace,
            nComponents,
        });

        let replacements = replacementResults.replacements;
        errors.push(...replacementResults.errors);
        warnings.push(...replacementResults.warnings);
        nComponents = replacementResults.nComponents;

        let replacementChanges = [
            {
                changeType: "add",
                changeTopLevelReplacements: true,
                firstReplacementInd: 0,
                numberReplacementsToReplace: component.replacements.length,
                serializedReplacements: replacements,
            },
        ];

        return { replacementChanges, nComponents };
    }
}
