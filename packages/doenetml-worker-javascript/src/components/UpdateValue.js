import {
    moveGraphicalObjectWithAnchorAction,
    returnAnchorAttributes,
    returnAnchorStateVariableDefinition,
} from "../utils/graphical";
import {
    returnLabelAttributes,
    returnLabelStateVariableDefinitions,
} from "../utils/label";
import { normalizeMathExpression } from "@doenet/utils";
import {
    addStandardTriggeringStateVariableDefinitions,
    returnStandardTriggeringAttributes,
} from "../utils/triggering";
import InlineComponent from "./abstract/InlineComponent";
import { returnSelectedStyleStateVariableDefinition } from "@doenet/utils";

export default class UpdateValue extends InlineComponent {
    constructor(args) {
        super(args);

        Object.assign(this.actions, {
            updateValue: this.updateValue.bind(this),
            updateValueIfTriggerNewlyTrue:
                this.updateValueIfTriggerNewlyTrue.bind(this),
            moveButton: this.moveButton.bind(this),
        });
    }
    static componentType = "updateValue";
    static rendererType = "button";

    static createAttributesObject() {
        let attributes = super.createAttributesObject();
        // attributes.width = {default: 300};
        // attributes.height = {default: 50};

        attributes.target = {
            createReferences: true,
        };

        attributes.type = {
            createPrimitiveOfType: "string",
            createStateVariable: "type",
            defaultPrimitiveValue: "math",
            toLowerCase: true,
            validValues: ["math", "number", "boolean", "text"],
        };

        attributes.newValue = {
            createComponentOfType: "_componentWithSelectableType",
        };

        attributes.draggable = {
            createComponentOfType: "boolean",
            createStateVariable: "draggable",
            defaultValue: true,
            public: true,
            forRenderer: true,
        };

        Object.assign(attributes, returnAnchorAttributes());

        Object.assign(attributes, returnLabelAttributes());

        let triggerAttributes = returnStandardTriggeringAttributes(
            "updateValueIfTriggerNewlyTrue",
        );

        Object.assign(attributes, triggerAttributes);

        // for newValue with type==="math"
        // let simplify="" or simplify="true" be full simplify
        attributes.simplify = {
            createComponentOfType: "text",
            createStateVariable: "simplify",
            defaultValue: "none",
            public: true,
            toLowerCase: true,
            valueForTrue: "full",
            valueForFalse: "none",
            validValues: [
                "none",
                "full",
                "numbers",
                "numberspreserveorder",
                "normalizeorder",
            ],
        };

        return attributes;
    }

