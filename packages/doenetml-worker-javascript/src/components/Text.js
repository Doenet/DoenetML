import {
    moveGraphicalObjectWithAnchorAction,
    returnAnchorAttributes,
    returnAnchorStateVariableDefinition,
} from "../utils/graphical";
import {
    returnSelectedStyleStateVariableDefinition,
    returnTextStyleDescriptionDefinitions,
} from "@doenet/utils";
import {
    returnTextPieceStateVariableDefinitions,
    textFromChildren,
} from "../utils/text";
import { textToMathFactory, latexToMathFactory } from "../utils/math";
import InlineComponent from "./abstract/InlineComponent";
import me from "math-expressions";

export default class Text extends InlineComponent {
    constructor(args) {
        super(args);

        Object.assign(this.actions, {
            moveText: this.moveText.bind(this),
            textClicked: this.textClicked.bind(this),
            textFocused: this.textFocused.bind(this),
        });
    }
    static componentType = "text";

    static includeBlankStringChildren = true;

    static variableForImplicitProp = "value";
    static implicitPropReturnsSameType = true;

    static descendantCompositesMustHaveAReplacement = true;
    static descendantCompositesDefaultReplacementType = "text";

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

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

        attributes.isLatex = {
            createComponentOfType: "boolean",
            createStateVariable: "isLatex",
            defaultValue: false,
            public: true,
        };

        Object.assign(attributes, returnAnchorAttributes());

