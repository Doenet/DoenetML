import { serializedComponentsReplacer } from "@doenet/utils";
import sha1 from "crypto-js/sha1";
import Base64 from "crypto-js/enc-base64";
import stringify from "json-stringify-deterministic";

function returnScoredContainerAncestorDependency(...variableNames) {
    return {
        dependencyType: "ancestor",
        variableNames,
    };
}

export function returnStandardAnswerAttributes() {
    return {
        weight: {
            createComponentOfType: "number",
            createStateVariable: "weight",
            defaultValue: 1,
            public: true,
            groupName: "answer-grading",
            description:
                "Relative weight of this answer when aggregating credit across multiple answers.",
        },
        handGraded: {
            createPrimitiveOfType: "boolean",
            createStateVariable: "handGraded",
            defaultValue: false,
            public: true,
            groupName: "answer-grading",
            description:
                "Whether this answer is graded by hand rather than automatically.",
        },
        matchPartial: {
            createComponentOfType: "boolean",
            createStateVariable: "matchPartial",
            defaultValue: false,
            public: true,
            groupName: "answer-grading",
            description:
                "Whether to award partial credit when the response is partially correct.",
        },
        maxNumAttempts: {
            createComponentOfType: "integer",
            createStateVariable: "maxNumAttempts",
            defaultValue: Infinity,
            public: true,
            groupName: "answer-grading",
            description:
                "Maximum number of times the response can be submitted.",
        },
        showCorrectness: {
            createComponentOfType: "boolean",
            createStateVariable: "showCorrectnessPreliminary",
            defaultValue: true,
            groupName: "answer-grading",
            description:
                "Whether to display whether the submitted response is correct.",
        },
        colorCorrectness: {
            createComponentOfType: "boolean",
            createStateVariable: "colorCorrectnessPreliminary",
            defaultValue: true,
            public: true,
            groupName: "answer-grading",
            // The runtime stores the raw attribute value under
            // `colorCorrectnessPreliminary` so a derived `colorCorrectness`
            // state def can combine it with the ancestor's setting. Authors
            // should see only the derived `colorCorrectness` property, so
            // hide the plumbing-named state var from the schema while
            // keeping the attribute itself author-facing. See #1089.
            stateVarExcludeFromSchema: true,
            description:
                "Whether to color-code the response based on its correctness.",
        },

        disableAfterCorrect: {
            createComponentOfType: "boolean",
            createStateVariable: "disableAfterCorrect",
            defaultValue: false,
            public: true,
            groupName: "answer-grading",
            description:
                "Whether to disable the answer after a fully correct response has been submitted.",
        },

        submitLabel: {
            createComponentOfType: "text",
            createStateVariable: "submitLabel",
            defaultValue: "Check Work",
            public: true,
            forRenderer: true,
            groupName: "answer-grading",
            description:
                "Label for the submit button when correctness is shown.",
        },

        submitLabelNoCorrectness: {
            createComponentOfType: "text",
            createStateVariable: "submitLabelNoCorrectness",
            defaultValue: "Submit Response",
            public: true,
            forRenderer: true,
            groupName: "answer-grading",
            description:
                "Label for the submit button when correctness is not shown.",
        },

        displayDigitsForResponses: {
            createComponentOfType: "integer",
            createStateVariable: "displayDigitsForResponses",
            defaultValue: 10,
            public: true,
            groupName: "answer-grading",
            description:
                "Number of significant digits to display when rendering numeric responses.",
        },

        displayDigitsForCreditAchieved: {
            createComponentOfType: "integer",
            createStateVariable: "displayDigitsForCreditAchieved",
            defaultValue: 3,
            public: true,
            groupName: "answer-grading",
            description:
                "Number of significant digits to display for the credit achieved value.",
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
            showCorrectnessAncestor: {
                dependencyType: "ancestor",
                variableNames: ["showCorrectness"],
            },
        }),
        definition({ dependencyValues, usedDefault }) {
            let showCorrectness;
            if (!usedDefault.showCorrectnessPreliminary) {
                showCorrectness = dependencyValues.showCorrectnessPreliminary;
            } else if (dependencyValues.handGraded) {
                showCorrectness = false;
            } else if (dependencyValues.showCorrectnessAncestor) {
                showCorrectness =
                    dependencyValues.showCorrectnessAncestor.stateValues
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
            colorCorrectnessAncestor: {
                dependencyType: "ancestor",
                variableNames: ["colorCorrectness"],
            },
        }),
        definition({ dependencyValues, usedDefault }) {
            let colorCorrectness = true;
            if (!dependencyValues.showCorrectness) {
                colorCorrectness = false;
            } else if (!usedDefault.colorCorrectnessPreliminary) {
                colorCorrectness = dependencyValues.colorCorrectnessPreliminary;
            } else if (dependencyValues.colorCorrectnessAncestor) {
                colorCorrectness =
                    dependencyValues.colorCorrectnessAncestor.stateValues
                        .colorCorrectness;
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
        description:
            "The fraction of credit achieved on the most recent submission (between 0 and 1).",
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
        description:
            "Whether a response has ever been submitted for this answer.",
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

            let diagnostics = [];

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
                    diagnostics.push({
                        message:
                            "An award for this answer is based on the answer tag's own submitted response, which will lead to unexpected behavior.",
                        type: "warning",
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
                sendDiagnostics: diagnostics,
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
        description:
            "Whether the most recent submission for this answer has not yet been changed.",
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
        description: "Total number of times a response has been submitted.",
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
        description:
            "Remaining number of submission attempts before the maximum is reached.",
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
            ancestorSuppressingAnswerSubmitButtons:
                returnScoredContainerAncestorDependency(
                    "suppressAnswerSubmitButtons",
                    "numAttemptsLeft",
                ),
            // Used to target the ignored-`maxNumAttempts` warning at the
            // attribute itself rather than the whole `<answer>`.
            maxNumAttemptsAttr: {
                dependencyType: "attributeComponent",
                attributeName: "maxNumAttempts",
            },
        }),
        definition({ dependencyValues, usedDefault }) {
            let sendDiagnostics = [];

            let insideSectionWideCheckWork =
                dependencyValues.ancestorSuppressingAnswerSubmitButtons
                    ?.stateValues.suppressAnswerSubmitButtons;

            if (!usedDefault.maxNumAttempts && insideSectionWideCheckWork) {
                sendDiagnostics.push({
                    type: "warning",
                    message:
                        "Setting `maxNumAttempts` on an `<answer>` inside a container with `sectionWideCheckWork` has no effect, as the number of attempts is controlled by the container. Set `maxNumAttempts` on the container instead.",
                    position: dependencyValues.maxNumAttemptsAttr?.position,
                });
            }

            // Inside a section-wide check work, the answer's own
            // `maxNumAttempts` is ignored: the enclosing container controls the
            // number of attempts. Report that container's remaining attempts so
            // the public `numAttemptsLeft` is accurate. This matches how a
            // `maxNumAttempts` on a nested `sectionWideCheckWork` container is
            // ignored.
            const numAttemptsLeft = insideSectionWideCheckWork
                ? dependencyValues.ancestorSuppressingAnswerSubmitButtons
                      .stateValues.numAttemptsLeft
                : Math.max(
                      0,
                      dependencyValues.maxNumAttempts -
                          dependencyValues.numSubmissions,
                  );

            return {
                setValue: { numAttemptsLeft },
                sendDiagnostics,
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
        description:
            "Whether this answer is disabled and is no longer accepting submissions.",
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

export function returnSimplifyExpandOnCompareWarning() {
    const stateVariableDefinitions = {};

    stateVariableDefinitions.simplifyExpandOnCompareWarning = {
        returnDependencies: () => ({
            expandOnCompareAttr: {
                dependencyType: "attributeComponent",
                attributeName: "expandOnCompare",
            },
            simplifyOnCompareAttr: {
                dependencyType: "attributeComponent",
                attributeName: "simplifyOnCompare",
            },
            symbolicEquality: {
                dependencyType: "stateVariable",
                variableName: "symbolicEquality",
            },
        }),
        definition({ dependencyValues }) {
            const sendDiagnostics = [];
            if (!dependencyValues.symbolicEquality) {
                const attributesSpecified = [];

                if (dependencyValues.expandOnCompareAttr !== null) {
                    attributesSpecified.push("expandOnCompare");
                }

                if (dependencyValues.simplifyOnCompareAttr !== null) {
                    attributesSpecified.push("simplifyOnCompare");
                }

                if (attributesSpecified.length > 0) {
                    sendDiagnostics.push({
                        message: `The ${attributesSpecified.join(
                            " and ",
                        )} attribute${
                            attributesSpecified.length > 1 ? "s" : ""
                        } will have no effect without symbolicEquality set.`,
                        type: "warning",
                    });
                }
            }

            return {
                sendDiagnostics,
                setValue: {
                    simplifyExpandOnCompareWarning: null,
                },
            };
        },
    };

    return stateVariableDefinitions;
}

/**
 * Walk a serialized-component tree and stamp each answer (and any
 * `_blockScoredComponent` descendant) with a sequential `answerNumber`
 * starting from `numSoFar + 1`. Answers and block-scored components
 * are leaves for the purpose of numbering: their children are not
 * descended into.
 *
 * Returns the running count so recursive calls can resume.
 */
export function numberAnswers(components, componentInfoObjects, numSoFar = 0) {
    let count = numSoFar;

    for (let comp of components) {
        if (
            comp.componentType === "answer" ||
            componentInfoObjects.isInheritedComponentType({
                inheritedComponentType: comp.componentType,
                baseComponentType: "_blockScoredComponent",
            })
        ) {
            count++;
            comp.answerNumber = count;
        } else if (comp.children) {
            const result = numberAnswers(
                comp.children,
                componentInfoObjects,
                count,
            );
            count = result.count;
        }
    }

    return { count };
}
