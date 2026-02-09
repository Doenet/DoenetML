import CompositeComponent from "./abstract/CompositeComponent";
import { returnGroupIntoComponentTypeSeparatedBySpacesOutsideParens } from "./commonsugar/lists";
import { postProcessCopy } from "../utils/copy";
import { convertUnresolvedAttributesForComponentType } from "../utils/dast/convertNormalizedDast";

export default class TextList extends CompositeComponent {
    static componentType = "textList";

    static stateVariableToEvaluateAfterReplacements =
        "readyToExpandWhenResolved";

    static includeBlankStringChildren = true;
    static removeBlankStringChildrenPostSugar = true;

    static allowInSchemaAsComponent = ["text"];

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
        attributes.isPotentialResponse = {
            leaveRaw: true,
            excludeFromSchema: true,
        };

        attributes.asList = {
            createPrimitiveOfType: "boolean",
            createStateVariable: "asList",
            defaultValue: true,
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
            replacementFunction: function ({
                matchedChildren,
                nComponents,
                stateIdInfo,
            }) {
                return groupIntoTextsSeparatedBySpaces({
                    matchedChildren,
                    nComponents,
                    stateIdInfo,
                });
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
                        (x) => x.componentIdx,
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
                        if (!workspace.desiredTextsShadow) {
                            workspace.desiredTextsShadow = [
                                ...globalDependencyValues.textsShadow,
                            ];
                        }
                        workspace.desiredTextsShadow[arrayKey] =
                            desiredStateVariableValues.texts[arrayKey];
                    }
                }

                if (workspace.desiredTextsShadow) {
                    instructions.push({
                        setDependency: "textsShadow",
                        desiredValue: workspace.desiredTextsShadow,
                    });
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
        nComponents,
    }) {
        if (workspace.replacementsCreated === undefined) {
            workspace.replacementsCreated = 0;
        }

        const stateIdInfo = {
            prefix: `${component.stateId}|`,
            num: workspace.replacementsCreated,
        };

        let errors = [];
        let warnings = [];

        let replacements = [];
        let componentsCopied = [];

        let attributesToConvert = {};
        for (let attr of ["fixed", "isResponse", "isPotentialResponse"]) {
            if (attr in component.attributes) {
                attributesToConvert[attr] = component.attributes[attr];
            }
        }

        let childNameByComponent =
            await component.stateValues.childNameByComponent;

        let numComponents = await component.stateValues.numComponents;
        for (let i = 0; i < numComponents; i++) {
            // allow one to override the fixed, isResponse, and isPotentialResponse attributes
            // by specifying it on the sequence
            let attributesFromComposite = {};

            if (Object.keys(attributesToConvert).length > 0) {
                const res = convertUnresolvedAttributesForComponentType({
                    attributes: attributesToConvert,
                    componentType: "text",
                    componentInfoObjects,
                    nComponents,
                    stateIdInfo,
                });

                attributesFromComposite = res.attributes;
                nComponents = res.nComponents;
            }

            let childIdx = childNameByComponent[i];
            let replacementSource = components[childIdx];

            if (replacementSource) {
                componentsCopied.push(replacementSource.componentIdx);
            }
            replacements.push({
                type: "serialized",
                componentType: "text",
                componentIdx: nComponents++,
                stateId: `${stateIdInfo.prefix}${stateIdInfo.num++}`,
                attributes: JSON.parse(JSON.stringify(attributesFromComposite)),
                doenetAttributes: {},
                children: [],
                state: {},
                downstreamDependencies: {
                    [component.componentIdx]: [
                        {
                            dependencyType: "referenceShadow",
                            compositeIdx: component.componentIdx,
                            propVariable: `text${i + 1}`,
                        },
                    ],
                },
            });
        }

        replacements = postProcessCopy({
            serializedComponents: replacements,
            componentIdx: component.componentIdx,
            addShadowDependencies: true,
            markAsPrimaryShadow: true,
        });

        workspace.componentsCopied = componentsCopied;
        workspace.numComponents = numComponents;

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
        componentInfoObjects,
        workspace,
        nComponents,
    }) {
        // TODO: don't yet have a way to return errors and warnings!
        let errors = [];
        let warnings = [];

        let numComponents = await component.stateValues.numComponents;

        if (numComponents === workspace.numComponents) {
            let componentsToCopy = [];

            let childNameByComponent =
                await component.stateValues.childNameByComponent;

            for (let childIdx of childNameByComponent) {
                let replacementSource = components[childIdx];

                if (replacementSource) {
                    componentsToCopy.push(replacementSource.componentIdx);
                }
            }

            if (
                componentsToCopy.length == workspace.componentsCopied.length &&
                workspace.componentsCopied.every(
                    (x, i) => x === componentsToCopy[i],
                )
            ) {
                return { replacementChanges: [] };
            }
        }

        // for now, just recreate
        let replacementResults = await this.createSerializedReplacements({
            component,
            components,
            componentInfoObjects,
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
