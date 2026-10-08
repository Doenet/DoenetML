import InlineComponent from "./abstract/InlineComponent";
import me from "math-expressions";
import {
    returnSelectedStyleStateVariableDefinition,
    returnTextStyleDescriptionDefinitions,
} from "@doenet/utils";
import { buildParsedExpression, evaluateLogic } from "../utils/booleanLogic";
import {
    moveGraphicalObjectWithAnchorAction,
    returnAnchorAttributes,
    returnAnchorStateVariableDefinition,
} from "../utils/graphical";
import {
    returnNumberDisplayAttributeComponentShadowing,
    returnNumberDisplayAttributes,
    returnNumberDisplayStateVariableDefinitions,
} from "../utils/numberDisplay";
import {
    textToAst,
    mathStateVariableFromNumberStateVariable,
    numberToMathExpression,
    plainComplex,
} from "../utils/math";
import { addClickTargetStateVariableDefinition } from "../utils/triggering";
import {
    numberDisplayString,
    numberFromDesiredText,
    numberFromDesiredValue,
    numberFromString,
    numberValueForDisplay,
    numberValueFromCodes,
} from "../utils/valueFunctions/number";

export default class NumberComponent extends InlineComponent {
    constructor(args) {
        super(args);

        Object.assign(this.actions, {
            moveNumber: this.moveNumber.bind(this),
            numberClicked: this.numberClicked.bind(this),
            numberFocused: this.numberFocused.bind(this),
        });
    }
    static componentType = "number";

    static componentDocs = {
        summary: "A numeric floating point value",
    };
    static variableForImplicitProp = "value";
    static implicitPropReturnsSameType = true;

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        Object.assign(attributes, returnNumberDisplayAttributes());

        attributes.renderAsMath = {
            description: "Whether to render the number using math typography.",
            createComponentOfType: "boolean",
            createStateVariable: "renderAsMath",
            defaultValue: false,
            public: true,
            forRenderer: true,
        };
        attributes.convertBoolean = {
            createPrimitiveOfType: "boolean",
            createStateVariable: "convertBoolean",
            defaultValue: false,
            description:
                "Whether to convert boolean inputs to 1/0 instead of NaN.",
        };
        attributes.valueOnNaN = {
            createPrimitiveOfType: "number",
            createStateVariable: "valueOnNaN",
            defaultValue: NaN,
            description:
                "Numeric value to use when the input cannot be parsed.",
        };

        attributes.draggable = {
            description: "Whether the number can be dragged on a graph.",
            createComponentOfType: "boolean",
            createStateVariable: "draggable",
            defaultValue: true,
            public: true,
            forRenderer: true,
        };

        attributes.layer = {
            description: "Z-order layer index when shown on a graph.",
            createComponentOfType: "number",
            createStateVariable: "layer",
            defaultValue: 0,
            public: true,
            forRenderer: true,
        };

        Object.assign(attributes, returnAnchorAttributes());

