import BaseComponent from "./BaseComponent";
import {
    returnSelectedStyleStateVariableDefinition,
    styleOverrideAttributes,
} from "@doenet/utils";
import {
    returnLabelAttributes,
    returnLabelStateVariableDefinitions,
} from "../../utils/label";

export default class GraphicalComponent extends BaseComponent {
    static componentType = "_graphical";

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        Object.assign(attributes, returnLabelAttributes());

        attributes.applyStyleToLabel = {
            createComponentOfType: "boolean",
            createStateVariable: "applyStyleToLabel",
            defaultValue: false,
            public: true,
            forRenderer: true,
            description:
                "Whether to apply this component's selected style to its label.",
        };
        attributes.layer = {
            createComponentOfType: "integer",
            createStateVariable: "layer",
            defaultValue: 0,
            public: true,
            forRenderer: true,
            attributesForCreatedComponent: { valueOnNaN: "0" },
            description:
                "Z-order layer index used to stack graphical components (higher values render on top).",
        };

        // Per-component non-color style overrides (e.g. markerStyle, lineWidth).
        // Colors stay <styleDefinition>-only so per-styleNumber WCAG contrast
        // diagnostics remain authoritative.
        for (const styleAttr in styleOverrideAttributes) {
            attributes[styleAttr] = {
                createComponentOfType:
                    styleOverrideAttributes[styleAttr].componentType,
                description: styleOverrideAttributes[styleAttr].description,
            };
        }

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
            returnSelectedStyleStateVariableDefinition({
                overrideAttributeNames: Object.keys(styleOverrideAttributes),
            });

        Object.assign(stateVariableDefinitions, selectedStyleDefinition);

        let labelDefinitions = returnLabelStateVariableDefinitions();

        Object.assign(stateVariableDefinitions, labelDefinitions);

        return stateVariableDefinitions;
    }
}
