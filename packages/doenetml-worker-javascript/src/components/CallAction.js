import { deepClone } from "@doenet/utils";
import {
    moveGraphicalObjectWithAnchorAction,
    returnAnchorAttributes,
    returnAnchorStateVariableDefinition,
} from "../utils/graphical";
import {
    returnLabelAttributes,
    returnLabelStateVariableDefinitions,
} from "../utils/label";
import {
    addStandardTriggeringStateVariableDefinitions,
    returnStandardTriggeringAttributes,
} from "../utils/triggering";
import InlineComponent from "./abstract/InlineComponent";
import { returnSelectedStyleStateVariableDefinition } from "@doenet/utils";

export default class CallAction extends InlineComponent {
    constructor(args) {
        super(args);

        Object.assign(this.actions, {
            callAction: this.callAction.bind(this),
            callActionIfTriggerNewlyTrue:
                this.callActionIfTriggerNewlyTrue.bind(this),
            moveButton: this.moveButton.bind(this),
        });
    }
    static componentType = "callAction";
    static rendererType = "button";

    static keepChildrenSerialized({
        serializedComponent,
        componentInfoObjects,
    }) {
        if (serializedComponent.children === undefined) {
            return [];
        } else {
            let keepSerializedInds = [];
            for (let [ind, child] of serializedComponent.children.entries()) {
                if (
                    !componentInfoObjects.componentIsSpecifiedType(
                        child,
                        "label",
                    )
                ) {
                    keepSerializedInds.push(ind);
                }
            }

            return keepSerializedInds;
        }
    }

    static createAttributesObject() {
        let attributes = super.createAttributesObject();
        // attributes.width = {default: 300};
        // attributes.height = {default: 50};

        attributes.target = {
            createReferences: true,
        };

        attributes.actionName = {
            createComponentOfType: "text",
            createStateVariable: "actionName",
            defaultValue: null,
            public: true,
        };

        attributes.draggable = {
            createComponentOfType: "boolean",
            createStateVariable: "draggable",
            defaultValue: true,
            public: true,
            forRenderer: true,
        };

        Object.assign(attributes, returnLabelAttributes());

        Object.assign(attributes, returnAnchorAttributes());

        let triggerAttributes = returnStandardTriggeringAttributes(
            "callActionIfTriggerNewlyTrue",
        );

        Object.assign(attributes, triggerAttributes);

        attributes.numbers = {
            createComponentOfType: "numberList",
        };

        attributes.number = {
            createComponentOfType: "number",
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
            "callAction",
        );

        let labelDefinitions = returnLabelStateVariableDefinitions();
        Object.assign(stateVariableDefinitions, labelDefinitions);

        let anchorDefinition = returnAnchorStateVariableDefinition();
        Object.assign(stateVariableDefinitions, anchorDefinition);

        stateVariableDefinitions.clickAction = {
            forRenderer: true,
            returnDependencies: () => ({}),
            definition: () => ({ setValue: { clickAction: "callAction" } }),
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

                    if (target.unresolvedPath == null) {
                        return {
                            setValue: {
                                targetComponentIdx: target.componentIdx,
                                unresolvedPath: target.unresolvedPath,
                            },
                        };
                    }
                }
                return {
                    setValue: {
                        targetComponentIdx: null,
                        unresolvedPath: null,
                    },
                };
            },
        };

        return stateVariableDefinitions;
    }

    async callAction({
        actionId,
        sourceInformation = {},
        skipRendererUpdate = false,
    }) {
        let targetIdx = await this.stateValues.targetComponentIdx;
        let actionName = await this.stateValues.actionName;
        if (targetIdx != null && actionName != null) {
            let args = { sourceInformation, skipRendererUpdate: true };
            if (this.serializedChildren.length > 0) {
                args.serializedComponents = deepClone(this.serializedChildren);
            }
            if (this.attributes.number) {
                args.number =
                    await this.attributes.number.component.stateValues.value;
            }
            if (this.attributes.numbers) {
                args.numbers =
                    await this.attributes.numbers.component.stateValues.numbers;
            }

            if (actionId) {
                args.actionId = actionId;
            }

            await this.coreFunctions.performAction({
                componentIdx: targetIdx,
                actionName,
                args,
                event: {
                    verb: "selected",
                    object: {
                        componentIdx: this.componentIdx,
                        componentType: this.componentType,
                    },
                },
                caseInsensitiveMatch: true,
            });

            await this.coreFunctions.triggerChainedActions({
                componentIdx: this.componentIdx,
                actionId,
                sourceInformation,
                skipRendererUpdate,
            });
        }
    }

    async callActionIfTriggerNewlyTrue({
        stateValues,
        previousValues,
        actionId,
    }) {
        // Note: explicitly test if previous value is false
        // so don't trigger on initialization when it is undefined
        if (
            stateValues.triggerWhen &&
            previousValues.triggerWhen === false &&
            !(await this.stateValues.insideTriggerSet)
        ) {
            return await this.callAction({ actionId });
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
