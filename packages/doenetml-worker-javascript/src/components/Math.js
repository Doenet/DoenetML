import InlineComponent from "./abstract/InlineComponent";
import me from "math-expressions";
import {
    normalizeMathExpression,
    convertValueToMathExpression,
    vectorOperators,
    flattenDeep,
    returnSelectedStyleStateVariableDefinition,
    returnTextStyleDescriptionDefinitions,
    deepCompare,
} from "@doenet/utils";
import {
    moveGraphicalObjectWithAnchorAction,
    returnAnchorAttributes,
    returnAnchorStateVariableDefinition,
} from "../utils/graphical";
import {
    returnNumberDisplayAttributes,
    returnNumberDisplayStateVariableDefinitions,
    returnNumberDisplayAttributeComponentShadowing,
} from "../utils/numberDisplay";
import {
    textToMathFactory,
    unicodeToSuperSubscripts,
    plainComplex,
    preprocessMathInverseDefinition,
} from "../utils/math";
import {
    invertMathValue,
    mathCodePre,
    mathCodesAdjacentToStrings,
    mathDisplayString,
    mathExpressionWithCodes,
    mathInverseAnalysis,
    mathStringsFromExpressionWithCodes,
    mathValueForDisplay,
    mathValueFromCodes,
} from "../utils/valueFunctions/math";
import { returnMathVectorMatrixStateVariableDefinitions } from "../utils/mathVectorMatrixStateVariables";

export default class MathComponent extends InlineComponent {
    constructor(args) {
        super(args);

        Object.assign(this.actions, {
            moveMath: this.moveMath.bind(this),
            mathClicked: this.mathClicked.bind(this),
            mathFocused: this.mathFocused.bind(this),
        });
    }
    static componentType = "math";

    static componentDocs = {
        summary: "A math expression",
    };
    // used when creating new component via adapter or copy prop
    static primaryStateVariableForDefinition = "unnormalizedValue";

    // for a `copy` of a property,
    // make sure it doesn't use the essential state variable unnormalizedValue
    static primaryEssentialStateVariable = "value";

    static variableForImplicitProp = "value";
    static implicitPropReturnsSameType = true;
    static variableForIndexAsProp = "vector";

    static descendantCompositesMustHaveAReplacement = true;
    static descendantCompositesDefaultReplacementType = "math";

    /**
     * Whether the value is a location (`isLocation`), which `fixLocation`
     * keeps from changing. A math's value is not: `fixLocation` keeps it
     * where it is drawn (its `anchor`), not at its value. A `<coords>`'s
     * value is the coordinates of the point it belongs to.
     */
    static valueIsLocation = false;

