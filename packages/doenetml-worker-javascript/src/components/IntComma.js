import Text from "./Text";
import { formatDecimalString } from "@doenet/i18n";
import { renameStateVariable } from "../utils/stateVariables";
import {
    contentLocale,
    returnContentLocaleDependencies,
} from "../utils/contentLocale";

// convert number to number separated by commas, a la django humanize's intcomma

/**
 * The decimal number at the start of a value, if there is one.
 *
 * Anchored, because that is what this component has always done: it groups a
 * number a value *begins* with and leaves the rest of the string alone, so
 * `<intComma>` around prose is a no-op rather than a mangling.
 */
const LEADING_DECIMAL = /^-?\d+(?:\.\d+)?/;

export default class IntComma extends Text {
    static componentType = "intComma";
    static rendererType = "text";

    static componentDocs = {
        summary:
            "Renders a numeric value with the thousands separators of the document's language (e.g. 1,000,000)",
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
            description:
                "The numeric value, grouped as the document's language groups digits.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: this.componentType,
            },
            returnDependencies: () => ({
                originalValue: {
                    dependencyType: "stateVariable",
                    variableName: "originalValue",
                },
                ...returnContentLocaleDependencies(),
            }),
            definition: function ({ dependencyValues }) {
                // The grouping this component exists to add is a *convention*,
                // not notation: German groups with periods and India groups in
                // twos after the first thousand, and a document written in
                // either should say so. That is why the separator comes from
                // the document's language rather than from a hard-coded comma
                // — and why `<number>` still does not, since a decimal point
                // inside mathematics has to survive being read back.
                const value = dependencyValues.originalValue;
                const number = LEADING_DECIMAL.exec(value)?.[0];
                if (number === undefined) {
                    return { setValue: { value } };
                }
                return {
                    setValue: {
                        value:
                            formatDecimalString(
                                contentLocale(dependencyValues),
                                number,
                            ) + value.slice(number.length),
                    },
                };
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
