import BaseComponent from "./BaseComponent";
import { returnSelectedStyleStateVariableDefinition } from "@doenet/utils";
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
        };
        attributes.layer = {
            createComponentOfType: "integer",
            createStateVariable: "layer",
            defaultValue: 0,
            public: true,
            forRenderer: true,
            attributesForCreatedComponent: { valueOnNaN: "0" },
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

        let labelDefinitions = returnLabelStateVariableDefinitions();

        Object.assign(stateVariableDefinitions, labelDefinitions);

        return stateVariableDefinitions;
    }
}
