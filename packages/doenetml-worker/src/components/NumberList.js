import CompositeComponent from "./abstract/CompositeComponent";
import { returnRoundingAttributes } from "../utils/rounding";
import { returnGroupIntoComponentTypeSeparatedBySpacesOutsideParens } from "./commonsugar/lists";
import {
    convertAttributesForComponentType,
    postProcessCopy,
} from "../utils/copy";
import { processAssignNames } from "../utils/naming";

export default class NumberList extends CompositeComponent {
    static componentType = "numberList";

    static stateVariableToEvaluateAfterReplacements =
        "readyToExpandWhenResolved";

    static includeBlankStringChildren = true;
    static removeBlankStringChildrenPostSugar = true;

    // when another component has an attribute that is a numberList,
    // use the numbers state variable to populate that attribute
    static stateVariableToBeShadowed = "numbers";
    static primaryStateVariableForDefinition = "numbersShadow";

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        attributes.unordered = {
            createComponentOfType: "boolean",
            createStateVariable: "unordered",
            defaultValue: false,
            public: true,
        };

        attributes.maxNumber = {
            createComponentOfType: "number",
            createStateVariable: "maxNumber",
            defaultValue: Infinity,
            public: true,
        };

        attributes.fixed = {
            leaveRaw: true,
        };

        for (let attrName in returnRoundingAttributes()) {
            attributes[attrName] = {
                leaveRaw: true,
            };
        }

