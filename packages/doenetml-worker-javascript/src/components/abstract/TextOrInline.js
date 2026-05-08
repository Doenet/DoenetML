import { textFromChildren } from "../../utils/text";
import InlineComponent from "./InlineComponent";

export default class TextOrInline extends InlineComponent {
    static componentType = "_textOrInline";
    static renderChildren = true;
    static rendererType = "containerInline";

    static includeBlankStringChildren = true;

    static returnChildGroups() {
        return [
            {
                group: "inlines",
                componentTypes: ["_inline"],
            },
        ];
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.value = {
            description: "The combined content of this component's children.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: this.componentType,
            },
            returnDependencies: () => ({
                inlineChildren: {
                    dependencyType: "child",
                    childGroups: ["inlines"],
                    variableNames: ["text", "hidden"],
                    variablesOptional: true,
                },
            }),
            definition: function ({ dependencyValues }) {
                let value = textFromChildren(dependencyValues.inlineChildren);

                return { setValue: { value } };
            },
        };

        stateVariableDefinitions.text = {
            description:
                "The combined content of this component's children, as a plain text string.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
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
