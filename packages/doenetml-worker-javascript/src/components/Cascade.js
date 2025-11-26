import { SectioningComponent } from "./abstract/SectioningComponent";

export default class Cascade extends SectioningComponent {
    static componentType = "cascade";
    static rendererType = "section";

    static includeBlankStringChildren = false;

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        attributes.hideFutureSections = {
            createComponentOfType: "boolean",
            createStateVariable: "hideFutureSections",
            defaultValue: false,
            public: true,
        };

        attributes.noAutoTitle.defaultValue = true;

        attributes.revealAll = {
            createComponentOfType: "boolean",
            createStateVariable: "revealAllPreliminary",
            defaultValue: false,
        };

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

        stateVariableDefinitions.revealAll = {
            returnDependencies: () => ({
                cascadeAncestor: {
                    dependencyType: "ancestor",
                    componentType: "cascade",
                    variableNames: ["revealAll"],
                },
                revealAllPreliminary: {
                    dependencyType: "stateVariable",
                    variableName: "revealAllPreliminary",
                },
            }),
            definition({ dependencyValues, usedDefault }) {
                let revealAll = false;
                if (!usedDefault.revealAllPreliminary) {
                    revealAll = dependencyValues.revealAllPreliminary;
                } else if (dependencyValues.cascadeAncestor) {
                    revealAll =
                        dependencyValues.cascadeAncestor.stateValues.revealAll;
                } else {
                    dependencyValues.revealAllPreliminary;
                }

                return { setValue: { revealAll } };
            },
        };

        stateVariableDefinitions.childrenToHide = {
            additionalStateVariablesDefined: ["childrenToHideChildren"],
            returnDependencies: () => ({
                hideFutureSections: {
                    dependencyType: "stateVariable",
                    variableName: "hideFutureSections",
                },
                numCompleted: {
                    dependencyType: "stateVariable",
                    variableName: "numCompleted",
                },
                children: {
                    dependencyType: "child",
                    childGroups: ["anything"],
                },
                childrenWithCascadeMessages: {
                    dependencyType: "child",
                    childGroups: ["anything", "cascadeMessages"],
                },
                revealAll: {
                    dependencyType: "stateVariable",
                    variableName: "revealAll",
                },
                hideChildren: {
                    dependencyType: "stateVariable",
                    variableName: "hideChildren",
                },
            }),
            definition({ dependencyValues, componentInfoObjects }) {
                const allContinuationComponentIndices =
                    dependencyValues.childrenWithCascadeMessages
                        .filter(
                            (child) => child.componentType === "cascadeMessage",
                        )
                        .map((child) => child.componentIdx);

                // If `revealAll` is set, then just hide continuation messages
                if (dependencyValues.revealAll) {
                    return {
                        setValue: {
                            childrenToHide: allContinuationComponentIndices,
                            childrenToHideChildren: [],
                        },
                    };
                }

                const childrenToHide = [];
                const childrenToHideChildren = [];

                for (const [
                    idx,
                    child,
                ] of dependencyValues.children.entries()) {
                    if (idx <= dependencyValues.numCompleted) {
                        if (dependencyValues.hideChildren) {
                            childrenToHide.push(child.componentIdx);
                        }
                    } else if (
                        !dependencyValues.hideChildren &&
                        !dependencyValues.hideFutureSections &&
                        componentInfoObjects.isInheritedComponentType({
                            inheritedComponentType: child.componentType,
                            baseComponentType: "_sectioningComponent",
                        })
                    ) {
                        childrenToHideChildren.push(child.componentIdx);
                    } else {
                        childrenToHide.push(child.componentIdx);
                    }
                }

                if (
                    dependencyValues.numCompleted <=
                    dependencyValues.children.length - 2
                ) {
                    // We have at least one child that is hidden due to previous child not completed.
                    // Look for the next `<cascadeMessage>` after the last shown child,
                    // and display that child if found.

                    const lastShownChild =
                        dependencyValues.children[dependencyValues.numCompleted]
                            .componentIdx;
                    const lastShownChildIdx =
                        dependencyValues.childrenWithCascadeMessages.findIndex(
                            (child) => child.componentIdx === lastShownChild,
                        );

                    const nextContinuation =
                        dependencyValues.childrenWithCascadeMessages
                            .slice(lastShownChildIdx + 1)
                            .find(
                                (child) =>
                                    child.componentType === "cascadeMessage",
                            );

                    if (nextContinuation) {
                        // We found a `<cascadeMessage>` child after the last shown child,
                        // so don't hide that one.
                        childrenToHide.push(
                            ...allContinuationComponentIndices.filter(
                                (cIdx) =>
                                    cIdx !== nextContinuation.componentIdx,
                            ),
                        );
                    } else {
                        // No `<cascadeMessage>` child was found after last shown child,
                        // so hide all continuation messages.
                        childrenToHide.push(...allContinuationComponentIndices);
                    }
                } else {
                    // if last child is showing, then hide all continuation messages
                    childrenToHide.push(...allContinuationComponentIndices);
                }

                return {
                    setValue: {
                        childrenToHide,
                        childrenToHideChildren,
                    },
                };
            },
        };

        return stateVariableDefinitions;
    }
}
