import { SectioningComponent } from "./abstract/SectioningComponent";

export default class Cascade extends SectioningComponent {
    static componentType = "cascade";

    static componentDocs = {
        summary: "Sectional component that reveals its children step-by-step",
    };
    static rendererType = "section";

    static includeBlankStringChildren = false;

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        attributes.hideFutureSections = {
            createComponentOfType: "boolean",
            createStateVariable: "hideFutureSections",
            defaultValue: false,
            public: true,
            description:
                "Whether to hide later cascade sections until previous ones are completed.",
        };

        attributes.noAutoTitle.defaultValue = true;

        // Keep the explicit attribute value separate so the effective state
        // variable can inherit from the parent when the attribute is omitted.
        // Mark it non-public so it doesn't appear in the schema or as a
        // shadowable property.
        attributes.asList.createStateVariable = "asListPreliminary";
        attributes.asList.public = false;

        attributes.revealAll = {
            createComponentOfType: "boolean",
            createStateVariable: "revealAllPreliminary",
            defaultValue: false,
            description:
                "Whether all cascade entries should be revealed regardless of progress.",
        };

        attributes.boxAll = {
            createComponentOfType: "boolean",
            createStateVariable: "boxAll",
            defaultValue: false,
            description:
                "Whether to draw boxes around all cascade entries regardless of progress.",
        };

        return attributes;
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        // Cascade is a structural container rather than a numbered item, even
        // when it sits inside a list-producing parent such as <problems>.
        stateVariableDefinitions.isListItem = {
            forRenderer: true,
            returnDependencies: () => ({}),
            definition: () => ({ setValue: { isListItem: false } }),
        };

        // Make cascade transparent for `asList` propagation unless the author
        // explicitly sets `asList` on the cascade itself.
        stateVariableDefinitions.asList = {
            description: "Whether to render this section's children as a list.",
            public: true,
            forRenderer: true,
            shadowingInstructions: {
                createComponentOfType: "boolean",
            },
            returnDependencies: () => ({
                asListPreliminary: {
                    dependencyType: "stateVariable",
                    variableName: "asListPreliminary",
                },
                parentAsList: {
                    dependencyType: "parentStateVariable",
                    variableName: "asList",
                },
            }),
            definition({ dependencyValues, usedDefault }) {
                let asList = dependencyValues.parentAsList;
                if (!usedDefault.asListPreliminary) {
                    asList = dependencyValues.asListPreliminary;
                }

                return { setValue: { asList: Boolean(asList) } };
            },
        };

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
            description: "The number of cascade sections currently completed.",
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

        /**
         * A cascade shows one continuation message at a time, chosen here.
         *
         * There are two places an author can put one. A `<cascadeMessage>` child
         * of the cascade itself stands between two steps, and the cascade shows
         * the next such message after the last shown step — one trailing message
         * therefore serves every gap. A `<cascadeMessage>` nested inside a step
         * belongs to that step alone, and a step's own message is the more
         * specific of the two, so when the next step has one it wins and every
         * message of the cascade's own is hidden for as long as it shows.
         *
         * `sectionToShowCascadeMessage` names the step whose nested messages are
         * shown (`null` for none); each section compares it against itself in
         * `showCascadeMessage`. Only the *next* step is ever named, so a step
         * further down the cascade shows nothing but its number and title, the
         * same as a step with no message at all. A nested `<cascade>` is a step
         * like any other, and one with message children of its own is nominated
         * like any other — it then chooses among them here in its own right,
         * which is the single message shown.
         *
         * Note that a nested message is the only kind that survives `asList`
         * (`<problems>` and friends): `childIndicesToRender` there renders only a
         * section's sectioning children, so a message child of the cascade is
         * dropped before it can be shown.
         */
        stateVariableDefinitions.childrenToHide = {
            additionalStateVariablesDefined: [
                "childrenToHideChildren",
                "sectionToShowCascadeMessage",
            ],
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
                    variableNames: ["hasCascadeMessageChild"],
                    variablesOptional: true,
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
                showCascadeMessage: {
                    dependencyType: "stateVariable",
                    variableName: "showCascadeMessage",
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
                            sectionToShowCascadeMessage: null,
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

                // The next step is the first one held back. It shows its own
                // messages if it has any, and then the cascade's own messages
                // all stay hidden.
                const nextStep =
                    dependencyValues.children[
                        dependencyValues.numCompleted + 1
                    ];
                const sectionToShowCascadeMessage =
                    nextStep &&
                    childrenToHideChildren.includes(nextStep.componentIdx) &&
                    nextStep.stateValues?.hasCascadeMessageChild
                        ? nextStep.componentIdx
                        : null;

                // The one message of the cascade's own to show, if any: the next
                // `<cascadeMessage>` after the last shown child. There is none
                // once the next step is showing a message of its own, and none
                // once the last child is showing, since then no child is held
                // back for a message to stand in for.
                //
                // A cascade that is itself a step of an enclosing cascade has a
                // third way to have none: `hideChildren` says the enclosing
                // cascade is holding it back, and then it speaks only while it
                // is the step that cascade nominates. A cascade further down the
                // enclosing cascade shows nothing at all, its own messages
                // included, exactly as a plain step further down does.
                let continuationToShow = null;

                if (
                    sectionToShowCascadeMessage === null &&
                    (!dependencyValues.hideChildren ||
                        dependencyValues.showCascadeMessage) &&
                    dependencyValues.numCompleted <=
                        dependencyValues.children.length - 2
                ) {
                    const lastShownChild =
                        dependencyValues.children[dependencyValues.numCompleted]
                            .componentIdx;
                    const lastShownChildIdx =
                        dependencyValues.childrenWithCascadeMessages.findIndex(
                            (child) => child.componentIdx === lastShownChild,
                        );

                    continuationToShow =
                        dependencyValues.childrenWithCascadeMessages
                            .slice(lastShownChildIdx + 1)
                            .find(
                                (child) =>
                                    child.componentType === "cascadeMessage",
                            )?.componentIdx ?? null;
                }

                // Hide every message of the cascade's own but that one. (With
                // none to show, `null` matches no child and all are hidden.)
                childrenToHide.push(
                    ...allContinuationComponentIndices.filter(
                        (cIdx) => cIdx !== continuationToShow,
                    ),
                );

                return {
                    setValue: {
                        childrenToHide,
                        childrenToHideChildren,
                        sectionToShowCascadeMessage,
                    },
                };
            },
        };

        return stateVariableDefinitions;
    }
}
