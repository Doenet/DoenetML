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
    returnRoundingAttributes,
    returnRoundingStateVariableDefinitions,
    returnRoundingAttributeComponentShadowing,
} from "../utils/rounding";
import {
    textToMathFactory,
    latexToMathFactory,
    roundForDisplay,
    mergeListsWithOtherContainers,
    superSubscriptsToUnicode,
    unicodeToSuperSubscripts,
    preprocessMathInverseDefinition,
} from "../utils/math";
import { createInputStringFromChildren } from "../utils/parseMath";
import { returnMathVectorMatrixStateVariableDefinitions } from "../utils/mathVectorMatrixStateVariables";

const vectorAndListOperators = ["list", ...vectorOperators];

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

    // used when creating new component via adapter or copy prop
    static primaryStateVariableForDefinition = "unnormalizedValue";

    // for copying a property with link="false"
    // make sure it doesn't use the essential state variable unnormalizedValue
    static primaryEssentialStateVariable = "value";

    static variableForImplicitProp = "value";
    static implicitPropReturnsSameType = true;
    static variableForIndexAsProp = "vector";

    static descendantCompositesMustHaveAReplacement = true;
    static descendantCompositesDefaultReplacementType = "math";

    static createAttributesObject() {
        let attributes = super.createAttributesObject();
        attributes.format = {
            createComponentOfType: "text",
            createStateVariable: "format",
            defaultValue: "text",
            public: true,
            toLowerCase: true,
            validValues: ["text", "latex"],
        };
        // let simplify="" or simplify="true" be full simplify
        attributes.simplify = {
            createComponentOfType: "text",
            createStateVariable: "simplify",
            defaultValue: "none",
            public: true,
            toLowerCase: true,
            valueForTrue: "full",
            valueForFalse: "none",
            validValues: ["none", "full", "numbers", "numberspreserveorder"],
        };
        attributes.expand = {
            createComponentOfType: "boolean",
            createStateVariable: "expand",
            defaultValue: false,
            public: true,
        };

        Object.assign(attributes, returnRoundingAttributes());

        attributes.renderMode = {
            createComponentOfType: "text",
            createStateVariable: "renderMode",
            defaultValue: "inline",
            public: true,
            forRenderer: true,
        };
        attributes.unordered = {
            createComponentOfType: "boolean",
        };
        attributes.createVectors = {
            createComponentOfType: "boolean",
            createStateVariable: "createVectors",
            defaultValue: false,
            public: true,
        };
        attributes.createIntervals = {
            createComponentOfType: "boolean",
            createStateVariable: "createIntervals",
            defaultValue: false,
            public: true,
        };

        attributes.functionSymbols = {
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
        };

        attributes.splitSymbols = {
            createComponentOfType: "boolean",
            createStateVariable: "splitSymbols",
            defaultValue: true,
            public: true,
            fallBackToParentStateVariable: "splitSymbols",
            fallBackToSourceCompositeStateVariable: "splitSymbols",
        };

        attributes.parseScientificNotation = {
            createComponentOfType: "boolean",
            createStateVariable: "parseScientificNotation",
            defaultValue: false,
            public: true,
            fallBackToParentStateVariable: "parseScientificNotation",
        };

        attributes.displayBlanks = {
            createComponentOfType: "boolean",
            createStateVariable: "displayBlanks",
            defaultValue: true,
            public: true,
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

        let roundingDefinitions = returnRoundingStateVariableDefinitions({
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
                let codePre = "math";

                // make sure that codePre is not in any string piece
                let foundInString = false;
                do {
                    foundInString = false;

                    for (let child of dependencyValues.stringChildren) {
                        if (child.includes(codePre) === true) {
                            // found codePre in a string, so extend codePre and try again
                            foundInString = true;
                            codePre += "m";
                            break;
                        }
                    }
                } while (foundInString);

                return { setValue: { codePre } };
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

                if (dependencyValues.mathChildren.length === 0) {
                    // just string children.  Set first to value, the rest to empty strings
                    let stringValue;
                    if ((await stateValues.format) === "latex") {
                        stringValue = newExpressionWithCodes.toLatex();
                    } else {
                        stringValue = newExpressionWithCodes.toString();
                    }

                    instructions.push({
                        setDependency: "stringChildren",
                        desiredValue: stringValue,
                        childIndex: 0,
                        variableIndex: 0,
                        ignoreChildChangeForComponent: true,
                    });

                    for (let ind = 1; ind < nStringChildren; ind++) {
                        instructions.push({
                            setDependency: "stringChildren",
                            desiredValue: "",
                            childIndex: ind,
                            variableIndex: 0,
                            ignoreChildChangeForComponent: true,
                        });
                    }
                } else {
                    // have math children

                    let stringExpr;
                    if ((await stateValues.format) === "latex") {
                        stringExpr = newExpressionWithCodes.toLatex();
                    } else {
                        stringExpr = newExpressionWithCodes.toString();
                    }

                    for (let [ind, stringCodes] of (
                        await stateValues.codesAdjacentToStrings
                    ).entries()) {
                        let thisString = stringExpr;
                        if (Object.keys(stringCodes).length === 0) {
                            // string was skipped, so set it to an empty string
                            instructions.push({
                                setDependency: "stringChildren",
                                desiredValue: "",
                                childIndex: ind,
                                variableIndex: 0,
                                ignoreChildChangeForComponent: true,
                            });
                        } else {
                            if (stringCodes.prevCode) {
                                thisString = thisString.split(
                                    stringCodes.prevCode,
                                )[1];
                            }
                            if (stringCodes.nextCode) {
                                thisString = thisString.split(
                                    stringCodes.nextCode,
                                )[0];
                            }
                            instructions.push({
                                setDependency: "stringChildren",
                                desiredValue: thisString,
                                childIndex: ind,
                                variableIndex: 0,
                                ignoreChildChangeForComponent: true,
                            });
                        }
                    }
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
            isLocation: true,
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
            isLocation: true,
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
                    ...returnRoundingAttributeComponentShadowing(),
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
            }),
            definition: function ({ dependencyValues }) {
                let value = dependencyValues.unnormalizedValue;

                let { simplify, expand, createVectors, createIntervals } =
                    dependencyValues;

                value = normalizeMathExpression({
                    value,
                    simplify,
                    expand,
                    createVectors,
                    createIntervals,
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
            public: true,
            shadowingInstructions: {
                createComponentOfType: "number",
                addAttributeComponentsShadowingStateVariables:
                    returnRoundingAttributeComponentShadowing(),
            },
            returnDependencies: () => ({
                value: {
                    dependencyType: "stateVariable",
                    variableName: "value",
                },
            }),
            definition: function ({ dependencyValues }) {
                let number = dependencyValues.value.evaluate_to_constant();
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
                let value = dependencyValues.value;

                // for display via latex and text, round any decimal numbers to the significant digits
                // determined by displayDigits, displayDecimals, and/or displaySmallAsZero
                let rounded = roundForDisplay({
                    value,
                    dependencyValues,
                });

                return {
                    setValue: {
                        valueForDisplay: normalizeMathExpression({
                            value: rounded,
                            simplify: dependencyValues.simplify,
                            expand: dependencyValues.expand,
                        }),
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
                let latex;
                let params = {};
                if (dependencyValues.padZeros) {
                    if (Number.isFinite(dependencyValues.displayDecimals)) {
                        params.padToDecimals = dependencyValues.displayDecimals;
                    }
                    if (dependencyValues.displayDigits >= 1) {
                        params.padToDigits = dependencyValues.displayDigits;
                    }
                }
                if (!dependencyValues.displayBlanks) {
                    params.showBlanks = false;
                }
                try {
                    latex = dependencyValues.valueForDisplay.toLatex(params);
                } catch (e) {
                    if (dependencyValues.displayBlanks) {
                        latex = "\uff3f";
                    } else {
                        latex = "";
                    }
                }
                return { setValue: { latex } };
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
                let text;
                let params = {};
                if (dependencyValues.padZeros) {
                    if (Number.isFinite(dependencyValues.displayDecimals)) {
                        params.padToDecimals = dependencyValues.displayDecimals;
                    }
                    if (dependencyValues.displayDigits >= 1) {
                        params.padToDigits = dependencyValues.displayDigits;
                    }
                }
                if (!dependencyValues.displayBlanks) {
                    params.showBlanks = false;
                }
                try {
                    text = dependencyValues.valueForDisplay.toString(params);
                } catch (e) {
                    if (dependencyValues.displayBlanks) {
                        text = "\uff3f";
                    } else {
                        text = "";
                    }
                }
                return {
                    setValue: {
                        text: superSubscriptsToUnicode(text.toString()),
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
            definition: calculateCodesAdjacentToStrings,
        };

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
                fixLocation: {
                    dependencyType: "stateVariable",
                    variableName: "fixLocation",
                },
                codePre: {
                    dependencyType: "stateVariable",
                    variableName: "codePre",
                },
            }),
            definition: determineCanBeModified,
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
                returnRoundingStateVariableDefinitions(),
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
                returnRoundingStateVariableDefinitions(),
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
    if (
        !(
            ("stringMathChildren" in changes &&
                changes.stringMathChildren.componentIdentitiesChanged) ||
            "format" in changes ||
            "splitSymbols" in changes ||
            "parseScientificNotation" in changes ||
            "functionSymbols" in changes ||
            "mathChildrenFunctionSymbols" in changes
        )
    ) {
        // if component identities of stringMathChildren didn't change
        // and format didn't change
        // then expressionWithCodes remains unchanged.
        // (We assume that the value of string children cannot change on their own.)
        return { useEssentialOrDefaultValue: { expressionWithCodes: true } };
        // return { noChanges: ["expressionWithCodes"] };
    }

    if (dependencyValues.stringMathChildren.length === 0) {
        // if don't have any string or math children,
        // set expressionWithCodes to be null,
        // which will indicate that value should use valueShadow
        return {
            setValue: { expressionWithCodes: null },
            setEssentialValue: { expressionWithCodes: null },
        };
    }

    let functionSymbols = [...dependencyValues.functionSymbols];
    functionSymbols.push(
        ...dependencyValues.mathChildrenFunctionSymbols.map(
            (x) => dependencyValues.codePre + x,
        ),
    );

    let parser;

    if (dependencyValues.format === "text") {
        parser = textToMathFactory({
            functionSymbols,
            splitSymbols: dependencyValues.splitSymbols,
            parseScientificNotation: dependencyValues.parseScientificNotation,
        });
    } else if (dependencyValues.format === "latex") {
        parser = latexToMathFactory({
            functionSymbols,
            splitSymbols: dependencyValues.splitSymbols,
            parseScientificNotation: dependencyValues.parseScientificNotation,
        });
    }

    let stringResults = createInputStringFromChildren({
        children: dependencyValues.stringMathChildren,
        codePre: dependencyValues.codePre,
        format: dependencyValues.format,
        parser,
    });

    let inputString = stringResults.string;

    let expressionWithCodes = null;

    if (inputString === "") {
        expressionWithCodes = me.fromAst("\uFF3F"); // long underscore
    } else {
        try {
            expressionWithCodes = parser(inputString);
        } catch (e) {
            expressionWithCodes = me.fromAst("\uFF3F"); // long underscore
            console.log(
                `Invalid value for a math of ${dependencyValues.format} format: ` +
                    inputString,
            );
        }
    }

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

    let subsMapping = {};
    for (let [ind, child] of dependencyValues.mathChildren.entries()) {
        subsMapping[dependencyValues.codePre + ind] = child.stateValues.value;
    }

    let value = dependencyValues.expressionWithCodes;
    if (dependencyValues.mathChildren.length > 0) {
        value = value.substitute(subsMapping);
    }

    value = me.fromAst(mergeListsWithOtherContainers(value.tree));

    return {
        setValue: { unnormalizedValue: value },
    };
}

function calculateCodesAdjacentToStrings({ dependencyValues }) {
    // create codesAdjacentToStrings object that gives substitution codes
    // that are just before and after each string child
    let codesAdjacentToStrings = [];
    let mathInd;
    for (let [ind, child] of dependencyValues.stringMathChildren.entries()) {
        if (typeof child === "string") {
            let nextChild = dependencyValues.stringMathChildren[ind + 1];
            if (nextChild !== undefined && typeof nextChild === "string") {
                // if following child is also a string, we'll skip the first string
                // which means, when inverting, the first string will just be set to blank
                continue;
            }

            let subCodes = {};
            if (mathInd !== undefined) {
                if (dependencyValues.format === "latex") {
                    subCodes.prevCode =
                        "\\operatorname{" +
                        dependencyValues.codePre +
                        mathInd +
                        "}";
                } else {
                    subCodes.prevCode = dependencyValues.codePre + mathInd;
                }
            }

            if (nextChild !== undefined) {
                // next child is a math
                let nextInd = 0;
                if (mathInd !== undefined) {
                    nextInd = mathInd + 1;
                }

                if (dependencyValues.format === "latex") {
                    subCodes.nextCode =
                        "\\operatorname{" +
                        dependencyValues.codePre +
                        nextInd +
                        "}";
                } else {
                    subCodes.nextCode = dependencyValues.codePre + nextInd;
                }
            }

            codesAdjacentToStrings.push(subCodes);
        } else {
            // have a mathChild, so increment mathInd
            if (mathInd === undefined) {
                mathInd = 0;
            } else {
                mathInd++;
            }
        }
    }

    return { setValue: { codesAdjacentToStrings } };
}

function determineCanBeModified({ dependencyValues }) {
    if (
        !dependencyValues.modifyIndirectly ||
        dependencyValues.fixed ||
        dependencyValues.fixLocation
    ) {
        return {
            setValue: {
                canBeModified: false,
                constantChildIndices: null,
                codeForExpression: null,
                inverseMaps: null,
                template: null,
                mathChildrenMapped: null,
            },
        };
    }

    if (dependencyValues.mathChildrenModifiable.length === 0) {
        // if have no math children, then can directly set value
        // to any specified expression
        return {
            setValue: {
                canBeModified: true,
                constantChildIndices: null,
                codeForExpression: null,
                inverseMaps: null,
                template: null,
                mathChildrenMapped: null,
            },
        };
    }

    // determine if can calculate value of activeChildren from
    // any specified value of expression

    // categorize all math activeChildren as variables or constants
    let variableInds = [];
    let variables = [];
    // let constantInds = [];
    let constants = [];

    let constantChildIndices = {};

    for (let [
        ind,
        childModifiable,
    ] of dependencyValues.mathChildrenModifiable.entries()) {
        let substitutionCode = dependencyValues.codePre + ind;

        if (childModifiable.stateValues.canBeModified === true) {
            variableInds.push(ind);
            variables.push(substitutionCode);
        } else {
            // constantInds.push(ind);
            constants.push(substitutionCode);
            constantChildIndices[substitutionCode] = ind;
        }
    }

    // include codePre in code for whole expression, as we know codePre is not in math expression
    let codeForExpression = dependencyValues.codePre + "expr";
    let tree = me.utils.unflattenLeft(
        dependencyValues.expressionWithCodes.tree,
    );

    let result = checkForLinearExpression(
        tree,
        variables,
        codeForExpression,
        constants,
    );

    if (result.foundLinear) {
        let inverseMaps = {};
        let template = result.template;
        let mathChildrenMapped = new Set();

        for (let key in result.mappings) {
            inverseMaps[key] = result.mappings[key];

            // if component was due to a math child, add Ind of the math child
            let mathChildSub = inverseMaps[key].mathChildSub;
            if (mathChildSub) {
                let mathChildInd =
                    variableInds[variables.indexOf(mathChildSub)];
                inverseMaps[key].mathChildInd = mathChildInd;
                mathChildrenMapped.add(Number(mathChildInd));
            }
        }

        mathChildrenMapped.has =
            mathChildrenMapped.has.bind(mathChildrenMapped);

        // found an inverse
        return {
            setValue: {
                canBeModified: true,
                constantChildIndices,
                codeForExpression,
                inverseMaps,
                template,
                mathChildrenMapped,
            },
        };
    }

    // if not linear, can't find an inverse
    return {
        setValue: {
            canBeModified: false,
            constantChildIndices: null,
            codeForExpression: null,
            inverseMaps: null,
            template: null,
            mathChildrenMapped: null,
        },
    };
}

function checkForLinearExpression(
    tree,
    variables,
    inverseTree,
    constants = [],
    components = [],
) {
    // Check if tree is a linear expression in variables.
    // Each component of container must be a linear expression in just one variable.
    // Haven't implemented inversion of a multivariable linear map

    let tree_variables = me.variables(tree);
    if (tree_variables.every((v) => !variables.includes(v))) {
        if (tree_variables.every((v) => !constants.includes(v))) {
            // if there are no variable or constant math activeChildren, then consider it linear
            let mappings = {};
            let key = "x" + components.join("_");
            mappings[key] = {
                result: me.fromAst(inverseTree).expand().simplify(),
                components: components,
            };
            //let modifiableStrings = {[key]: components};
            return { foundLinear: true, mappings: mappings, template: key };
            //modifiableStrings: modifiableStrings };
        }
    }

    // if not an array, check if is a variable
    if (!Array.isArray(tree)) {
        return checkForScalarLinearExpression(
            tree,
            variables,
            inverseTree,
            components,
        );
    }

    let operator = tree[0];
    let operands = tree.slice(1);

    // for container, check if at least one component is a linear expression
    if (vectorAndListOperators.includes(operator)) {
        let result = { mappings: {}, template: [operator] }; //, modifiableStrings: {}};
        let numLinear = 0;
        for (let ind = 0; ind < operands.length; ind++) {
            let new_components = [...components, ind];
            let res = checkForLinearExpression(
                operands[ind],
                variables,
                inverseTree,
                constants,
                new_components,
            );
            if (res.foundLinear) {
                numLinear++;

                // append mappings found for the component
                result.mappings = Object.assign(result.mappings, res.mappings);

                // // append modifiableStrings found for the component
                // result.modifiableStrings = Object.assign(result.modifiableStrings, res.modifiableStrings);

                // append template
                result.template.push(res.template);
            } else {
                result.template.push("x" + new_components.join("_"));
            }
        }

        // if no components are linear, view whole container as nonlinear
        if (numLinear === 0) {
            return { foundLinear: false };
        }

        // if at least one component is a linear functions, view as linear
        result.foundLinear = true;
        return result;
    } else {
        // if not a container, check if is a scalar linear function
        return checkForScalarLinearExpression(
            tree,
            variables,
            inverseTree,
            components,
        );
    }
}

// check if tree is a scalar linear function in one of the variables
function checkForScalarLinearExpression(
    tree,
    variables,
    inverseTree,
    components = [],
) {
    if (typeof tree === "string" && variables.includes(tree)) {
        let mappings = {};
        let template = "x" + components.join("_");
        mappings[template] = {
            result: me.fromAst(inverseTree).expand().simplify(),
            components: components,
            mathChildSub: tree,
        };
        return { foundLinear: true, mappings: mappings, template: template };
    }

    if (!Array.isArray(tree)) {
        return { foundLinear: false };
    }

    let operator = tree[0];
    let operands = tree.slice(1);

    if (operator === "-") {
        inverseTree = ["-", inverseTree];
        return checkForScalarLinearExpression(
            operands[0],
            variables,
            inverseTree,
            components,
        );
    }
    if (operator === "+") {
        if (me.variables(operands[0]).every((v) => !variables.includes(v))) {
            // if none of the variables appear in the first operand, subtract off operand from inverseTree
            inverseTree = ["+", inverseTree, ["-", operands[0]]];
            return checkForScalarLinearExpression(
                operands[1],
                variables,
                inverseTree,
                components,
            );
        } else if (
            me.variables(operands[1]).every((v) => !variables.includes(v))
        ) {
            // if none of the variables appear in the second operand, subtract off operand from inverseTree
            inverseTree = ["+", inverseTree, ["-", operands[1]]];
            return checkForScalarLinearExpression(
                operands[0],
                variables,
                inverseTree,
                components,
            );
        } else {
            // neither operand was a constant
            return { foundLinear: false };
        }
    }
    if (operator === "*") {
        if (
            me.variables(operands[0]).every((v) => !variables.includes(v)) &&
            !exprContainsVector(operands[0])
        ) {
            // if none of the variables appear in the first operand and it doesn't contain a vector,
            // divide inverseTree by operand
            inverseTree = ["/", inverseTree, operands[0]];
            return checkForScalarLinearExpression(
                operands[1],
                variables,
                inverseTree,
                components,
            );
        } else if (
            me.variables(operands[1]).every((v) => !variables.includes(v)) &&
            !exprContainsVector(operands[1])
        ) {
            // if none of the variables appear in the second operand and it doesn't contain a vector,
            // divide inverseTree by operand
            inverseTree = ["/", inverseTree, operands[1]];
            return checkForScalarLinearExpression(
                operands[0],
                variables,
                inverseTree,
                components,
            );
        } else {
            // neither operand was a constant
            return { foundLinear: false };
        }
    }
    if (operator === "/") {
        if (me.variables(operands[1]).every((v) => !variables.includes(v))) {
            // if none of the variables appear in the second operand, multiply inverseTree by operand
            inverseTree = ["*", inverseTree, operands[1]];
            return checkForScalarLinearExpression(
                operands[0],
                variables,
                inverseTree,
                components,
            );
        } else {
            // second operand was not a constant
            return { foundLinear: false };
        }
    }

    // any other operator means not linear
    return { foundLinear: false };
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

    if (mathChildren.length === 0) {
        let instructions = [];

        if (nStringChildren > 0) {
            instructions.push({
                setDependency: "expressionWithCodes",
                desiredValue: desiredExpression,
            });
        } else {
            instructions.push({
                setDependency: "valueShadow",
                desiredValue: desiredExpression,
            });
        }

        return {
            success: true,
            instructions,
        };
    }

    // first calculate expression pieces to make sure really can update
    let expressionPieces = await getExpressionPieces({
        expression: desiredExpression,
        stateValues,
    });
    if (!expressionPieces) {
        return { success: false };
    }

    let instructions = [];

    let childrenToSkip = [];
    if (
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

    // update math children where have inversemap and canBeModified is true
    let mathChildrenWithCanBeModified =
        await stateValues.mathChildrenWithCanBeModified;
    for (let [childInd, mathChild] of mathChildren.entries()) {
        if (
            stateValues.mathChildrenMapped.has(childInd) &&
            mathChildrenWithCanBeModified[childInd].stateValues.canBeModified
        ) {
            if (!childrenToSkip.includes(childInd)) {
                let childValue = expressionPieces[childInd];
                let subsMap = {};
                let foundConst = false;
                let constantChildIndices =
                    await stateValues.constantChildIndices;
                for (let code in constantChildIndices) {
                    let constInd = constantChildIndices[code];
                    subsMap[code] = mathChildren[constInd].stateValues.value;
                    foundConst = true;
                }
                if (foundConst) {
                    // substitute values of any math children that are constant
                    // (i.e., that are marked as not modifiable from above)
                    childValue = childValue.substitute(subsMap);
                }

                childValue = childValue.expand().simplify();

                instructions.push({
                    setDependency: "mathChildren",
                    desiredValue: childValue,
                    childIndex: childInd,
                    variableIndex: 0,
                });
            }

            delete expressionPieces[childInd];
        }
    }

    // if there are any string children,
    // need to update expressionWithCodes with new values

    if (nStringChildren > 0) {
        let newExpressionWithCodes = dependencyValues.expressionWithCodes;
        let codePre = dependencyValues.codePre;
        let nCP = codePre.length;

        // Given that we have both string and math children,
        // the only way that expressionWithCodes could change
        // is if expression is a vector
        // and there is a vector component that came entirely from a string child,
        // i.e., that that vector component in expressionWithCodes
        // does not have any Codes in it.

        let mathComponentIsCode = (tree) =>
            typeof tree === "string" && tree.substring(0, nCP) === codePre;

        let mathComponentContainsCode = (tree) => {
            if (Array.isArray(tree)) {
                return flattenDeep(tree.slice(1)).some(mathComponentIsCode);
            } else {
                return mathComponentIsCode(tree);
            }
        };

        if (
            vectorAndListOperators.includes(newExpressionWithCodes.tree[0]) &&
            !newExpressionWithCodes.tree
                .slice(1)
                .every(mathComponentContainsCode)
        ) {
            let inverseMaps = await stateValues.inverseMaps;
            for (let piece in expressionPieces) {
                let inverseMap = inverseMaps[piece];
                // skip math children
                if (inverseMap.mathChildInd !== undefined) {
                    continue;
                }
                let components = inverseMap.components;
                newExpressionWithCodes =
                    newExpressionWithCodes.substitute_component(
                        components,
                        expressionPieces[piece],
                    );
            }

            instructions.push({
                setDependency: "expressionWithCodes",
                desiredValue: newExpressionWithCodes,
            });
        }
    }

    return {
        success: true,
        instructions,
    };
}

async function getExpressionPieces({ expression, stateValues }) {
    let template = await stateValues.template;

    let matching = me.utils.match(expression.tree, template);

    // if doesn't match, trying matching, by converting vectors, intervals, or both
    if (!matching) {
        matching = me.utils.match(
            expression.tuples_to_vectors().tree,
            me.fromAst(template).tuples_to_vectors().tree,
        );
        if (!matching) {
            matching = me.utils.match(
                expression.to_intervals().tree,
                me.fromAst(template).to_intervals().tree,
            );
            if (!matching) {
                matching = me.utils.match(
                    expression.tuples_to_vectors().to_intervals().tree,
                    me.fromAst(template).tuples_to_vectors().to_intervals()
                        .tree,
                );
                if (!matching) {
                    return false;
                }
            }
        }
    }

    let pieces = {};
    for (let x in matching) {
        let subMap = {};
        subMap[await stateValues.codeForExpression] = matching[x];
        let inverseMap = (await stateValues.inverseMaps)[x];
        if (inverseMap !== undefined) {
            let id = x;
            if (inverseMap.mathChildInd !== undefined) {
                id = inverseMap.mathChildInd;
            }
            pieces[id] = inverseMap.result.substitute(subMap);

            pieces[id] = normalizeMathExpression({
                value: pieces[id],
                simplify: await stateValues.simplify,
                expand: await stateValues.expand,
                createVectors: await stateValues.createVectors,
                createIntervals: await stateValues.createIntervals,
            });
        }
    }
    return pieces;
}

function exprContainsVector(tree) {
    if (!Array.isArray(tree)) {
        return false;
    }

    let operator = tree[0];
    let operands = tree.slice(1);

    if (vectorOperators.includes(operator)) {
        return true;
    }

    return operands.some(exprContainsVector);
}
