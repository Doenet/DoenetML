import InlineComponent from "./abstract/InlineComponent";
import {
    returnSelectedStyleStateVariableDefinition,
    returnTextStyleDescriptionDefinitions,
} from "@doenet/utils";
import me from "math-expressions";
import {
    moveGraphicalObjectWithAnchorAction,
    returnAnchorAttributes,
    returnAnchorStateVariableDefinition,
} from "../utils/graphical";
import { textFromChildren } from "../utils/text";
import { latexToText, textToLatex } from "../utils/math";

export default class Label extends InlineComponent {
    constructor(args) {
        super(args);

        Object.assign(this.actions, {
            moveLabel: this.moveLabel.bind(this),
            labelClicked: this.labelClicked.bind(this),
            labelFocused: this.labelFocused.bind(this),
        });
    }
    static componentType = "label";
    static rendererType = "label";

    static includeBlankStringChildren = true;

    // used when creating new component via adapter or copy prop
    static primaryStateVariableForDefinition = "valueShadow";

    static variableForImplicitProp = "value";
    static implicitPropReturnsSameType = true;

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        attributes.forObject = {
            createReferences: true,
        };

        attributes.draggable = {
            createComponentOfType: "boolean",
            createStateVariable: "draggable",
            defaultValue: true,
            public: true,
            forRenderer: true,
        };

        attributes.layer = {
            createComponentOfType: "number",
            createStateVariable: "layer",
            defaultValue: 0,
            public: true,
            forRenderer: true,
        };

        Object.assign(attributes, returnAnchorAttributes());

