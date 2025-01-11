import { textFromChildren } from "../../utils/text";
import BaseComponent from "../abstract/BaseComponent";

export default class Criteria extends BaseComponent {
    static componentType = "criteria";
    static rendererType = undefined;

    static includeBlankStringChildren = true;

    static returnChildGroups() {
        return [
            {
                group: "anything",
                componentTypes: ["_base"],
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
                    childGroups: ["anything"],
                    variableNames: ["text", "hidden"],
                    variablesOptional: true,
                },
            }),
            definition: function ({ dependencyValues }) {
                let text = textFromChildren(dependencyValues.inlineChildren);

                return { setValue: { text } };
            },
        };

        return stateVariableDefinitions;
    }
}
