import BaseComponent from "../abstract/BaseComponent";

export class Sample extends BaseComponent {
    static componentType = "sample";
    static rendererType = undefined;

    static returnChildGroups() {
        return [
            {
                group: "response",
                componentTypes: ["response"],
            },
            {
                group: "evaluations",
                componentTypes: ["evaluations"],
            },
        ];
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.data = {
            returnDependencies: () => ({
                responseChildren: {
                    dependencyType: "child",
                    childGroups: ["response"],
                    variableNames: ["text"],
                },
                evaluationsChildren: {
                    dependencyType: "child",
                    childGroups: ["evaluations"],
                    variableNames: ["data"],
                },
            }),
            definition({ dependencyValues }) {
                let response = "";
                if (dependencyValues.responseChildren.length > 0) {
                    response =
                        dependencyValues.responseChildren[
                            dependencyValues.responseChildren.length - 1
                        ].stateValues.text;
                }
                let evaluations = [];
                if (dependencyValues.evaluationsChildren.length > 0) {
                    evaluations =
                        dependencyValues.evaluationsChildren[
                            dependencyValues.evaluationsChildren.length - 1
                        ].stateValues.data;
                }

                const data = {
                    response,
                    evaluations,
                };

                return { setValue: { data } };
            },
        };

        return stateVariableDefinitions;
    }
}

export class Samples extends BaseComponent {
    static componentType = "samples";
    static rendererType = undefined;

    static returnChildGroups() {
        return [
            {
                group: "sample",
                componentTypes: ["sample"],
            },
        ];
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.data = {
            returnDependencies: () => ({
                sampleChildren: {
                    dependencyType: "child",
                    childGroups: ["sample"],
                    variableNames: ["data"],
                },
            }),
            definition({ dependencyValues }) {
                const data = dependencyValues.sampleChildren.map(
                    (c) => c.stateValues.data,
                );

                return { setValue: { data } };
            },
        };

        return stateVariableDefinitions;
    }
}
