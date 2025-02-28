import { textFromComponent } from "../utils/text";
import InlineComponent from "./abstract/InlineComponent";

export default class AsList extends InlineComponent {
    static componentType = "asList";
    static renderChildren = true;
    static canDisplayChildErrors = true;

    static returnChildGroups() {
        return [
            {
                group: "inline",
                componentTypes: ["_inline"],
            },
            {
                group: "errors",
                componentTypes: ["_error"],
            },
        ];
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.text = {
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            returnDependencies: () => ({
                inlineChildren: {
                    dependencyType: "child",
                    childGroups: ["inline"],
                    variableNames: ["text", "hidden"],
                    variablesOptional: true,
                },
            }),
            definition: function ({ dependencyValues }) {
                let textpieces =
                    dependencyValues.inlineChildren.map(textFromComponent);

                let text = textpieces.filter((x) => x).join(", ");

                return { setValue: { text } };
            },
        };

        stateVariableDefinitions.latex = {
            public: true,
            shadowingInstructions: {
                createComponentOfType: "latex",
            },
            returnDependencies: () => ({
                inlineChildren: {
                    dependencyType: "child",
                    childGroups: ["inline"],
                    variableNames: ["text", "latex"],
                    variablesOptional: true,
                },
            }),
            definition: function ({ dependencyValues }) {
                let latexpieces = [];
                for (let child of dependencyValues.inlineChildren) {
                    if (typeof child !== "object") {
                        latexpieces.push(child.toString().trim());
                    } else if (typeof child.stateValues.latex === "string") {
                        latexpieces.push(child.stateValues.latex.trim());
                    } else if (typeof child.stateValues.text === "string") {
                        latexpieces.push(child.stateValues.text.trim());
                    } else {
                        latexpieces.push("");
                    }
                }
                let latex = latexpieces.join(", ");

                return { setValue: { latex } };
            },
        };

        return stateVariableDefinitions;
    }
}
