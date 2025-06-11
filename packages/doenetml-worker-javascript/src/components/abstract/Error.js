import { printDoenetMLrange } from "@doenet/utils";
import BlockComponent from "./BlockComponent";

export default class ErrorComponent extends BlockComponent {
    static componentType = "_error";
    static renderChildren = true;

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        attributes.message = {
            createComponentOfType: "text",
            createStateVariable: "message",
            defaultValue: "",
            public: true,
            forRenderer: true,
        };

        return attributes;
    }

    static returnChildGroups() {
        let childGroups = [
            {
                group: "errors",
                componentTypes: ["_error"],
            },
            {
                group: "any",
                componentTypes: ["_base"],
            },
        ];

        return childGroups;
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        // error components can never be hidden
        stateVariableDefinitions.hidden = {
            returnDependencies: () => ({}),
            definition: () => ({ setValue: { hidden: false } }),
        };

        stateVariableDefinitions.rangeMessage = {
            forRenderer: true,
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            returnDependencies: () => ({
                position: {
                    dependencyType: "position",
                },
            }),
            definition({ dependencyValues }) {
                let rangeMessage = "";

                let position = dependencyValues.position;
                if (position?.start.line !== undefined) {
                    rangeMessage =
                        "Found on " + printDoenetMLrange(position) + ".";
                }

                return { setValue: { rangeMessage } };
            },
        };

        // If this error message is just a repeat of one of its children's messages,
        // then don't display the error again.
        stateVariableDefinitions.showMessage = {
            forRenderer: true,
            returnDependencies: () => ({
                childErrors: {
                    dependencyType: "child",
                    childGroups: ["errors"],
                    variableNames: ["message"],
                },
                message: {
                    dependencyType: "stateVariable",
                    variableName: "message",
                },
            }),
            definition({ dependencyValues }) {
                let showMessage = !dependencyValues.childErrors.some(
                    (child) =>
                        child.stateValues.message === dependencyValues.message,
                );

                return { setValue: { showMessage } };
            },
        };

        return stateVariableDefinitions;
    }
}