    static createAttributesObject() {
        let attributes = super.createAttributesObject();
        attributes.format = {
            description: "Input format.",
            createComponentOfType: "text",
            createStateVariable: "format",
            defaultValue: "text",
            public: true,
            highlighted: true,
            toLowerCase: true,
            validValues: [
                {
                    value: "text",
                    description: "Plain-text math notation (e.g., `x^2 + 1`).",
                },
                {
                    value: "latex",
                    description: "LaTeX-formatted math (e.g., `x^{2} + 1`).",
                },
            ],
        };
        // let simplify="" or simplify="true" be full simplify
        attributes.simplify = {
            description: "Level of simplification applied to the expression.",
            createComponentOfType: "text",
            createStateVariable: "simplify",
            defaultValue: "none",
            public: true,
            highlighted: true,
            toLowerCase: true,
            valueForTrue: "full",
            valueForFalse: "none",
            validValues: [
                {
                    value: "none",
                    description: "No simplification is applied.",
                },
                {
                    value: "full",
                    description: "Fully simplify the expression.",
                },
                {
                    value: "numbers",
                    description:
                        "Simplify numeric subexpressions only, leaving symbolic structure intact.",
                },
                {
                    value: "numbersPreserveOrder",
                    description:
                        "Like `numbers`, but does not reorder commutative operands.",
                },
                {
                    value: "normalizeOrder",
                    description:
                        "Reorder commutative operands into a canonical form without simplifying values.",
                },
            ],
        };
        attributes.expand = {
            description: "Whether to expand the expression.",
            createComponentOfType: "boolean",
            createStateVariable: "expand",
            defaultValue: false,
            public: true,
        };

        Object.assign(attributes, returnNumberDisplayAttributes());
        // Highlight the most commonly tuned number-display attribute. Because
        // it keeps its `groupName`, it appears both in the Highlighted section
        // and in the "Number display" group.
        attributes.displayDigits.highlighted = true;

        attributes.renderMode = {
            description: "How the math is rendered.",
            createComponentOfType: "text",
            createStateVariable: "renderMode",
            defaultValue: "inline",
            toLowerCase: true,
            // The math renderer understands two further modes, neither of
            // which `<math>` can reach. `numbered` needs an `equationTag` state
            // variable to fill its `\tag{}`, and only the equation components
            // (`<me>`, `<men>`, `<odeSystem>`) define one. `align` needs `&`
            // alignment markers in the LaTeX, which the math-expressions
            // expression underlying `<math>` cannot carry — that mode is
            // reached through components like `<md>` instead.
            validValues: [
                {
                    value: "inline",
                    description: "Render inline with the surrounding text.",
                },
                {
                    value: "display",
                    description:
                        "Render as a centered equation on its own line.",
                },
            ],
            public: true,
            forRenderer: true,
        };
        attributes.unordered = {
            createComponentOfType: "boolean",
            description:
                "Whether tuple- or list-like math expressions should be treated as unordered for comparison.",
        };
        attributes.createVectors = {
            description:
                "Whether tuple-like expressions are interpreted as vectors.",
            createComponentOfType: "boolean",
            createStateVariable: "createVectors",
            defaultValue: false,
            public: true,
        };
        attributes.createIntervals = {
            description:
                "Whether range expressions are interpreted as intervals.",
            createComponentOfType: "boolean",
            createStateVariable: "createIntervals",
            defaultValue: false,
            public: true,
        };

        attributes.functionSymbols = {
            description: "Symbols treated as function names when parsing.",
            createComponentOfType: "textList",
            createStateVariable: "functionSymbols",
            defaultValue: ["f", "g"],
            public: true,
            fallBackToParentStateVariable: "functionSymbols",
            fallBackToSourceCompositeStateVariable: "functionSymbols",
        };

        attributes.referencesAreFunctionSymbols = {
            createReferences: true,
            createStateVariable: "referencesAreFunctionSymbols",
            defaultValue: [],
            fallBackToParentStateVariable: "referencesAreFunctionSymbols",
            fallBackToSourceCompositeStateVariable:
                "referencesAreFunctionSymbols",
            description:
                "References whose names should be treated as function symbols when parsing.",
        };

        attributes.splitSymbols = {
            description:
                "Whether multi-character symbols are split into a product of variables.",
            createComponentOfType: "boolean",
            createStateVariable: "splitSymbols",
            defaultValue: true,
            public: true,
            fallBackToParentStateVariable: "splitSymbols",
            fallBackToSourceCompositeStateVariable: "splitSymbols",
        };

        attributes.parseScientificNotation = {
            description:
                "Whether to parse expressions like 1e3 as scientific notation.",
            createComponentOfType: "boolean",
            createStateVariable: "parseScientificNotation",
            defaultValue: false,
            public: true,
            fallBackToParentStateVariable: "parseScientificNotation",
        };

        attributes.displayBlanks = {
            description: "Whether blanks (placeholders) are visibly rendered.",
            createComponentOfType: "boolean",
            createStateVariable: "displayBlanks",
            defaultValue: true,
            public: true,
        };

        attributes.assumptions = {
            description: "Assumptions applied when simplifying or comparing.",
            createComponentOfType: "math",
            createStateVariable: "assumptions",
            defaultValue: me.fromAst("\uff3f"), // long underscore
            public: true,
        };

        attributes.draggable = {
            description:
                "Whether the math component can be dragged on a graph.",
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

    static returnChildGroups() {
        return [
            {
                group: "maths",
                componentTypes: ["math"],
            },
            {
                group: "strings",
                componentTypes: ["string"],
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
            childGroupsIfSingleMatch: ["maths"],
            childGroupsToStopSingleMatch: ["strings"],
        });
        Object.assign(stateVariableDefinitions, roundingDefinitions);

        // valueShadow will be long underscore unless math was created
        // from serialized state with unnormalizedValue
        stateVariableDefinitions.valueShadow = {
            defaultValue: me.fromAst("\uff3f"), // long underscore
            hasEssential: true,
            essentialVarName: "value",
            returnDependencies: () => ({}),
            definition: () => ({
                useEssentialOrDefaultValue: {
                    valueShadow: true,
                },
            }),
            inverseDefinition: function ({ desiredStateVariableValues }) {
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

        stateVariableDefinitions.unordered = {
            description: "Whether list-like values are treated as unordered.",
            defaultValue: false,
            public: true,
            shadowingInstructions: {
                createComponentOfType: "boolean",
            },
            hasEssential: true,
            returnDependencies: () => ({
                unorderedAttr: {
                    dependencyType: "attributeComponent",
                    attributeName: "unordered",
                    variableNames: ["value"],
                },
                mathChildren: {
                    dependencyType: "child",
                    childGroups: ["maths"],
                    variableNames: ["unordered"],
                },
            }),
            definition({ dependencyValues }) {
                if (dependencyValues.unorderedAttr === null) {
                    if (dependencyValues.mathChildren.length > 0) {
                        let unordered = dependencyValues.mathChildren.every(
                            (x) => x.stateValues.unordered,
                        );
                        return { setValue: { unordered } };
                    } else {
                        return {
                            useEssentialOrDefaultValue: {
                                unordered: true,
                            },
                        };
                    }
                } else {
                    return {
                        setValue: {
                            unordered:
                                dependencyValues.unorderedAttr.stateValues
                                    .value,
                        },
                    };
                }
            },
        };

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

        stateVariableDefinitions.codePre = {
            // deferCalculation: false,
            returnDependencies: () => ({
                stringChildren: {
                    dependencyType: "child",
                    childGroups: ["strings"],
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        codePre: mathCodePre(dependencyValues.stringChildren),
                    },
                };
            },
        };

        stateVariableDefinitions.mathChildrenFunctionSymbols = {
            returnDependencies: () => ({
                referencesAreFunctionSymbols: {
                    dependencyType: "stateVariable",
                    variableName: "referencesAreFunctionSymbols",
                },
                mathChildren: {
                    dependencyType: "child",
                    childGroups: ["maths"],
                },
            }),
            definition({ dependencyValues }) {
                let mathChildrenFunctionSymbols = [];
                if (dependencyValues.mathChildren.compositeReplacementRange) {
                    for (let compositeInfo of dependencyValues.mathChildren
                        .compositeReplacementRange) {
                        if (
                            dependencyValues.referencesAreFunctionSymbols.some(
                                (reference) =>
                                    reference.componentIdx ===
                                        compositeInfo.extendIdx &&
                                    deepCompare(
                                        reference.unresolvedPath,
                                        compositeInfo.unresolvedPath,
                                    ),
                            )
                        ) {
                            for (
                                let ind = compositeInfo.firstInd;
                                ind <= compositeInfo.lastInd;
                                ind++
                            ) {
                                mathChildrenFunctionSymbols.push(ind);
                            }
                        }
                    }
                }

                return { setValue: { mathChildrenFunctionSymbols } };
            },
        };

        stateVariableDefinitions.expressionWithCodes = {
            hasEssential: true,
            doNotShadowEssential: true,
            returnDependencies: () => ({
                stringMathChildren: {
                    dependencyType: "child",
                    childGroups: ["strings", "maths"],
                },
                // have stringChildren and mathChildren just for inverse definition
                stringChildren: {
                    dependencyType: "child",
                    childGroups: ["strings"],
                },
                mathChildren: {
                    dependencyType: "child",
                    childGroups: ["maths"],
                },
                format: {
                    dependencyType: "stateVariable",
                    variableName: "format",
                },
                codePre: {
                    dependencyType: "stateVariable",
                    variableName: "codePre",
                },
                functionSymbols: {
                    dependencyType: "stateVariable",
                    variableName: "functionSymbols",
                },
                mathChildrenFunctionSymbols: {
                    dependencyType: "stateVariable",
                    variableName: "mathChildrenFunctionSymbols",
                },
                splitSymbols: {
                    dependencyType: "stateVariable",
                    variableName: "splitSymbols",
                },
                parseScientificNotation: {
                    dependencyType: "stateVariable",
                    variableName: "parseScientificNotation",
                },
            }),
            set: (x) => (x === null ? null : convertValueToMathExpression(x)),
            definition: calculateExpressionWithCodes,
            async inverseDefinition({
                desiredStateVariableValues,
                dependencyValues,
                stateValues,
            }) {
                let newExpressionWithCodes =
                    desiredStateVariableValues.expressionWithCodes;

                let instructions = [
                    {
                        setEssentialValue: "expressionWithCodes",
                        value: newExpressionWithCodes,
                    },
                ];

                let nStringChildren = dependencyValues.stringChildren.length;

                if (nStringChildren === 0) {
                    // don't use expressionWithCodes if no children
                    // and expressionWithCodes will not change if no string children
                    return { success: false };
                }

                const strings = mathStringsFromExpressionWithCodes({
                    expressionWithCodes: newExpressionWithCodes,
                    format: await stateValues.format,
                    numStrings: nStringChildren,
                    numMaths: dependencyValues.mathChildren.length,
                    codesAdjacentToStrings:
                        dependencyValues.mathChildren.length === 0
                            ? []
                            : await stateValues.codesAdjacentToStrings,
                });

                for (let [ind, desiredValue] of strings.entries()) {
                    instructions.push({
                        setDependency: "stringChildren",
                        desiredValue,
                        childIndex: ind,
                        variableIndex: 0,
                        ignoreChildChangeForComponent: true,
                    });
                }

                return {
                    success: true,
                    instructions,
                };
            },
        };

        stateVariableDefinitions.mathChildrenWithCanBeModified = {
            returnDependencies: () => ({
                mathChildren: {
                    dependencyType: "child",
                    childGroups: ["maths"],
                    variableNames: ["value", "canBeModified"],
                },
            }),
            definition: ({ dependencyValues }) => ({
                setValue: {
                    mathChildrenWithCanBeModified:
                        dependencyValues.mathChildren,
                },
            }),
        };

        stateVariableDefinitions.unnormalizedValue = {
            isLocation: this.valueIsLocation,
            returnDependencies: () => ({
                mathChildren: {
                    dependencyType: "child",
                    childGroups: ["maths"],
                    variableNames: ["value"],
                },
                // Note: need stringChildren for inverse definition
                // (even though not in definition)
                stringChildren: {
                    dependencyType: "child",
                    childGroups: ["strings"],
                    variableNames: ["value"],
                },
                expressionWithCodes: {
                    dependencyType: "stateVariable",
                    variableName: "expressionWithCodes",
                },
                codePre: {
                    dependencyType: "stateVariable",
                    variableName: "codePre",
                },
                valueShadow: {
                    dependencyType: "stateVariable",
                    variableName: "valueShadow",
                },
            }),
            set: convertValueToMathExpression,
            hasEssential: true,
            defaultValue: me.fromAst("\uff3f"), // long underscore
            definition: calculateMathValue,
            inverseDefinition: invertMath,
        };

        stateVariableDefinitions.value = {
            description: "The math expression value.",
            isLocation: this.valueIsLocation,
            public: true,
            shadowingInstructions: {
                createComponentOfType: this.componentType,
                attributesToShadow: ["unordered", "simplify", "expand"],
                // the reason we create a attribute component from the state variable fixed,
                // rather than just shadowing the attribute,
                // is that a sequence creates a math where it sets fixed directly in the state
                addAttributeComponentsShadowingStateVariables: {
                    fixed: {
                        stateVariableToShadow: "fixed",
                    },
                    ...returnNumberDisplayAttributeComponentShadowing(),
                },
            },
            returnDependencies: () => ({
                unnormalizedValue: {
                    dependencyType: "stateVariable",
                    variableName: "unnormalizedValue",
                },
                simplify: {
                    dependencyType: "stateVariable",
                    variableName: "simplify",
                },
                expand: {
                    dependencyType: "stateVariable",
                    variableName: "expand",
                },
                createVectors: {
                    dependencyType: "stateVariable",
                    variableName: "createVectors",
                },
                createIntervals: {
                    dependencyType: "stateVariable",
                    variableName: "createIntervals",
                },
                assumptions: {
                    dependencyType: "stateVariable",
                    variableName: "assumptions",
                },
            }),
            definition: function ({ dependencyValues }) {
                let value = dependencyValues.unnormalizedValue;

                let {
                    simplify,
                    expand,
                    createVectors,
                    createIntervals,
                    assumptions,
                } = dependencyValues;

                value = normalizeMathExpression({
                    value,
                    simplify,
                    expand,
                    createVectors,
                    createIntervals,
                    assumptions,
                });

                return { setValue: { value } };
            },
            inverseDefinition: function ({ desiredStateVariableValues }) {
                return {
                    success: true,
                    instructions: [
                        {
                            setDependency: "unnormalizedValue",
                            desiredValue: desiredStateVariableValues.value,
                        },
                    ],
                };
            },
        };

        stateVariableDefinitions.number = {
            description:
                "The numeric value of the expression (NaN if not a number).",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "number",
                addAttributeComponentsShadowingStateVariables:
                    returnNumberDisplayAttributeComponentShadowing(),
            },
            returnDependencies: () => ({
                value: {
                    dependencyType: "stateVariable",
                    variableName: "value",
                },
            }),
            definition: function ({ dependencyValues }) {
                // `plainComplex` because a math.js `Complex` does not survive
                // the structured clone to the main thread with its prototype,
                // and `?? NaN` as belt and braces: `plainComplex` passes
                // anything that is not a `Complex` straight through, and this
                // variable's own description promises NaN for anything that is
                // not a number. `evaluate_to_constant()` reports `x+y` as
                // `NaN` itself, so the `??` no longer has a case it must catch.
                let number =
                    plainComplex(
                        dependencyValues.value.evaluate_to_constant(),
                    ) ?? NaN;
                return { setValue: { number } };
            },
            inverseDefinition: function ({ desiredStateVariableValues }) {
                return {
                    success: true,
                    instructions: [
                        {
                            setDependency: "value",
                            desiredValue: me.fromAst(
                                desiredStateVariableValues.number,
                            ),
                        },
                    ],
                };
            },
        };

        // isNumber is true if the value of the math is an actual number
        stateVariableDefinitions.isNumber = {
            description: "Whether the expression evaluates to a finite number.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "boolean",
            },
            returnDependencies: () => ({
                value: {
                    dependencyType: "stateVariable",
                    variableName: "value",
                },
            }),
            definition: function ({ dependencyValues }) {
                return {
                    setValue: {
                        isNumber: Number.isFinite(dependencyValues.value.tree),
                    },
                };
            },
        };

        // isNumeric is weaker than isNumber
        // isNumeric is true if the value can be evaluated as a number,
        // i.e., if the number state variable is a number
        stateVariableDefinitions.isNumeric = {
            description:
                "Whether the expression evaluates to any number (including infinities).",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "boolean",
            },
            returnDependencies: () => ({
                number: {
                    dependencyType: "stateVariable",
                    variableName: "number",
                },
            }),
            definition: function ({ dependencyValues }) {
                return {
                    setValue: {
                        isNumeric: Number.isFinite(dependencyValues.number),
                    },
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
                displayDecimals: {
                    dependencyType: "stateVariable",
                    variableName: "displayDecimals",
                },
                displaySmallAsZero: {
                    dependencyType: "stateVariable",
                    variableName: "displaySmallAsZero",
                },
                simplify: {
                    dependencyType: "stateVariable",
                    variableName: "simplify",
                },
                expand: {
                    dependencyType: "stateVariable",
                    variableName: "expand",
                },
            }),
            definition: function ({ dependencyValues }) {
                return {
                    setValue: {
                        valueForDisplay: mathValueForDisplay(dependencyValues),
                    },
                };
            },
            inverseDefinition({ desiredStateVariableValues }) {
                return {
                    success: true,
                    instructions: [
                        {
                            setDependency: "value",
                            desiredValue:
                                desiredStateVariableValues.valueForDisplay,
                        },
                    ],
                };
            },
        };

        stateVariableDefinitions.latex = {
            description: "The expression rendered as a LaTeX string.",
            public: true,
            forRenderer: true,
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
                displayBlanks: {
                    dependencyType: "stateVariable",
                    variableName: "displayBlanks",
                },
            }),
            definition: function ({ dependencyValues }) {
                return {
                    setValue: {
                        latex: mathDisplayString({
                            ...dependencyValues,
                            format: "latex",
                        }),
                    },
                };
            },
            inverseDefinition({ desiredStateVariableValues }) {
                let value;
                try {
                    value = me.fromLatex(desiredStateVariableValues.latex);
                } catch (e) {
                    return { success: false };
                }
                return {
                    success: true,
                    instructions: [
                        {
                            setDependency: "valueForDisplay",
                            desiredValue: value,
                        },
                    ],
                };
            },
        };

