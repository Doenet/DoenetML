export function returnStandardTriggeringAttributes(triggerActionOnChange) {
    return {
        triggerWhen: {
            createComponentOfType: "boolean",
            createStateVariable: "triggerWhen",
            defaultValue: false,
            triggerActionOnChange,
        },
        triggerWith: {
            createReferences: true,
        },
        triggerWhenObjectsClicked: {
            createReferences: true,
        },
        triggerWhenObjectsFocused: {
            createReferences: true,
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
                let triggerWith = [];
                if (dependencyValues.triggerWith !== null) {
                    for (let refResolution of dependencyValues.triggerWith) {
                        if (refResolution.unresolvedPath === null) {
                            triggerWith.push({
                                target: refResolution.componentIdx,
                            });
                        }
                    }
                }
                if (dependencyValues.triggerWhenObjectsClicked !== null) {
                    for (let refResolution of dependencyValues.triggerWhenObjectsClicked) {
                        if (refResolution.unresolvedPath === null) {
                            triggerWith.push({
                                target: refResolution.componentIdx,
                                triggeringAction: "click",
                            });
                        }
                    }
                }
                if (dependencyValues.triggerWhenObjectsFocused !== null) {
                    for (let refResolution of dependencyValues.triggerWhenObjectsFocused) {
                        if (refResolution.unresolvedPath === null) {
                            triggerWith.push({
                                target: refResolution.componentIdx,
                                triggeringAction: "focus",
                            });
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
