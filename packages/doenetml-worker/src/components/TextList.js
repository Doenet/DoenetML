import CompositeComponent from "./abstract/CompositeComponent";
import { returnGroupIntoComponentTypeSeparatedBySpacesOutsideParens } from "./commonsugar/lists";
import {
    convertAttributesForComponentType,
    postProcessCopy,
} from "../utils/copy";
import { processAssignNames } from "../utils/naming";

export default class TextList extends CompositeComponent {
    static componentType = "textList";

    static stateVariableToEvaluateAfterReplacements =
        "readyToExpandWhenResolved";

    static assignNamesToReplacements = true;

    static includeBlankStringChildren = true;
    static removeBlankStringChildrenPostSugar = true;

    // when another component has a attribute that is a textList,
    // use the texts state variable to populate that attribute
    static stateVariableToBeShadowed = "texts";
    static primaryStateVariableForDefinition = "textsShadow";

    // even if inside a component that turned on descendantCompositesMustHaveAReplacement
    // don't required composite replacements
    static descendantCompositesMustHaveAReplacement = false;

    static doNotExpandAsShadowed = true;

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

        attributes.isResponse = {
            leaveRaw: true,
        };

        return attributes;
    }

    // Include children that can be added due to sugar
    static additionalSchemaChildren = ["string"];

    static returnSugarInstructions() {
        let sugarInstructions = super.returnSugarInstructions();

        let groupIntoTextsSeparatedBySpaces =
            returnGroupIntoComponentTypeSeparatedBySpacesOutsideParens({
                componentType: "text",
            });

        sugarInstructions.push({
            replacementFunction: function ({ matchedChildren }) {
                return groupIntoTextsSeparatedBySpaces({ matchedChildren });
            },
        });

        return sugarInstructions;
    }

    static returnChildGroups() {
        return [
            {
                group: "texts",
                componentTypes: ["text"],
            },
        ];
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.textsShadow = {
            defaultValue: null,
            hasEssential: true,
            returnDependencies: () => ({}),
            definition: () => ({
                useEssentialOrDefaultValue: {
                    textsShadow: true,
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
            returnDependencies() {
                return {
                    maxNumber: {
                        dependencyType: "stateVariable",
                        variableName: "maxNumber",
                    },
                    textChildren: {
                        dependencyType: "child",
                        childGroups: ["texts"],
                    },
                    textsShadow: {
                        dependencyType: "stateVariable",
                        variableName: "textsShadow",
                    },
                };
            },
            definition: function ({ dependencyValues }) {
                let numComponents = 0;
                let childNameByComponent = [];

                if (dependencyValues.textChildren.length > 0) {
                    childNameByComponent = dependencyValues.textChildren.map(
                        (x) => x.componentName,
                    );
                    numComponents = dependencyValues.textChildren.length;
                } else if (dependencyValues.textsShadow !== null) {
                    numComponents = dependencyValues.textsShadow.length;
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
                    setValue: { numComponents, childNameByComponent },
                    checkForActualChange: { numComponents: true },
                };
            },
        };

        stateVariableDefinitions.texts = {
            isArray: true,
            entryPrefixes: ["text"],
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
                    textsShadow: {
                        dependencyType: "stateVariable",
                        variableName: "textsShadow",
                    },
                };

                for (let arrayKey of arrayKeys) {
                    let childIndices = [];
                    if (stateValues.childNameByComponent[arrayKey]) {
                        childIndices = [arrayKey];
                    }
                    dependenciesByKey[arrayKey] = {
                        textChildren: {
                            dependencyType: "child",
                            childGroups: ["texts"],
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
                let texts = {};

                for (let arrayKey of arrayKeys) {
                    let child = dependencyValuesByKey[arrayKey].textChildren[0];

                    if (child) {
                        texts[arrayKey] = child.stateValues.value;
                    } else if (globalDependencyValues.textsShadow !== null) {
                        texts[arrayKey] =
                            globalDependencyValues.textsShadow[arrayKey];
                    }
                }

                return { setValue: { texts } };
            },
            inverseArrayDefinitionByKey({
                desiredStateVariableValues,
                globalDependencyValues,
                dependencyValuesByKey,
                dependencyNamesByKey,
                workspace,
            }) {
                let instructions = [];

                for (let arrayKey in desiredStateVariableValues.texts) {
                    if (!dependencyValuesByKey[arrayKey]) {
                        continue;
                    }

                    let child = dependencyValuesByKey[arrayKey].textChildren[0];

                    if (child) {
                        instructions.push({
                            setDependency:
                                dependencyNamesByKey[arrayKey].textChildren,
                            desiredValue:
                                desiredStateVariableValues.texts[arrayKey],
                            childIndex: 0,
                            variableIndex: 0,
                        });
                    } else if (globalDependencyValues.textsShadow !== null) {
                        if (!workspace.desiredTextShadow) {
                            workspace.desiredTextShadow = [
                                ...globalDependencyValues.textsShadow,
                            ];
                        }
                        workspace.desiredTextShadow[arrayKey] =
                            desiredStateVariableValues.texts[arrayKey];
                        instructions.push({
                            setDependency: "textsShadow",
                            desiredValue: workspace.desiredTextShadow,
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
            targetVariableName: "texts",
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
        for (let attr of ["fixed", "isResponse"]) {
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
                componentType: "text",
                componentInfoObjects,
                compositeCreatesNewNamespace: newNamespace,
            });
        }

        let childNameByComponent =
            await component.stateValues.childNameByComponent;

        let numComponents = await component.stateValues.numComponents;
        for (let i = 0; i < numComponents; i++) {
            let childName = childNameByComponent[i];
            let replacementSource = components[childName];

            if (replacementSource) {
                componentsCopied.push(replacementSource.componentName);
            }
            replacements.push({
                componentType: "text",
                attributes: JSON.parse(JSON.stringify(attributesFromComposite)),
                downstreamDependencies: {
                    [component.componentName]: [
                        {
                            dependencyType: "referenceShadow",
                            compositeName: component.componentName,
                            propVariable: `text${i + 1}`,
                        },
                    ],
                },
            });
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
