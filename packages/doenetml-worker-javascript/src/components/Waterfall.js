import { renameStateVariable } from "../utils/stateVariables";
import { SectioningComponent } from "./abstract/SectioningComponent";

export default class Waterfall extends SectioningComponent {
    static componentType = "waterfall";
    static rendererType = "section";

    static includeBlankStringChildren = false;

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        attributes.completedColor = {
            createComponentOfType: "text",
            createStateVariable: "completedColor",
            defaultValue: "var(--lightGreen)",
        };

        attributes.inProgressColor = {
            createComponentOfType: "text",
            createStateVariable: "inProgressColor",
            defaultValue: "var(--mainGray)",
        };

        attributes.hideFutureSections = {
            createComponentOfType: "boolean",
            createStateVariable: "hideFutureSections",
            defaultValue: false,
            public: true,
        };

        attributes.noAutoTitle.defaultValue = true;

        return attributes;
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.childrenAggregateScores = {
            returnDependencies: () => ({}),
            definition: () => ({ setValue: { childrenAggregateScores: true } }),
        };

        stateVariableDefinitions.childCreditAchieved = {
            returnDependencies: () => ({
                children: {
                    dependencyType: "child",
                    childGroups: ["anything"],
                    variableNames: ["creditAchieved"],
                    variablesOptional: true,
                },
            }),
            definition({ dependencyValues }) {
                const childCreditAchieved = dependencyValues.children.map(
                    (child) => child.stateValues?.creditAchieved ?? null,
                );

                return { setValue: { childCreditAchieved } };
            },
        };

        stateVariableDefinitions.numCompleted = {
            public: true,
            shadowingInstructions: {
                createComponentOfType: "integer",
            },
            returnDependencies: () => ({
                childCreditAchieved: {
                    dependencyType: "stateVariable",
                    variableName: "childCreditAchieved",
                },
            }),
            definition({ dependencyValues }) {
                let numCompleted = 0;

                for (const childCredit of dependencyValues.childCreditAchieved) {
                    // if childCredit === null, then that child doesn't have a credit achieved
                    // so it is automatically deemed completed when reached
                    if (childCredit === 1 || childCredit === null) {
                        numCompleted++;
                    } else {
                        // Stop as soon as reach a child that has a credit achieved less than 1
                        break;
                    }
                }

                return { setValue: { numCompleted } };
            },
        };

        // rename childIndicesToRender to childIndicesToRenderOriginal
        // so that start with original indices and only remove additional ones
        renameStateVariable({
            stateVariableDefinitions,
            oldName: "childIndicesToRender",
            newName: "childIndicesToRenderOriginal",
        });

        stateVariableDefinitions.childIndicesToRender = {
            additionalStateVariablesDefined: ["childrenToHideChildren"],
            returnDependencies: () => ({
                childIndicesToRenderOriginal: {
                    dependencyType: "stateVariable",
                    variableName: "childIndicesToRenderOriginal",
                },
                hideFutureSections: {
                    dependencyType: "stateVariable",
                    variableName: "hideFutureSections",
                },
                numCompleted: {
                    dependencyType: "stateVariable",
                    variableName: "numCompleted",
                },
                allChildren: {
                    dependencyType: "child",
                    childGroups: [
                        "anything",
                        "variantControls",
                        "titles",
                        "setups",
                    ],
                },
            }),
            definition({ dependencyValues, componentInfoObjects }) {
                const childIndicesToRender = [];
                const childrenToHideChildren = [];

                let numAnythingChildren = 0;
                const otherChildTypes = ["variantControl", "title", "setup"];

                for (const [
                    idx,
                    child,
                ] of dependencyValues.allChildren.entries()) {
                    if (
                        dependencyValues.childIndicesToRenderOriginal.includes(
                            idx,
                        )
                    ) {
                        if (
                            numAnythingChildren <= dependencyValues.numCompleted
                        ) {
                            childIndicesToRender.push(idx);
                        } else if (
                            !dependencyValues.hideFutureSections &&
                            componentInfoObjects.isInheritedComponentType({
                                inheritedComponentType: child.componentType,
                                baseComponentType: "_sectioningComponent",
                            })
                        ) {
                            childrenToHideChildren.push(child.componentIdx);
                            childIndicesToRender.push(idx);
                        }
                    }

                    const isAnythingChild = !otherChildTypes.some((cType) =>
                        componentInfoObjects.isInheritedComponentType({
                            inheritedComponentType: child.componentType,
                            baseComponentType: cType,
                        }),
                    );

                    if (isAnythingChild) {
                        numAnythingChildren++;
                    }
                }

                return {
                    setValue: {
                        childIndicesToRender,
                        childrenToHideChildren,
                    },
                };
            },
            markStale: () => ({ updateRenderedChildren: true }),
        };

        return stateVariableDefinitions;
    }
}
