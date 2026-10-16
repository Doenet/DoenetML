import BaseComponent from "./abstract/BaseComponent";

export default class ConsiderAsResponses extends BaseComponent {
    static componentType = "considerAsResponses";
    static rendererType = undefined;

    static componentDocs = {
        summary:
            "Marks its children as response components for an enclosing answer",
    };

    static inSchemaOnlyInheritAs = [];

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

        stateVariableDefinitions.childrenWithNValues = {
            returnDependencies: () => ({
                children: {
                    dependencyType: "child",
                    childGroups: ["anything"],
                    variableNames: ["numValues"],
                    variablesOptional: true,
                },
            }),
            definition: ({ dependencyValues }) => ({
                setValue: { childrenWithNValues: dependencyValues.children },
            }),
        };

        stateVariableDefinitions.childrenAsResponses = {
            returnDependencies: () => ({
                children: {
                    dependencyType: "child",
                    childGroups: ["anything"],
                    variableNames: [
                        "value",
                        "values",
                        "componentType",
                        // only a value reference (`_ref`) has these; the
                        // answer records it from its referent, as it records
                        // one in an award (`currentResponses` in `Answer.js`)
                        "valueAsResponse",
                        "componentTypeAsResponse",
                    ],
                    variablesOptional: true,
                },
            }),
            definition: ({ dependencyValues }) => ({
                setValue: { childrenAsResponses: dependencyValues.children },
            }),
        };

        return stateVariableDefinitions;
    }
}
