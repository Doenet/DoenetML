export function returnScoredSectionAttributes() {
    return {
        aggregateScores: {
            createComponentOfType: "boolean",
            createStateVariable: "aggregateScoresPreliminary",
            defaultValue: false,
        },
        weight: {
            createComponentOfType: "number",
            createStateVariable: "weight",
            defaultValue: 1,
            public: true,
        },

        sectionWideCheckWork: {
            createComponentOfType: "boolean",
            createStateVariable: "sectionWideCheckWork",
            defaultValue: false,
            public: true,
        },
        showCorrectness: {
            createComponentOfType: "boolean",
            createStateVariable: "showCorrectnessPreliminary",
            defaultValue: null,
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

        displayDigitsForCreditAchieved: {
            createComponentOfType: "integer",
            createStateVariable: "displayDigitsForCreditAchieved",
            defaultValue: 3,
            public: true,
        },
    };
}

export function returnScoredSectionStateVariableDefinition() {
    const stateVariableDefinitions = {};

    stateVariableDefinitions.scoredDescendants = {
        returnDependencies: () => ({
            scoredDescendants: {
                dependencyType: "descendant",
                componentTypes: [
                    "_sectioningComponent",
                    "answer",
                    "setup",
                    "_blockScoredComponent",
                    "p",
                    "li",
                    "div",
                    "span",
                ],
                variableNames: [
                    "scoredDescendants",
                    "aggregateScores",
                    "weight",
                ],
                recurseToMatchedChildren: false,
                variablesOptional: true,
            },
        }),
        definition({ dependencyValues }) {
            let scoredDescendants = [];
            for (let descendant of dependencyValues.scoredDescendants) {
                // added setup just so that can skip them
                if (descendant.componentType === "setup") {
                    continue;
                }
                if (
                    descendant.stateValues.aggregateScores ||
                    descendant.stateValues.scoredDescendants === undefined
                ) {
                    scoredDescendants.push(descendant);
                } else {
                    scoredDescendants.push(
                        ...descendant.stateValues.scoredDescendants,
                    );
                }
            }

            return { setValue: { scoredDescendants } };
        },
    };

    stateVariableDefinitions.answerDescendants = {
        returnDependencies: () => ({
            answerDescendants: {
                dependencyType: "descendant",
                componentTypes: ["answer", "_blockScoredComponent"],
                variableNames: ["justSubmitted"],
                recurseToMatchedChildren: false,
            },
        }),
        definition({ dependencyValues }) {
            return {
                setValue: {
                    answerDescendants: dependencyValues.answerDescendants,
                },
            };
        },
    };

    stateVariableDefinitions.justSubmitted = {
        forRenderer: true,
        returnDependencies: () => ({
            answerDescendants: {
                dependencyType: "stateVariable",
                variableName: "answerDescendants",
            },
        }),
        definition({ dependencyValues }) {
            return {
                setValue: {
                    justSubmitted: dependencyValues.answerDescendants.every(
                        (x) => x.stateValues.justSubmitted,
                    ),
                },
            };
        },
    };

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
        }),
        definition({ dependencyValues, usedDefault }) {
            let showCorrectness;
            if (!usedDefault.showCorrectnessPreliminary) {
                showCorrectness = dependencyValues.showCorrectnessPreliminary;
            } else {
                showCorrectness =
                    dependencyValues.showCorrectnessFlag !== false;
            }
            return { setValue: { showCorrectness } };
        },
    };

    stateVariableDefinitions.displayDecimalsForCreditAchieved = {
        returnDependencies: () => ({}),
        definition: () => ({
            setValue: { displayDecimalsForCreditAchieved: -Infinity },
        }),
    };

    stateVariableDefinitions.aggregateScores = {
        public: true,
        shadowingInstructions: {
            createComponentOfType: "boolean",
        },
        returnDependencies: () => ({
            aggregateScoresPreliminary: {
                dependencyType: "stateVariable",
                variableName: "aggregateScoresPreliminary",
            },
            sectionWideCheckWork: {
                dependencyType: "stateVariable",
                variableName: "sectionWideCheckWork",
            },
        }),
        definition({ dependencyValues }) {
            return {
                setValue: {
                    aggregateScores:
                        dependencyValues.aggregateScoresPreliminary ||
                        dependencyValues.sectionWideCheckWork,
                },
            };
        },
    };

    stateVariableDefinitions.creditAchieved = {
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
        defaultValue: 0,
        hasEssential: true,
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
                defaultValue: 0,
                hasEssential: true,
            },
        ],
        stateVariablesDeterminingDependencies: [
            "aggregateScores",
            "scoredDescendants",
        ],
        returnDependencies({ stateValues }) {
            let dependencies = {
                aggregateScores: {
                    dependencyType: "stateVariable",
                    variableName: "aggregateScores",
                },
            };
            if (stateValues.aggregateScores) {
                dependencies.scoredDescendants = {
                    dependencyType: "stateVariable",
                    variableName: "scoredDescendants",
                };
                for (let [
                    ind,
                    descendant,
                ] of stateValues.scoredDescendants.entries()) {
                    dependencies["creditAchieved" + ind] = {
                        dependencyType: "stateVariable",
                        componentIdx: descendant.componentIdx,
                        variableName: "creditAchieved",
                    };
                }
            }

            return dependencies;
        },
        definition({ dependencyValues }) {
            if (!dependencyValues.aggregateScores) {
                return {
                    setValue: {
                        creditAchieved: 0,
                        percentCreditAchieved: 0,
                    },
                };
            }

            let creditSum = 0;
            let totalWeight = 0;

            for (let [
                ind,
                component,
            ] of dependencyValues.scoredDescendants.entries()) {
                let weight = component.stateValues.weight;
                creditSum += dependencyValues["creditAchieved" + ind] * weight;
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
        stateVariablesDeterminingDependencies: [
            "aggregateScores",
            "scoredDescendants",
        ],
        returnDependencies({ stateValues }) {
            let dependencies = {
                aggregateScores: {
                    dependencyType: "stateVariable",
                    variableName: "aggregateScores",
                },
            };
            if (stateValues.aggregateScores) {
                dependencies.scoredDescendants = {
                    dependencyType: "stateVariable",
                    variableName: "scoredDescendants",
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
            }

            return dependencies;
        },
        definition({ dependencyValues }) {
            if (!dependencyValues.aggregateScores) {
                return {
                    setValue: {
                        creditAchievedIfSubmit: 0,
                    },
                };
            }

            let creditSum = 0;
            let totalWeight = 0;

            for (let [
                ind,
                component,
            ] of dependencyValues.scoredDescendants.entries()) {
                let weight = component.stateValues.weight;
                creditSum +=
                    dependencyValues["creditAchievedIfSubmit" + ind] * weight;
                totalWeight += weight;
            }
            let creditAchievedIfSubmit = creditSum / totalWeight;

            return { setValue: { creditAchievedIfSubmit } };
        },
    };

    stateVariableDefinitions.createSubmitAllButton = {
        forRenderer: true,
        additionalStateVariablesDefined: [
            {
                variableName: "suppressAnswerSubmitButtons",
                forRenderer: true,
            },
        ],
        returnDependencies: () => ({
            sectionWideCheckWork: {
                dependencyType: "stateVariable",
                variableName: "sectionWideCheckWork",
            },
            sectionAncestor: {
                dependencyType: "ancestor",
                componentType: "_sectioningComponent",
                variableNames: ["suppressAnswerSubmitButtons"],
            },
            documentAncestor: {
                dependencyType: "ancestor",
                componentType: "document",
                variableNames: ["suppressAnswerSubmitButtons"],
            },
            pAncestor: {
                dependencyType: "ancestor",
                componentType: "p",
                variableNames: ["suppressAnswerSubmitButtons"],
            },
            liAncestor: {
                dependencyType: "ancestor",
                componentType: "li",
                variableNames: ["suppressAnswerSubmitButtons"],
            },
            divAncestor: {
                dependencyType: "ancestor",
                componentType: "div",
                variableNames: ["suppressAnswerSubmitButtons"],
            },
            spanAncestor: {
                dependencyType: "ancestor",
                componentType: "span",
                variableNames: ["suppressAnswerSubmitButtons"],
            },
        }),
        definition({ dependencyValues }) {
            let warnings = [];

            let createSubmitAllButton = false;
            let suppressAnswerSubmitButtons = false;

            if (
                dependencyValues.documentAncestor.stateValues
                    .suppressAnswerSubmitButtons ||
                dependencyValues.sectionAncestor?.stateValues
                    .suppressAnswerSubmitButtons ||
                dependencyValues.pAncestor?.stateValues
                    .suppressAnswerSubmitButtons ||
                dependencyValues.liAncestor?.stateValues
                    .suppressAnswerSubmitButtons ||
                dependencyValues.divAncestor?.stateValues
                    .suppressAnswerSubmitButtons ||
                dependencyValues.spanAncestor?.stateValues
                    .suppressAnswerSubmitButtons
            ) {
                suppressAnswerSubmitButtons = true;
            } else if (dependencyValues.sectionWideCheckWork) {
                createSubmitAllButton = true;
                suppressAnswerSubmitButtons = true;
            }

            return {
                setValue: {
                    createSubmitAllButton,
                    suppressAnswerSubmitButtons,
                },
                sendWarnings: warnings,
            };
        },
    };

    stateVariableDefinitions.suppressCheckWork = {
        forRenderer: true,
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

    stateVariableDefinitions.showCheckWork = {
        forRenderer: true,
        returnDependencies: () => ({
            createSubmitAllButton: {
                dependencyType: "stateVariable",
                variableName: "createSubmitAllButton",
            },
            suppressCheckWork: {
                dependencyType: "stateVariable",
                variableName: "suppressCheckWork",
            },
        }),
        definition({ dependencyValues }) {
            return {
                setValue: {
                    showCheckWork:
                        dependencyValues.createSubmitAllButton &&
                        !dependencyValues.suppressCheckWork,
                },
            };
        },
    };

    return stateVariableDefinitions;
}

export async function submitAllAnswers({
    component,
    actionId,
    sourceInformation = {},
    skipRendererUpdate = false,
}) {
    component.coreFunctions.requestRecordEvent({
        verb: "submitted",
        object: {
            componentIdx: component.componentIdx,
            componentType: component.componentType,
        },
        result: {
            creditAchieved: await component.stateValues.creditAchievedIfSubmit,
        },
    });

    let answersToSubmit = [];
    for (let answer of await component.stateValues.answerDescendants) {
        if (!(await answer.stateValues.justSubmitted)) {
            answersToSubmit.push(answer);
        }
    }

    let numAnswers = answersToSubmit.length;

    for (let [ind, answer] of answersToSubmit.entries()) {
        await component.coreFunctions.performAction({
            componentIdx: answer.componentIdx,
            actionName: "submitAnswer",
            args: {
                actionId,
                sourceInformation,
                skipRendererUpdate: skipRendererUpdate || ind < numAnswers - 1,
            },
        });
    }
}
