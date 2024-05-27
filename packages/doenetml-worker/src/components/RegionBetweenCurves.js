import GraphicalComponent from "./abstract/GraphicalComponent";

export default class RegionBetweenCurves extends GraphicalComponent {
    static componentType = "regionBetweenCurves";

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        attributes.boundaryValues = {
            createComponentOfType: "numberList",
            createStateVariable: "boundaryValues",
            defaultValue: [0, 1],
            forRenderer: true,
            public: true,
        };

        attributes.flipFunctions = {
            createComponentOfType: "boolean",
            createStateVariable: "flipFunctions",
            defaultValue: false,
            public: true,
            forRenderer: true,
        };

        return attributes;
    }

    static returnChildGroups() {
        let groups = super.returnChildGroups();
        groups.push({
            group: "functions",
            componentTypes: ["function"],
        });

        return groups;
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.styleDescription = {
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            returnDependencies: () => ({
                selectedStyle: {
                    dependencyType: "stateVariable",
                    variableName: "selectedStyle",
                },
                document: {
                    dependencyType: "ancestor",
                    componentType: "document",
                    variableNames: ["theme"],
                },
            }),
            definition: function ({ dependencyValues }) {
                let fillColorWord;
                if (dependencyValues.document?.stateValues.theme === "dark") {
                    fillColorWord =
                        dependencyValues.selectedStyle.fillColorWordDarkMode;
                } else {
                    fillColorWord =
                        dependencyValues.selectedStyle.fillColorWord;
                }

                return { setValue: { styleDescription: fillColorWord } };
            },
        };

        stateVariableDefinitions.styleDescriptionWithNoun = {
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            returnDependencies: () => ({
                styleDescription: {
                    dependencyType: "stateVariable",
                    variableName: "styleDescription",
                },
            }),
            definition: function ({ dependencyValues }) {
                let styleDescriptionWithNoun =
                    dependencyValues.styleDescription + " region";

                return { setValue: { styleDescriptionWithNoun } };
            },
        };

        stateVariableDefinitions.functions = {
            additionalStateVariablesDefined: [
                {
                    variableName: "haveFunctions",
                    forRenderer: true,
                },
                {
                    variableName: "fDefinitions",
                    forRenderer: true,
                },
            ],
            returnDependencies: () => ({
                functions: {
                    dependencyType: "child",
                    childGroups: ["functions"],
                    variableNames: [
                        "numericalfs",
                        "numInputs",
                        "numOutputs",
                        "fDefinition",
                    ],
                },
            }),
            definition({ dependencyValues }) {
                if (
                    dependencyValues.functions.length < 2 ||
                    dependencyValues.functions[0].stateValues.numInputs !== 1 ||
                    dependencyValues.functions[0].stateValues.numOutputs !==
                        1 ||
                    dependencyValues.functions[1].stateValues.numInputs !== 1 ||
                    dependencyValues.functions[1].stateValues.numOutputs !== 1
                ) {
                    return {
                        setValues: {
                            function: [() => NaN, () => NaN],
                            haveFunctions: false,
                            fDefinitions: [{}, {}],
                        },
                    };
                }

                return {
                    setValue: {
                        functions: [
                            dependencyValues.functions[0].stateValues
                                .numericalfs[0],
                            dependencyValues.functions[1].stateValues
                                .numericalfs[0],
                        ],
                        haveFunctions: true,
                        fDefinitions: [
                            dependencyValues.functions[0].stateValues
                                .fDefinition,
                            dependencyValues.functions[1].stateValues
                                .fDefinition,
                        ],
                    },
                };
            },
        };

        return stateVariableDefinitions;
    }
}