        return attributes;
    }

    // Include children that can be added due to sugar
    static additionalSchemaChildren = ["string"];

    static returnSugarInstructions() {
        let sugarInstructions = super.returnSugarInstructions();

        let groupIntoNumbersSeparatedBySpaces =
            returnGroupIntoComponentTypeSeparatedBySpacesOutsideParens({
                componentType: "number",
            });

        sugarInstructions.push({
            replacementFunction: function ({
                matchedChildren,
                componentAttributes,
            }) {
                let result = groupIntoNumbersSeparatedBySpaces({
                    matchedChildren,
                });

                // Since an answer ignores composite descendants when calculating responses,
                // we need to add isResponse from the numberList to its children.
                if (componentAttributes.isResponse) {
                    for (let child of result.newChildren) {
                        if (!child.attributes) {
                            child.attributes = {};
                        }
                        child.attributes.isResponse = { primitive: true };
                    }
                }

                return result;
            },
        });

        return sugarInstructions;
    }

    static returnChildGroups() {
        return [
            {
                group: "numbers",
                componentTypes: ["number"],
            },
        ];
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.numbersShadow = {
            defaultValue: null,
            hasEssential: true,
            returnDependencies: () => ({}),
            definition: () => ({
                useEssentialOrDefaultValue: {
                    numbersShadow: true,
                },
            }),
        };

        stateVariableDefinitions.asList = {
            returnDependencies: () => ({}),
            definition() {
                return { setValue: { asList: true } };
            },
        };

        stateVariableDefinitions.numComponents = {
            public: true,
            shadowingInstructions: {
                createComponentOfType: "number",
            },
            additionalStateVariablesDefined: ["childNameByComponent"],
            returnDependencies: () => ({
                maxNumber: {
                    dependencyType: "stateVariable",
                    variableName: "maxNumber",
                },
                numberChildren: {
                    dependencyType: "child",
                    childGroups: ["numbers"],
                },
                numbersShadow: {
                    dependencyType: "stateVariable",
                    variableName: "numbersShadow",
                },
            }),
            definition: function ({ dependencyValues }) {
                let numComponents = 0;
                let childNameByComponent = [];

                if (dependencyValues.numberChildren.length > 0) {
                    childNameByComponent = dependencyValues.numberChildren.map(
                        (x) => x.componentName,
                    );
                    numComponents = dependencyValues.numberChildren.length;
                } else if (dependencyValues.numbersShadow !== null) {
                    numComponents = dependencyValues.numbersShadow.length;
                }

                let maxNum = dependencyValues.maxNumber;
                if (numComponents > maxNum) {
                    numComponents = maxNum;
                    childNameByComponent = childNameByComponent.slice(
                        0,
                        maxNum,
                    );
                }

                return {
                    setValue: {
                        numComponents,
                        childNameByComponent,
                    },
                    checkForActualChange: { numComponents: true },
                };
            },
        };

        stateVariableDefinitions.numbers = {
            shadowingInstructions: {
                createComponentOfType: "number",
            },
            isArray: true,
            entryPrefixes: ["number"],
            stateVariablesDeterminingDependencies: ["childNameByComponent"],
            returnArraySizeDependencies: () => ({
                numComponents: {
                    dependencyType: "stateVariable",
                    variableName: "numComponents",
                },
            }),
            returnArraySize({ dependencyValues }) {
                return [dependencyValues.numComponents];
            },

            returnArrayDependenciesByKey({ arrayKeys, stateValues }) {
                let dependenciesByKey = {};
                let globalDependencies = {
                    childNameByComponent: {
                        dependencyType: "stateVariable",
                        variableName: "childNameByComponent",
                    },
                    numbersShadow: {
                        dependencyType: "stateVariable",
                        variableName: "numbersShadow",
                    },
                };

                for (let arrayKey of arrayKeys) {
                    let childIndices = [];
                    if (stateValues.childNameByComponent[arrayKey]) {
                        childIndices = [arrayKey];
                    }
                    dependenciesByKey[arrayKey] = {
                        numberChildren: {
                            dependencyType: "child",
                            childGroups: ["numbers"],
                            variableNames: ["value"],
                            childIndices,
                        },
                    };
                }
                return { globalDependencies, dependenciesByKey };
            },
            arrayDefinitionByKey({
                globalDependencyValues,
                dependencyValuesByKey,
                arrayKeys,
            }) {
                let numbers = {};

                for (let arrayKey of arrayKeys) {
                    let child =
                        dependencyValuesByKey[arrayKey].numberChildren[0];

                    if (child) {
                        numbers[arrayKey] = child.stateValues.value;
                    } else if (globalDependencyValues.numbersShadow !== null) {
                        numbers[arrayKey] =
                            globalDependencyValues.numbersShadow[arrayKey];
                    }
                }

                return { setValue: { numbers } };
            },
            inverseArrayDefinitionByKey({
                desiredStateVariableValues,
                dependencyValuesByKey,
                globalDependencyValues,
                dependencyNamesByKey,
                workspace,
            }) {
                let instructions = [];

                for (let arrayKey in desiredStateVariableValues.numbers) {
                    if (!dependencyValuesByKey[arrayKey]) {
                        continue;
                    }

                    let child =
                        dependencyValuesByKey[arrayKey].numberChildren[0];

                    if (child) {
                        instructions.push({
                            setDependency:
                                dependencyNamesByKey[arrayKey].numberChildren,
                            desiredValue:
                                desiredStateVariableValues.numbers[arrayKey],
                            childIndex: 0,
                            variableIndex: 0,
                        });
                    } else if (globalDependencyValues.numbersShadow !== null) {
                        if (!workspace.desiredNumberShadow) {
                            workspace.desiredNumberShadow = [
                                ...globalDependencyValues.numbersShadow,
                            ];
                        }
                        workspace.desiredNumberShadow[arrayKey] =
                            desiredStateVariableValues.numbers[arrayKey];
                        instructions.push({
                            setDependency: "numbersShadow",
                            desiredValue: workspace.desiredNumberShadow,
                        });
                    }
                }

                return {
                    success: true,
                    instructions,
                };
            },
        };

        stateVariableDefinitions.numValues = {
            isAlias: true,
            targetVariableName: "numComponents",
        };

        stateVariableDefinitions.values = {
            isAlias: true,
            targetVariableName: "numbers",
        };

        stateVariableDefinitions.readyToExpandWhenResolved = {
            returnDependencies: () => ({
                childNameByComponent: {
                    dependencyType: "stateVariable",
                    variableName: "childNameByComponent",
                },
            }),
            // When this state variable is marked stale
            // it indicates we should update replacements.
            // For this to work, must set
            // stateVariableToEvaluateAfterReplacements
            // to this variable so that it is marked fresh
            markStale: () => ({ updateReplacements: true }),
            definition: function () {
                return { setValue: { readyToExpandWhenResolved: true } };
            },
        };

        return stateVariableDefinitions;
    }

    static async createSerializedReplacements({
        component,
        components,
        componentInfoObjects,
        workspace,
    }) {
        let errors = [];
        let warnings = [];

        let replacements = [];
        let componentsCopied = [];

        let attributesToConvert = {};
        for (let attr of [
            "fixed",
            "isResponse",
            ...Object.keys(returnRoundingAttributes()),
        ]) {
            if (attr in component.attributes) {
                attributesToConvert[attr] = component.attributes[attr];
            }
        }

        let newNamespace = component.attributes.newNamespace?.primitive;

        // allow one to override the fixed and isResponse attributes
        // as well as rounding settings
        // by specifying it on the sequence
        let attributesFromComposite = {};

        if (Object.keys(attributesToConvert).length > 0) {
            attributesFromComposite = convertAttributesForComponentType({
                attributes: attributesToConvert,
                componentType: "number",
                componentInfoObjects,
                compositeCreatesNewNamespace: newNamespace,
            });
        }

        let childNameByComponent =
            await component.stateValues.childNameByComponent;

        if (childNameByComponent.length > 0) {
            for (let childName of childNameByComponent) {
                let replacementSource = components[childName];

                if (replacementSource) {
                    componentsCopied.push(replacementSource.componentName);

                    let repl = await replacementSource.serialize({
                        primitiveSourceAttributesToIgnore: ["isResponse"],
                    });
                    if (!repl.attributes) {
                        repl.attributes = {};
                    }
                    Object.assign(
                        repl.attributes,
                        JSON.parse(JSON.stringify(attributesFromComposite)),
                    );
                    replacements.push(repl);
                }
            }
        } else {
            let numComponents = await component.stateValues.numComponents;
            for (let i = 0; i < numComponents; i++) {
                replacements.push({
                    componentType: "number",
                    attributes: JSON.parse(
                        JSON.stringify(attributesFromComposite),
                    ),
                    downstreamDependencies: {
                        [component.componentName]: [
                            {
                                dependencyType: "referenceShadow",
                                compositeName: component.componentName,
                                propVariable: `number${i + 1}`,
                            },
                        ],
                    },
                });
            }
        }

        workspace.uniqueIdentifiersUsed = [];
        replacements = postProcessCopy({
            serializedComponents: replacements,
            componentName: component.componentName,
            uniqueIdentifiersUsed: workspace.uniqueIdentifiersUsed,
            addShadowDependencies: true,
            markAsPrimaryShadow: true,
        });

        let processResult = processAssignNames({
            assignNames: component.doenetAttributes.assignNames,
            serializedComponents: replacements,
            parentName: component.componentName,
            parentCreatesNewNamespace: newNamespace,
            componentInfoObjects,
        });
        errors.push(...processResult.errors);
        warnings.push(...processResult.warnings);

        workspace.componentsCopied = componentsCopied;

        return {
            replacements: processResult.serializedComponents,
            errors,
            warnings,
        };
    }

    static async calculateReplacementChanges({
        component,
        components,
        componentInfoObjects,
        workspace,
    }) {
        // TODO: don't yet have a way to return errors and warnings!
        let errors = [];
        let warnings = [];

        let componentsToCopy = [];

        let childNameByComponent =
            await component.stateValues.childNameByComponent;

        for (let childName of childNameByComponent) {
            let replacementSource = components[childName];

            if (replacementSource) {
                componentsToCopy.push(replacementSource.componentName);
            }
        }

        if (
            componentsToCopy.length == workspace.componentsCopied.length &&
            workspace.componentsCopied.every(
                (x, i) => x === componentsToCopy[i],
            )
        ) {
            return [];
        }

        // for now, just recreate
        let replacementResults = await this.createSerializedReplacements({
            component,
            components,
            componentInfoObjects,
            workspace,
        });

        let replacements = replacementResults.replacements;
        errors.push(...replacementResults.errors);
        warnings.push(...replacementResults.warnings);

        let replacementChanges = [
            {
                changeType: "add",
                changeTopLevelReplacements: true,
                firstReplacementInd: 0,
                numberReplacementsToReplace: component.replacements.length,
                serializedReplacements: replacements,
            },
        ];

        return replacementChanges;
    }
}
