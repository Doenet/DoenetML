import {
    moveGraphicalObjectWithAnchorAction,
    returnAnchorAttributes,
    returnAnchorStateVariableDefinition,
} from "../utils/graphical";
import { returnWrapNonLabelsDescriptionsSugarFunction } from "../utils/label";
import { returnTextPieceStateVariableDefinitions } from "../utils/text";
import Input from "./abstract/Input";
import {
    defineSubmitAnswerExternalAction,
    inputUpdateImmediateValue,
    inputUpdateValue,
    returnImmediateValueStateVariableDefinition,
    returnInputValueChangedStateVariableDefinitions,
} from "../utils/input";

export default class Textinput extends Input {
    constructor(args) {
        super(args);

        Object.assign(this.actions, {
            updateImmediateValue: inputUpdateImmediateValue.bind(this),
            updateValue: inputUpdateValue.bind(this),
            moveInput: this.moveInput.bind(this),
        });

        defineSubmitAnswerExternalAction(this);
    }
    static componentType = "textInput";

    static componentDocs = {
        summary: "An interactive text input",
    };
    static variableForImplicitProp = "value";

    static processWhenJustUpdatedForNewComponent = true;

    static createAttributesObject() {
        let attributes = super.createAttributesObject();
        attributes.prefill = {
            description:
                "Initial text shown in the input before the user types.",
            createComponentOfType: "text",
            createStateVariable: "prefill",
            defaultValue: "",
            public: true,
        };
        attributes.bindValueTo = {
            createComponentOfType: "text",
            description: "Two-way binding target for the input's value.",
        };
        attributes.expanded = {
            description: "Whether the input renders as a multi-line text area.",
            createComponentOfType: "boolean",
            createStateVariable: "expanded",
            defaultValue: false,
            forRenderer: true,
            public: true,
            fallBackToParentStateVariable: "expanded",
        };
        attributes.width = {
            createComponentOfType: "componentSize",
            description: "Display width of the input.",
        };
        attributes.height = {
            description: "Display height of the input.",
            createComponentOfType: "componentSize",
            createStateVariable: "height",
            defaultValue: { size: 120, isAbsolute: true },
            forRenderer: true,
            public: true,
        };
        attributes.draggable = {
            description: "Whether the input can be dragged on a graph.",
            createComponentOfType: "boolean",
            createStateVariable: "draggable",
            defaultValue: true,
            public: true,
            forRenderer: true,
        };

        Object.assign(attributes, returnAnchorAttributes());

        return attributes;
    }

    // Include children that can be added due to sugar
    static additionalSchemaChildren = ["string"];

    static returnSugarInstructions() {
        let sugarInstructions = super.returnSugarInstructions();

        sugarInstructions.push({
            replacementFunction: returnWrapNonLabelsDescriptionsSugarFunction({
                wrappingComponentType: "text",
                wrapSingleIfNotWrappingComponentType: true,
            }),
        });

        return sugarInstructions;
    }