        return attributes;
    }

    static returnChildGroups() {
        return [
            {
                group: "inlines",
                componentTypes: ["_inline"],
            },
        ];
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        let selectedStyleDefinition =
            returnSelectedStyleStateVariableDefinition();
        Object.assign(stateVariableDefinitions, selectedStyleDefinition);

        let styleDescriptionDefinitions =
            returnTextStyleDescriptionDefinitions();
        Object.assign(stateVariableDefinitions, styleDescriptionDefinitions);

        let anchorDefinition = returnAnchorStateVariableDefinition();
        Object.assign(stateVariableDefinitions, anchorDefinition);

        stateVariableDefinitions.valueShadow = {
            hasEssential: true,
            defaultValue: null,
            returnDependencies: () => ({}),
            definition() {
                return {
                    useEssentialOrDefaultValue: { valueShadow: true },
                };
            },
            inverseDefinition({ desiredStateVariableValues }) {
                return {
                    success: true,
                    instructions: [
                        {
                            setEssentialValue: "valueShadow",
                            value: desiredStateVariableValues.valueShadow,
                        },
                    ],
                };
            },
        };

        stateVariableDefinitions.hasLatex = {
            public: true,
            forRenderer: true,
            shadowingInstructions: {
                createComponentOfType: "boolean",
            },
            returnDependencies: () => ({
                inlineChildren: {
                    dependencyType: "child",
                    childGroups: ["inlines"],
                    variableNames: [
                        "text",
                        "latex",
                        "value",
                        "hasLatex",
                        "renderAsMath",
                    ],
                    variablesOptional: true,
                },
                valueShadow: {
                    dependencyType: "stateVariable",
                    variableName: "valueShadow",
                },
            }),
            definition: function ({ dependencyValues }) {
                if (
                    dependencyValues.inlineChildren.length === 0 &&
                    dependencyValues.valueShadow !== null
                ) {
                    let value = dependencyValues.valueShadow;
                    let hasLatex = Boolean(/\\\(.*\\\)/.exec(value));
                    return { setValue: { hasLatex } };
                }

                let hasLatex = false;
                for (let comp of dependencyValues.inlineChildren) {
                    if (typeof comp !== "object") {
                    } else if (
                        typeof comp.stateValues.hasLatex === "boolean" &&
                        typeof comp.stateValues.value === "string" &&
                        typeof comp.stateValues.text === "string"
                    ) {
                        // if component has a boolean hasLatex state variable
                        // and value and text are strings
                        // then use  hasLatex directly
                        if (comp.stateValues.hasLatex) {
                            return { setValue: { hasLatex: true } };
                        }
                    } else if (
                        typeof comp.stateValues.renderAsMath === "boolean" &&
                        typeof comp.stateValues.latex === "string" &&
                        typeof comp.stateValues.text === "string"
                    ) {
                        // if have both latex and string,
                        // use render as math, if exists, to decide which to use
                        if (comp.stateValues.renderAsMath) {
                            return { setValue: { hasLatex: true } };
                        }
                    } else if (typeof comp.stateValues.latex === "string") {
                        return { setValue: { hasLatex: true } };
                    }
                }

                return { setValue: { hasLatex } };
            },
        };

        stateVariableDefinitions.text = {
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            additionalStateVariablesDefined: [
                {
                    variableName: "latex",
                    public: true,
                    shadowingInstructions: {
                        createComponentOfType: "latex",
                    },
                },
                {
                    variableName: "value",
                    public: true,
                    forRenderer: true,
                    shadowingInstructions: {
                        createComponentOfType: this.componentType,
                        addStateVariablesShadowingStateVariables: {
                            hasLatex: {
                                stateVariableToShadow: "hasLatex",
                            },
                        },
                    },
                },
            ],
            returnDependencies: () => ({
                inlineChildren: {
                    dependencyType: "child",
                    childGroups: ["inlines"],
                    variableNames: [
                        "text",
                        "latex",
                        "value",
                        "hasLatex",
                        "renderAsMath",
                        "hidden",
                    ],
                    variablesOptional: true,
                },
                valueShadow: {
                    dependencyType: "stateVariable",
                    variableName: "valueShadow",
                },
                hasLatex: {
                    dependencyType: "stateVariable",
                    variableName: "hasLatex",
                },
            }),
            definition: function ({ dependencyValues, componentIdx }) {
                if (
                    dependencyValues.inlineChildren.length === 0 &&
                    dependencyValues.valueShadow !== null
                ) {
                    let value = dependencyValues.valueShadow;
                    let text = value;
                    let latex = value;
                    if (dependencyValues.hasLatex) {
                        latex = latex.replace(/\\\(/g, "");
                        latex = latex.replace(/\\\)/g, "");

                        text = extractTextFromLabel(text);
                    }

                    return { setValue: { text, latex, value } };
                }

                let valueFromComponentConverter = function (comp) {
                    if (typeof comp !== "object") {
                        return comp.toString();
                    } else if (comp.stateValues.hidden) {
                        return "";
                    } else if (
                        typeof comp.stateValues.hasLatex === "boolean" &&
                        typeof comp.stateValues.value === "string"
                    ) {
                        // if component has a boolean hasLatex state variable
                        // and value is string
                        // then use value directly
                        // (as it is a label or similar)
                        return comp.stateValues.value;
                    } else if (
                        typeof comp.stateValues.renderAsMath === "boolean" &&
                        typeof comp.stateValues.latex === "string" &&
                        typeof comp.stateValues.text === "string"
                    ) {
                        // if have both latex and string,
                        // and renderAsMath exists, then we'll use renderAsMath
                        // to decide which to use
                        if (comp.stateValues.renderAsMath) {
                            return "\\(" + comp.stateValues.latex + "\\)";
                        } else {
                            return comp.stateValues.text;
                        }
                    } else if (typeof comp.stateValues.latex === "string") {
                        // if no renderAsMath, then we'll use latex if it exists
                        return "\\(" + comp.stateValues.latex + "\\)";
                    } else if (typeof comp.stateValues.text === "string") {
                        return comp.stateValues.text;
                    }
                };

                let textFromComponentConverter = function (
                    comp,
                    preferLatex = false,
                ) {
                    if (typeof comp !== "object") {
                        return comp.toString();
                    } else if (comp.stateValues.hidden) {
                        return "";
                    } else if (
                        typeof comp.stateValues.text === "string" &&
                        !preferLatex
                    ) {
                        return comp.stateValues.text;
                    } else if (typeof comp.stateValues.latex === "string") {
                        return comp.stateValues.latex;
                    } else if (typeof comp.stateValues.text === "string") {
                        return comp.stateValues.text;
                    }
                };

                let value = textFromChildren(
                    dependencyValues.inlineChildren,
                    valueFromComponentConverter,
                );
                let text = textFromChildren(
                    dependencyValues.inlineChildren,
                    (x) => textFromComponentConverter(x, false),
                );
                let latex = textFromChildren(
                    dependencyValues.inlineChildren,
                    (x) => textFromComponentConverter(x, true),
                );

                return { setValue: { text, latex, value } };
            },
            inverseDefinition: function ({
                desiredStateVariableValues,
                dependencyValues,
            }) {
                // if specify desired value, text, or latex, use that to set value
                let desiredValue;
                if (typeof desiredStateVariableValues.value === "string") {
                    desiredValue = desiredStateVariableValues.value;
                } else if (
                    typeof desiredStateVariableValues.text === "string"
                ) {
                    if (dependencyValues.hasLatex) {
                        // if hasLatex is set, then the only invertible form is where there is a single
                        // latex expression.
                        // Attempt to convert text into latex.
                        desiredValue = textToLatex(
                            desiredStateVariableValues.text,
                        );
                    } else {
                        desiredValue = desiredStateVariableValues.text;
                    }
                } else if (
                    typeof desiredStateVariableValues.latex === "string"
                ) {
                    desiredValue = desiredStateVariableValues.latex;
                } else {
                    return { success: false };
                }

                if (
                    dependencyValues.inlineChildren.length === 0 &&
                    dependencyValues.valueShadow !== null
                ) {
                    return {
                        success: true,
                        instructions: [
                            {
                                setDependency: "valueShadow",
                                desiredValue,
                            },
                        ],
                    };
                } else if (dependencyValues.inlineChildren.length === 1) {
                    let comp = dependencyValues.inlineChildren[0];

                    if (typeof comp !== "object") {
                        return {
                            success: true,
                            instructions: [
                                {
                                    setDependency: "inlineChildren",
                                    desiredValue,
                                    childIndex: 0,
                                },
                            ],
                        };
                    } else if (
                        typeof comp.stateValues.hasLatex === "boolean" &&
                        typeof comp.stateValues.value === "string" &&
                        typeof comp.stateValues.text === "string"
                    ) {
                        // if child has a boolean hasLatex state variable
                        // and value and text are strings
                        // then set value directly

                        return {
                            success: true,
                            instructions: [
                                {
                                    setDependency: "inlineChildren",
                                    desiredValue,
                                    childIndex: 0,
                                    variableIndex: 2, // the variable "value"
                                },
                            ],
                        };
                    } else if (
                        typeof comp.stateValues.renderAsMath === "boolean" &&
                        typeof comp.stateValues.latex === "string" &&
                        typeof comp.stateValues.text === "string"
                    ) {
                        // if have both latex and string,
                        // use render as math, if exists, to decide which to use
                        if (comp.stateValues.renderAsMath) {
                            // set the latex variable to the value, after remove the latex delimiters
                            let match = desiredValue.match(/^\\\((.*)\\\)/);
                            if (match) {
                                desiredValue = match[1];
                            }
                            return {
                                success: true,
                                instructions: [
                                    {
                                        setDependency: "inlineChildren",
                                        desiredValue,
                                        childIndex: 0,
                                        variableIndex: 1, // the "latex" variable
                                    },
                                ],
                            };
                        } else {
                            // set the text variable to the value
                            return {
                                success: true,
                                instructions: [
                                    {
                                        setDependency: "inlineChildren",
                                        desiredValue,
                                        childIndex: 0,
                                        variableIndex: 0, // the "text" variable
                                    },
                                ],
                            };
                        }
                    } else if (typeof comp.stateValues.latex === "string") {
                        // set the latex variable to the value, after remove the latex delimiters
                        let match = desiredValue.match(/^\\\((.*)\\\)/);
                        if (match) {
                            desiredValue = match[1];
                        }
                        return {
                            success: true,
                            instructions: [
                                {
                                    setDependency: "inlineChildren",
                                    desiredValue,
                                    childIndex: 0,
                                    variableIndex: 1, // the "latex" variable
                                },
                            ],
                        };
                    } else if (typeof comp.stateValues.text === "string") {
                        // set the text variable to the value
                        return {
                            success: true,
                            instructions: [
                                {
                                    setDependency: "inlineChildren",
                                    desiredValue,
                                    childIndex: 0,
                                    variableIndex: 0, // the "text" variable
                                },
                            ],
                        };
                    } else {
                        return { success: false };
                    }
                } else {
                    // more than 1 inline child
                    return { success: false };
                }
            },
        };

        stateVariableDefinitions.forObjectComponentIdx = {
            returnDependencies: () => ({
                forObject: {
                    dependencyType: "attributeRefResolutions",
                    attributeName: "forObject",
                },
            }),
            definition({ dependencyValues }) {
                let forObjectComponentIdx;

                if (dependencyValues.forObject?.length === 1) {
                    if (dependencyValues.forObject[0].unresolvedPath === null) {
                        forObjectComponentIdx =
                            dependencyValues.forObject[0].componentIdx;
                    } else {
                        // if there was a `forObject` attribute but it didn't match  an object,
                        // then set `forObjectComponentIdx` to `-1`
                        // so that this label will not be used in a legend
                        forObjectComponentIdx = -1;
                    }
                } else {
                    forObjectComponentIdx = null;
                }

                return { setValue: { forObjectComponentIdx } };
            },
        };

        return stateVariableDefinitions;
    }

    static adapters = ["text"];

    async moveLabel({
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

    async labelClicked({
        actionId,
        componentIdx,
        sourceInformation = {},
        skipRendererUpdate = false,
    }) {
        if (!(await this.stateValues.fixed)) {
            await this.coreFunctions.triggerChainedActions({
                triggeringAction: "click",
                componentIdx, // use componentIdx rather than this.componentIdx to get original componentIdx if adapted
                actionId,
                sourceInformation,
                skipRendererUpdate,
            });
        }
    }

    async labelFocused({
        actionId,
        componentIdx,
        sourceInformation = {},
        skipRendererUpdate = false,
    }) {
        if (!(await this.stateValues.fixed)) {
            await this.coreFunctions.triggerChainedActions({
                triggeringAction: "focus",
                componentIdx, // use componentIdx rather than this.componentIdx to get original componentIdx if adapted
                actionId,
                sourceInformation,
                skipRendererUpdate,
            });
        }
    }
}

/**
 * Extract text from a label string consisting of regular text and latex snippets enclosed by `\(` and `\)`.
 *
 * For each latex string delimited by `\(` and `\)`, attempt to create a math expression from that latex.
 */
function extractTextFromLabel(labelValue) {
    let unprocessedText = labelValue;
    let text = "";
    let match = unprocessedText.match(/\\\((.*?)\\\)/);
    while (match) {
        let preChars = match.index;

        // add text before the latex piece found
        text += unprocessedText.slice(0, preChars);

        // attempt to convert the latex piece found
        text += latexToText(match[1]);

        // remove processed text and continue
        unprocessedText = unprocessedText.slice(preChars + match[0].length);
        match = unprocessedText.match(/\\\((.*?)\\\)/);
    }

    // add any leftover text after all latex pieces
    text += unprocessedText;

    return text;
}
