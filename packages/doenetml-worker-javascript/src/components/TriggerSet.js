import {
    moveGraphicalObjectWithAnchorAction,
    returnAnchorAttributes,
    returnAnchorStateVariableDefinition,
} from "../utils/graphical";
import {
    returnLabelAttributes,
    returnLabelStateVariableDefinitions,
    returnRenderOnlyLabelChildDefinitions,
} from "../utils/label";
import {
    addStandardTriggeringStateVariableDefinitions,
    returnStandardTriggeringAttributes,
} from "../utils/triggering";
import InlineComponent from "./abstract/InlineComponent";
import { returnSelectedStyleStateVariableDefinition } from "@doenet/utils";

export default class triggerSet extends InlineComponent {
    constructor(args) {
        super(args);

        Object.assign(this.actions, {
            triggerActions: this.triggerActions.bind(this),
            triggerActionsIfTriggerNewlyTrue:
                this.triggerActionsIfTriggerNewlyTrue.bind(this),
            moveButton: this.moveButton.bind(this),
        });
    }
    static componentType = "triggerSet";

    static componentDocs = {
        summary:
            "Groups a set of `<updateValue>` or `<callAction>` components which share a single trigger condition",
    };
    static rendererType = "button";
    static renderChildren = true;

    static createAttributesObject() {
        let attributes = super.createAttributesObject();
        // attributes.width = {default: 300};
        // attributes.height = {default: 50};

        attributes.draggable = {
            description:
                "Whether the trigger set's button can be dragged on a graph.",
            createComponentOfType: "boolean",
            createStateVariable: "draggable",
            defaultValue: true,
            public: true,
            forRenderer: true,
        };

        Object.assign(attributes, returnAnchorAttributes());

        Object.assign(attributes, returnLabelAttributes());

        let triggerAttributes = returnStandardTriggeringAttributes(
            "triggerActionsIfTriggerNewlyTrue",
        );

        Object.assign(attributes, triggerAttributes);

        return attributes;
    }

    static returnChildGroups() {
        return [
            {
                group: "updateValuesCallActions",
                componentTypes: ["updateValue", "callAction"],
            },
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
            "triggerActions",
        );

        let labelDefinitions = returnLabelStateVariableDefinitions();
        Object.assign(stateVariableDefinitions, labelDefinitions);
        Object.assign(
            stateVariableDefinitions,
            returnRenderOnlyLabelChildDefinitions(),
        );

        let anchorDefinition = returnAnchorStateVariableDefinition();
        Object.assign(stateVariableDefinitions, anchorDefinition);

        stateVariableDefinitions.clickAction = {
            forRenderer: true,
            returnDependencies: () => ({}),
            definition: () => ({ setValue: { clickAction: "triggerActions" } }),
        };

        stateVariableDefinitions.updateValueAndActionsToTrigger = {
            returnDependencies: () => ({
                updateValueAndCallActionChildren: {
                    dependencyType: "child",
                    childGroups: ["updateValuesCallActions"],
                    variableNames: ["disabled"],
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        updateValueAndActionsToTrigger:
                            dependencyValues.updateValueAndCallActionChildren,
                    },
                };
            },
        };

        return stateVariableDefinitions;
    }

    async triggerActions({
        actionId,
        sourceInformation = {},
        skipRendererUpdate = false,
    }) {
        // A disabled trigger set runs none of its children, whether its button
        // was clicked or it was triggered, and triggers none of the actions
        // chained to it. In read-only mode, where everything is disabled, the
        // actions still run as before: updates are blocked there anyway, and
        // the actions read-only mode allows, such as revealing a hint or
        // changing a page, still go through.
        if (!this.flags.readOnly && (await this.stateValues.disabled)) {
            return;
        }

        // Which children are disabled is decided before any of them runs, so
        // that a child that disables this trigger set, or a later sibling,
        // does not stop the rest partway. A disabled child is skipped while
        // its siblings still run; the others are told not to check again.
        const childrenToRun = (
            await this.stateValues.updateValueAndActionsToTrigger
        ).filter((child) => this.flags.readOnly || !child.stateValues.disabled);

        for (let child of childrenToRun) {
            if (
                this.componentInfoObjects.isInheritedComponentType({
                    inheritedComponentType: child.componentType,
                    baseComponentType: "updateValue",
                })
            ) {
                await this.coreFunctions.performAction({
                    componentIdx: child.componentIdx,
                    actionName: "updateValue",
                    args: {
                        actionId,
                        sourceInformation,
                        skipRendererUpdate: true,
                        disabledCheckedByTriggerSet: true,
                    },
                });
            } else if (
                this.componentInfoObjects.isInheritedComponentType({
                    inheritedComponentType: child.componentType,
                    baseComponentType: "callAction",
                })
            ) {
                await this.coreFunctions.performAction({
                    componentIdx: child.componentIdx,
                    actionName: "callAction",
                    args: {
                        actionId,
                        sourceInformation,
                        skipRendererUpdate: true,
                        disabledCheckedByTriggerSet: true,
                    },
                });
            }
        }

        return await this.coreFunctions.triggerChainedActions({
            componentIdx: this.componentIdx,
            actionId,
            sourceInformation,
            skipRendererUpdate,
        });
    }

    async triggerActionsIfTriggerNewlyTrue({
        stateValues,
        previousValues,
        actionId,
    }) {
        // Note: explicitly test if previous value is false
        // so don't trigger on initialization when it is undefined
        if (stateValues.triggerWhen && previousValues.triggerWhen === false) {
            return await this.triggerActions({
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
            component: this,
            componentType: this.componentType,
            coreFunctions: this.coreFunctions,
        });
    }
}