    static returnChildGroups() {
        return [
            {
                group: "labels",
                componentTypes: ["label"],
            },
        ];
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        let selectedStyleDefinition =
            returnSelectedStyleStateVariableDefinition();

        Object.assign(stateVariableDefinitions, selectedStyleDefinition);

        addStandardTriggeringStateVariableDefinitions(
            stateVariableDefinitions,
            "updateValue",
        );

        let labelDefinitions = returnLabelStateVariableDefinitions();
        Object.assign(stateVariableDefinitions, labelDefinitions);

        let anchorDefinition = returnAnchorStateVariableDefinition();
        Object.assign(stateVariableDefinitions, anchorDefinition);

        stateVariableDefinitions.clickAction = {
            forRenderer: true,
            returnDependencies: () => ({}),
            definition: () => ({ setValue: { clickAction: "updateValue" } }),
        };

        stateVariableDefinitions.targetComponentIdx = {
            additionalStateVariablesDefined: ["unresolvedPath"],
            returnDependencies: () => ({
                target: {
                    dependencyType: "attributeRefResolutions",
                    attributeName: "target",
                },
            }),
            definition({ dependencyValues }) {
                if (dependencyValues.target?.length === 1) {
                    const target = dependencyValues.target[0];

                    return {
                        setValue: {
                            targetComponentIdx: target.componentIdx,
                            unresolvedPath: target.unresolvedPath,
                        },
                    };
                } else {
                    return {
                        setValue: {
                            targetComponentIdx: null,
                            unresolvedPath: null,
                        },
                    };
                }
            },
        };

        stateVariableDefinitions.targetComponent = {
            stateVariablesDeterminingDependencies: ["targetComponentIdx"],
            returnDependencies({ stateValues }) {
                if (stateValues.targetComponentIdx != null) {
                    return {
                        targetComponent: {
                            dependencyType: "componentIdentity",
                            componentIdx: stateValues.targetComponentIdx,
                        },
                    };
                } else {
                    return {};
                }
            },
            definition: function ({ dependencyValues }) {
                let targetComponent = null;
                if (dependencyValues.targetComponent) {
                    targetComponent = dependencyValues.targetComponent;
                }

                return {
                    setValue: { targetComponent },
                };
            },
        };

        stateVariableDefinitions.targetIdentities = {
            stateVariablesDeterminingDependencies: ["targetComponent"],
            returnDependencies: function ({
                stateValues,
                componentInfoObjects,
            }) {
                let dependencies = {};

                if (stateValues.targetComponent !== null) {
                    if (
                        componentInfoObjects.isCompositeComponent({
                            componentType:
                                stateValues.targetComponent.componentType,
                            includeNonStandard: false,
                        })
                    ) {
                        dependencies.targets = {
                            dependencyType: "replacement",
                            compositeIdx:
                                stateValues.targetComponent.componentIdx,
                            recursive: true,
                        };
                    } else {
                        dependencies.targets = {
                            dependencyType: "stateVariable",
                            variableName: "targetComponent",
                        };
                    }
                }
                return dependencies;
            },
            definition({ dependencyValues }) {
                let targetIdentities = null;
                if (dependencyValues.targets) {
                    targetIdentities = dependencyValues.targets;
                    if (!Array.isArray(targetIdentities)) {
                        targetIdentities = [targetIdentities];
                    }
                }
                let warnings = [];
                if (
                    targetIdentities === null ||
                    targetIdentities.length === 0
                ) {
                    warnings.push({
                        message:
                            "Invalid target for <updateValue>: cannot find target.",
                        level: 1,
                    });
                }

                return {
                    setValue: { targetIdentities },
                    sendWarnings: warnings,
                };
            },
        };

        stateVariableDefinitions.targets = {
            stateVariablesDeterminingDependencies: [
                "targetIdentities",
                "unresolvedPath",
            ],
            returnDependencies: function ({ stateValues }) {
                let dependencies = {
                    targetIdentities: {
                        dependencyType: "stateVariable",
                        variableName: "targetIdentities",
                    },
                    unresolvedPath: {
                        dependencyType: "stateVariable",
                        variableName: "unresolvedPath",
                    },
                };

                if (stateValues.targetIdentities !== null) {
                    for (let [
                        ind,
                        target,
                    ] of stateValues.targetIdentities.entries()) {
                        let thisTarget;

                        if (stateValues.unresolvedPath) {
                            let propIndex = stateValues.propIndex;
                            if (propIndex) {
                                // make propIndex be a shallow copy
                                // so that can detect if it changed
                                // when update dependencies
                                propIndex = [...propIndex];
                            }

                            thisTarget = {
                                dependencyType:
                                    "stateVariableFromUnresolvedPath",
                                componentIdx: target.componentIdx,
                                unresolvedPath: stateValues.unresolvedPath,
                                returnAsComponentObject: true,
                                variablesOptional: true,
                                caseInsensitiveVariableMatch: true,
                                publicStateVariablesOnly: true,
                                useMappedVariableNames: true,
                            };
                        } else {
                            thisTarget = {
                                dependencyType: "stateVariable",
                                componentIdx: target.componentIdx,
                                variableName: "value",
                                returnAsComponentObject: true,
                                variablesOptional: true,
                            };
                        }

                        dependencies["target" + ind] = thisTarget;
                    }
                }

                return dependencies;
            },
            definition({ dependencyValues }) {
                let targets = null;
                let warnings = [];

                if (dependencyValues.targetIdentities !== null) {
                    targets = [];

                    for (let ind in dependencyValues.targetIdentities) {
                        let target = dependencyValues["target" + ind];
                        if (target == null) {
                            let message =
                                "Invalid target for <updateValue>: cannot find target.";

                            warnings.push({
                                message,
                                level: 1,
                            });
                            continue;
                        }
                        targets.push(target);
                        if (Object.keys(target.stateValues)[0] === undefined) {
                            if (dependencyValues.unresolvedPath) {
                                let prop =
                                    dependencyValues.unresolvedPath[0].name;
                                if (
                                    dependencyValues.unresolvedPath[0].index
                                        .length > 0
                                ) {
                                    for (const idx of dependencyValues
                                        .unresolvedPath[0].index) {
                                        prop += `[idx]`;
                                    }
                                }
                                let message = `Invalid target for <updateValue>: cannot find a state variable named "${prop}" on a <${target.componentType}>.`;
                                warnings.push({
                                    message,
                                    level: 1,
                                });
                            } else {
                                let message = `Invalid target for <updateValue>: cannot find a state variable named "value" on a <${target.componentType}>.`;
                                warnings.push({
                                    message,
                                    level: 1,
                                });
                            }
                        }
                    }
                }

                return { setValue: { targets }, sendWarnings: warnings };
            },
        };

        stateVariableDefinitions.newValue = {
            returnDependencies: () => ({
                newValueAttr: {
                    dependencyType: "attributeComponent",
                    attributeName: "newValue",
                    variableNames: ["value"],
                },
                type: {
                    dependencyType: "stateVariable",
                    variableName: "type",
                },
                simplify: {
                    dependencyType: "stateVariable",
                    variableName: "simplify",
                },
            }),
            definition: function ({ dependencyValues }) {
                if (dependencyValues.newValueAttr === null) {
                    return {
                        setValue: {
                            newValue: null,
                        },
                    };
                }

                let newValue = dependencyValues.newValueAttr.stateValues.value;

                if (dependencyValues.type === "math") {
                    newValue = normalizeMathExpression({
                        value: newValue,
                        simplify: dependencyValues.simplify,
                    });
                }

                return {
                    setValue: { newValue },
                };
            },
        };

        return stateVariableDefinitions;
    }

