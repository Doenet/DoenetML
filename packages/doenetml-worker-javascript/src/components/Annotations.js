import BaseComponent from "./abstract/BaseComponent";

export default class Annotations extends BaseComponent {
    static componentType = "annotations";
    static rendererType = undefined;

    static returnChildGroups() {
        return [
            {
                group: "annotations",
                componentTypes: ["annotation"],
            },
        ];
    }

    static returnStateVariableDefinitions() {
        const stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.annotationSubtrees = {
            returnDependencies: () => ({
                annotationChildren: {
                    dependencyType: "child",
                    childGroups: ["annotations"],
                    variableNames: ["prefigureAnnotationNode"],
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        annotationSubtrees: dependencyValues.annotationChildren
                            .map(
                                (child) =>
                                    child?.stateValues?.prefigureAnnotationNode,
                            )
                            .filter((x) => x !== null && x !== undefined),
                    },
                };
            },
        };

        return stateVariableDefinitions;
    }
}
