import BaseComponent from "./abstract/BaseComponent";
import {
    determineVariantsForSection,
    getVariantsForDescendantsForUniqueVariants,
} from "../utils/variants";
import { returnStyleDefinitionStateVariables } from "@doenet/utils";
import { returnFeedbackDefinitionStateVariables } from "../utils/feedback";
import {
    returnScoredSectionStateVariableDefinition,
    submitAllAnswers,
} from "../utils/scoredSection";

export default class Document extends BaseComponent {
    constructor(args) {
        super(args);

        Object.assign(this.actions, {
            submitAllAnswers: this.submitAllAnswers.bind(this),
            recordVisibilityChange: this.recordVisibilityChange.bind(this),
        });
    }
    static componentType = "document";
    static rendererType = "section";
    static renderChildren = true;

    static canDisplayChildErrors = true;

    static createsVariants = true;

    static includeBlankStringChildren = true;

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        delete attributes.hide;
        delete attributes.disabled;
        delete attributes.modifyIndirectly;
        delete attributes.fixed;
        delete attributes.styleNumber;
        delete attributes.isResponse;
        delete attributes.isPotentialResponse;

        attributes.documentWideCheckWork = {
            createComponentOfType: "boolean",
            createStateVariable: "documentWideCheckWork",
            defaultValue: false,
            public: true,
        };
        attributes.showCorrectness = {
            createComponentOfType: "boolean",
            createStateVariable: "showCorrectnessPreliminary",
            defaultValue: true,
        };
        attributes.colorCorrectness = {
            createComponentOfType: "boolean",
            createStateVariable: "colorCorrectnessPreliminary",
            defaultValue: true,
        };
        attributes.forceIndividualAnswerColoring = {
            createComponentOfType: "boolean",
            createStateVariable: "forceIndividualAnswerColoring",
            defaultValue: false,
        };
        attributes.submitLabel = {
            createComponentOfType: "text",
            createStateVariable: "submitLabel",
            defaultValue: "Check Work",
            public: true,
            forRenderer: true,
        };
        attributes.submitLabelNoCorrectness = {
            createComponentOfType: "text",
            createStateVariable: "submitLabelNoCorrectness",
            defaultValue: "Submit Response",
            public: true,
            forRenderer: true,
        };

        attributes.displayDigitsForCreditAchieved = {
            createComponentOfType: "integer",
            createStateVariable: "displayDigitsForCreditAchieved",
            defaultValue: 3,
            public: true,
        };

        // at this point, we are creating these attributes
        // so that having them in the doenetML is valid
        // Do we want to do something with these attributes?
        attributes.xmlns = {
            createPrimitiveOfType: "string",
        };
        attributes.type = {
            createPrimitiveOfType: "string",
        };

