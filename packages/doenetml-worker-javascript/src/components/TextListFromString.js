import InlineComponent from "./abstract/InlineComponent";

export default class TextListFromString extends InlineComponent {
    static componentType = "textListFromString";

    static componentDocs = {
        summary:
            "A list of text strings parsed from a single string by splitting on whitespace.",
    };
    static rendererType = "asList";
    static renderChildren = true;

    static excludeFromSchema = true;

    static stateVariableToBeShadowed = "texts";

    static returnSugarInstructions() {
        let sugarInstructions = super.returnSugarInstructions();

        let breakStringsBySpaces = function ({ matchedChildren, nComponents }) {
            // break any string by white space

            let newChildren = matchedChildren.reduce(function (a, c) {
                if (typeof c === "string") {
                    return [...a, ...c.split(/\s+/).filter((s) => s)];
                } else {
                    return [...a, c];
                }
            }, []);

            return {
                success: true,
                newChildren: newChildren,
                nComponents,
            };
        };

        sugarInstructions.push({
            replacementFunction: breakStringsBySpaces,
        });

        return sugarInstructions;
    }

    static returnChildGroups() {
        return [
            {
                group: "strings",
                componentTypes: ["string"],
            },
        ];
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.numComponents = {
            description: "The number of items in the text list.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "number",
            },
            returnDependencies: () => ({
                stringChildren: {
                    dependencyType: "child",
                    childGroups: ["strings"],
                },
            }),
            definition: function ({ dependencyValues }) {
                return {
                    setValue: {
                        numComponents: dependencyValues.stringChildren.length,
                    },
                };
            },
        };

        stateVariableDefinitions.texts = {
            description: "The list of texts parsed from the input string.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            isArray: true,
            entryPrefixes: ["text"],
            returnArraySizeDependencies: () => ({
                numComponents: {
                    dependencyType: "stateVariable",
                    variableName: "numComponents",
                },
            }),
            returnArraySize({ dependencyValues }) {
                return [dependencyValues.numComponents];
            },
            returnArrayDependenciesByKey({ arrayKeys }) {
                let dependenciesByKey = {};
                for (let arrayKey of arrayKeys) {
                    dependenciesByKey[arrayKey] = {
                        stringChild: {
                            dependencyType: "child",
                            childGroups: ["strings"],
                            variableNames: ["value"],
                            childIndices: [arrayKey],
                        },
                    };
                }
                return { dependenciesByKey };
            },
            arrayDefinitionByKey: function ({
                dependencyValuesByKey,
                arrayKeys,
            }) {
                let texts = {};
                for (let arrayKey of arrayKeys) {
                    if (
                        dependencyValuesByKey[arrayKey].stringChild.length === 1
                    ) {
                        texts[arrayKey] =
                            dependencyValuesByKey[arrayKey].stringChild[0];
                    }
                }
                return { setValue: { texts } };
            },
        };

        stateVariableDefinitions.numValues = {
            isAlias: true,
            targetVariableName: "numComponents",
        };

        stateVariableDefinitions.values = {
            isAlias: true,
            targetVariableName: "texts",
        };

        stateVariableDefinitions.text = {
            description: "The texts joined as a single text string.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            forRenderer: true,
            returnDependencies: () => ({
                texts: {
                    dependencyType: "stateVariable",
                    variableName: "texts",
                },
            }),
            definition: ({ dependencyValues }) => ({
                setValue: { text: dependencyValues.texts.join(", ") },
            }),
        };

        return stateVariableDefinitions;
    }
}