    static returnChildGroups() {
        return [
            {
                group: "labels",
                componentTypes: ["label"],
            },
            {
                group: "descriptions",
                componentTypes: ["description"],
            },
            {
                group: "shortDescriptions",
                componentTypes: ["shortDescription"],
            },
            {
                group: "texts",
                componentTypes: ["text"],
            },
        ];
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        Object.assign(
            stateVariableDefinitions,
            returnInputValueChangedStateVariableDefinitions({
                valueChangedDescription:
                    "Whether the value has been changed from its initial state.",
                immediateValueChangedDescription:
                    "Whether the value, including in-progress edits, has been changed from its initial state.",
            }),
        );

        let anchorDefinition = returnAnchorStateVariableDefinition();
        Object.assign(stateVariableDefinitions, anchorDefinition);

        stateVariableDefinitions.width = {
            description: "Display width of the input.",
            forRenderer: true,
            hasEssential: true,
            public: true,
            shadowingInstructions: {
                createComponentOfType: "componentSize",
            },
            returnDependencies: () => ({
                widthAttr: {
                    dependencyType: "attributeComponent",
                    attributeName: "width",
                    variableNames: ["componentSize"],
                },
                expanded: {
                    dependencyType: "stateVariable",
                    variableName: "expanded",
                },
            }),
            definition({ dependencyValues }) {
                if (dependencyValues.widthAttr) {
                    return {
                        setValue: {
                            width: dependencyValues.widthAttr.stateValues
                                .componentSize,
                        },
                    };
                } else {
                    return {
                        useEssentialOrDefaultValue: {
                            width: {
                                defaultValue: {
                                    size: dependencyValues.expanded ? 600 : 100,
                                    isAbsolute: true,
                                },
                            },
                        },
                    };
                }
            },
            inverseDefinition({
                desiredStateVariableValues,
                dependencyValues,
            }) {
                if (dependencyValues.widthAttr) {
                    return {
                        success: true,
                        instructions: [
                            {
                                setDependency: "widthAttr",
                                desiredValue: desiredStateVariableValues.width,
                            },
                        ],
                    };
                } else {
                    return {
                        success: true,
                        instructions: [
                            {
                                setEssentialValue: "width",
                                value: desiredStateVariableValues.width,
                            },
                        ],
                    };
                }
            },
        };

        stateVariableDefinitions.value = {
            description: "The text value of the input.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            hasEssential: true,
            shadowVariable: true,
            returnDependencies: () => ({
                textChild: {
                    dependencyType: "child",
                    childGroups: ["texts"],
                    variableNames: ["value"],
                },
                bindValueTo: {
                    dependencyType: "attributeComponent",
                    attributeName: "bindValueTo",
                    variableNames: ["value"],
                },
                prefill: {
                    dependencyType: "stateVariable",
                    variableName: "prefill",
                },
                valueChanged: {
                    dependencyType: "stateVariable",
                    variableName: "valueChanged",
                    onlyToSetInInverseDefinition: true,
                },
                immediateValueChanged: {
                    dependencyType: "stateVariable",
                    variableName: "immediateValueChanged",
                    onlyToSetInInverseDefinition: true,
                },
            }),
            definition: function ({ dependencyValues }) {
                if (dependencyValues.textChild.length > 0) {
                    return {
                        setValue: {
                            value: dependencyValues.textChild[0].stateValues
                                .value,
                        },
                    };
                } else if (dependencyValues.bindValueTo) {
                    return {
                        setValue: {
                            value: dependencyValues.bindValueTo.stateValues
                                .value,
                        },
                    };
                } else {
                    return {
                        useEssentialOrDefaultValue: {
                            value: {
                                defaultValue: dependencyValues.prefill,
                            },
                        },
                    };
                }
            },
            inverseDefinition: function ({
                desiredStateVariableValues,
                dependencyValues,
            }) {
                let instructions = [
                    {
                        setDependency: "valueChanged",
                        desiredValue: true,
                    },
                    {
                        setDependency: "immediateValueChanged",
                        desiredValue: true,
                    },
                ];

                if (dependencyValues.textChild.length > 0) {
                    instructions.push({
                        setDependency: "textChild",
                        desiredValue: desiredStateVariableValues.value,
                        variableIndex: 0,
                        childIndex: 0,
                    });
                } else if (dependencyValues.bindValueTo) {
                    instructions.push({
                        setDependency: "bindValueTo",
                        desiredValue: desiredStateVariableValues.value,
                        variableIndex: 0,
                    });
                } else {
                    // no child or bindValueTo, so value is essential and give it the desired value
                    instructions.push({
                        setEssentialValue: "value",
                        value: desiredStateVariableValues.value,
                    });
                }

                return { success: true, instructions };
            },
        };

        stateVariableDefinitions.immediateValue =
            returnImmediateValueStateVariableDefinition({
                description:
                    "The text value reflecting the user's in-progress edits.",
                createComponentOfType: "text",
            }).immediateValue;

        stateVariableDefinitions.text = {
            description: "The current text as a plain text string.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            returnDependencies: () => ({
                value: {
                    dependencyType: "stateVariable",
                    variableName: "value",
                },
            }),
            definition: function ({ dependencyValues }) {
                return { setValue: { text: dependencyValues.value } };
            },
        };

        stateVariableDefinitions.componentType = {
            returnDependencies: () => ({}),
            definition: () => ({ setValue: { componentType: "text" } }),
        };

        let pieceDefs = returnTextPieceStateVariableDefinitions();
        Object.assign(stateVariableDefinitions, pieceDefs);

        return stateVariableDefinitions;
    }

    async moveInput({
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
