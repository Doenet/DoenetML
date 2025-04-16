import CompositeComponent from "./abstract/CompositeComponent";

export default class Setup extends CompositeComponent {
    static componentType = "setup";

    // Note: can't add customAttribute to child groups
    // or it won't be expanded
    static additionalSchemaChildren = ["customAttribute"];

    static returnChildGroups() {
        return [
            {
                group: "styleDefinitions",
                componentTypes: ["styleDefinitions"],
            },
            {
                group: "feedbackDefinitions",
                componentTypes: ["feedbackDefinitions"],
            },
            {
                group: "anything",
                componentTypes: ["_base"],
            },
        ];
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.componentIdxForAttributes = {
            returnDependencies: () => ({
                sourceCompositeIdentity: {
                    dependencyType: "sourceCompositeIdentity",
                },
            }),
            definition({ dependencyValues }) {
                let componentIdxForAttributes = null;
                if (dependencyValues.sourceCompositeIdentity) {
                    componentIdxForAttributes =
                        dependencyValues.sourceCompositeIdentity.componentIdx;
                }
                return { setValue: { componentIdxForAttributes } };
            },
        };

        stateVariableDefinitions.readyToExpandWhenResolved = {
            returnDependencies: () => ({}),
            definition() {
                return {
                    setValue: { readyToExpandWhenResolved: true },
                };
            },
        };

        return stateVariableDefinitions;
    }
}
