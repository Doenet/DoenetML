/**
 * Attributes implementing a "scored section": score aggregation plus the
 * "section-wide check work" feature (a single submit button for a container
 * that submits all enclosed answers at once, with an optional cap on the
 * number of submissions via `maxNumAttempts`).
 *
 * This is shared by all containers that can host section-wide check work
 * (sections, `<p>`, `<ol>`, `<ul>`, `<li>`, `<div>`, `<span>`, and the
 * document), so the feature is defined in exactly one place. The document
 * reuses this set but removes the score-aggregation attributes it does not
 * expose; see `Document.js`.
 */
export function returnScoredSectionAttributes() {
    return {
        aggregateScores: {
            createComponentOfType: "boolean",
            createStateVariable: "aggregateScoresPreliminary",
            defaultValue: false,
            groupName: "scoring",
            description:
                "Whether to aggregate scores of scored descendants into a section credit-achieved value.",
        },
        weight: {
            createComponentOfType: "number",
            createStateVariable: "weight",
            defaultValue: 1,
            public: true,
            groupName: "scoring",
            description:
                "Relative weight of this section when aggregated by an enclosing scored section.",
        },

        sectionWideCheckWork: {
            createComponentOfType: "boolean",
            createStateVariable: "sectionWideCheckWork",
            defaultValue: false,
            public: true,
            groupName: "scoring",
            description:
                "Whether to show a single section-wide check-work button instead of per-answer buttons.",
        },
        maxNumAttempts: {
            createComponentOfType: "integer",
            createStateVariable: "maxNumAttempts",
            defaultValue: Infinity,
            public: true,
            groupName: "scoring",
            description:
                "Maximum number of times the section-wide check-work button can be submitted. Once reached, all enclosed answers are disabled.",
        },
        forceIndividualAnswerColoring: {
            createComponentOfType: "boolean",
            createStateVariable: "forceIndividualAnswerColoring",
            defaultValue: false,
            groupName: "scoring",
            description:
                "Whether to force per-answer color-correctness even when section-wide check work is enabled.",
        },
        submitLabel: {
            createComponentOfType: "text",
            createStateVariable: "submitLabel",
            defaultValue: "Check Work",
            public: true,
            forRenderer: true,
            groupName: "scoring",
            description:
                "Label for the section-wide submit button when correctness is shown.",
        },
        submitLabelNoCorrectness: {
            createComponentOfType: "text",
            createStateVariable: "submitLabelNoCorrectness",
            defaultValue: "Submit Response",
            public: true,
            forRenderer: true,
            groupName: "scoring",
            description:
                "Label for the section-wide submit button when correctness is not shown.",
        },

        showCorrectness: {
            createComponentOfType: "boolean",
            createStateVariable: "showCorrectnessPreliminary",
            // This default is shown to authors but is not used to resolve the
            // value: when the attribute is unspecified, the `showCorrectness`
            // state variable ignores this (defaulted) value and falls back to
            // the enclosing ancestor and then the `showCorrectness` flag (which
            // defaults to `true`). It is set to `true` to reflect that effective
            // default.
            defaultValue: true,
            groupName: "scoring",
            description:
                "Whether to display correctness indicators for the answers it contains.",
        },
        colorCorrectness: {
            createComponentOfType: "boolean",
            createStateVariable: "colorCorrectnessPreliminary",
            // See the note on `showCorrectness`: this default is shown to
            // authors but the resolved value falls back to the ancestor and
            // then to whether correctness is shown.
            defaultValue: true,
            groupName: "scoring",
            description:
                "Whether to color-code the answers it contains based on correctness.",
        },

        displayDigitsForCreditAchieved: {
            createComponentOfType: "integer",
            createStateVariable: "displayDigitsForCreditAchieved",
            defaultValue: 3,
            public: true,
            groupName: "scoring",
            description:
                "Number of significant digits to display for the credit achieved value.",
        },
    };
}

/**
 * State variables implementing a "scored section": the section-wide check work
 * feature plus score aggregation, shared by containers (sections, `<p>`,
 * `<ol>`, `<ul>`, `<li>`, `<div>`, `<span>`, and the document). Pairs with
 * {@link returnScoredSectionAttributes}.
 *
 * The section-wide check work portion includes the section-wide submit button
 * (`createSubmitAllButton`), the suppression of per-answer submit buttons
 * (`suppressAnswerSubmitButtons`), the attempt cap (`numSubmissions`,
 * `numAttemptsLeft`), and the flag that disables all enclosed answers once
 * attempts are exhausted (`descendantsDisabledByAttempts`). The aggregation
 * portion includes `scoredDescendants`, `aggregateScores`, `creditAchieved`,
 * and related variables. The document reuses this set but deletes
 * `aggregateScores` and overrides `creditAchieved`; see `Document.js`.
 */
export function returnScoredSectionStateVariableDefinition() {
    const stateVariableDefinitions = {};

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

    stateVariableDefinitions.numSubmissions = {
        description:
            "Number of times the section-wide check-work button has been submitted.",
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

    stateVariableDefinitions.numAttemptsLeft = {
        description:
            "Remaining number of section-wide submissions before the maximum is reached.",
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

    // Whether descendant answers should be disabled because the section-wide
    // check-work attempts have been exhausted. Propagates from an enclosing
    // container so that a nested container also reports its answers as disabled
    // when an outer section-wide check work has run out of attempts.
    stateVariableDefinitions.descendantsDisabledByAttempts = {
        returnDependencies: () => ({
            sectionWideCheckWork: {
                dependencyType: "stateVariable",
                variableName: "sectionWideCheckWork",
            },
            numAttemptsLeft: {
                dependencyType: "stateVariable",
                variableName: "numAttemptsLeft",
            },
            ancestorDisabled: {
                dependencyType: "ancestor",
                variableNames: ["descendantsDisabledByAttempts"],
            },
        }),
        definition({ dependencyValues }) {
            const descendantsDisabledByAttempts =
                dependencyValues.ancestorDisabled?.stateValues
                    .descendantsDisabledByAttempts ||
                (dependencyValues.sectionWideCheckWork &&
                    dependencyValues.numAttemptsLeft < 1);

            return { setValue: { descendantsDisabledByAttempts } };
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
                    "ol",
                    "ul",
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

    return stateVariableDefinitions;
}

export async function submitAllAnswers({
    component,
    actionId,
    sourceInformation = {},
    skipRendererUpdate = false,
}) {
    // Each press of the section-wide check-work button counts as one attempt.
    // Once attempts are exhausted, do nothing (the answers are already disabled).
    const numAttemptsLeft = await component.stateValues.numAttemptsLeft;
    if (numAttemptsLeft < 1) {
        return;
    }

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

    // Submit the answers before counting the attempt. If counting the attempt
    // exhausts the limit, the answers become disabled, so they must be
    // submitted (and graded) while still enabled.
    const finite = Number.isFinite(numAttemptsLeft);

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
                // When tracking a finite attempt limit, the renderer update is
                // deferred to the numSubmissions update below so that the
                // attempts-remaining message and disabled state update together.
                skipRendererUpdate:
                    skipRendererUpdate || finite || ind < numAnswers - 1,
            },
        });
    }

    if (finite) {
        await component.coreFunctions.performUpdate({
            updateInstructions: [
                {
                    updateType: "updateValue",
                    componentIdx: component.componentIdx,
                    stateVariable: "numSubmissions",
                    value: (await component.stateValues.numSubmissions) + 1,
                },
            ],
            skipRendererUpdate,
        });
    }
}
