import InlineComponent from "./InlineComponent";

export default class Input extends InlineComponent {
    static componentType = "_input";

    static createAttributesObject() {
        let attributes = super.createAttributesObject();
        attributes.collaborateGroups = {
            createComponentOfType: "collaborateGroups",
            createStateVariable: "collaborateGroups",
            defaultValue: null,
            public: true,
            excludeFromSchema: true,
        };
        return attributes;
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        // how many values an input returns
        stateVariableDefinitions.numValues = {
            returnDependencies: () => ({}),
            definition: () => ({ setValue: { numValues: 1 } }),
        };

        stateVariableDefinitions.answerAncestor = {
            returnDependencies: () => ({
                answerAncestor: {
                    dependencyType: "ancestor",
                    componentType: "answer",
                    variableNames: [
                        "delegateCheckWorkToInput",
                        "justSubmitted",
                        "creditAchieved",
                        "showCorrectness",
                        "submitLabel",
                        "submitLabelNoCorrectness",
                        "numAttemptsLeft",
                        "creditIsReducedByAttempt",
                        "numIncorrectSubmissions",
                        "numPreviousIncorrectSubmissions",
                        "creditFactorUsed",
                        "nextCreditFactor",
                    ],
                },
            }),
            definition: function ({ dependencyValues }) {
                return {
                    setValue: {
                        answerAncestor: dependencyValues.answerAncestor,
                    },
                };
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

        stateVariableDefinitions.showCheckWork = {
            forRenderer: true,
            returnDependencies: () => ({
                answerAncestor: {
                    dependencyType: "stateVariable",
                    variableName: "answerAncestor",
                },
                suppressCheckWork: {
                    dependencyType: "stateVariable",
                    variableName: "suppressCheckWork",
                },
            }),
            definition: function ({ dependencyValues }) {
                let showCheckWork = false;
                if (
                    dependencyValues.answerAncestor &&
                    !dependencyValues.suppressCheckWork
                ) {
                    showCheckWork =
                        dependencyValues.answerAncestor.stateValues
                            .delegateCheckWorkToInput;
                }
                return {
                    setValue: { showCheckWork },
                };
            },
        };

        stateVariableDefinitions.creditAchieved = {
            forRenderer: true,
            returnDependencies: () => ({
                answerAncestor: {
                    dependencyType: "stateVariable",
                    variableName: "answerAncestor",
                },
            }),
            definition: function ({ dependencyValues }) {
                let creditAchieved = 0;
                if (dependencyValues.answerAncestor) {
                    creditAchieved =
                        dependencyValues.answerAncestor.stateValues
                            .creditAchieved;
                }
                return {
                    setValue: { creditAchieved },
                };
            },
        };

        stateVariableDefinitions.creditIsReducedByAttempt = {
            forRenderer: true,
            returnDependencies: () => ({
                answerAncestor: {
                    dependencyType: "stateVariable",
                    variableName: "answerAncestor",
                },
            }),
            definition: function ({ dependencyValues }) {
                let creditIsReducedByAttempt = false;
                if (dependencyValues.answerAncestor) {
                    creditIsReducedByAttempt =
                        dependencyValues.answerAncestor.stateValues
                            .creditIsReducedByAttempt;
                }
                return {
                    setValue: { creditIsReducedByAttempt },
                };
            },
        };

        stateVariableDefinitions.justSubmitted = {
            forRenderer: true,
            returnDependencies: () => ({
                answerAncestor: {
                    dependencyType: "stateVariable",
                    variableName: "answerAncestor",
                },
            }),
            definition: function ({ dependencyValues }) {
                let justSubmitted = false;

                if (
                    dependencyValues.answerAncestor &&
                    dependencyValues.answerAncestor.stateValues.justSubmitted
                ) {
                    justSubmitted = true;
                }
                return {
                    setValue: { justSubmitted },
                };
            },
        };

        stateVariableDefinitions.showCorrectness = {
            forRenderer: true,
            returnDependencies: () => ({
                showCorrectnessFlag: {
                    dependencyType: "flag",
                    flagName: "showCorrectness",
                },
                answerAncestor: {
                    dependencyType: "stateVariable",
                    variableName: "answerAncestor",
                },
            }),
            definition({ dependencyValues }) {
                let showCorrectness;
                if (dependencyValues.answerAncestor) {
                    showCorrectness =
                        dependencyValues.answerAncestor.stateValues
                            .showCorrectness;
                } else {
                    showCorrectness =
                        dependencyValues.showCorrectnessFlag !== false;
                }
                return { setValue: { showCorrectness } };
            },
        };

        stateVariableDefinitions.submitLabel = {
            forRenderer: true,
            returnDependencies: () => ({
                answerAncestor: {
                    dependencyType: "stateVariable",
                    variableName: "answerAncestor",
                },
            }),
            definition({ dependencyValues }) {
                let submitLabel;
                if (dependencyValues.answerAncestor) {
                    submitLabel =
                        dependencyValues.answerAncestor.stateValues.submitLabel;
                } else {
                    submitLabel = "";
                }
                return { setValue: { submitLabel } };
            },
        };

        stateVariableDefinitions.submitLabelNoCorrectness = {
            forRenderer: true,
            returnDependencies: () => ({
                answerAncestor: {
                    dependencyType: "stateVariable",
                    variableName: "answerAncestor",
                },
            }),
            definition({ dependencyValues }) {
                let submitLabelNoCorrectness;
                if (dependencyValues.answerAncestor) {
                    submitLabelNoCorrectness =
                        dependencyValues.answerAncestor.stateValues
                            .submitLabelNoCorrectness;
                } else {
                    submitLabelNoCorrectness = "";
                }
                return { setValue: { submitLabelNoCorrectness } };
            },
        };

        stateVariableDefinitions.numAttemptsLeft = {
            forRenderer: true,
            returnDependencies: () => ({
                answerAncestor: {
                    dependencyType: "stateVariable",
                    variableName: "answerAncestor",
                },
            }),
            definition({ dependencyValues }) {
                let numAttemptsLeft;
                if (dependencyValues.answerAncestor) {
                    numAttemptsLeft =
                        dependencyValues.answerAncestor.stateValues
                            .numAttemptsLeft;
                } else {
                    numAttemptsLeft = Infinity;
                }
                return { setValue: { numAttemptsLeft } };
            },
        };

        stateVariableDefinitions.numIncorrectSubmissions = {
            forRenderer: true,
            returnDependencies: () => ({
                answerAncestor: {
                    dependencyType: "stateVariable",
                    variableName: "answerAncestor",
                },
            }),
            definition({ dependencyValues }) {
                let numIncorrectSubmissions;
                if (dependencyValues.answerAncestor) {
                    numIncorrectSubmissions =
                        dependencyValues.answerAncestor.stateValues
                            .numIncorrectSubmissions;
                } else {
                    numIncorrectSubmissions = 0;
                }
                return { setValue: { numIncorrectSubmissions } };
            },
        };

        stateVariableDefinitions.numPreviousIncorrectSubmissions = {
            forRenderer: true,
            returnDependencies: () => ({
                answerAncestor: {
                    dependencyType: "stateVariable",
                    variableName: "answerAncestor",
                },
            }),
            definition({ dependencyValues }) {
                let numPreviousIncorrectSubmissions;
                if (dependencyValues.answerAncestor) {
                    numPreviousIncorrectSubmissions =
                        dependencyValues.answerAncestor.stateValues
                            .numPreviousIncorrectSubmissions;
                } else {
                    numPreviousIncorrectSubmissions = 0;
                }
                return { setValue: { numPreviousIncorrectSubmissions } };
            },
        };

        stateVariableDefinitions.creditFactorUsed = {
            forRenderer: true,
            returnDependencies: () => ({
                answerAncestor: {
                    dependencyType: "stateVariable",
                    variableName: "answerAncestor",
                },
            }),
            definition({ dependencyValues }) {
                let creditFactorUsed;
                if (dependencyValues.answerAncestor) {
                    creditFactorUsed =
                        dependencyValues.answerAncestor.stateValues
                            .creditFactorUsed;
                } else {
                    creditFactorUsed = 1;
                }
                return { setValue: { creditFactorUsed } };
            },
        };

        stateVariableDefinitions.nextCreditFactor = {
            forRenderer: true,
            returnDependencies: () => ({
                answerAncestor: {
                    dependencyType: "stateVariable",
                    variableName: "answerAncestor",
                },
            }),
            definition({ dependencyValues }) {
                let nextCreditFactor;
                if (dependencyValues.answerAncestor) {
                    nextCreditFactor =
                        dependencyValues.answerAncestor.stateValues
                            .nextCreditFactor;
                } else {
                    nextCreditFactor = 1;
                }
                return { setValue: { nextCreditFactor } };
            },
        };

        return stateVariableDefinitions;
    }
}
