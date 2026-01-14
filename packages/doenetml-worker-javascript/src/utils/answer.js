import { serializedComponentsReplacer } from "@doenet/utils";
import sha1 from "crypto-js/sha1";
import Base64 from "crypto-js/enc-base64";
import stringify from "json-stringify-deterministic";

export function returnStandardAnswerAttributes() {
    return {
        weight: {
            createComponentOfType: "number",
            createStateVariable: "weight",
            defaultValue: 1,
            public: true,
        },
        handGraded: {
            createPrimitiveOfType: "boolean",
            createStateVariable: "handGraded",
            defaultValue: false,
            public: true,
        },
        matchPartial: {
            createComponentOfType: "boolean",
            createStateVariable: "matchPartial",
            defaultValue: false,
            public: true,
        },
        maxNumAttempts: {
            createComponentOfType: "integer",
            createStateVariable: "maxNumAttempts",
            defaultValue: Infinity,
            public: true,
        },
        showCorrectness: {
            createComponentOfType: "boolean",
            createStateVariable: "showCorrectnessPreliminary",
            defaultValue: true,
        },
        colorCorrectness: {
            createComponentOfType: "boolean",
            createStateVariable: "colorCorrectnessPreliminary",
            defaultValue: true,
            public: true,
        },

        disableAfterCorrect: {
            createComponentOfType: "boolean",
            createStateVariable: "disableAfterCorrect",
            defaultValue: false,
            public: true,
        },

        submitLabel: {
            createComponentOfType: "text",
            createStateVariable: "submitLabel",
            defaultValue: "Check Work",
            public: true,
            forRenderer: true,
        },

        submitLabelNoCorrectness: {
            createComponentOfType: "text",
            createStateVariable: "submitLabelNoCorrectness",
            defaultValue: "Submit Response",
            public: true,
            forRenderer: true,
        },

        displayDigitsForResponses: {
            createComponentOfType: "integer",
            createStateVariable: "displayDigitsForResponses",
            defaultValue: 10,
            public: true,
        },

        displayDigitsForCreditAchieved: {
            createComponentOfType: "integer",
            createStateVariable: "displayDigitsForCreditAchieved",
            defaultValue: 3,
            public: true,
        },
    };
}

