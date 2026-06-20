import me from "math-expressions";
import { deepCompare, convertValueToMathExpression } from "@doenet/utils";
import { buildNumberDisplayParameters } from "./numberDisplay";
import {
    latexToMathFactory,
    normalizeLatexString,
    roundForDisplay,
    stripLatex,
} from "./math";

/**
 * Shared building blocks for the internal math-input "cell" components that
 * back a `<matrixInput>` (each `_matrixComponentInput`) and a `<fractionInput>`
 * (its numerator/denominator `_fractionInputComponent`). Both render with the
 * `mathInput` renderer, read their parsing/number-display configuration from
 * their parent input, and convert between a raw LaTeX string and a math value.
 *
 * The parts that genuinely differ between the two — where `value` /
 * `immediateValue` come from, and the accessible `shortDescription` — stay in
 * the individual component classes.
 */

/**
 * Define a `submitAnswer` external action on an input component that delegates
 * to its `answerAncestor`. Call from the component constructor.
 */
export function defineSubmitAnswerExternalAction(component) {
    component.externalActions = {};

    // Complex because the stateValues isn't defined until later
    Object.defineProperty(component.externalActions, "submitAnswer", {
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
        }.bind(component),
    });
}

/**
 * The parsing attributes (`format`, `functionSymbols`, `splitSymbols`,
 * `parseScientificNotation`) shared by inputs that parse math the same way a
 * `<mathInput>` does.
 */
export function returnMathInputParsingAttributes() {
    return {
        format: {
            description: "Input format for the math entered.",
            createComponentOfType: "text",
            createStateVariable: "format",
            defaultValue: "text",
            public: true,
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
        },
        functionSymbols: {
            description: "Symbols treated as function names when parsing.",
            createComponentOfType: "textList",
            createStateVariable: "functionSymbols",
            defaultValue: ["f", "g"],
            public: true,
        },
        splitSymbols: {
            description:
                "Whether multi-character symbols are split into a product of variables.",
            createComponentOfType: "boolean",
            createStateVariable: "splitSymbols",
            defaultValue: true,
            public: true,
        },
        parseScientificNotation: {
            description:
                "Whether to parse expressions like 1e3 as scientific notation.",
            createComponentOfType: "boolean",
            createStateVariable: "parseScientificNotation",
            defaultValue: false,
            public: true,
        },
    };
}

/**
 * The `valueChanged` / `immediateValueChanged` essential booleans, public so
 * authors can detect whether a user has edited the input.
 */
export function returnInputValueChangedStateVariableDefinitions({
    valueChangedDescription,
    immediateValueChangedDescription,
} = {}) {
    const stateVariableDefinitions = {};

    stateVariableDefinitions.valueChanged = {
        description: valueChangedDescription,
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
                        value: Boolean(desiredStateVariableValues.valueChanged),
                    },
                ],
            };
        },
    };

    stateVariableDefinitions.immediateValueChanged = {
        description: immediateValueChangedDescription,
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

    return stateVariableDefinitions;
}

/**
 * Configuration state variables a math-input cell reads from its parent input
 * (`parentComponentType`): the parsing options, the number-display options, the
 * cell width, plus the constant `componentType` (`"math"`) and the `focused`
 * flag.
 */
