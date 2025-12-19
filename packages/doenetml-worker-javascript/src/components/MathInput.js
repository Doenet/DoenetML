import Input from "./abstract/Input";
import me from "math-expressions";
import { deepCompare, convertValueToMathExpression } from "@doenet/utils";
import {
    returnRoundingAttributeComponentShadowing,
    returnRoundingAttributes,
    returnRoundingStateVariableDefinitions,
} from "../utils/rounding";
import { returnWrapNonLabelsDescriptionsSugarFunction } from "../utils/label";
import {
    latexToMathFactory,
    normalizeLatexString,
    roundForDisplay,
    stripLatex,
} from "../utils/math";
import { returnMathVectorMatrixStateVariableDefinitions } from "../utils/mathVectorMatrixStateVariables";

export default class MathInput extends Input {
    constructor(args) {
        super(args);

        Object.assign(this.actions, {
            updateRawValue: this.updateRawValue.bind(this),
            updateValue: this.updateValue.bind(this),
        });

        this.externalActions = {};

        //Complex because the stateValues isn't defined until later
        Object.defineProperty(this.externalActions, "submitAnswer", {
            enumerable: true,
            get: async function () {
                let answerAncestor = await this.stateValues.answerAncestor;
                if (answerAncestor !== null) {
                    return {
                        componentIdx: answerAncestor.componentIdx,
                        actionName: "submitAnswer",
                    };
                } else {
                    return;
                }
            }.bind(this),
        });
    }
    static componentType = "mathInput";

    static variableForImplicitProp = "value";
    static variableForIndexAsProp = "vector";

    static processWhenJustUpdatedForNewComponent = true;

    static createAttributesObject() {
        let attributes = super.createAttributesObject();
        attributes.prefill = {
            createComponentOfType: "math",
            createStateVariable: "prefill",
            defaultValue: me.fromAst("\uff3f"),
            public: true,
            copyComponentAttributesForCreatedComponent: [
                "format",
                "functionSymbols",
                "splitSymbols",
                "parseScientificNotation",
            ],
        };
        attributes.prefillLatex = {
            createComponentOfType: "latex",
            createStateVariable: "prefillLatex",
            defaultValue: "",
            public: true,
        };
        attributes.format = {
            createComponentOfType: "text",
            createStateVariable: "format",
            defaultValue: "text",
            public: true,
            toLowerCase: true,
            validValues: ["text", "latex"],
        };
        attributes.functionSymbols = {
            createComponentOfType: "textList",
            createStateVariable: "functionSymbols",
            defaultValue: ["f", "g"],
            public: true,
        };
        attributes.splitSymbols = {
            createComponentOfType: "boolean",
            createStateVariable: "splitSymbols",
            defaultValue: true,
            public: true,
            fallBackToParentStateVariable: "splitSymbols",
        };
        attributes.parseScientificNotation = {
            createComponentOfType: "boolean",
            createStateVariable: "parseScientificNotation",
            defaultValue: false,
            public: true,
            fallBackToParentStateVariable: "parseScientificNotation",
        };

        Object.assign(attributes, returnRoundingAttributes());

        attributes.bindValueTo = {
            createComponentOfType: "math",
        };
        attributes.unionFromU = {
            createComponentOfType: "boolean",
            createStateVariable: "unionFromU",
            defaultValue: false,
            public: true,
        };
        attributes.hideNaN = {
            createComponentOfType: "boolean",
            createStateVariable: "hideNaN",
            defaultValue: true,
            public: true,
        };
        attributes.removeStrings = {
            createComponentOfType: "textList",
            createStateVariable: "removeStrings",
            defaultValue: null,
        };
        attributes.minWidth = {
            createComponentOfType: "integer",
            createStateVariable: "minWidth",
            defaultValue: 50,
            clamp: [0, Infinity],
            public: true,
            forRenderer: true,
        };

        return attributes;
    }

