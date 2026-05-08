import { textFromChildren } from "../utils/text";
import InlineComponent from "./abstract/InlineComponent";

export default class Footnote extends InlineComponent {
    static componentType = "footnote";
    static renderChildren = true;

    static componentDocs = {
        summary:
            "Inline footnote whose body is shown on demand and is auto-numbered in the document.",
    };

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

        stateVariableDefinitions.text = {
            description: "The footnote's body as plain text.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            forRenderer: true,
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

                return { setValue: { text } };
            },
        };

        stateVariableDefinitions.footnoteTag = {
            description:
                "The auto-generated marker (number) used to reference this footnote.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            forRenderer: true,
            mustEvaluate: true, // must evaluate to make sure all counters are accounted for
            returnDependencies: () => ({
                footnoteCounter: {
                    dependencyType: "counter",
                    counterName: "footnote",
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        footnoteTag: String(dependencyValues.footnoteCounter),
                    },
                };
            },
        };

        return stateVariableDefinitions;
    }
}
