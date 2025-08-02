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
                        "numAttemptsLeft",
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
        //TODO: disabled is now in basecomponent - how to make it work with collaborateGroups
        // stateVariableDefinitions.disabled = {
        //   forRenderer: true,
        //   returnDependencies: () => ({
        //     collaborateGroups: {
        //       dependencyType: "stateVariable",
        //       variableName: "collaborateGroups"
        //     },
        //     collaboration: {
        //       dependencyType: "flag",
        //       flagName: "collaboration"
        //     }
        //   }),
        //   definition: function ({ dependencyValues }) {
        //     let disabled = false;
        //     if (dependencyValues.collaborateGroups) {
        //       disabled = !dependencyValues.collaborateGroups.matchGroup(dependencyValues.collaboration)
        //     }
        //     return { setValue: { disabled } }
        //   }
        // }

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

        return stateVariableDefinitions;
    }
}
