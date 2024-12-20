import { textFromChildren } from "../../utils/text";
import InlineComponent from "./InlineComponent";

export default class InlineRenderInlineChildren extends InlineComponent {
    static componentType = "_inlineRenderInlineChildren";
    static renderChildren = true;
    static includeBlankStringChildren = true;

    // Note: these atributes are used just for the text state variable, below.
    // They are ignored in the renderers themselves.
    static beginTextDelimiter = "";
    static endTextDelimiter = "";

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

        let componentClass = this;

        stateVariableDefinitions.text = {
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
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
                let text = textFromChildren(dependencyValues.inlineChildren);

                text =
                    componentClass.beginTextDelimiter +
                    text +
                    componentClass.endTextDelimiter;

                return { setValue: { text } };
            },
        };

        return stateVariableDefinitions;
    }
}