export function returnMathComponentInputConfigStateVariableDefinitions({
    parentComponentType,
}) {
    const stateVariableDefinitions = {};

    stateVariableDefinitions.minWidth = {
        forRenderer: true,
        returnDependencies: () => ({
            inputAncestor: {
                dependencyType: "ancestor",
                componentType: parentComponentType,
                variableNames: ["minComponentWidth"],
            },
        }),
        definition({ dependencyValues }) {
            return {
                setValue: {
                    minWidth: dependencyValues.inputAncestor
                        ? dependencyValues.inputAncestor.stateValues
                              .minComponentWidth
                        : 0,
                },
            };
        },
    };

    // these are passed straight through from the parent input
    for (const varName of [
        "format",
        "functionSymbols",
        "splitSymbols",
        "parseScientificNotation",
        "displaySmallAsZero",
        "padZeros",
        "avoidScientificNotation",
        "unionFromU",
    ]) {
        stateVariableDefinitions[varName] = {
            returnDependencies: () => ({
                parentValue: {
                    dependencyType: "parentStateVariable",
                    parentComponentType,
                    variableName: varName,
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: { [varName]: dependencyValues.parentValue },
                };
            },
        };
    }

    // displayDigits and displayDecimals additionally propagate usedDefault so
    // the cell's number display respects whether the parent used a default
    for (const varName of ["displayDigits", "displayDecimals"]) {
        stateVariableDefinitions[varName] = {
            returnDependencies: () => ({
                parentValue: {
                    dependencyType: "parentStateVariable",
                    parentComponentType,
                    variableName: varName,
                },
            }),
            definition({ dependencyValues, usedDefault }) {
                let result = {
                    setValue: { [varName]: dependencyValues.parentValue },
                };

                if (usedDefault.parentValue) {
                    result.markAsUsedDefault = { [varName]: true };
                }

                return result;
            },
        };
    }

    stateVariableDefinitions.componentType = {
        returnDependencies: () => ({}),
        definition: () => ({ setValue: { componentType: "math" } }),
    };

    stateVariableDefinitions.focused = {
        forRenderer: true,
        hasEssential: true,
        defaultValue: false,
        public: true,
        description: "Whether this input currently has keyboard focus.",
        shadowingInstructions: {
            createComponentOfType: "boolean",
        },
        ignoreFixed: true,
        returnDependencies: () => ({}),
        definition: () => ({
            useEssentialOrDefaultValue: { focused: true },
        }),
        inverseDefinition({ desiredStateVariableValues }) {
            return {
                success: true,
                instructions: [
                    {
                        setEssentialValue: "focused",
                        value: Boolean(desiredStateVariableValues.focused),
                    },
                ],
            };
        },
    };

    return stateVariableDefinitions;
}

/**
 * The display state variables that turn a cell's `value` / `immediateValue`
 * into rounded display values, a `text` string, and the `rawRendererValue`
 * (LaTeX) the renderer edits. Requires the cell to define `value`,
 * `immediateValue`, and the number-display config (see
 * {@link returnMathComponentInputConfigStateVariableDefinitions}).
 */
export function returnMathComponentInputDisplayStateVariableDefinitions() {
    const stateVariableDefinitions = {};

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
        }),
        definition: function ({ dependencyValues }) {
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
        description: "The current value as a text string.",
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
            avoidScientificNotation: {
                dependencyType: "stateVariable",
                variableName: "avoidScientificNotation",
            },
        }),
        definition: function ({ dependencyValues }) {
            let params = buildNumberDisplayParameters({
                padZeros: dependencyValues.padZeros,
                displayDigits: dependencyValues.displayDigits,
                displayDecimals: dependencyValues.displayDecimals,
                avoidScientificNotation:
                    dependencyValues.avoidScientificNotation,
            });
            return {
                setValue: {
                    text: dependencyValues.valueForDisplay.toString(params),
                },
            };
        },
    };

    // raw value from renderer
    stateVariableDefinitions.rawRendererValue = {
        description: "The raw value used by the renderer.",
        forRenderer: true,
        hasEssential: true,
        shadowVariable: true,
        defaultValue: "",
        provideEssentialValuesInDefinition: true,
        public: true,
        shadowingInstructions: {
            createComponentOfType: "text",
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
        }),
        definition({ dependencyValues, essentialValues }) {
            // use deepCompare of trees rather than equalsViaSyntax
            // so even tiny numerical differences that within double precision are detected
            if (
                essentialValues.rawRendererValue === undefined ||
                !deepCompare(
                    essentialValues.lastValueForDisplay.tree,
                    dependencyValues.valueForDisplay.tree,
                )
            ) {
                let rawRendererValue = stripLatex(
                    dependencyValues.valueForDisplay.toLatex(),
                );
                if (rawRendererValue === "\uff3f") {
                    rawRendererValue = "";
                }
                return {
                    setValue: {
                        rawRendererValue,
                        lastValueForDisplay: dependencyValues.valueForDisplay,
                    },
                    setEssentialValue: {
                        rawRendererValue,
                        lastValueForDisplay: dependencyValues.valueForDisplay,
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
        }) {
            const calculateMathExpressionFromLatex = async (text) => {
                let expression;

                text = normalizeLatexString(text, {
                    unionFromU: await stateValues.unionFromU,
                });

                // replace ^25 with ^{2}5, since mathQuill uses standard latex conventions
                // unlike math-expression's latex parser
                text = text.replace(/\^(\w)/g, "^{$1}");

                let fromLatex = latexToMathFactory({
                    functionSymbols: await stateValues.functionSymbols,
                    splitSymbols: await stateValues.splitSymbols,
                    parseScientificNotation:
                        await stateValues.parseScientificNotation,
                });

                try {
                    expression = fromLatex(text);
                } catch (e) {
                    expression = me.fromAst("\uFF3F");
                }
                return expression;
            };

            let instructions = [];

            if (
                typeof desiredStateVariableValues.rawRendererValue === "string"
            ) {
                let currentValue = essentialValues.rawRendererValue;
                let desiredValue = desiredStateVariableValues.rawRendererValue;

                if (currentValue !== desiredValue) {
                    instructions.push({
                        setEssentialValue: "rawRendererValue",
                        value: desiredValue,
                    });
                }

                let currentMath =
                    await calculateMathExpressionFromLatex(currentValue);
                let desiredMath =
                    await calculateMathExpressionFromLatex(desiredValue);

                // use deepCompare of trees rather than equalsViaSyntax
                // so even tiny numerical differences that within double precision are detected
                if (!deepCompare(desiredMath.tree, currentMath.tree)) {
                    instructions.push({
                        setDependency: "immediateValue",
                        desiredValue: desiredMath,
                        treatAsInitialChange: true, // so does not change value
                    });
                }
            } else {
                // since desired value was not a string, it must be a math-expression
                // always update lastValueForDisplay
                // update rawRendererValue
                // if desired expression is different from math-expression obtained from current raw value
                // do not update immediate value

                instructions.push({
                    setEssentialValue: "lastValueForDisplay",
                    value: desiredStateVariableValues.rawRendererValue,
                });

                let currentMath = await calculateMathExpressionFromLatex(
                    essentialValues.rawRendererValue,
                );

                // use deepCompare of trees rather than equalsViaSyntax
                // so even tiny numerical differences that within double precision are detected
                if (
                    !deepCompare(
                        desiredStateVariableValues.rawRendererValue.tree,
                        currentMath.tree,
                    )
                ) {
                    let desiredValue = stripLatex(
                        desiredStateVariableValues.rawRendererValue.toLatex(),
                    );
                    if (desiredValue === "\uff3f") {
                        desiredValue = "";
                    }
                    instructions.push({
                        setEssentialValue: "rawRendererValue",
                        value: desiredValue,
                    });
                }
            }

            return {
                success: true,
                instructions,
            };
        },
    };

    return stateVariableDefinitions;
}

