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

    return stateVariableDefinitions;
}