    async updateValue({
        actionId,
        sourceInformation = {},
        skipRendererUpdate = false,
    }) {
        let targets = await this.stateValues.targets;
        let newValue = await this.stateValues.newValue;
        if (targets === null || newValue === null) {
            return;
        }

        let updateInstructions = [];

        for (let target of targets) {
            let stateVariable = Object.keys(target.stateValues)[0];
            if (stateVariable === undefined) {
                continue;
            }

            updateInstructions.push({
                updateType: "updateValue",
                componentIdx: target.componentIdx,
                stateVariable,
                value: newValue,
            });
        }

        await this.coreFunctions.performUpdate({
            updateInstructions,
            actionId,
            sourceInformation,
            skipRendererUpdate: true,
            event: {
                verb: "selected",
                object: {
                    componentIdx: this.componentIdx,
                    componentType: this.componentType,
                },
                result: {
                    response: newValue,
                    responseText: newValue.toString(),
                },
            },
        });

        return await this.coreFunctions.triggerChainedActions({
            componentIdx: this.componentIdx,
            actionId,
            sourceInformation,
            skipRendererUpdate,
        });
    }

    async updateValueIfTriggerNewlyTrue({
        stateValues,
        previousValues,
        actionId,
    }) {
        // Note: explicitly test if previous value is false
        // so don't trigger on initialization when it is undefined
        if (
            (await stateValues.triggerWhen) &&
            previousValues.triggerWhen === false &&
            !(await this.stateValues.insideTriggerSet)
        ) {
            return await this.updateValue({
                actionId,
                skipRendererUpdate: true,
            });
        }
    }

    async moveButton({
        x,
        y,
        z,
        transient,
        actionId,
        sourceInformation = {},
        skipRendererUpdate = false,
    }) {
        return await moveGraphicalObjectWithAnchorAction({
            x,
            y,
            z,
            transient,
            actionId,
            sourceInformation,
            skipRendererUpdate,
            componentIdx: this.componentIdx,
            componentType: this.componentType,
            coreFunctions: this.coreFunctions,
        });
    }
}
