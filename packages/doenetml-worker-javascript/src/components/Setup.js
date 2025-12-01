import CompositeComponent from "./abstract/CompositeComponent";

export default class Setup extends CompositeComponent {
    static componentType = "setup";

    static returnSugarInstructions() {
        let sugarInstructions = super.returnSugarInstructions();

        let removeDefinitions = function ({
            matchedChildren,
            componentInfoObjects,
            nComponents,
        }) {
            let componentIsSpecifiedType =
                componentInfoObjects.componentIsSpecifiedType;

            let foundDefinitionsChildren = false;

            // First, move any children of styleDefinitions or feedbackDefinitions directly into the setup
            // TODO: add a deprecation warning in this case?
            // We can remove this when upgrade to next major version
            const childrenMovedDefinitions = [];
            for (const child of matchedChildren) {
                childrenMovedDefinitions.push(child);
                if (
                    componentIsSpecifiedType(child, "styleDefinitions") ||
                    componentIsSpecifiedType(child, "feedbackDefinitions")
                ) {
                    if (child.children?.length > 0) {
                        foundDefinitionsChildren = true;
                        childrenMovedDefinitions.push(...child.children);
                        child.children = [];
                    }
                }
            }

            if (foundDefinitionsChildren) {
                return {
                    success: true,
                    newChildren: childrenMovedDefinitions,
                    nComponents,
                };
            } else {
                return { success: false };
            }
        };

        sugarInstructions.push({
            replacementFunction: removeDefinitions,
        });

        return sugarInstructions;
    }

    static returnChildGroups() {
        return [
            {
                group: "styleDefinitions",
                componentTypes: ["styleDefinition"],
            },
            {
                group: "feedbackDefinitions",
                componentTypes: ["feedbackDefinition"],
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