/**
 * Shared `updateRawValue` action for a math-input cell: stores the latest raw
 * (LaTeX) value from the renderer and flags the component as needing a value
 * update. The update is transient so each keystroke does not add a row to the
 * database. Bind to the component instance in its constructor.
 */
export async function mathComponentInputUpdateRawValue({
    rawRendererValue,
    actionId,
    sourceInformation = {},
    skipRendererUpdate = false,
}) {
    if (!(await this.stateValues.disabled)) {
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

/**
 * Shared `updateValue` action for a math-input cell: when the live
 * `immediateValue` differs from the saved `value`, commit it (and refresh the
 * renderer's raw value), emitting an "answered" event and triggering any
 * chained actions. Bind to the component instance in its constructor.
 */
export async function mathComponentInputUpdateValue({
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
                    stateVariable: "immediateValue",
                    valueOfStateVariable: "value",
                },
                {
                    updateType: "unsetComponentNeedingUpdateValue",
                },
            ];

            if (immediateValue.tree !== "\uff3f") {
                updateInstructions.push({
                    updateType: "updateValue",
                    componentIdx: this.componentIdx,
                    stateVariable: "rawRendererValue",
                    valueOfStateVariable: "valueForDisplay",
                });
            }

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

            await this.coreFunctions.performUpdate({
                updateInstructions,
                actionId,
                sourceInformation,
                skipRendererUpdate: true,
                event,
            });

            return await this.coreFunctions.triggerChainedActions({
                componentIdx: this.componentIdx,
                actionId,
                sourceInformation,
                skipRendererUpdate,
            });
        } else {
            // set raw renderer value to save it to the database,
            // as it might not have been saved
            // given that updateRawValue is transient
            await this.coreFunctions.performUpdate({
                updateInstructions: [
                    {
                        updateType: "updateValue",
                        componentIdx: this.componentIdx,
                        stateVariable: "rawRendererValue",
                        valueOfStateVariable: "rawRendererValue",
                    },
                ],
                actionId,
                sourceInformation,
                skipRendererUpdate,
            });
        }
    }
}

/**
 * Shared `focusChanged` action for a math-input cell. Bind to the component
 * instance in its constructor.
 */
export async function mathComponentInputFocusChanged({
    focused,
    actionId,
    sourceInformation,
}) {
    return await this.coreFunctions.performUpdate({
        updateInstructions: [
            {
                updateType: "updateValue",
                componentIdx: this.componentIdx,
                stateVariable: "focused",
                value: focused,
            },
        ],
        actionId,
        sourceInformation,
        overrideReadOnly: true,
        doNotSave: true,
    });
}
