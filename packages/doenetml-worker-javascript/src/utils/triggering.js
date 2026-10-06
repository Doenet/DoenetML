import { targetIdxOfRefResolution } from "./refTargets";

export function returnStandardTriggeringAttributes(triggerActionOnChange) {
    return {
        triggerWhen: {
            createComponentOfType: "boolean",
            createStateVariable: "triggerWhen",
            defaultValue: false,
            triggerActionOnChange,
            groupName: "triggering",
            description:
                "Boolean expression that fires the action whenever it transitions to true.",
        },
        triggerWith: {
            createReferences: true,
            groupName: "triggering",
            description:
                "References to components whose value changes should fire this action.",
        },
        triggerWhenObjectsClicked: {
            createReferences: true,
            groupName: "triggering",
            description:
                "References to components whose click events should fire this action.",
        },
        triggerWhenObjectsFocused: {
            createReferences: true,
            groupName: "triggering",
            description:
                "References to components whose focus events should fire this action.",
        },
    };
}

export function addStandardTriggeringStateVariableDefinitions(
    stateVariableDefinitions,
    triggeredAction,
) {
    stateVariableDefinitions.insideTriggerSet = {
        returnDependencies: () => ({
            parentTriggerSet: {
                dependencyType: "parentStateVariable",
                parentComponentType: "triggerSet",
                variableName: "updateValueAndActionsToTrigger",
            },
        }),
        definition({ dependencyValues }) {
            return {
                setValue: {
                    insideTriggerSet:
                        dependencyValues.parentTriggerSet !== null,
                },
            };
        },
    };

    stateVariableDefinitions.triggerWith = {
        returnDependencies: () => ({
            triggerWith: {
                dependencyType: "attributeRefResolutions",
                attributeName: "triggerWith",
            },
            triggerWhenObjectsClicked: {
                dependencyType: "attributeRefResolutions",
                attributeName: "triggerWhenObjectsClicked",
            },
            triggerWhenObjectsFocused: {
                dependencyType: "attributeRefResolutions",
                attributeName: "triggerWhenObjectsFocused",
            },
            triggerWhen: {
                dependencyType: "attributeComponent",
                attributeName: "triggerWhen",
            },
            insideTriggerSet: {
                dependencyType: "stateVariable",
                variableName: "insideTriggerSet",
            },
        }),
        definition({ dependencyValues }) {
            if (
                dependencyValues.triggerWhen ||
                dependencyValues.insideTriggerSet
            ) {
                return { setValue: { triggerWith: null } };
            } else {
                // A reference to one entry of a list component (`$pl[2]`)
                // names the entry (`targetIdxOfRefResolution`).
                let triggerWith = [];
                for (const [attributeName, triggeringAction] of [
                    ["triggerWith", undefined],
                    ["triggerWhenObjectsClicked", "click"],
                    ["triggerWhenObjectsFocused", "focus"],
                ]) {
                    for (const refResolution of dependencyValues[
                        attributeName
                    ] ?? []) {
                        const target = targetIdxOfRefResolution(refResolution);
                        if (target !== null) {
                            triggerWith.push(
                                triggeringAction === undefined
                                    ? { target }
                                    : { target, triggeringAction },
                            );
                        }
                    }
                }

                if (triggerWith.length === 0) {
                    triggerWith = null;
                }

                return { setValue: { triggerWith } };
            }
        },
    };

    stateVariableDefinitions.triggerWithTargetIds = {
        chainActionOnActionOfStateVariableTargets: {
            triggeredAction,
        },
        returnDependencies: () => ({
            triggerWith: {
                dependencyType: "stateVariable",
                variableName: "triggerWith",
            },
        }),
        definition({ dependencyValues }) {
            let triggerWithTargetIds = [];

            if (dependencyValues.triggerWith) {
                for (let targetObj of dependencyValues.triggerWith) {
                    let id = targetObj.target;

                    if (targetObj.triggeringAction) {
                        id += "|" + targetObj.triggeringAction;
                    }

                    if (!triggerWithTargetIds.includes(id)) {
                        triggerWithTargetIds.push(id);
                    }
                }
            }

            return { setValue: { triggerWithTargetIds } };
        },
        markStale() {
            return { updateActionChaining: true };
        },
    };

    let originalHiddenReturnDependencies =
        stateVariableDefinitions.hidden.returnDependencies;
    let originalHiddenDefinition = stateVariableDefinitions.hidden.definition;

    stateVariableDefinitions.hidden.returnDependencies = function (args) {
        let dependencies = originalHiddenReturnDependencies(args);
        dependencies.triggerWhen = {
            dependencyType: "attributeComponent",
            attributeName: "triggerWhen",
        };
        dependencies.triggerWith = {
            dependencyType: "stateVariable",
            variableName: "triggerWith",
        };
        dependencies.insideTriggerSet = {
            dependencyType: "stateVariable",
            variableName: "insideTriggerSet",
        };
        return dependencies;
    };

    stateVariableDefinitions.hidden.definition = function (args) {
        if (
            args.dependencyValues.triggerWhen ||
            args.dependencyValues.triggerWith ||
            args.dependencyValues.insideTriggerSet
        ) {
            return { setValue: { hidden: true } };
        } else {
            return originalHiddenDefinition(args);
        }
    };
}

/**
 * Add the `clickTarget` state variable, which tells the renderer whether
 * clicking this component fires an action. It is true when another
 * component lists this one in `triggerWhenObjectsClicked` and that
 * component acts on clicks, or when this component is a bare reference
 * (such as `$t`) to a component that is a click target, since clicking the
 * reference fires the same actions.
 */
export function addClickTargetStateVariableDefinition(
    stateVariableDefinitions,
) {
    stateVariableDefinitions.componentsReferencingForClick = {
        returnDependencies: () => ({
            componentsReferencing: {
                dependencyType: "componentsReferencingAttribute",
                attributeName: "triggerWhenObjectsClicked",
            },
        }),
        definition({ dependencyValues }) {
            return {
                setValue: {
                    componentsReferencingForClick:
                        dependencyValues.componentsReferencing ?? [],
                },
            };
        },
    };

    stateVariableDefinitions.clickTarget = {
        forRenderer: true,
        stateVariablesDeterminingDependencies: [
            "componentsReferencingForClick",
        ],
        returnDependencies({ stateValues }) {
            const dependencies = {
                shadowSourceClickTarget: {
                    dependencyType: "shadowSourceStateVariable",
                    variableName: "clickTarget",
                    onlyBareReferences: true,
                },
            };

            // A referencing component ignores its own triggering attributes
            // when it has `triggerWhen` or is inside a `<triggerSet>`.
            for (const [
                ind,
                comp,
            ] of stateValues.componentsReferencingForClick.entries()) {
                dependencies[`referencerTriggerWhen${ind}`] = {
                    dependencyType: "attributeComponent",
                    parentIdx: comp.componentIdx,
                    attributeName: "triggerWhen",
                };
                dependencies[`referencerTriggerSet${ind}`] = {
                    dependencyType: "parentIdentity",
                    childIdx: comp.componentIdx,
                    parentComponentType: "triggerSet",
                };
            }

            return dependencies;
        },
        definition({ dependencyValues }) {
            let clickTarget = dependencyValues.shadowSourceClickTarget === true;
            for (
                let ind = 0;
                `referencerTriggerSet${ind}` in dependencyValues;
                ind++
            ) {
                if (
                    !dependencyValues[`referencerTriggerWhen${ind}`] &&
                    !dependencyValues[`referencerTriggerSet${ind}`]
                ) {
                    clickTarget = true;
                }
            }

            return { setValue: { clickTarget } };
        },
    };
}
