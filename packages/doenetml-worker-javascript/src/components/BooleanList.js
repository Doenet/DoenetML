import CompositeComponent from "./abstract/CompositeComponent";
import { returnGroupIntoComponentTypeSeparatedBySpacesOutsideParens } from "./commonsugar/lists";
import { postProcessCopy } from "../utils/copy";
import { convertUnresolvedAttributesForComponentType } from "../utils/dast/convertNormalizedDast";

export default class BooleanList extends CompositeComponent {
    static componentType = "booleanList";

    static stateVariableToEvaluateAfterReplacements =
        "readyToExpandWhenResolved";

    static includeBlankStringChildren = true;
    static removeBlankStringChildrenPostSugar = true;

    // when another component has a attribute that is a booleanList,
    // use the booleans state variable to populate that attribute
    static stateVariableToBeShadowed = "booleans";
    static primaryStateVariableForDefinition = "booleansShadow";

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
        let groupIntoBooleansSeparatedBySpaces =
            returnGroupIntoComponentTypeSeparatedBySpacesOutsideParens({
                componentType: "boolean",
            });

        sugarInstructions.push({
            replacementFunction: function ({
                matchedChildren,
                nComponents,
                stateIdInfo,
            }) {
                return groupIntoBooleansSeparatedBySpaces({
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
                group: "booleans",
                componentTypes: ["boolean"],
            },
        ];
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.booleansShadow = {
            defaultValue: null,
            hasEssential: true,
            returnDependencies: () => ({}),
            definition: () => ({
                useEssentialOrDefaultValue: {
                    booleansShadow: true,
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
                    booleanChildren: {
                        dependencyType: "child",
                        childGroups: ["booleans"],
                    },
                    booleansShadow: {
                        dependencyType: "stateVariable",
                        variableName: "booleansShadow",
                    },
                };
            },
            definition: function ({ dependencyValues }) {
                let numComponents = 0;
                let childNameByComponent = [];

                if (dependencyValues.booleanChildren.length > 0) {
                    childNameByComponent = dependencyValues.booleanChildren.map(
                        (x) => x.componentIdx,
                    );
                    numComponents = dependencyValues.booleanChildren.length;
                } else if (dependencyValues.booleansShadow !== null) {
                    numComponents = dependencyValues.booleansShadow.length;
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

        stateVariableDefinitions.booleans = {
            isArray: true,
            entryPrefixes: ["boolean"],
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
                    booleansShadow: {
                        dependencyType: "stateVariable",
                        variableName: "booleansShadow",
                    },
                };

                for (let arrayKey of arrayKeys) {
                    let childIndices = [];
                    if (stateValues.childNameByComponent[arrayKey]) {
                        childIndices = [arrayKey];
                    }
                    dependenciesByKey[arrayKey] = {
                        booleanChildren: {
                            dependencyType: "child",
                            childGroups: ["booleans"],
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
                let booleans = {};

                for (let arrayKey of arrayKeys) {
                    let child =
                        dependencyValuesByKey[arrayKey].booleanChildren[0];

                    if (child) {
                        booleans[arrayKey] = child.stateValues.value;
                    } else if (globalDependencyValues.booleansShadow !== null) {
                        booleans[arrayKey] =
                            globalDependencyValues.booleansShadow[arrayKey];
                    }
                }

                return { setValue: { booleans } };
            },
            inverseArrayDefinitionByKey({
                desiredStateVariableValues,
                globalDependencyValues,
                dependencyValuesByKey,
                dependencyNamesByKey,
                workspace,
            }) {
                let instructions = [];

                for (let arrayKey in desiredStateVariableValues.booleans) {
                    if (!dependencyValuesByKey[arrayKey]) {
                        continue;
                    }

                    let child =
                        dependencyValuesByKey[arrayKey].booleanChildren[0];

                    if (child) {
                        instructions.push({
                            setDependency:
                                dependencyNamesByKey[arrayKey].booleanChildren,
                            desiredValue:
                                desiredStateVariableValues.booleans[arrayKey],
                            childIndex: 0,
                            variableIndex: 0,
                        });
                    } else if (globalDependencyValues.booleansShadow !== null) {
                        if (!workspace.desiredBooleanShadow) {
                            workspace.desiredBooleanShadow = [
                                ...globalDependencyValues.booleansShadow,
                            ];
                        }
                        workspace.desiredBooleanShadow[arrayKey] =
                            desiredStateVariableValues.booleans[arrayKey];
                    }
                }

                if (workspace.desiredBooleanShadow) {
                    instructions.push({
                        setDependency: "booleansShadow",
                        desiredValue: workspace.desiredBooleanShadow,
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
            targetVariableName: "booleans",
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
        for (let attr of ["fixed", "isResponse"]) {
            if (attr in component.attributes) {
                attributesToConvert[attr] = component.attributes[attr];
            }
        }

        let childNameByComponent =
            await component.stateValues.childNameByComponent;

        let numComponents = await component.stateValues.numComponents;
        for (let i = 0; i < numComponents; i++) {
            // allow one to override the fixed and isResponse attributes
            // by specifying it on the sequence
            let attributesFromComposite = {};

            if (Object.keys(attributesToConvert).length > 0) {
                const res = convertUnresolvedAttributesForComponentType({
                    attributes: attributesToConvert,
                    componentType: "boolean",
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
                componentType: "boolean",
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
                            propVariable: `boolean${i + 1}`,
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
        nComponents,
        componentInfoObjects,
        workspace,
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
                return [];
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