        stateVariableDefinitions.text = {
            description: "The expression rendered as a plain text string.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
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
                value: {
                    dependencyType: "stateVariable",
                    variableName: "value",
                    onlyToSetInInverseDefinition: true,
                },
                displayBlanks: {
                    dependencyType: "stateVariable",
                    variableName: "displayBlanks",
                },
            }),
            definition: function ({ dependencyValues }) {
                return {
                    setValue: {
                        text: mathDisplayString({
                            ...dependencyValues,
                            format: "text",
                        }),
                    },
                };
            },
            async inverseDefinition({
                desiredStateVariableValues,
                stateValues,
            }) {
                let fromText = textToMathFactory({
                    functionSymbols: await stateValues.functionSymbols,
                    splitSymbols: await stateValues.splitSymbols,
                    parseScientificNotation:
                        await stateValues.parseScientificNotation,
                });

                let expr;
                try {
                    expr = fromText(
                        unicodeToSuperSubscripts(
                            desiredStateVariableValues.text,
                        ),
                    );
                } catch (e) {
                    return { success: false };
                }

                return {
                    success: true,
                    instructions: [
                        {
                            setDependency: "value",
                            desiredValue: expr,
                        },
                    ],
                };
            },
        };

        stateVariableDefinitions.codesAdjacentToStrings = {
            returnDependencies: () => ({
                stringMathChildren: {
                    dependencyType: "child",
                    childGroups: ["strings", "maths"],
                },
                codePre: {
                    dependencyType: "stateVariable",
                    variableName: "codePre",
                },
                format: {
                    dependencyType: "stateVariable",
                    variableName: "format",
                },
            }),
            definition: ({ dependencyValues }) => ({
                setValue: {
                    codesAdjacentToStrings: mathCodesAdjacentToStrings({
                        content: dependencyValues.stringMathChildren,
                        codePre: dependencyValues.codePre,
                        format: dependencyValues.format,
                    }),
                },
            }),
        };

        const valueIsLocation = this.valueIsLocation;
        stateVariableDefinitions.canBeModified = {
            additionalStateVariablesDefined: [
                "constantChildIndices",
                "codeForExpression",
                "inverseMaps",
                "template",
                "mathChildrenMapped",
            ],
            returnDependencies: () => ({
                mathChildrenModifiable: {
                    dependencyType: "child",
                    childGroups: ["maths"],
                    variableNames: ["canBeModified"],
                },
                expressionWithCodes: {
                    dependencyType: "stateVariable",
                    variableName: "expressionWithCodes",
                },
                modifyIndirectly: {
                    dependencyType: "stateVariable",
                    variableName: "modifyIndirectly",
                },
                fixed: {
                    dependencyType: "stateVariable",
                    variableName: "fixed",
                },
                // only a value that is a location stays put under
                // `fixLocation`
                ...(valueIsLocation
                    ? {
                          fixLocation: {
                              dependencyType: "stateVariable",
                              variableName: "fixLocation",
                          },
                      }
                    : {}),
                codePre: {
                    dependencyType: "stateVariable",
                    variableName: "codePre",
                },
            }),
            definition: ({ dependencyValues }) => ({
                setValue: mathInverseAnalysis({
                    expressionWithCodes: dependencyValues.expressionWithCodes,
                    codePre: dependencyValues.codePre,
                    childCanBeModified:
                        dependencyValues.mathChildrenModifiable.map(
                            (child) => child.stateValues.canBeModified,
                        ),
                    modifyIndirectly: dependencyValues.modifyIndirectly,
                    fixed: dependencyValues.fixed,
                    fixLocation: Boolean(dependencyValues.fixLocation),
                }),
            }),
        };

        stateVariableDefinitions.mathChildrenByVectorComponent = {
            returnDependencies: () => ({
                codePre: {
                    dependencyType: "stateVariable",
                    variableName: "codePre",
                },
                mathChildren: {
                    dependencyType: "child",
                    childGroups: ["maths"],
                },
                expressionWithCodes: {
                    dependencyType: "stateVariable",
                    variableName: "expressionWithCodes",
                },
            }),
            definition: function ({ dependencyValues }) {
                if (dependencyValues.expressionWithCodes === null) {
                    return {
                        setValue: { mathChildrenByVectorComponent: null },
                    };
                }
                let expressionWithCodesTree =
                    dependencyValues.expressionWithCodes.tree;
                let nMathChildren = dependencyValues.mathChildren.length;

                if (
                    nMathChildren === 0 ||
                    !Array.isArray(expressionWithCodesTree) ||
                    !vectorOperators.includes(expressionWithCodesTree[0])
                ) {
                    return {
                        setValue: { mathChildrenByVectorComponent: null },
                    };
                }

                let mathChildrenByVectorComponent = {};

                let childInd = 0;
                let childCode = dependencyValues.codePre + childInd;

                for (let ind = 1; ind < expressionWithCodesTree.length; ind++) {
                    let exprComp = expressionWithCodesTree[ind];
                    let mc = (mathChildrenByVectorComponent[ind] = []);

                    if (Array.isArray(exprComp)) {
                        let flattenedComp = flattenDeep(exprComp);
                        while (flattenedComp.includes(childCode)) {
                            mc.push(childInd);
                            childInd++;
                            childCode = dependencyValues.codePre + childInd;
                        }
                    } else {
                        if (exprComp === childCode) {
                            mc.push(childInd);
                            childInd++;
                            childCode = dependencyValues.codePre + childInd;
                        }
                    }

                    if (childInd >= nMathChildren) {
                        break;
                    }
                }

                return { setValue: { mathChildrenByVectorComponent } };
            },
        };

        Object.assign(
            stateVariableDefinitions,
            returnMathVectorMatrixStateVariableDefinitions(),
        );

        return stateVariableDefinitions;
    }

    static adapters = [
        {
            stateVariable: "number",
            stateVariablesToShadow: Object.keys(
                returnNumberDisplayStateVariableDefinitions(),
            ),
        },
        "text",
        { componentType: "point", stateVariable: "value" },
        { componentType: "vector", stateVariable: "value" },
        {
            componentType: "subsetOfReals",
            stateVariable: "value",
            substituteForPrimaryStateVariable: "subsetValue",
        },
        {
            stateVariable: "value",
            componentType: "_directionComponent",
            stateVariablesToShadow: Object.keys(
                returnNumberDisplayStateVariableDefinitions(),
            ),
        },
    ];

    async moveMath({
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

    async mathClicked({
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

    async mathFocused({
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

function calculateExpressionWithCodes({ dependencyValues, changes }) {
    if (!(
        ("stringMathChildren" in changes &&
            changes.stringMathChildren.componentIdentitiesChanged) ||
        "format" in changes ||
        "splitSymbols" in changes ||
        "parseScientificNotation" in changes ||
        "functionSymbols" in changes ||
        "mathChildrenFunctionSymbols" in changes
    )) {
        // if component identities of stringMathChildren didn't change
        // and format didn't change
        // then expressionWithCodes remains unchanged.
        // (We assume that the value of string children cannot change on their own.)
        return { useEssentialOrDefaultValue: { expressionWithCodes: true } };
    }

    // `null` if there are no string or math children,
    // which will indicate that value should use valueShadow
    const expressionWithCodes = mathExpressionWithCodes({
        content: dependencyValues.stringMathChildren,
        codePre: dependencyValues.codePre,
        format: dependencyValues.format,
        functionSymbols: dependencyValues.functionSymbols,
        functionSymbolChildIndices:
            dependencyValues.mathChildrenFunctionSymbols,
        splitSymbols: dependencyValues.splitSymbols,
        parseScientificNotation: dependencyValues.parseScientificNotation,
    });

    return {
        setValue: { expressionWithCodes },
        setEssentialValue: { expressionWithCodes },
    };
}

function calculateMathValue({ dependencyValues } = {}) {
    // if expressionWithCodes is null, there were no string or math children
    if (dependencyValues.expressionWithCodes === null) {
        return {
            setValue: { unnormalizedValue: dependencyValues.valueShadow },
        };
    }

    return {
        setValue: {
            unnormalizedValue: mathValueFromCodes({
                expressionWithCodes: dependencyValues.expressionWithCodes,
                codePre: dependencyValues.codePre,
                codeValues: dependencyValues.mathChildren.map(
                    (child) => child.stateValues.value,
                ),
            }),
        },
    };
}

async function invertMath({
    desiredStateVariableValues,
    dependencyValues,
    stateValues,
    workspace,
    overrideFixed,
}) {
    if (!(await stateValues.canBeModified) && !overrideFixed) {
        return { success: false };
    }

    let mathChildren = dependencyValues.mathChildren;
    let nStringChildren = dependencyValues.stringChildren.length;

    if (mathChildren.length === 1 && nStringChildren === 0) {
        // if only child is a math, just send instructions to change it to desired value
        return {
            success: true,
            instructions: [
                {
                    setDependency: "mathChildren",
                    desiredValue: desiredStateVariableValues.unnormalizedValue,
                    childIndex: 0,
                    variableIndex: 0,
                },
            ],
        };
    }

    let desiredExpression = convertValueToMathExpression(
        desiredStateVariableValues.unnormalizedValue,
    );

    let result = await preprocessMathInverseDefinition({
        desiredValue: desiredExpression,
        stateValues,
        variableName: "value",
        workspace,
    });

    let vectorComponentsNotAffected = result.vectorComponentsNotAffected;
    desiredExpression = result.desiredValue;

    let childrenToSkip = [];
    if (
        mathChildren.length > 0 &&
        vectorComponentsNotAffected &&
        (await stateValues.mathChildrenByVectorComponent)
    ) {
        let mathChildrenByVectorComponent =
            await stateValues.mathChildrenByVectorComponent;
        for (let ind of vectorComponentsNotAffected) {
            if (mathChildrenByVectorComponent[ind]) {
                childrenToSkip.push(...mathChildrenByVectorComponent[ind]);
            }
        }
    }

    let analysis = {};
    let childCanBeModified = [];
    if (mathChildren.length > 0) {
        analysis = {
            template: await stateValues.template,
            inverseMaps: await stateValues.inverseMaps,
            codeForExpression: await stateValues.codeForExpression,
            constantChildIndices: await stateValues.constantChildIndices,
            mathChildrenMapped: await stateValues.mathChildrenMapped,
        };
        childCanBeModified = (
            await stateValues.mathChildrenWithCanBeModified
        ).map((child) => child.stateValues.canBeModified);
    }

    const inverse = invertMathValue({
        desiredValue: desiredExpression,
        numStrings: nStringChildren,
        codeValues: mathChildren.map((child) => child.stateValues.value),
        childCanBeModified,
        childrenToSkip,
        analysis,
        expressionWithCodes: dependencyValues.expressionWithCodes,
        codePre: dependencyValues.codePre,
        simplify: await stateValues.simplify,
        expand: await stateValues.expand,
        createVectors: await stateValues.createVectors,
        createIntervals: await stateValues.createIntervals,
    });

    if (!inverse.success) {
        return { success: false };
    }

    let instructions = [];

    for (let childInd in inverse.childValues) {
        instructions.push({
            setDependency: "mathChildren",
            desiredValue: inverse.childValues[childInd],
            childIndex: Number(childInd),
            variableIndex: 0,
        });
    }
    if (inverse.expressionWithCodes) {
        instructions.push({
            setDependency: "expressionWithCodes",
            desiredValue: inverse.expressionWithCodes,
        });
    }
    if (inverse.valueShadow) {
        instructions.push({
            setDependency: "valueShadow",
            desiredValue: inverse.valueShadow,
        });
    }

    return {
        success: true,
        instructions,
    };
}
