import GraphicalComponent from "./abstract/GraphicalComponent";

export default class RegionBetweenCurveXAxis extends GraphicalComponent {
    static componentType = "regionBetweenCurveXAxis";

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        attributes.boundaryValues = {
            createComponentOfType: "numberList",
            createStateVariable: "boundaryValues",
            defaultValue: [0, 1],
            forRenderer: true,
            public: true,
        };

        attributes.function = {
            createComponentOfType: "function",
        };

        return attributes;
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

        stateVariableDefinitions.function = {
            additionalStateVariablesDefined: [
                {
                    variableName: "haveFunction",
                    forRenderer: true,
                },
                {
                    variableName: "fDefinition",
                    forRenderer: true,
                },
            ],
            returnDependencies: () => ({
                functionAttr: {
                    dependencyType: "attributeComponent",
                    attributeName: "function",
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
                    dependencyValues.functionAttr === null ||
                    dependencyValues.functionAttr.stateValues.numInputs !== 1 ||
                    dependencyValues.functionAttr.stateValues.numOutputs !== 1
                ) {
                    return {
                        setValue: {
                            function: () => NaN,
                            haveFunction: false,
                            fDefinition: {},
                        },
                    };
                }

                return {
                    setValue: {
                        function:
                            dependencyValues.functionAttr.stateValues
                                .numericalfs[0],
                        haveFunction: true,
                        fDefinition:
                            dependencyValues.functionAttr.stateValues
                                .fDefinition,
                    },
                };
            },
        };

        stateVariableDefinitions.nearestPoint = {
            returnDependencies: () => ({
                function: {
                    dependencyType: "stateVariable",
                    variableName: "function",
                },
                boundaryValues: {
                    dependencyType: "stateVariable",
                    variableName: "boundaryValues",
                },
                haveFunction: {
                    dependencyType: "stateVariable",
                    variableName: "haveFunction",
                },
            }),
            definition({ dependencyValues }) {
                // if don't have function, then don't return nearest point
                if (!dependencyValues.haveFunction) {
                    return { setValue: { nearestPoint: () => ({}) } };
                }
                const minx = Math.min(
                    dependencyValues.boundaryValues[0],
                    dependencyValues.boundaryValues[1],
                );
                const maxx = Math.max(
                    dependencyValues.boundaryValues[0],
                    dependencyValues.boundaryValues[1],
                );

                const f = dependencyValues.function;

                let nearestPoint = function ({ variables }) {
                    let x1 = variables.x1.evaluate_to_constant();
                    let x2 = variables.x2.evaluate_to_constant();

                    x1 = Math.max(minx, Math.min(maxx, x1));

                    let [val1, val2] = [0, f(x1)].sort((a, b) => a - b);

                    x2 = Math.max(val1, Math.min(val2, x2));

                    return { x1, x2 };
                };

                return { setValue: { nearestPoint } };
            },
        };

        return stateVariableDefinitions;
    }
}