    // Include children that can be added due to sugar
    static additionalSchemaChildren = ["string"];

    static returnSugarInstructions() {
        let sugarInstructions = super.returnSugarInstructions();

        sugarInstructions.push({
            replacementFunction: returnWrapNonLabelsDescriptionsSugarFunction({
                wrappingComponentType: "math",
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
                group: "maths",
                componentTypes: ["math"],
            },
        ];
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        Object.assign(
            stateVariableDefinitions,
            returnRoundingStateVariableDefinitions({
                displayDigitsDefault: 10,
                displaySmallAsZeroDefault: 0,
            }),
        );

        stateVariableDefinitions.valueChanged = {
            public: true,
            hasEssential: true,
            defaultValue: false,
            shadowingInstructions: {
                createComponentOfType: "boolean",
            },
            returnDependencies: () => ({}),
            definition() {
                return { useEssentialOrDefaultValue: { valueChanged: true } };
            },
            inverseDefinition({ desiredStateVariableValues }) {
                return {
                    success: true,
                    instructions: [
                        {
                            setEssentialValue: "valueChanged",
                            value: Boolean(
                                desiredStateVariableValues.valueChanged,
                            ),
                        },
                    ],
                };
            },
        };

        stateVariableDefinitions.value = {
            public: true,
            shadowingInstructions: {
                createComponentOfType: "math",
                addAttributeComponentsShadowingStateVariables:
                    returnRoundingAttributeComponentShadowing(),
            },
            hasEssential: true,
            shadowVariable: true,
            returnDependencies: () => ({
                mathChild: {
                    dependencyType: "child",
                    childGroups: ["maths"],
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
                prefillLatex: {
                    dependencyType: "stateVariable",
                    variableName: "prefillLatex",
                },
                unionFromU: {
                    dependencyType: "stateVariable",
                    variableName: "unionFromU",
                },
                functionSymbols: {
                    dependencyType: "stateVariable",
                    variableName: "functionSymbols",
                },
                splitSymbols: {
                    dependencyType: "stateVariable",
                    variableName: "splitSymbols",
                },
                parseScientificNotation: {
                    dependencyType: "stateVariable",
                    variableName: "parseScientificNotation",
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
            set: convertValueToMathExpression,
            definition: function ({ dependencyValues, usedDefault }) {
                if (dependencyValues.mathChild.length > 0) {
                    return {
                        setValue: {
                            value: dependencyValues.mathChild[0].stateValues
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
                                get defaultValue() {
                                    if (
                                        !usedDefault.prefill ||
                                        usedDefault.prefillLatex
                                    ) {
                                        return dependencyValues.prefill;
                                    } else {
                                        return calculateMathExpressionFromLatex(
                                            {
                                                latex: dependencyValues.prefillLatex,
                                                unionFromU:
                                                    dependencyValues.unionFromU,
                                                functionSymbols:
                                                    dependencyValues.functionSymbols,
                                                splitSymbols:
                                                    dependencyValues.splitSymbols,
                                                parseScientificNotation:
                                                    dependencyValues.parseScientificNotation,
                                            },
                                        );
                                    }
                                },
                            },
                        },
                    };
                }
            },
            inverseDefinition: function ({
                desiredStateVariableValues,
                dependencyValues,
            }) {
                // console.log(`inverse definition of value for mathInput`)
                // console.log(desiredStateVariableValues)
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

                if (dependencyValues.mathChild.length > 0) {
                    instructions.push({
                        setDependency: "mathChild",
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

        stateVariableDefinitions.immediateValueChanged = {
            public: true,
            hasEssential: true,
            defaultValue: false,
            shadowingInstructions: {
                createComponentOfType: "boolean",
            },
            returnDependencies: () => ({}),
            definition() {
                return {
                    useEssentialOrDefaultValue: { immediateValueChanged: true },
                };
            },
            inverseDefinition({ desiredStateVariableValues }) {
                return {
                    success: true,
                    instructions: [
                        {
                            setEssentialValue: "immediateValueChanged",
                            value: Boolean(
                                desiredStateVariableValues.immediateValueChanged,
                            ),
                        },
                    ],
                };
            },
        };

        stateVariableDefinitions.immediateValue = {
            public: true,
            shadowingInstructions: {
                createComponentOfType: "math",
                addAttributeComponentsShadowingStateVariables:
                    returnRoundingAttributeComponentShadowing(),
            },
            hasEssential: true,
            shadowVariable: true,
            returnDependencies: () => ({
                value: {
                    dependencyType: "stateVariable",
                    variableName: "value",
                },
                immediateValueChanged: {
                    dependencyType: "stateVariable",
                    variableName: "immediateValueChanged",
                    onlyToSetInInverseDefinition: true,
                },
            }),
            set: convertValueToMathExpression,
            definition: function ({
                dependencyValues,
                changes,
                justUpdatedForNewComponent,
                usedDefault,
            }) {
                // console.log(`definition of immediateValue`)
                // console.log(dependencyValues)
                // console.log(changes, usedDefault);
                // console.log(`justUpdatedForNewComponent: ${justUpdatedForNewComponent}`)

                if (
                    changes.value &&
                    !justUpdatedForNewComponent &&
                    !usedDefault.value
                ) {
                    // only update to value when it changes
                    // (otherwise, let its essential value change)
                    return {
                        setValue: { immediateValue: dependencyValues.value },
                        setEssentialValue: {
                            immediateValue: dependencyValues.value,
                        },
                    };
                } else {
                    return {
                        useEssentialOrDefaultValue: {
                            immediateValue: {
                                defaultValue: dependencyValues.value,
                            },
                        },
                    };
                }
            },
            inverseDefinition: function ({
                desiredStateVariableValues,
                initialChange,
                shadowedVariable,
            }) {
                // value is essential; give it the desired value
                let instructions = [
                    {
                        setEssentialValue: "immediateValue",
                        value: desiredStateVariableValues.immediateValue,
                    },
                    {
                        setDependency: "immediateValueChanged",
                        desiredValue: true,
                    },
                ];

                // if from outside sources, also set value
                if (!(initialChange || shadowedVariable)) {
                    instructions.push({
                        setDependency: "value",
                        desiredValue: desiredStateVariableValues.immediateValue,
                    });
                }

                return {
                    success: true,
                    instructions,
                };
            },
        };

        stateVariableDefinitions.valueForDisplay = {
            forRenderer: true,
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
            }),
            set: convertValueToMathExpression,
            definition: function ({ dependencyValues }) {
                // round any decimal numbers to the significant digits
                // determined by displaydigits or displaydecimals
                let rounded = roundForDisplay({
                    value: dependencyValues.value,
                    dependencyValues,
                });

                return {
                    setValue: { valueForDisplay: rounded },
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
            }),
            definition: function ({ dependencyValues }) {
                return {
                    setValue: {
                        text: dependencyValues.valueForDisplay.toString(),
                    },
                };
            },
        };

        stateVariableDefinitions.dontUpdateRawValueInDefinition = {
            defaultValue: false,
            hasEssential: true,
            returnDependencies: () => ({}),
            definition: () => ({
                useEssentialOrDefaultValue: {
                    dontUpdateRawValueInDefinition: true,
                },
            }),
            inverseDefinition({ desiredStateVariableValues }) {
                return {
                    success: true,
                    instructions: [
                        {
                            setEssentialValue: "dontUpdateRawValueInDefinition",
                            value: desiredStateVariableValues.dontUpdateRawValueInDefinition,
                        },
                    ],
                };
            },
        };

        // raw value from renderer
        stateVariableDefinitions.rawRendererValue = {
            forRenderer: true,
            hasEssential: true,
            shadowVariable: true,
            defaultValue: "",
            provideEssentialValuesInDefinition: true,
            public: true,
            shadowingInstructions: {
                createComponentOfType: "latex",
            },
            additionalStateVariablesDefined: [
                {
                    variableName: "lastValueForDisplay",
                    hasEssential: true,
                    shadowVariable: true,
                    defaultValue: null,
                    set: convertValueToMathExpression,
                },
            ],
            returnDependencies: () => ({
                // include immediateValue for inverse definition
                immediateValue: {
                    dependencyType: "stateVariable",
                    variableName: "immediateValue",
                },
                valueForDisplay: {
                    dependencyType: "stateVariable",
                    variableName: "valueForDisplay",
                },
                hideNaN: {
                    dependencyType: "stateVariable",
                    variableName: "hideNaN",
                },
                dontUpdateRawValueInDefinition: {
                    dependencyType: "stateVariable",
                    variableName: "dontUpdateRawValueInDefinition",
                },
                prefill: {
                    dependencyType: "stateVariable",
                    variableName: "prefill",
                },
                prefillLatex: {
                    dependencyType: "stateVariable",
                    variableName: "prefillLatex",
                },
            }),
            definition({
                dependencyValues,
                essentialValues,
                justUpdatedForNewComponent,
                usedDefault,
            }) {
                // console.log(`definition of raw value for ${componentIdx}`)
                // console.log(JSON.parse(JSON.stringify(dependencyValues)), JSON.parse(JSON.stringify(essentialValues)), JSON.parse(JSON.stringify(usedDefault)))

                // use deepCompare of trees rather than equalsViaSyntax
                // so even tiny numerical differences that are within double precision are detected
                if (
                    essentialValues.rawRendererValue === undefined ||
                    !(
                        justUpdatedForNewComponent ||
                        deepCompare(
                            essentialValues.lastValueForDisplay.tree,
                            dependencyValues.valueForDisplay.tree,
                        ) ||
                        dependencyValues.dontUpdateRawValueInDefinition
                    )
                ) {
                    let rawRendererValue;
                    if (
                        usedDefault.immediateValue &&
                        usedDefault.prefill &&
                        !usedDefault.prefillLatex
                    ) {
                        rawRendererValue = stripLatex(
                            dependencyValues.prefillLatex,
                        );
                    } else {
                        rawRendererValue = stripLatex(
                            dependencyValues.valueForDisplay.toLatex({
                                showBlanks: false,
                            }),
                        );
                    }

                    if (
                        dependencyValues.hideNaN &&
                        rawRendererValue === "NaN"
                    ) {
                        rawRendererValue = "";
                    }
                    return {
                        setValue: {
                            rawRendererValue,
                            lastValueForDisplay:
                                dependencyValues.valueForDisplay,
                        },
                        setEssentialValue: {
                            rawRendererValue,
                            lastValueForDisplay:
                                dependencyValues.valueForDisplay,
                        },
                    };
                } else {
                    return {
                        useEssentialOrDefaultValue: {
                            rawRendererValue: true,
                            lastValueForDisplay: true,
                        },
                    };
                }
            },
            async inverseDefinition({
                desiredStateVariableValues,
                stateValues,
                essentialValues,
                dependencyValues,
                componentIdx,
            }) {
                // console.log(`inverse definition of rawRenderer value for ${componentIdx}`, desiredStateVariableValues, JSON.parse(JSON.stringify(essentialValues)))

                let instructions = [];

                if (
                    typeof desiredStateVariableValues.rawRendererValue ===
                    "string"
                ) {
                    let currentValue = essentialValues.rawRendererValue;
                    let desiredValue =
                        desiredStateVariableValues.rawRendererValue;

                    if (currentValue !== desiredValue) {
                        instructions.push({
                            setEssentialValue: "rawRendererValue",
                            value: desiredValue,
                        });
                    }

                    let unionFromU = await stateValues.unionFromU;
                    let functionSymbols = await stateValues.functionSymbols;
                    let splitSymbols = await stateValues.splitSymbols;
                    let parseScientificNotation =
                        await stateValues.parseScientificNotation;
                    let removeStrings = await stateValues.removeStrings;

                    let currentMath = calculateMathExpressionFromLatex({
                        latex: currentValue,
                        unionFromU,
                        functionSymbols,
                        splitSymbols,
                        parseScientificNotation,
                        removeStrings,
                    });
                    let desiredMath = calculateMathExpressionFromLatex({
                        latex: desiredValue,
                        unionFromU,
                        functionSymbols,
                        splitSymbols,
                        parseScientificNotation,
                        removeStrings,
                    });

                    // use deepCompare of trees rather than equalsViaSyntax
                    // so even tiny numerical differences that within double precision are detected
                    if (!deepCompare(desiredMath.tree, currentMath.tree)) {
                        instructions.push({
                            setDependency: "immediateValue",
                            desiredValue: desiredMath,
                            treatAsInitialChange: true, // so does not change value
                        });
                    }
                } else if (
                    desiredStateVariableValues.rawRendererValue instanceof
                    me.class
                ) {
                    // When desired rawRendererValue is a math-expression
                    // always update lastValueForDisplay
                    // Update rawRendererValue if desired expression is different
                    // from math-expression obtained from current raw value
                    // Do not update immediate value

                    instructions.push({
                        setEssentialValue: "lastValueForDisplay",
                        value: desiredStateVariableValues.rawRendererValue,
                    });

                    let unionFromU = await stateValues.unionFromU;
                    let functionSymbols = await stateValues.functionSymbols;
                    let splitSymbols = await stateValues.splitSymbols;
                    let parseScientificNotation =
                        await stateValues.parseScientificNotation;
                    let removeStrings = await stateValues.removeStrings;

                    let currentMath = calculateMathExpressionFromLatex({
                        latex: essentialValues.rawRendererValue,
                        unionFromU,
                        functionSymbols,
                        splitSymbols,
                        parseScientificNotation,
                        removeStrings,
                    });

                    // use deepCompare of trees rather than equalsViaSyntax
                    // so even tiny numerical differences that are within double precision are detected
                    if (
                        !deepCompare(
                            desiredStateVariableValues.rawRendererValue.tree,
                            currentMath.tree,
                        )
                    ) {
                        let desiredValue = stripLatex(
                            desiredStateVariableValues.rawRendererValue.toLatex(
                                {
                                    showBlanks: false,
                                },
                            ),
                        );
                        if (
                            dependencyValues.hideNaN &&
                            desiredValue === "NaN"
                        ) {
                            desiredValue = "";
                        }
                        instructions.push({
                            setEssentialValue: "rawRendererValue",
                            value: desiredValue,
                        });
                    }
                } else if (
                    desiredStateVariableValues.lastValueForDisplay instanceof
                    me.class
                ) {
                    // if desired value for lastValueForDisplay is a math,
                    // then only update lastValueForDisplay and not rawRendererValue

                    instructions.push({
                        setEssentialValue: "lastValueForDisplay",
                        value: desiredStateVariableValues.lastValueForDisplay,
                    });
                }

                return {
                    success: true,
                    instructions,
                };
            },
        };

        stateVariableDefinitions.componentType = {
            returnDependencies: () => ({}),
            definition: () => ({ setValue: { componentType: "math" } }),
        };

        Object.assign(
            stateVariableDefinitions,
            returnMathVectorMatrixStateVariableDefinitions(),
        );

        return stateVariableDefinitions;
    }

    async updateRawValue({
        rawRendererValue,
        actionId,
        sourceInformation = {},
        skipRendererUpdate = false,
    }) {
        if (!(await this.stateValues.disabled)) {
            // we set transient to true so that each keystroke does not
            // add a row to the database

            return await this.coreFunctions.performUpdate({
                updateInstructions: [
                    {
                        updateType: "updateValue",
                        componentIdx: this.componentIdx,
                        stateVariable: "rawRendererValue",
                        value: rawRendererValue,
                    },
                    {
                        updateType: "setComponentNeedingUpdateValue",
                        componentIdx: this.componentIdx,
                    },
                ],
                transient: true,
                actionId,
                sourceInformation,
                skipRendererUpdate,
            });
        }
    }

    async updateValue({
        actionId,
        sourceInformation = {},
        skipRendererUpdate = false,
    }) {
        if (!(await this.stateValues.disabled)) {
            let immediateValue = await this.stateValues.immediateValue;

            if (
                !deepCompare(
                    (await this.stateValues.value).tree,
                    immediateValue.tree,
                )
            ) {
                let updateInstructions = [
                    {
                        updateType: "updateValue",
                        componentIdx: this.componentIdx,
                        stateVariable: "dontUpdateRawValueInDefinition",
                        value: true,
                    },
                    {
                        updateType: "updateValue",
                        componentIdx: this.componentIdx,
                        stateVariable: "value",
                        value: immediateValue,
                    },
                    // in case value ended up being a different value than requested
                    // we set immediate value to whatever was the result
                    // (hence the need to execute update first)
                    {
                        updateType: "executeUpdate",
                    },
                    {
                        updateType: "updateValue",
                        componentIdx: this.componentIdx,
                        stateVariable: "dontUpdateRawValueInDefinition",
                        value: false,
                    },
                    {
                        updateType: "updateValue",
                        componentIdx: this.componentIdx,
                        stateVariable: "immediateValue",
                        valueOfStateVariable: "value",
                    },
                    {
                        updateType: "unsetComponentNeedingUpdateValue",
                    },
                ];

                updateInstructions.push({
                    updateType: "updateValue",
                    componentIdx: this.componentIdx,
                    stateVariable: "rawRendererValue",
                    valueOfStateVariable: "valueForDisplay",
                });

                let event = {
                    verb: "answered",
                    object: {
                        componentIdx: this.componentIdx,
                        componentType: this.componentType,
                    },
                    result: {
                        response: immediateValue,
                        responseText: immediateValue.toString(),
                    },
                };

                let answerAncestor = await this.stateValues.answerAncestor;
                if (answerAncestor) {
                    event.context = {
                        answerAncestor: answerAncestor.componentIdx,
                    };
                }

                // TODO: we should should skip renderer updates here,
                // but doing so triggers a bug in the resolveItem logic
                // in an esoteric complicated case (factoringOldAlgorithm.cy.js, factor x^2-1).
                // We could chase down this bug, but a better long term
                // solution is to completely remove resolve blockers.
                await this.coreFunctions.performUpdate({
                    updateInstructions,
                    actionId,
                    sourceInformation,
                    skipRendererUpdate: false,
                    event,
                });

                return await this.coreFunctions.triggerChainedActions({
                    componentIdx: this.componentIdx,
                    actionId,
                    sourceInformation,
                    skipRendererUpdate,
                });
            }
        }
    }

    static adapters = [
        {
            stateVariable: "value",
            stateVariablesToShadow: Object.keys(
                returnRoundingStateVariableDefinitions(),
            ),
        },
    ];
}

function calculateMathExpressionFromLatex({
    latex,
    unionFromU,
    functionSymbols,
    splitSymbols,
    parseScientificNotation,
    removeStrings,
}) {
    let expression;

    if (removeStrings) {
        for (let s of removeStrings) {
            if (["$", "%"].includes(s)) {
                s = "\\" + s;
            }
            latex = latex.replaceAll(s, "");
        }
    }

    latex = normalizeLatexString(latex, {
        unionFromU,
    });

    let fromLatex = latexToMathFactory({
        functionSymbols,
        splitSymbols,
        parseScientificNotation,
    });

    try {
        expression = fromLatex(latex);
    } catch (e) {
        // TODO: error on bad latex
        expression = me.fromAst("\uFF3F");
    }
    return expression;
}