        return attributes;
    }

    static returnChildGroups() {
        return [
            {
                group: "variantControl",
                componentTypes: ["variantControl"],
            },
            {
                group: "title",
                componentTypes: ["title"],
            },
            {
                group: "description",
                componentTypes: ["description"],
            },
            {
                group: "setups",
                componentTypes: ["setup"],
            },
            {
                group: "styleDefinitions",
                componentTypes: ["styleDefinition"],
            },
            {
                group: "feedbackDefinitions",
                componentTypes: ["feedbackDefinition"],
            },
            {
                group: "anything",
                componentTypes: ["_base"],
            },
        ];
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        // Note: style definition state variables allow one to redefine the style
        // via styledefinitions inside a setup in the document
        let styleDefinitionStateVariables =
            returnStyleDefinitionStateVariables();
        Object.assign(stateVariableDefinitions, styleDefinitionStateVariables);

        let feedbackDefinitionStateVariables =
            returnFeedbackDefinitionStateVariables();
        Object.assign(
            stateVariableDefinitions,
            feedbackDefinitionStateVariables,
        );

        Object.assign(
            stateVariableDefinitions,
            returnScoredSectionStateVariableDefinition(),
        );

        delete stateVariableDefinitions.aggregateScores;

        stateVariableDefinitions.titleChildName = {
            forRenderer: true,
            returnDependencies: () => ({
                titleChild: {
                    dependencyType: "child",
                    childGroups: ["title"],
                },
            }),
            definition({ dependencyValues }) {
                let titleChildName = null;
                if (dependencyValues.titleChild.length > 0) {
                    titleChildName =
                        dependencyValues.titleChild[0].componentIdx;
                }
                return {
                    setValue: { titleChildName },
                };
            },
        };

        stateVariableDefinitions.title = {
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            forRenderer: true,
            returnDependencies: () => ({
                titleChild: {
                    dependencyType: "child",
                    childGroups: ["title"],
                    variableNames: ["text"],
                },
            }),
            definition({ dependencyValues }) {
                if (dependencyValues.titleChild.length === 0) {
                    return { setValue: { title: "" } };
                } else {
                    return {
                        setValue: {
                            title: dependencyValues.titleChild[0].stateValues
                                .text,
                        },
                    };
                }
            },
        };

        stateVariableDefinitions.description = {
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            returnDependencies: () => ({
                descriptionChild: {
                    dependencyType: "child",
                    childGroups: ["description"],
                    variableNames: ["text"],
                },
            }),
            definition({ dependencyValues }) {
                if (dependencyValues.descriptionChild.length === 0) {
                    return { setValue: { description: "" } };
                } else {
                    return {
                        setValue: {
                            description:
                                dependencyValues.descriptionChild[0].stateValues
                                    .text,
                        },
                    };
                }
            },
        };

        // Theme is used to by styleDescriptions to use the dark mode words if theme is dark.
        // It is set to be either "light" or "dark" via an action sent by the viewer.
        stateVariableDefinitions.theme = {
            hasEssential: true,
            defaultValue: "light",
            returnDependencies: () => ({
                documentAncestor: {
                    dependencyType: "ancestor",
                    componentType: "document",
                    variableNames: ["theme"],
                },
            }),
            definition({ dependencyValues }) {
                if (dependencyValues.documentAncestor) {
                    // this document is inside another document so use the ancestor's value
                    return {
                        setValue: {
                            theme: dependencyValues.documentAncestor.stateValues
                                .theme,
                        },
                    };
                } else {
                    return { useEssentialOrDefaultValue: { theme: true } };
                }
            },
            inverseDefinition({
                desiredStateVariableValues,
                dependencyValues,
            }) {
                if (dependencyValues.documentAncestor) {
                    return {
                        success: true,
                        instructions: [
                            {
                                setDependency: "documentAncestor",
                                desiredValue: desiredStateVariableValues.theme,
                            },
                        ],
                    };
                } else {
                    return {
                        success: true,
                        instructions: [
                            {
                                setEssentialValue: "theme",
                                value: desiredStateVariableValues.theme,
                            },
                        ],
                    };
                }
            },
        };

        stateVariableDefinitions.level = {
            forRenderer: true,
            returnDependencies: () => ({}),
            definition: () => ({ setValue: { level: 0 } }),
        };

        stateVariableDefinitions.numScoredDescendants = {
            returnDependencies: () => ({
                scoredDescendants: {
                    dependencyType: "stateVariable",
                    variableName: "scoredDescendants",
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        numScoredDescendants:
                            dependencyValues.scoredDescendants.length,
                    },
                };
            },
        };

        stateVariableDefinitions.componentCreditAchieved = {
            isArray: true,
            returnArraySizeDependencies: () => ({
                numScoredDescendants: {
                    dependencyType: "stateVariable",
                    variableName: "numScoredDescendants",
                },
            }),
            returnArraySize({ dependencyValues }) {
                return [dependencyValues.numScoredDescendants];
            },
            stateVariablesDeterminingDependencies: ["scoredDescendants"],
            returnArrayDependenciesByKey({ arrayKeys, stateValues }) {
                let dependenciesByKey = {};
                for (let arrayKey of arrayKeys) {
                    let descendant = stateValues.scoredDescendants[arrayKey];
                    if (descendant) {
                        dependenciesByKey[arrayKey] = {
                            creditAchieved: {
                                dependencyType: "stateVariable",
                                componentIdx: descendant.componentIdx,
                                variableName: "creditAchieved",
                            },
                        };
                    }
                }

                return { dependenciesByKey };
            },
            arrayDefinitionByKey({ dependencyValuesByKey, arrayKeys }) {
                let componentCreditAchieved = {};

                for (let arrayKey of arrayKeys) {
                    componentCreditAchieved[arrayKey] =
                        dependencyValuesByKey[arrayKey].creditAchieved;
                }

                return { setValue: { componentCreditAchieved } };
            },
        };

        stateVariableDefinitions.componentNumberByAnswerName = {
            stateVariablesDeterminingDependencies: ["scoredDescendants"],
            returnDependencies({ stateValues }) {
                let dependencies = {
                    scoredDescendants: {
                        dependencyType: "stateVariable",
                        variableName: "scoredDescendants",
                    },
                };
                for (let ind in stateValues.scoredDescendants) {
                    let descendant = stateValues.scoredDescendants[ind];
                    dependencies[`descendantsOf${ind}`] = {
                        dependencyType: "descendant",
                        ancestorIdx: descendant.componentIdx,
                        componentTypes: ["answer", "_blockScoredComponent"],
                        recurseToMatchedChildren: false,
                    };
                }

                return dependencies;
            },
            definition({ dependencyValues, componentInfoObjects }) {
                let componentNumberByAnswerName = {};

                for (let [
                    ind,
                    component,
                ] of dependencyValues.scoredDescendants.entries()) {
                    let componentNumber = ind + 1;
                    for (let answerDescendant of dependencyValues[
                        `descendantsOf${ind}`
                    ]) {
                        componentNumberByAnswerName[
                            answerDescendant.componentIdx
                        ] = componentNumber;
                    }
                    if (
                        componentInfoObjects.isInheritedComponentType({
                            inheritedComponentType: component.componentType,
                            baseComponentType: "answer",
                        }) ||
                        componentInfoObjects.isInheritedComponentType({
                            inheritedComponentType: component.componentType,
                            baseComponentType: "_blockScoredComponent",
                        })
                    ) {
                        componentNumberByAnswerName[component.componentIdx] =
                            componentNumber;
                    }
                }

                return { setValue: { componentNumberByAnswerName } };
            },
        };

        stateVariableDefinitions.docVariantInfo = {
            isArray: true,
            returnArraySizeDependencies: () => ({
                numScoredDescendants: {
                    dependencyType: "stateVariable",
                    variableName: "numScoredDescendants",
                },
            }),
            returnArraySize({ dependencyValues }) {
                return [dependencyValues.numScoredDescendants];
            },
            stateVariablesDeterminingDependencies: ["scoredDescendants"],
            returnArrayDependenciesByKey({ arrayKeys, stateValues }) {
                let dependenciesByKey = {};
                for (let arrayKey of arrayKeys) {
                    let descendant = stateValues.scoredDescendants[arrayKey];
                    if (descendant) {
                        dependenciesByKey[arrayKey] = {
                            generatedVariantInfo: {
                                dependencyType: "stateVariable",
                                componentIdx: descendant.componentIdx,
                                variableName: "generatedVariantInfo",
                                variablesOptional: true,
                            },
                        };
                    }
                }

                return { dependenciesByKey };
            },
            arrayDefinitionByKey({ dependencyValuesByKey, arrayKeys }) {
                let docVariantInfo = {};

                for (let arrayKey of arrayKeys) {
                    docVariantInfo[arrayKey] =
                        dependencyValuesByKey[arrayKey].generatedVariantInfo;
                }

                return { setValue: { docVariantInfo } };
            },
        };

        stateVariableDefinitions.creditAchieved = {
            public: true,
            forRenderer: true,
            defaultValue: 0,
            shadowingInstructions: {
                createComponentOfType: "number",
                addAttributeComponentsShadowingStateVariables: {
                    displayDigits: {
                        stateVariableToShadow: "displayDigitsForCreditAchieved",
                    },
                    displayDecimals: {
                        stateVariableToShadow:
                            "displayDecimalsForCreditAchieved",
                    },
                },
            },
            additionalStateVariablesDefined: [
                {
                    variableName: "percentCreditAchieved",
                    public: true,
                    shadowingInstructions: {
                        createComponentOfType: "number",
                        addAttributeComponentsShadowingStateVariables: {
                            displayDigits: {
                                stateVariableToShadow:
                                    "displayDigitsForCreditAchieved",
                            },
                            displayDecimals: {
                                stateVariableToShadow:
                                    "displayDecimalsForCreditAchieved",
                            },
                        },
                    },
                },
            ],
            returnDependencies: () => ({
                scoredDescendants: {
                    dependencyType: "stateVariable",
                    variableName: "scoredDescendants",
                },
                componentCreditAchieved: {
                    dependencyType: "stateVariable",
                    variableName: "componentCreditAchieved",
                },
            }),
            definition({ dependencyValues }) {
                let creditSum = 0;
                let totalWeight = 0;

                for (let [
                    ind,
                    component,
                ] of dependencyValues.scoredDescendants.entries()) {
                    let weight = component.stateValues.weight;
                    creditSum +=
                        dependencyValues.componentCreditAchieved[ind] * weight;
                    totalWeight += weight;
                }
                let creditAchieved;

                if (totalWeight > 0) {
                    creditAchieved = creditSum / totalWeight;
                } else {
                    // give full credit if there are no scored items
                    creditAchieved = 1;
                }

                let percentCreditAchieved = creditAchieved * 100;

                return { setValue: { creditAchieved, percentCreditAchieved } };
            },
        };

        stateVariableDefinitions.creditAchievedIfSubmit = {
            defaultValue: 0,
            stateVariablesDeterminingDependencies: ["scoredDescendants"],
            returnDependencies({ stateValues }) {
                let dependencies = {
                    scoredDescendants: {
                        dependencyType: "stateVariable",
                        variableName: "scoredDescendants",
                    },
                };
                for (let [
                    ind,
                    descendant,
                ] of stateValues.scoredDescendants.entries()) {
                    dependencies["creditAchievedIfSubmit" + ind] = {
                        dependencyType: "stateVariable",
                        componentIdx: descendant.componentIdx,
                        variableName: "creditAchievedIfSubmit",
                    };
                }

                return dependencies;
            },
            definition({ dependencyValues }) {
                let creditSum = 0;
                let totalWeight = 0;

                for (let [
                    ind,
                    component,
                ] of dependencyValues.scoredDescendants.entries()) {
                    let weight = component.stateValues.weight;
                    creditSum +=
                        dependencyValues["creditAchievedIfSubmit" + ind] *
                        weight;
                    totalWeight += weight;
                }
                let creditAchievedIfSubmit = creditSum / totalWeight;

                return { setValue: { creditAchievedIfSubmit } };
            },
        };

        stateVariableDefinitions.generatedVariantInfo = {
            providePreviousValuesInDefinition: true,
            returnDependencies: ({
                sharedParameters,
                componentInfoObjects,
            }) => ({
                variantIndex: {
                    dependencyType: "value",
                    value: sharedParameters.variantIndex,
                },
                variantName: {
                    dependencyType: "value",
                    value: sharedParameters.variantName,
                },
                variantDescendants: {
                    dependencyType: "descendant",
                    componentTypes: Object.keys(
                        componentInfoObjects.componentTypesCreatingVariants,
                    ),
                    variableNames: [
                        "isVariantComponent",
                        "generatedVariantInfo",
                    ],
                    recurseToMatchedChildren: false,
                    variablesOptional: true,
                    includeNonActiveChildren: true,
                    ignoreReplacementsOfEncounteredComposites: true,
                },
            }),
            definition({ dependencyValues, componentIdx, previousValues }) {
                let generatedVariantInfo = {
                    index: dependencyValues.variantIndex,
                    name: dependencyValues.variantName,
                    meta: {
                        createdBy: componentIdx,
                    },
                };

                let subvariants = (generatedVariantInfo.subvariants = []);

                for (let descendant of dependencyValues.variantDescendants) {
                    if (descendant.stateValues.isVariantComponent) {
                        subvariants.push(
                            descendant.stateValues.generatedVariantInfo,
                        );
                    } else if (descendant.stateValues.generatedVariantInfo) {
                        subvariants.push(
                            ...descendant.stateValues.generatedVariantInfo
                                .subvariants,
                        );
                    }
                }

                for (let [ind, subvar] of subvariants.entries()) {
                    if (
                        !subvar.subvariants &&
                        previousValues.generatedVariantInfo
                    ) {
                        // check if previously had subvariants
                        let previousSubvariants =
                            previousValues.generatedVariantInfo.subvariants;
                        if (previousSubvariants[ind]?.subvariants) {
                            subvariants[ind] = Object.assign(
                                {},
                                subvariants[ind],
                            );
                            subvariants[ind].subvariants =
                                previousSubvariants[ind].subvariants;
                        }
                    }
                }

                return { setValue: { generatedVariantInfo } };
            },
        };

        stateVariableDefinitions.createSubmitAllButton = {
            forRenderer: true,
            additionalStateVariablesDefined: [
                "suppressAnswerSubmitButtons",
                "descendantColorCorrectnessBasedOnIdx",
            ],
            returnDependencies: () => ({
                documentWideCheckWork: {
                    dependencyType: "stateVariable",
                    variableName: "documentWideCheckWork",
                },
                forceIndividualAnswerColoring: {
                    dependencyType: "stateVariable",
                    variableName: "forceIndividualAnswerColoring",
                },
            }),
            definition({ dependencyValues, componentIdx }) {
                let createSubmitAllButton = false;
                let suppressAnswerSubmitButtons = false;
                let descendantColorCorrectnessBasedOnIdx = null;

                if (dependencyValues.documentWideCheckWork) {
                    createSubmitAllButton = true;
                    suppressAnswerSubmitButtons = true;
                    if (!dependencyValues.forceIndividualAnswerColoring) {
                        descendantColorCorrectnessBasedOnIdx = componentIdx;
                    }
                }

                return {
                    setValue: {
                        createSubmitAllButton,
                        suppressAnswerSubmitButtons,
                        descendantColorCorrectnessBasedOnIdx,
                    },
                };
            },
        };

        stateVariableDefinitions.containerTag = {
            forRenderer: true,
            returnDependencies: () => ({}),
            definition: () => ({ setValue: { containerTag: "div" } }),
        };

        return stateVariableDefinitions;
    }

    async submitAllAnswers({
        actionId,
        sourceInformation = {},
        skipRendererUpdate = false,
    }) {
        return submitAllAnswers({
            component: this,
            actionId,
            sourceInformation,
            skipRendererUpdate,
        });
    }

    recordVisibilityChange({ isVisible }) {
        this.coreFunctions.requestRecordEvent({
            verb: "visibilityChanged",
            object: {
                componentIdx: this.componentIdx,
                componentType: this.componentType,
            },
            result: { isVisible },
        });
    }

    static setUpVariant({
        serializedComponent,
        sharedParameters,
        descendantVariantComponents,
    }) {
        // console.log("****Variant for document*****")

        let numVariants = serializedComponent.variants.numVariants;

        let variantIndex;
        // check if desiredVariant was specified
        let desiredVariant = serializedComponent.variants.desiredVariant;
        if (desiredVariant !== undefined) {
            if (desiredVariant.index !== undefined) {
                let desiredVariantIndex = Number(desiredVariant.index);
                if (!Number.isFinite(desiredVariantIndex)) {
                    console.warn(
                        "Variant index " +
                            desiredVariant.index +
                            " must be a number",
                    );
                    variantIndex = 1;
                } else {
                    if (!Number.isInteger(desiredVariantIndex)) {
                        console.warn(
                            "Variant index " +
                                desiredVariant.index +
                                " must be an integer",
                        );
                        desiredVariantIndex = Math.round(desiredVariantIndex);
                    }
                    let indexFrom0 = (desiredVariantIndex - 1) % numVariants;
                    if (indexFrom0 < 0) {
                        indexFrom0 += numVariants;
                    }
                    variantIndex = indexFrom0 + 1;
                }
            }
        }

        if (variantIndex === undefined) {
            // if variant index wasn't specified, use first variant
            variantIndex = 1;
        }

        sharedParameters.allPossibleVariants =
            serializedComponent.variants.allPossibleVariants;
        sharedParameters.allVariantNames =
            serializedComponent.variants.allVariantNames;

        sharedParameters.variantSeed =
            serializedComponent.variants.allPossibleVariantSeeds[
                variantIndex - 1
            ];
        sharedParameters.variantIndex = variantIndex;
        sharedParameters.variantName =
            serializedComponent.variants.allPossibleVariants[variantIndex - 1];
        sharedParameters.uniqueIndex =
            serializedComponent.variants.allPossibleVariantUniqueIndices[
                variantIndex - 1
            ];

        sharedParameters.variantRng = sharedParameters.rngClass(
            sharedParameters.variantSeed,
        );
        sharedParameters.subpartVariantRng = sharedParameters.rngClass(
            sharedParameters.variantSeed + "s",
        );

        // console.log("Document variant name: " + sharedParameters.variantName);

        // if subvariants were specified, add those to the corresponding descendants
        if (desiredVariant?.subvariants && descendantVariantComponents) {
            for (let ind in desiredVariant.subvariants) {
                let subvariant = desiredVariant.subvariants[ind];
                let variantComponent = descendantVariantComponents[ind];
                if (variantComponent === undefined) {
                    break;
                }
                variantComponent.variants.desiredVariant = subvariant;
            }
        }

        // console.log("Desired variant for document");
        // console.log(desiredVariant);
    }

    static determineNumberOfUniqueVariants({
        serializedComponent,
        componentInfoObjects,
    }) {
        return determineVariantsForSection({
            serializedComponent,
            componentInfoObjects,
            isDocument: true,
        });
    }

    static getUniqueVariant({
        serializedComponent,
        variantIndex,
        componentInfoObjects,
    }) {
        let originalVariantIndex =
            serializedComponent.variants.allPossibleVariantUniqueIndices[
                variantIndex - 1
            ];

        if (originalVariantIndex === undefined) {
            return { success: false };
        }

        let result = getVariantsForDescendantsForUniqueVariants({
            variantIndex: originalVariantIndex,
            serializedComponent,
            componentInfoObjects,
        });

        if (!result.success) {
            console.log("Failed to get unique variant for document.");

            return { success: false };
        }

        return {
            success: true,
            desiredVariant: {
                index: variantIndex,
                subvariants: result.desiredVariants,
            },
        };
    }
}
