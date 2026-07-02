import Text from "./Text";
import { renameStateVariable } from "../utils/stateVariables";

// convert number to number separated by commas, a la django humanize's intcomma

export default class IntComma extends Text {
    static componentType = "intComma";
    static rendererType = "text";

    static componentDocs = {
        summary:
            "Renders a numeric value with thousands separators (e.g. 1,000,000)",
    };

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        // rename value to originalValue
        renameStateVariable({
            stateVariableDefinitions,
            oldName: "value",
            newName: "originalValue",
        });

        stateVariableDefinitions.value = {
            description: "The numeric value with thousands separators.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: this.componentType,
            },
            returnDependencies: () => ({
                originalValue: {
                    dependencyType: "stateVariable",
                    variableName: "originalValue",
                },
            }),
            definition: function ({ dependencyValues }) {
                let value = dependencyValues.originalValue;

                let startAtLeastFourNumRegex = /^(-?\d+)(\d{3})/;
                let matchObj = value.match(startAtLeastFourNumRegex);
                while (matchObj !== null) {
                    value = value.replace(startAtLeastFourNumRegex, `$1,$2`);
                    matchObj = value.match(startAtLeastFourNumRegex);
                }

                return { setValue: { value } };
            },
        };

        stateVariableDefinitions.text = {
            description: "The formatted value rendered as a text string.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            forRenderer: true,
            returnDependencies: () => ({
                value: {
                    dependencyType: "stateVariable",
                    variableName: "value",
                },
            }),
            definition: ({ dependencyValues }) => ({
                setValue: { text: dependencyValues.value },
            }),
        };

        return stateVariableDefinitions;
    }
}
