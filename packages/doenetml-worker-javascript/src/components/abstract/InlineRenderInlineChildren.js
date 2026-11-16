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
            description:
                "The combined text content of this component's children, with optional begin/end delimiters.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            returnDependencies: () => ({
                inlineChildren: {
                    dependencyType: "child",
                    childGroups: ["inlines"],
                    variableNames: ["text", "hidden", "valueMissing"],
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
            // A write lands on the one child that supplies the text, as in a
            // `<text>` (`textChildValuesFromDesired`), so `<em>Hi</em>` in a
            // `<label>` takes a new label and keeps its markup (#2537). The
            // delimiters (a `<q>`'s quotes) are not the child's, and are
            // dropped from the desired text when it has them. Several
            // children, or none, refuse the write.
            inverseDefinition({
                desiredStateVariableValues,
                dependencyValues,
            }) {
                let desiredText = desiredStateVariableValues.text;
                const children = dependencyValues.inlineChildren;
                if (typeof desiredText !== "string" || children.length !== 1) {
                    return { success: false };
                }
                const begin = componentClass.beginTextDelimiter;
                const end = componentClass.endTextDelimiter;
                if (
                    desiredText.length >= begin.length + end.length &&
                    desiredText.startsWith(begin) &&
                    desiredText.endsWith(end)
                ) {
                    desiredText = desiredText.slice(
                        begin.length,
                        desiredText.length - end.length,
                    );
                }
                const child = children[0];
                if (typeof child === "string") {
                    return {
                        success: true,
                        instructions: [
                            {
                                setDependency: "inlineChildren",
                                desiredValue: desiredText,
                                childIndex: 0,
                            },
                        ],
                    };
                }
                if (typeof child.stateValues.text === "string") {
                    return {
                        success: true,
                        instructions: [
                            {
                                setDependency: "inlineChildren",
                                desiredValue: desiredText,
                                childIndex: 0,
                                variableIndex: 0, // the "text" variable
                            },
                        ],
                    };
                }
                return { success: false };
            },
        };

        return stateVariableDefinitions;
    }
}