// Note: depends on `creditAchievedIfSubmit` state variable
// and having the original `disabled` attribute be renamed to `disabledOriginal`.
export function returnStandardAnswerStateVariableDefinition() {
    const stateVariableDefinitions = {};

    stateVariableDefinitions.showCorrectness = {
        forRenderer: true,
        returnDependencies: () => ({
            showCorrectnessPreliminary: {
                dependencyType: "stateVariable",
                variableName: "showCorrectnessPreliminary",
            },
            showCorrectnessFlag: {
                dependencyType: "flag",
                flagName: "showCorrectness",
            },
            handGraded: {
                dependencyType: "stateVariable",
                variableName: "handGraded",
            },
            sectionAncestor: {
                dependencyType: "ancestor",
                componentType: "_sectioningComponent",
                variableNames: ["showCorrectness"],
            },
            documentAncestor: {
                dependencyType: "ancestor",
                componentType: "document",
                variableNames: ["showCorrectness"],
            },
        }),
        definition({ dependencyValues, usedDefault }) {
            let showCorrectness;
            if (!usedDefault.showCorrectnessPreliminary) {
                showCorrectness = dependencyValues.showCorrectnessPreliminary;
            } else if (dependencyValues.handGraded) {
                showCorrectness = false;
            } else if (dependencyValues.sectionAncestor) {
                showCorrectness =
                    dependencyValues.sectionAncestor.stateValues
                        .showCorrectness;
            } else if (dependencyValues.documentAncestor) {
                showCorrectness =
                    dependencyValues.documentAncestor.stateValues
                        .showCorrectness;
            } else {
                showCorrectness =
                    dependencyValues.showCorrectnessFlag !== false;
            }
            return { setValue: { showCorrectness } };
        },
    };

    stateVariableDefinitions.colorCorrectness = {
        forRenderer: true,
        returnDependencies: () => ({
            colorCorrectnessPreliminary: {
                dependencyType: "stateVariable",
                variableName: "colorCorrectnessPreliminary",
            },
            showCorrectness: {
                dependencyType: "stateVariable",
                variableName: "showCorrectness",
            },
            sectionAncestor: {
                dependencyType: "ancestor",
                componentType: "_sectioningComponent",
                variableNames: ["colorCorrectness"],
            },
            documentAncestor: {
                dependencyType: "ancestor",
                componentType: "document",
                variableNames: ["colorCorrectness"],
            },
        }),
        definition({ dependencyValues, usedDefault }) {
            let colorCorrectness = true;
            if (!dependencyValues.showCorrectness) {
                colorCorrectness = false;
            } else if (!usedDefault.colorCorrectnessPreliminary) {
                colorCorrectness = dependencyValues.colorCorrectnessPreliminary;
            } else if (dependencyValues.sectionAncestor) {
                colorCorrectness =
                    dependencyValues.sectionAncestor.stateValues
                        .colorCorrectness;
            } else if (dependencyValues.documentAncestor) {
                colorCorrectness =
                    dependencyValues.documentAncestor.stateValues;
            }

            return { setValue: { colorCorrectness } };
        },
    };

    stateVariableDefinitions.suppressCheckWork = {
        returnDependencies: () => ({
            autoSubmit: {
                dependencyType: "flag",
                flagName: "autoSubmit",
            },
        }),
        definition({ dependencyValues }) {
            return {
                setValue: {
                    suppressCheckWork: dependencyValues.autoSubmit,
                },
            };
        },
    };

    stateVariableDefinitions.displayDecimalsForCreditAchieved = {
        returnDependencies: () => ({}),
        definition: () => ({
            setValue: { displayDecimalsForCreditAchieved: -Infinity },
        }),
    };

    stateVariableDefinitions.creditAchieved = {
        defaultValue: 0,
        public: true,
        shadowingInstructions: {
            createComponentOfType: "number",
            addAttributeComponentsShadowingStateVariables: {
                displayDigits: {
                    stateVariableToShadow: "displayDigitsForCreditAchieved",
                },
                displayDecimals: {
                    stateVariableToShadow: "displayDecimalsForCreditAchieved",
                },
            },
        },
        forRenderer: true,
        hasEssential: true,
        returnDependencies: () => ({}),
        definition: () => ({
            useEssentialOrDefaultValue: {
                creditAchieved: true,
            },
        }),
        inverseDefinition: function ({ desiredStateVariableValues }) {
            return {
                success: true,
                instructions: [
                    {
                        setEssentialValue: "creditAchieved",
                        value: desiredStateVariableValues.creditAchieved,
                    },
                ],
            };
        },
    };

    stateVariableDefinitions.responseHasBeenSubmitted = {
        public: true,
        shadowingInstructions: {
            createComponentOfType: "boolean",
        },
        defaultValue: false,
        hasEssential: true,
        returnDependencies: () => ({}),
        definition: () => ({
            useEssentialOrDefaultValue: {
                responseHasBeenSubmitted: true,
            },
        }),
        inverseDefinition: function ({ desiredStateVariableValues }) {
            return {
                success: true,
                instructions: [
                    {
                        setEssentialValue: "responseHasBeenSubmitted",
                        value: desiredStateVariableValues.responseHasBeenSubmitted,
                    },
                ],
            };
        },
    };

    stateVariableDefinitions.autoSubmit = {
        returnDependencies: () => ({
            autoSubmit: {
                dependencyType: "flag",
                flagName: "autoSubmit",
            },
        }),
        definition({ dependencyValues }) {
            return {
                setValue: {
                    autoSubmit: Boolean(dependencyValues.autoSubmit),
                },
            };
        },
    };

    stateVariableDefinitions.creditAchievedDependencies = {
        shadowVariable: true,
        stateVariablesDeterminingDependencies: ["autoSubmit"],
        returnDependencies: ({ stateValues }) => ({
            currentCreditAchievedDependencies: {
                dependencyType: "recursiveDependencyValues",
                variableNames: ["creditAchievedIfSubmit"],
                includeImmediateValueWithValue: !stateValues.autoSubmit,
                includeRawValueWithImmediateValue: !stateValues.autoSubmit,
                includeOnlyEssentialValues: true,
            },
        }),
        definition({ dependencyValues, componentIdx }) {
            // Use stringify from json-stringify-deterministic
            // so that the string will be the same
            // even if the object was built in a different order
            // (as can happen when reloading from a database)

            let warnings = [];

            let selfDependencies =
                dependencyValues.currentCreditAchievedDependencies.find(
                    (x) => x.componentIdx === componentIdx,
                );

            if (selfDependencies) {
                // look for a dependency on a submitted response
                if (
                    Object.keys(selfDependencies.stateValues).find(
                        (x) => x.substring(0, 17) === "submittedResponse",
                    )
                ) {
                    warnings.push({
                        message:
                            "An award for this answer is based on the answer tag's own submitted response, which will lead to unexpected behavior.",
                        level: 1,
                    });
                }
            }

            let stringified = stringify(
                dependencyValues.currentCreditAchievedDependencies,
                { replacer: serializedComponentsReplacer },
            );

            return {
                setValue: {
                    creditAchievedDependencies: Base64.stringify(
                        sha1(stringified),
                    ),
                },
                sendWarnings: warnings,
            };
        },
        markStale: () => ({ answerCreditPotentiallyChanged: true }),
    };

    stateVariableDefinitions.creditAchievedDependenciesAtSubmit = {
        defaultValue: null,
        hasEssential: true,
        returnDependencies: () => ({}),
        definition: () => ({
            useEssentialOrDefaultValue: {
                creditAchievedDependenciesAtSubmit: true,
            },
        }),
        inverseDefinition: function ({ desiredStateVariableValues }) {
            return {
                success: true,
                instructions: [
                    {
                        setEssentialValue: "creditAchievedDependenciesAtSubmit",
                        value: desiredStateVariableValues.creditAchievedDependenciesAtSubmit,
                    },
                ],
            };
        },
    };

    stateVariableDefinitions.justSubmitted = {
        public: true,
        shadowingInstructions: {
            createComponentOfType: "boolean",
        },
        forRenderer: true,
        defaultValue: false,
        hasEssential: true,
        shadowVariable: true,
        returnDependencies: () => ({
            currentCreditAchievedDependencies: {
                dependencyType: "stateVariable",
                variableName: "creditAchievedDependencies",
            },
            creditAchievedDependenciesAtSubmit: {
                dependencyType: "stateVariable",
                variableName: "creditAchievedDependenciesAtSubmit",
            },
            disableAfterCorrect: {
                dependencyType: "stateVariable",
                variableName: "disableAfterCorrect",
            },
            hasBeenCorrect: {
                dependencyType: "stateVariable",
                variableName: "hasBeenCorrect",
            },
        }),
        definition: function ({
            dependencyValues,
            justUpdatedForNewComponent,
            initialAddPhase,
        }) {
            if (
                dependencyValues.disableAfterCorrect &&
                dependencyValues.hasBeenCorrect
            ) {
                return {
                    setValue: { justSubmitted: true },
                };
            }

            let foundChange =
                dependencyValues.creditAchievedDependenciesAtSubmit !==
                dependencyValues.currentCreditAchievedDependencies;

            if (
                foundChange &&
                !(justUpdatedForNewComponent || initialAddPhase)
            ) {
                return {
                    setValue: { justSubmitted: false },
                    setEssentialValue: { justSubmitted: false },
                };
            } else {
                return {
                    useEssentialOrDefaultValue: { justSubmitted: true },
                };
            }
        },
        inverseDefinition({ desiredStateVariableValues }) {
            return {
                success: true,
                instructions: [
                    {
                        setEssentialValue: "justSubmitted",
                        value: desiredStateVariableValues.justSubmitted,
                    },
                ],
            };
        },
    };

    stateVariableDefinitions.numSubmissions = {
        public: true,
        shadowingInstructions: {
            createComponentOfType: "integer",
        },
        defaultValue: 0,
        hasEssential: true,
        returnDependencies: () => ({}),
        definition: () => ({
            useEssentialOrDefaultValue: {
                numSubmissions: true,
            },
        }),
        inverseDefinition: ({ desiredStateVariableValues }) => ({
            success: true,
            instructions: [
                {
                    setEssentialValue: "numSubmissions",
                    value: desiredStateVariableValues.numSubmissions,
                },
            ],
        }),
    };

    stateVariableDefinitions.numIncorrectSubmissions = {
        defaultValue: 0,
        hasEssential: true,
        forRenderer: true,
        returnDependencies: () => ({}),
        definition: () => ({
            useEssentialOrDefaultValue: {
                numIncorrectSubmissions: true,
            },
        }),
        inverseDefinition: ({ desiredStateVariableValues }) => ({
            success: true,
            instructions: [
                {
                    setEssentialValue: "numIncorrectSubmissions",
                    value: desiredStateVariableValues.numIncorrectSubmissions,
                },
            ],
        }),
    };

    stateVariableDefinitions.numAttemptsLeft = {
        public: true,
        shadowingInstructions: {
            createComponentOfType: "integer",
        },
        forRenderer: true,
        returnDependencies: () => ({
            numSubmissions: {
                dependencyType: "stateVariable",
                variableName: "numSubmissions",
            },
            maxNumAttempts: {
                dependencyType: "stateVariable",
                variableName: "maxNumAttempts",
            },
        }),
        definition({ dependencyValues }) {
            return {
                setValue: {
                    numAttemptsLeft:
                        dependencyValues.maxNumAttempts -
                        dependencyValues.numSubmissions,
                },
            };
        },
    };

    stateVariableDefinitions.hasBeenCorrect = {
        defaultValue: false,
        hasEssential: true,
        shadowVariable: true,
        returnDependencies: () => ({
            creditAchieved: {
                dependencyType: "stateVariable",
                variableName: "creditAchieved",
            },
            nextCreditFactor: {
                dependencyType: "stateVariable",
                variableName: "nextCreditFactor",
                variablesOptional: true,
            },
        }),
        definition({ dependencyValues }) {
            const creditAchieved = dependencyValues.creditAchieved;
            if (
                creditAchieved === 1 ||
                (creditAchieved > 0 &&
                    creditAchieved === dependencyValues.nextCreditFactor)
            ) {
                return {
                    setValue: { hasBeenCorrect: true },
                    setEssentialValue: { hasBeenCorrect: true },
                };
            }

            return {
                useEssentialOrDefaultValue: {
                    hasBeenCorrect: true,
                },
            };
        },
    };

    stateVariableDefinitions.disabled = {
        public: true,
        shadowingInstructions: {
            createComponentOfType: "boolean",
        },
        forRenderer: true,
        stateVariablesDeterminingDependencies: ["disableAfterCorrect"],
        returnDependencies({ stateValues }) {
            let dependencies = {
                disabledOriginal: {
                    dependencyType: "stateVariable",
                    variableName: "disabledOriginal",
                },
                numAttemptsLeft: {
                    dependencyType: "stateVariable",
                    variableName: "numAttemptsLeft",
                },
                disableAfterCorrect: {
                    dependencyType: "stateVariable",
                    variableName: "disableAfterCorrect",
                },
            };

            if (stateValues.disableAfterCorrect) {
                dependencies.hasBeenCorrect = {
                    dependencyType: "stateVariable",
                    variableName: "hasBeenCorrect",
                };
            }

            return dependencies;
        },
        definition({ dependencyValues }) {
            let disabled =
                dependencyValues.disabledOriginal ||
                dependencyValues.numAttemptsLeft < 1 ||
                (dependencyValues.disableAfterCorrect &&
                    dependencyValues.hasBeenCorrect);

            return { setValue: { disabled } };
        },
    };

    stateVariableDefinitions.inComponentNumber = {
        returnDependencies: () => ({
            documentAncestor: {
                dependencyType: "ancestor",
                componentType: "document",
                variableNames: ["componentNumberByAnswerName"],
            },
        }),
        definition({ dependencyValues, componentIdx }) {
            return {
                setValue: {
                    inComponentNumber:
                        dependencyValues.documentAncestor.stateValues
                            .componentNumberByAnswerName[componentIdx],
                },
            };
        },
    };

    return stateVariableDefinitions;
}