        return attributes;
    }

    static returnSugarInstructions() {
        let sugarInstructions = super.returnSugarInstructions();

        // if not convertBoolean, then
        // add math around multiple children
        // so that can invert value
        sugarInstructions.push({
            childrenRegex: /..+/,
            replacementFunction: ({
                matchedChildren,
                componentAttributes,
                nComponents,
                stateIdInfo,
            }) => ({
                success: !componentAttributes.convertBoolean?.value,
                newChildren: [
                    {
                        type: "serialized",
                        componentType: "math",
                        componentIdx: nComponents++,
                        stateId: stateIdInfo
                            ? `${stateIdInfo.prefix}${stateIdInfo.num++}`
                            : undefined,
                        children: matchedChildren,
                        attributes: {},
                        doenetAttributes: {},
                        state: {},
                    },
                ],
                nComponents,
            }),
        });

        return sugarInstructions;
    }

    static returnChildGroups() {
        return [
            {
                group: "strings",
                componentTypes: ["string"],
            },
            {
                group: "numbers",
                componentTypes: ["number"],
            },
            {
                group: "maths",
                componentTypes: ["math"],
            },
            {
                group: "texts",
                componentTypes: ["text"],
            },
            {
                group: "booleans",
                componentTypes: ["boolean"],
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

        let roundingDefinitions = returnNumberDisplayStateVariableDefinitions({
            childGroupsIfSingleMatch: ["maths", "numbers"],
            childGroupsToStopSingleMatch: ["strings", "texts", "booleans"],
        });
        Object.assign(stateVariableDefinitions, roundingDefinitions);

        stateVariableDefinitions.inUnorderedList = {
            returnDependencies: () => ({
                sourceCompositeUnordered: {
                    dependencyType: "sourceCompositeStateVariable",
                    variableName: "unordered",
                    skipCopies: true,
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

        stateVariableDefinitions.singleNumberOrStringChild = {
            additionalStateVariablesDefined: ["singleMathChild"],
            returnDependencies: () => ({
                numberChildren: {
                    dependencyType: "child",
                    childGroups: ["numbers"],
                },
                stringChildren: {
                    dependencyType: "child",
                    childGroups: ["strings"],
                },
                mathChildren: {
                    dependencyType: "child",
                    childGroups: ["maths"],
                },
                booleanChildren: {
                    dependencyType: "child",
                    childGroups: ["booleans"],
                },
                textChildren: {
                    dependencyType: "child",
                    childGroups: ["texts"],
                },
                convertBoolean: {
                    dependencyType: "stateVariable",
                    variableName: "convertBoolean",
                },
            }),
            definition({ dependencyValues }) {
                let nNumberStrings =
                    dependencyValues.numberChildren.length +
                    dependencyValues.stringChildren.length;
                let nMaths = dependencyValues.mathChildren.length;
                let nOthers = dependencyValues.booleanChildren.length;

                if (dependencyValues.convertBoolean) {
                    nOthers += dependencyValues.textChildren.length;
                } else {
                    // if don't convert boolean, then we'll convert text children to numbers
                    nNumberStrings += dependencyValues.textChildren.length;
                }

                let singleNumberOrStringChild =
                    nNumberStrings <= 1 && nMaths + nOthers === 0;
                let singleMathChild =
                    nMaths === 1 && nNumberStrings + nOthers === 0;

                return {
                    setValue: { singleNumberOrStringChild, singleMathChild },
                };
            },
        };

        stateVariableDefinitions.parsedExpression = {
            additionalStateVariablesDefined: ["codePre"],
            returnDependencies: () => ({
                allChildren: {
                    dependencyType: "child",
                    childGroups: [
                        "strings",
                        "numbers",
                        "maths",
                        "texts",
                        "booleans",
                    ],
                },
                stringChildren: {
                    dependencyType: "child",
                    childGroups: ["strings"],
                    variableNames: ["value"],
                },
                convertBoolean: {
                    dependencyType: "stateVariable",
                    variableName: "convertBoolean",
                },
            }),
            definition({ dependencyValues, componentInfoObjects }) {
                if (!dependencyValues.convertBoolean) {
                    // if don't convert boolean, then we'll treat texts as numbers
                    dependencyValues = { ...dependencyValues };
                    dependencyValues.allChildren =
                        dependencyValues.allChildren.map((child) => {
                            if (
                                componentInfoObjects.isInheritedComponentType({
                                    inheritedComponentType: child.componentType,
                                    baseComponentType: "text",
                                })
                            ) {
                                child = { componentType: "number" };
                            }
                            return child;
                        });
                }

                return buildParsedExpression({
                    dependencyValues,
                    componentInfoObjects,
                });
            },
        };

        stateVariableDefinitions.mathChildrenByCode = {
            additionalStateVariablesDefined: [
                "textChildrenByCode",
                "numberChildrenByCode",
                "booleanChildrenByCode",
            ],
            returnDependencies: () => ({
                allChildren: {
                    dependencyType: "child",
                    childGroups: [
                        "strings",
                        "numbers",
                        "maths",
                        "texts",
                        "booleans",
                    ],
                    variableNames: [
                        "value",
                        "texts",
                        "maths",
                        "booleans",
                        "number",
                    ],
                    variablesOptional: true,
                },
                codePre: {
                    dependencyType: "stateVariable",
                    variableName: "codePre",
                },
                convertBoolean: {
                    dependencyType: "stateVariable",
                    variableName: "convertBoolean",
                },
            }),
            definition({ dependencyValues, componentInfoObjects }) {
                let mathChildrenByCode = {};
                let numberChildrenByCode = {};
                let textChildrenByCode = {};
                let booleanChildrenByCode = {};
                let subnum = 0;

                let codePre = dependencyValues.codePre;

                for (let child of dependencyValues.allChildren) {
                    if (typeof child !== "string") {
                        // a math, number, text, or boolean
                        let code = codePre + subnum;

                        if (
                            componentInfoObjects.isInheritedComponentType({
                                inheritedComponentType: child.componentType,
                                baseComponentType: "math",
                            })
                        ) {
                            mathChildrenByCode[code] = child;
                        } else if (
                            componentInfoObjects.isInheritedComponentType({
                                inheritedComponentType: child.componentType,
                                baseComponentType: "number",
                            })
                        ) {
                            numberChildrenByCode[code] = child;
                        } else if (
                            componentInfoObjects.isInheritedComponentType({
                                inheritedComponentType: child.componentType,
                                baseComponentType: "text",
                            })
                        ) {
                            if (dependencyValues.convertBoolean) {
                                textChildrenByCode[code] = child;
                            } else {
                                // treat child like a number
                                child = {
                                    componentType: "number",
                                    stateValues: {
                                        value: child.stateValues.number,
                                    },
                                };
                                numberChildrenByCode[code] = child;
                            }
                        } else {
                            booleanChildrenByCode[code] = child;
                        }
                        subnum += 1;
                    }
                }

                return {
                    setValue: {
                        mathChildrenByCode,
                        numberChildrenByCode,
                        textChildrenByCode,
                        booleanChildrenByCode,
                    },
                };
            },
        };

        stateVariableDefinitions.value = {
            public: true,
            description: "The numeric value.",
            shadowingInstructions: {
                createComponentOfType: this.componentType,
                // the reason we create a attribute component from the state variable,
                // rather than just shadowing the attribute,
                // is that a sequence creates a number where it sets fixed directly in the state
                addAttributeComponentsShadowingStateVariables: {
                    fixed: {
                        stateVariableToShadow: "fixed",
                    },
                    ...returnNumberDisplayAttributeComponentShadowing(),
                },
            },
            hasEssential: true,
            defaultValue: NaN,
            stateVariablesDeterminingDependencies: [
                "singleNumberOrStringChild",
            ],
            returnDependencies({ stateValues }) {
                if (stateValues.singleNumberOrStringChild) {
                    return {
                        singleNumberOrStringChild: {
                            dependencyType: "stateVariable",
                            variableName: "singleNumberOrStringChild",
                        },
                        convertBoolean: {
                            dependencyType: "stateVariable",
                            variableName: "convertBoolean",
                        },
                        numberChild: {
                            dependencyType: "child",
                            childGroups: ["numbers"],
                            variableNames: ["value"],
                        },
                        textChild: {
                            dependencyType: "child",
                            childGroups: ["texts"],
                            variableNames: ["number"],
                        },
                        stringChild: {
                            dependencyType: "child",
                            childGroups: ["strings"],
                            variableNames: ["value"],
                        },
                        valueOnNaN: {
                            dependencyType: "stateVariable",
                            variableName: "valueOnNaN",
                        },
                    };
                } else {
                    return {
                        singleNumberOrStringChild: {
                            dependencyType: "stateVariable",
                            variableName: "singleNumberOrStringChild",
                        },
                        singleMathChild: {
                            dependencyType: "stateVariable",
                            variableName: "singleMathChild",
                        },
                        convertBoolean: {
                            dependencyType: "stateVariable",
                            variableName: "convertBoolean",
                        },
                        parsedExpression: {
                            dependencyType: "stateVariable",
                            variableName: "parsedExpression",
                        },
                        allChildren: {
                            dependencyType: "child",
                            childGroups: [
                                "strings",
                                "numbers",
                                "maths",
                                "texts",
                                "booleans",
                            ],
                            variableNames: [
                                "value",
                                "texts",
                                "maths",
                                "unordered",
                            ],
                            variablesOptional: true,
                        },
                        booleanChildrenByCode: {
                            dependencyType: "stateVariable",
                            variableName: "booleanChildrenByCode",
                        },
                        textChildrenByCode: {
                            dependencyType: "stateVariable",
                            variableName: "textChildrenByCode",
                        },
                        mathChildrenByCode: {
                            dependencyType: "stateVariable",
                            variableName: "mathChildrenByCode",
                        },
                        numberChildrenByCode: {
                            dependencyType: "stateVariable",
                            variableName: "numberChildrenByCode",
                        },
                        valueOnNaN: {
                            dependencyType: "stateVariable",
                            variableName: "valueOnNaN",
                        },
                    };
                }
            },
            definition({ dependencyValues, componentInfoObjects }) {
                if (dependencyValues.singleNumberOrStringChild) {
                    if (
                        dependencyValues.numberChild.length +
                            dependencyValues.textChild.length ===
                        0
                    ) {
                        if (dependencyValues.stringChild.length === 0) {
                            return {
                                useEssentialOrDefaultValue: {
                                    value: {
                                        defaultValue:
                                            dependencyValues.valueOnNaN,
                                    },
                                },
                            };
                        }
                        const number = numberFromString(
                            dependencyValues.stringChild[0],
                            {
                                convertBoolean: dependencyValues.convertBoolean,
                                valueOnNaN: dependencyValues.valueOnNaN,
                                componentInfoObjects,
                            },
                        );
                        return { setValue: { value: plainComplex(number) } };
                    } else {
                        let number =
                            dependencyValues.numberChild.length === 1
                                ? dependencyValues.numberChild[0].stateValues
                                      .value
                                : dependencyValues.textChild[0].stateValues
                                      .number;
                        if (Number.isNaN(number)) {
                            number = dependencyValues.valueOnNaN;
                        }
                        // `plainComplex` here too: `<text>`'s `.number` can be
                        // a math.js `Complex` (`<number><text>3+4i</text></number>`),
                        // and this was the one branch of this definition that
                        // let the class instance reach the state variable.
                        return { setValue: { value: plainComplex(number) } };
                    }
                } else {
                    if (dependencyValues.parsedExpression === null) {
                        // if don't have parsed expression
                        // (which could occur if have invalid form)
                        // return dependencyValues.valueOnNaN
                        return {
                            setValue: { value: dependencyValues.valueOnNaN },
                        };
                    }

                    if (
                        Object.keys(dependencyValues.textChildrenByCode)
                            .length === 0 &&
                        Object.keys(dependencyValues.booleanChildrenByCode)
                            .length === 0
                    ) {
                        // just have strings, numbers, and math, evaluate expression
                        const mathValuesByCode = {};
                        for (let code in dependencyValues.mathChildrenByCode) {
                            mathValuesByCode[code] =
                                dependencyValues.mathChildrenByCode[
                                    code
                                ].stateValues.value;
                        }
                        const numberValuesByCode = {};
                        for (let code in dependencyValues.numberChildrenByCode) {
                            numberValuesByCode[code] =
                                dependencyValues.numberChildrenByCode[
                                    code
                                ].stateValues.value;
                        }
                        const number = numberValueFromCodes({
                            parsedExpression: dependencyValues.parsedExpression,
                            mathValuesByCode,
                            numberValuesByCode,
                            valueOnNaN: dependencyValues.valueOnNaN,
                        });
                        if (number !== null) {
                            return { setValue: { value: number } };
                        }
                    }

                    if (!dependencyValues.convertBoolean) {
                        return {
                            setValue: { value: dependencyValues.valueOnNaN },
                        };
                    }

                    dependencyValues = Object.assign({}, dependencyValues);
                    dependencyValues.mathListChildrenByCode = {};
                    dependencyValues.numberListChildrenByCode = {};
                    dependencyValues.textListChildrenByCode = {};
                    dependencyValues.booleanListChildrenByCode = {};
                    dependencyValues.otherChildrenByCode = {};

                    let fractionSatisfied = evaluateLogic({
                        logicTree: dependencyValues.parsedExpression.tree,
                        dependencyValues,
                        valueOnInvalid: dependencyValues.valueOnNaN,
                    });

                    // fractionSatisfied will be either 0 or 1 (or valueOnNaN)
                    // as have not specified matchPartial

                    return { setValue: { value: fractionSatisfied } };
                }
            },
            set: function (value) {
                // this function is called when
                // - definition is overridden by a copy prop
                // - when processing new state variable values
                //   (which could be from outside sources)

                // TODO: we can't access the state variable valueOnNaN here
                // so we can set value to NaN
                // Is there a way to use valueOnNaN?  Is there a case where we'd need to?
                if (value === null) {
                    return NaN;
                }
                if (
                    typeof value === "number" ||
                    (typeof value?.re === "number" &&
                        typeof value?.im === "number")
                ) {
                    return value;
                }

                let number = Number(value);
                if (Number.isNaN(number)) {
                    try {
                        // `?? NaN` is belt and braces: `plainComplex` passes
                        // anything that is not a `Complex` straight through, and
                        // `evaluate_to_constant()` used to hand it a `null` for
                        // a free variable or a blank, which coerces to `0`. It
                        // answers `NaN` for those now.
                        number =
                            plainComplex(
                                me
                                    .fromAst(textToAst.convert(value))
                                    .evaluate_to_constant(),
                            ) ?? NaN;
                    } catch (e) {
                        number = NaN;
                    }
                }
                return number;
            },
            inverseDefinition: async function ({
                desiredStateVariableValues,
                dependencyValues,
                stateValues,
                overrideFixed,
            }) {
                if (!(await stateValues.canBeModified) && !overrideFixed) {
                    return { success: false };
                }

                let desiredValue = numberFromDesiredValue(
                    desiredStateVariableValues.value,
                    dependencyValues.valueOnNaN,
                );

                if (!dependencyValues.singleNumberOrStringChild) {
                    // invert only if have just a single math child
                    if (dependencyValues.singleMathChild) {
                        return {
                            success: true,
                            instructions: [
                                {
                                    setDependency: "allChildren",
                                    desiredValue:
                                        numberToMathExpression(desiredValue),
                                    childIndex: 0,
                                    variableIndex: 0,
                                },
                            ],
                        };
                    } else {
                        // for any other combination that isn't single number or string,
                        // we can't invert
                        return { success: false };
                    }
                }

                let instructions;

                if (dependencyValues.numberChild.length === 0) {
                    if (dependencyValues.stringChild.length === 0) {
                        instructions = [
                            {
                                setEssentialValue: "value",
                                value: plainComplex(
                                    numberToMathExpression(
                                        desiredValue,
                                    ).evaluate_to_constant(),
                                ), // to normalize form
                            },
                        ];
                    } else {
                        // TODO: would it be more efficient to defer setting value of string?
                        instructions = [
                            {
                                setDependency: "stringChild",
                                desiredValue:
                                    numberToMathExpression(
                                        desiredValue,
                                    ).toString(),
                                childIndex: 0,
                                variableIndex: 0,
                            },
                        ];
                    }
                } else {
                    instructions = [
                        {
                            setDependency: "numberChild",
                            desiredValue: desiredValue,
                            childIndex: 0,
                            variableIndex: 0,
                        },
                    ];
                }

                return {
                    success: true,
                    instructions,
                };
            },
        };

        stateVariableDefinitions.valueForDisplay = {
            returnDependencies: () => ({
                value: {
                    dependencyType: "stateVariable",
                    variableName: "value",
                },
                displayDigits: {
                    dependencyType: "stateVariable",
                    variableName: "displayDigits",
                },
                displaySmallAsZero: {
                    dependencyType: "stateVariable",
                    variableName: "displaySmallAsZero",
                },
                displayDecimals: {
                    dependencyType: "stateVariable",
                    variableName: "displayDecimals",
                },
            }),
            definition: function ({ dependencyValues }) {
                return {
                    setValue: {
                        valueForDisplay:
                            numberValueForDisplay(dependencyValues),
                    },
                };
            },
        };

        stateVariableDefinitions.text = {
            description: "The number rendered as plain text.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            forRenderer: true,
            returnDependencies: () => ({
                valueForDisplay: {
                    dependencyType: "stateVariable",
                    variableName: "valueForDisplay",
                },
                padZeros: {
                    dependencyType: "stateVariable",
                    variableName: "padZeros",
                },
                avoidScientificNotation: {
                    dependencyType: "stateVariable",
                    variableName: "avoidScientificNotation",
                },
                displayDigits: {
                    dependencyType: "stateVariable",
                    variableName: "displayDigits",
                },
                displayDecimals: {
                    dependencyType: "stateVariable",
                    variableName: "displayDecimals",
                },
                value: {
                    dependencyType: "stateVariable",
                    variableName: "value",
                    onlyToSetInInverseDefinition: true,
                },
            }),
            definition: function ({ dependencyValues }) {
                return {
                    setValue: {
                        text: numberDisplayString({
                            ...dependencyValues,
                            format: "text",
                        }),
                    },
                };
            },
            inverseDefinition({ desiredStateVariableValues }) {
                const desiredNumber = numberFromDesiredText(
                    desiredStateVariableValues.text,
                );
                if (desiredNumber === null) {
                    return { success: false };
                }
                return {
                    success: true,
                    instructions: [
                        {
                            setDependency: "value",
                            desiredValue: desiredNumber,
                        },
                    ],
                };
            },
        };

        stateVariableDefinitions.math =
            mathStateVariableFromNumberStateVariable({
                numberVariableName: "value",
                mathVariableName: "math",
                isPublic: true,
            });

        stateVariableDefinitions.math.description =
            "The number's value as a math expression.";

        stateVariableDefinitions.math.shadowingInstructions.addAttributeComponentsShadowingStateVariables =
            returnNumberDisplayAttributeComponentShadowing();

        stateVariableDefinitions.latex = {
            description: "The number rendered as LaTeX.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "latex",
            },
            returnDependencies: () => ({
                valueForDisplay: {
                    dependencyType: "stateVariable",
                    variableName: "valueForDisplay",
                },
                padZeros: {
                    dependencyType: "stateVariable",
                    variableName: "padZeros",
                },
                avoidScientificNotation: {
                    dependencyType: "stateVariable",
                    variableName: "avoidScientificNotation",
                },
                displayDigits: {
                    dependencyType: "stateVariable",
                    variableName: "displayDigits",
                },
                displayDecimals: {
                    dependencyType: "stateVariable",
                    variableName: "displayDecimals",
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        latex: numberDisplayString({
                            ...dependencyValues,
                            format: "latex",
                        }),
                    },
                };
            },
        };

        stateVariableDefinitions.canBeModified = {
            returnDependencies: () => ({
                numberChildModifiable: {
                    dependencyType: "child",
                    childGroups: ["numbers"],
                    variableNames: ["canBeModified"],
                },
                modifyIndirectly: {
                    dependencyType: "stateVariable",
                    variableName: "modifyIndirectly",
                },
                fixed: {
                    dependencyType: "stateVariable",
                    variableName: "fixed",
                },
                singleNumberOrStringChild: {
                    dependencyType: "stateVariable",
                    variableName: "singleNumberOrStringChild",
                },
                singleMathChild: {
                    dependencyType: "stateVariable",
                    variableName: "singleMathChild",
                },
            }),
            definition: function ({ dependencyValues }) {
                if (
                    !dependencyValues.modifyIndirectly ||
                    dependencyValues.fixed ||
                    !(
                        dependencyValues.singleNumberOrStringChild ||
                        dependencyValues.singleMathChild
                    )
                ) {
                    return { setValue: { canBeModified: false } };
                }

                if (
                    dependencyValues.numberChildModifiable.length === 1 &&
                    !dependencyValues.numberChildModifiable[0].stateValues
                        .canBeModified
                ) {
                    return { setValue: { canBeModified: false } };
                }

                return { setValue: { canBeModified: true } };
            },
        };

        addClickTargetStateVariableDefinition(stateVariableDefinitions);

        return stateVariableDefinitions;
    }

    // returnSerializeInstructions() {
    //   let stringMatches = this.childLogic.returnMatches("atMostOneString");
    //   let skipChildren = stringMatches && stringMatches.length === 1;
    //   if (skipChildren) {
    //     let stateVariables = ["value"];
    //     return { skipChildren, stateVariables };
    //   }
    //   return {};
    // }

    static adapters = [
        {
            stateVariable: "math",
            stateVariablesToShadow: Object.keys(
                returnNumberDisplayStateVariableDefinitions(),
            ),
        },
        "text",
    ];

    async moveNumber({
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

    async numberClicked({
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

    async numberFocused({
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
