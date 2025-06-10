import CompositeComponent from "./abstract/CompositeComponent";

export default class Setup extends CompositeComponent {
    static componentType = "setup";

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