        return attributes;
    }

    static returnChildGroups() {
        // Note: Latex class extends Text and depends on "textLike" being the first entry
        return [
            {
                group: "textLike",
                componentTypes: [
                    "string",
                    "text",
                    "_singleCharacterInline",
                    "_inlineRenderInlineChildren",
                ],
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

        stateVariableDefinitions.inUnorderedList = {
            defaultValue: false,
            returnDependencies: () => ({
                sourceCompositeUnordered: {
                    dependencyType: "sourceCompositeStateVariable",
                    variableName: "unordered",
                },
            }),
            definition({ dependencyValues, usedDefault }) {
                if (
                    dependencyValues.sourceCompositeUnordered !== null &&
                    !usedDefault.sourceCompositeUnordered
                ) {
                    return {
                        setValue: {
                            inUnorderedList: Boolean(
                                dependencyValues.sourceCompositeUnordered,
                            ),
                        },
                    };
                } else {
                    return {
                        setValue: {
                            inUnorderedList: false,
                        },
                    };
                }
            },
        };

        stateVariableDefinitions.value = {
            public: true,
            shadowingInstructions: {
                createComponentOfType: this.componentType,
                // the reason we create a attribute component from the state variable,
                // rather than just shadowing the attribute,
                // is that a sequence creates a text where it sets fixed directly in the state
                // TODO: how to deal with this in general?  Should we disallow that way to set state?
                // Or should we always shadow attributes this way?
                addAttributeComponentsShadowingStateVariables: {
                    fixed: {
                        stateVariableToShadow: "fixed",
                    },
                },
            },
            hasEssential: true,
            returnDependencies: () => ({
                textLikeChildren: {
                    dependencyType: "child",
                    childGroups: ["textLike"],
                    variableNames: ["text"],
                },
            }),
            defaultValue: "",
            set: (x) => (x === null ? "" : String(x)),
            definition: function ({ dependencyValues }) {
                if (dependencyValues.textLikeChildren.length === 0) {
                    return {
                        useEssentialOrDefaultValue: {
                            value: true,
                        },
                    };
                }

                let value = textFromChildren(dependencyValues.textLikeChildren);

                return { setValue: { value } };
            },
            inverseDefinition: function ({
                desiredStateVariableValues,
                dependencyValues,
            }) {
                let numChildren = dependencyValues.textLikeChildren.length;

                if (numChildren > 1) {
                    // if have multiple children, then we could still update them if
                    // 1. all children come from a single composite with asList set to true, and
                    // 2. the desired value is a comma-separated list with the number of entries
                    //    matching the number of children.
                    // In that case, we will attempt to update each child to the corresponding entry
                    // from the desired value.

                    // Check if all text children are from a composite with asList set to true
                    let foundAllFromListComposite = false;
                    for (let range of dependencyValues.textLikeChildren
                        .compositeReplacementRange) {
                        if (
                            range.asList &&
                            range.firstInd === 0 &&
                            range.lastInd === numChildren - 1
                        ) {
                            foundAllFromListComposite = true;
                        }
                    }

                    if (foundAllFromListComposite) {
                        // Check if desired value is a comma-separated list with the same number of entries as children
                        let splitValues = desiredStateVariableValues.value
                            .split(",")
                            .map((v) => v.trim());

                        if (splitValues.length === numChildren) {
                            // All conditions are met, so we attempt to update the children
                            let instructions = splitValues.map((v, i) => ({
                                setDependency: "textLikeChildren",
                                desiredValue: v,
                                childIndex: i,
                                variableIndex: 0,
                            }));
                            return { success: true, instructions };
                        }
                    }
                    return { success: false };
                }

                if (numChildren === 1) {
                    return {
                        success: true,
                        instructions: [
                            {
                                setDependency: "textLikeChildren",
                                desiredValue: desiredStateVariableValues.value,
                                childIndex: 0,
                                variableIndex: 0,
                            },
                        ],
                    };
                }
                // no children, so set essential value to the desired value
                return {
                    success: true,
                    instructions: [
                        {
                            setEssentialValue: "value",
                            value:
                                desiredStateVariableValues.value === null
                                    ? ""
                                    : String(desiredStateVariableValues.value),
                        },
                    ],
                };
            },
        };

        stateVariableDefinitions.text = {
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            forRenderer: true,
            returnDependencies: () => ({
                value: {
                    dependencyType: "stateVariable",
                    variableName: "value",
                },
            }),
            definition: ({ dependencyValues }) => ({
                setValue: { text: dependencyValues.value },
            }),
            inverseDefinition: ({ desiredStateVariableValues }) => ({
                success: true,
                instructions: [
                    {
                        setDependency: "value",
                        desiredValue: desiredStateVariableValues.text,
                    },
                ],
            }),
        };

        stateVariableDefinitions.math = {
            public: true,
            shadowingInstructions: {
                createComponentOfType: "math",
            },
            forRenderer: true,
            returnDependencies: () => ({
                value: {
                    dependencyType: "stateVariable",
                    variableName: "value",
                },
                isLatex: {
                    dependencyType: "stateVariable",
                    variableName: "isLatex",
                },
            }),
            definition({ dependencyValues }) {
                let parser = dependencyValues.isLatex
                    ? latexToMathFactory()
                    : textToMathFactory();
                let expression;
                try {
                    expression = parser(dependencyValues.value);
                } catch (e) {
                    expression = me.fromAst("\uFF3F");
                }
                return { setValue: { math: expression } };
            },
            inverseDefinition({
                desiredStateVariableValues,
                dependencyValues,
            }) {
                let text;
                if (dependencyValues.isLatex) {
                    text = desiredStateVariableValues.math.toLatex();
                } else {
                    text = desiredStateVariableValues.math.toString();
                }
                return {
                    success: true,
                    instructions: [
                        {
                            setDependency: "value",
                            desiredValue: text,
                        },
                    ],
                };
            },
        };

        stateVariableDefinitions.number = {
            public: true,
            shadowingInstructions: {
                createComponentOfType: "number",
            },
            forRenderer: true,
            returnDependencies: () => ({
                math: {
                    dependencyType: "stateVariable",
                    variableName: "math",
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        number: dependencyValues.math.evaluate_to_constant(),
                    },
                };
            },
            inverseDefinition({ desiredStateVariableValues }) {
                return {
                    success: true,
                    instructions: [
                        {
                            setDependency: "math",
                            desiredValue: me.fromAst(
                                Number(desiredStateVariableValues.number),
                            ),
                        },
                    ],
                };
            },
        };

        let pieceDefs = returnTextPieceStateVariableDefinitions();
        Object.assign(stateVariableDefinitions, pieceDefs);

        return stateVariableDefinitions;
    }

    static adapters = ["math", "number"];

    async moveText({
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

    async textClicked({
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

    async textFocused({
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
