export function returnScoredSectionAttributes() {
    return {
        aggregateScores: {
            createComponentOfType: "boolean",
            createStateVariable: "aggregateScoresPreliminary",
            defaultValue: false,
            description:
                "Whether to aggregate scores of scored descendants into a section credit-achieved value.",
        },
        weight: {
            createComponentOfType: "number",
            createStateVariable: "weight",
            defaultValue: 1,
            public: true,
            description:
                "Relative weight of this section when aggregated by an enclosing scored section.",
        },

        sectionWideCheckWork: {
            createComponentOfType: "boolean",
            createStateVariable: "sectionWideCheckWork",
            defaultValue: false,
            public: true,
            description:
                "Whether to show a single section-wide check-work button instead of per-answer buttons.",
        },
        showCorrectness: {
            createComponentOfType: "boolean",
            createStateVariable: "showCorrectnessPreliminary",
            defaultValue: false,
            description:
                "Whether to display correctness indicators for answers in this section.",
        },
        colorCorrectness: {
            createComponentOfType: "boolean",
            createStateVariable: "colorCorrectnessPreliminary",
            defaultValue: false,
            description:
                "Whether to color-code answers in this section based on correctness.",
        },
        forceIndividualAnswerColoring: {
            createComponentOfType: "boolean",
            createStateVariable: "forceIndividualAnswerColoring",
            defaultValue: false,
            description:
                "Whether to force per-answer color-correctness even when section-wide check work is enabled.",
        },
        submitLabel: {
            createComponentOfType: "text",
            createStateVariable: "submitLabel",
            defaultValue: "Check Work",
            public: true,
            forRenderer: true,
            description:
                "Label for the section-wide submit button when correctness is shown.",
        },
        submitLabelNoCorrectness: {
            createComponentOfType: "text",
            createStateVariable: "submitLabelNoCorrectness",
            defaultValue: "Submit Response",
            public: true,
            forRenderer: true,
            description:
                "Label for the section-wide submit button when correctness is not shown.",
        },

        displayDigitsForCreditAchieved: {
            createComponentOfType: "integer",
            createStateVariable: "displayDigitsForCreditAchieved",
            defaultValue: 3,
            public: true,
            description:
                "Number of significant digits to display for the section's credit achieved value.",
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
            showCorrectnessAncestor: {
                dependencyType: "ancestor",
                variableNames: ["showCorrectness"],
            },
        }),
        definition({ dependencyValues, usedDefault }) {
            let showCorrectness;
            if (!usedDefault.showCorrectnessPreliminary) {
                showCorrectness = dependencyValues.showCorrectnessPreliminary;
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

    stateVariableDefinitions.displayDecimalsForCreditAchieved = {
        returnDependencies: () => ({}),
        definition: () => ({
            setValue: { displayDecimalsForCreditAchieved: -Infinity },
        }),
    };

    stateVariableDefinitions.aggregateScores = {
        description:
            "Whether scores of scored descendants are aggregated into this section's credit value.",
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
            parentChildrenAggregateScores: {
                dependencyType: "parentStateVariable",
                variableName: "childrenAggregateScores",
            },
        }),
        definition({ dependencyValues }) {
            return {
                setValue: {
                    aggregateScores:
                        dependencyValues.aggregateScoresPreliminary ||
                        dependencyValues.sectionWideCheckWork ||
                        dependencyValues.parentChildrenAggregateScores,
                },
            };
        },
    };

    stateVariableDefinitions.creditAchieved = {
        description:
            "Aggregate credit achieved (between 0 and 1) for scored descendants of this section.",
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
                description:
                    "Aggregate credit achieved as a percentage (between 0 and 100).",
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
            "suppressAnswerSubmitButtons",
            "descendantColorCorrectnessBasedOnIdx",
        ],
        returnDependencies: () => ({
            sectionWideCheckWork: {
                dependencyType: "stateVariable",
                variableName: "sectionWideCheckWork",
            },
            forceIndividualAnswerColoring: {
                dependencyType: "stateVariable",
                variableName: "forceIndividualAnswerColoring",
            },
            ancestorDeterminingSubmit: {
                dependencyType: "ancestor",
                variableNames: [
                    "suppressAnswerSubmitButtons",
                    "descendantColorCorrectnessBasedOnIdx",
                ],
            },
        }),
        definition({ dependencyValues, componentIdx }) {
            let createSubmitAllButton = false;
            let suppressAnswerSubmitButtons = false;
            let descendantColorCorrectnessBasedOnIdx = null;
            if (
                dependencyValues.ancestorDeterminingSubmit?.stateValues
                    .suppressAnswerSubmitButtons
            ) {
                suppressAnswerSubmitButtons = true;
                descendantColorCorrectnessBasedOnIdx =
                    dependencyValues.ancestorDeterminingSubmit.stateValues
                        .descendantColorCorrectnessBasedOnIdx;
            } else if (dependencyValues.sectionWideCheckWork) {
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
