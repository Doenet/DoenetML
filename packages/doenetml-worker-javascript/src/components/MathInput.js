import Input from "./abstract/Input";
import me from "math-expressions";
import {
    buildEffectiveMathInputFunctionNames,
    deepCompare,
    convertValueToMathExpression,
} from "@doenet/utils";
import {
    buildNumberDisplayParameters,
    returnNumberDisplayAttributeComponentShadowing,
    returnNumberDisplayAttributes,
    returnNumberDisplayStateVariableDefinitions,
} from "../utils/numberDisplay";
import { returnWrapNonLabelsDescriptionsSugarFunction } from "../utils/label";
import {
    latexToMathFactory,
    normalizeLatexString,
    roundForDisplay,
    stripLatex,
} from "../utils/math";
import { returnMathVectorMatrixStateVariableDefinitions } from "../utils/mathVectorMatrixStateVariables";
import { defineSubmitAnswerExternalAction } from "../utils/mathComponentInput";

export default class MathInput extends Input {
    constructor(args) {
        super(args);

        Object.assign(this.actions, {
            updateRawValue: this.updateRawValue.bind(this),
            updateValue: this.updateValue.bind(this),
        });

        defineSubmitAnswerExternalAction(this);
    }
    static componentType = "mathInput";

    static componentDocs = {
        summary: "An interactive math input",
    };
    static variableForImplicitProp = "value";
    static variableForIndexAsProp = "vector";

    static processWhenJustUpdatedForNewComponent = true;

    static createAttributesObject() {
        let attributes = super.createAttributesObject();
        attributes.prefill = {
            description: "Initial value displayed in the input.",
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
            description: "Initial value as a LaTeX string.",
            createComponentOfType: "latex",
            createStateVariable: "prefillLatex",
            defaultValue: "",
            public: true,
        };
        attributes.format = {
            description: "Input format.",
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
        };
        attributes.functionSymbols = {
            description: "Symbols treated as function names when parsing.",
            createComponentOfType: "textList",
            createStateVariable: "functionSymbols",
            defaultValue: ["f", "g"],
            public: true,
        };
        attributes.additionalFunctionNames = {
            description:
                "Extra identifiers to auto-format as function names in " +
                "the editor (e.g., 'erf'). Entries that also appear in " +
                "`removedFunctionNames` are dropped.",
            createComponentOfType: "textList",
            createStateVariable: "additionalFunctionNames",
            defaultValue: [],
            public: true,
        };
        attributes.removedFunctionNames = {
            description:
                "Built-in function names to stop auto-formatting in the " +
                "editor (e.g., 'min' so 'kg/min' can be typed as a unit).",
            createComponentOfType: "textList",
            createStateVariable: "removedFunctionNames",
            defaultValue: [],
            public: true,
        };
        attributes.resetFunctionNames = {
            description:
                "When set, replaces the entire auto-formatted function " +
                "name list (defaults, `additionalFunctionNames`, and " +
                "`removedFunctionNames` are all ignored). Set to an empty " +
                "value to disable auto-formatting entirely.",
            createComponentOfType: "textList",
            createStateVariable: "resetFunctionNames",
            defaultValue: null,
            public: true,
        };
        attributes.splitSymbols = {
            description:
                "Whether multi-character symbols are split into a product of single-character variables.",
            createComponentOfType: "boolean",
            createStateVariable: "splitSymbols",
            defaultValue: true,
            public: true,
            fallBackToParentStateVariable: "splitSymbols",
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

        Object.assign(attributes, returnNumberDisplayAttributes());

        attributes.bindValueTo = {
            createComponentOfType: "math",
            description: "Two-way binding target for the input's value.",
        };
        attributes.unionFromU = {
            description: 'Whether "U" between sets is parsed as union.',
            createComponentOfType: "boolean",
            createStateVariable: "unionFromU",
            defaultValue: false,
            public: true,
        };
        attributes.hideNaN = {
            description:
                "Whether to hide NaN values when displaying the input.",
            createComponentOfType: "boolean",
            createStateVariable: "hideNaN",
            defaultValue: true,
            public: true,
        };
        attributes.removeStrings = {
            createComponentOfType: "textList",
            createStateVariable: "removeStrings",
            defaultValue: null,
            description: "Substrings to strip from the input before parsing.",
        };
        attributes.minWidth = {
            description: "Minimum rendered width of the input.",
            createComponentOfType: "integer",
            createStateVariable: "minWidth",
            defaultValue: 50,
            clamp: [0, Infinity],
            public: true,
            forRenderer: true,
        };

        attributes.showPreview = {
            createComponentOfType: "boolean",
            createStateVariable: "showPreviewPreliminary",
            defaultValue: false,
            description: "Whether to display a preview of the parsed math.",
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
            returnNumberDisplayStateVariableDefinitions({
                displayDigitsDefault: 10,
                displaySmallAsZeroDefault: 0,
            }),
        );

        stateVariableDefinitions.effectiveFunctionNames = {
            // Resolved MathQuill `autoOperatorNames` list — defaults
            // merged with `additionalFunctionNames` / `removedFunctionNames`
            // (or replaced wholesale when `resetFunctionNames` is set).
            // Computed here in the worker (rather than the renderer) so
            // we can emit a `warning` diagnostic when authored tokens
            // are dropped for failing MathQuill's validator — letting
            // those reach MathQuill would crash the `EditableMathField`
            // mount instead.
            forRenderer: true,
            returnDependencies: () => ({
                additionalFunctionNames: {
                    dependencyType: "stateVariable",
                    variableName: "additionalFunctionNames",
                },
                removedFunctionNames: {
                    dependencyType: "stateVariable",
                    variableName: "removedFunctionNames",
                },
                resetFunctionNames: {
                    dependencyType: "stateVariable",
                    variableName: "resetFunctionNames",
                },
                // The attribute components carry their own source
                // positions; we read them so each emitted diagnostic
                // points at the attribute whose contents actually
                // contributed an invalid token, rather than the whole
                // `<mathInput>` element. The `attributeComponent`
                // dependency returns `null` when the attribute is
                // absent, so the `?.position` guards below are real.
                additionalFunctionNamesAttr: {
                    dependencyType: "attributeComponent",
                    attributeName: "additionalFunctionNames",
                },
                resetFunctionNamesAttr: {
                    dependencyType: "attributeComponent",
                    attributeName: "resetFunctionNames",
                },
            }),
            definition({ dependencyValues }) {
                const { names, droppedFromAdditional, droppedFromReset } =
                    buildEffectiveMathInputFunctionNames({
                        additional: dependencyValues.additionalFunctionNames,
                        removed: dependencyValues.removedFunctionNames,
                        reset: dependencyValues.resetFunctionNames,
                    });
                const result = { setValue: { effectiveFunctionNames: names } };
                const diagnostics = [];
                const buildMessage = (attr, list) =>
                    `<mathInput>: ignored invalid function name(s) in ` +
                    `${attr}: ${list.map((n) => `'${n}'`).join(", ")}. ` +
                    `Each name's display segment must be at least 2 ` +
                    `characters (letters or dashes); an optional ` +
                    "`|<mathspeak alternative>` suffix may follow.";
                // One diagnostic per *contributing* attribute. The
                // helper already enforces precedence (`reset` wins
                // over `additional`), so when both are authored only
                // `reset`'s invalid tokens surface — `additional` is
                // inactive in that case, and warning about its
                // contents would be misleading.
                if (droppedFromAdditional.length > 0) {
                    diagnostics.push({
                        type: "warning",
                        message: buildMessage(
                            "additionalFunctionNames",
                            droppedFromAdditional,
                        ),
                        position:
                            dependencyValues.additionalFunctionNamesAttr
                                ?.position,
                    });
                }
                if (droppedFromReset.length > 0) {
                    diagnostics.push({
                        type: "warning",
                        message: buildMessage(
                            "resetFunctionNames",
                            droppedFromReset,
                        ),
                        position:
                            dependencyValues.resetFunctionNamesAttr?.position,
                    });
                }
                if (diagnostics.length > 0)
                    result.sendDiagnostics = diagnostics;
                return result;
            },
        };

        stateVariableDefinitions.showPreview = {
            description: "Whether to display a preview of the parsed math.",
            forRenderer: true,
            public: true,
            shadowingInstructions: {
                createComponentOfType: "boolean",
            },
            returnDependencies: () => ({
                showPreviewPreliminary: {
                    dependencyType: "stateVariable",
                    variableName: "showPreviewPreliminary",
                },
                parentShowPreview: {
                    dependencyType: "parentStateVariable",
                    variableName: "showPreview",
                },
            }),
            definition({ dependencyValues, usedDefault }) {
                let showPreview = dependencyValues.showPreviewPreliminary;
                if (
                    usedDefault.showPreviewPreliminary &&
                    typeof dependencyValues.parentShowPreview === "boolean" &&
                    !usedDefault.parentShowPreview
                ) {
                    showPreview = dependencyValues.parentShowPreview;
                }

                return { setValue: { showPreview } };
            },
        };

        stateVariableDefinitions.valueChanged = {
            description:
                "Whether the value has been changed from its initial state.",
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
            description: "The math value of the input.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "math",
                addAttributeComponentsShadowingStateVariables:
                    returnNumberDisplayAttributeComponentShadowing(),
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
                                        ).expression;
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
            description:
                "Whether the value, including in-progress edits, has been changed from its initial state.",
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
            description:
                "The math value reflecting the user's in-progress edits.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "math",
                addAttributeComponentsShadowingStateVariables:
                    returnNumberDisplayAttributeComponentShadowing(),
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

        stateVariableDefinitions.immediateValueLatex = {
            forRenderer: true,
            returnDependencies: () => ({
                immediateValue: {
                    dependencyType: "stateVariable",
                    variableName: "immediateValue",
                },
                showPreview: {
                    dependencyType: "stateVariable",
                    variableName: "showPreview",
                },
            }),
            definition({ dependencyValues }) {
                // If showPreview is false, then immediateValueLatex is not used.
                // In that case, return blank string to avoid latex computation.
                return {
                    setValue: {
                        immediateValueLatex: dependencyValues.showPreview
                            ? dependencyValues.immediateValue.toLatex({
                                  showBlanks: true,
                              })
                            : "",
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
            }),
            set: convertValueToMathExpression,
            definition: function ({ dependencyValues }) {
                // round any decimal numbers to the significant digits
                // determined by displaydigits or displaydecimals
                // NOTE: this rounded value is used for semantic references
                // (e.g. $mi.value and $mi.immediateValue). The live input
                // display continues to come from rawRendererValue so we preserve
                // what the user typed while editing.
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
            description: "The current input as a text string.",
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
                avoidScientificNotation: {
                    dependencyType: "stateVariable",
                    variableName: "avoidScientificNotation",
                },
            }),
            definition: function ({ dependencyValues }) {
                // `.text` reflects number-display formatting, while the live
                // editor content is still preserved in rawRendererValue.
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
            description:
                "The raw value used by the renderer (e.g. LaTeX string).",
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
                // and to determine if used default value
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
                    }).expression;
                    let desiredMath = calculateMathExpressionFromLatex({
                        latex: desiredValue,
                        unionFromU,
                        functionSymbols,
                        splitSymbols,
                        parseScientificNotation,
                        removeStrings,
                    }).expression;

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
                    }).expression;

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

        stateVariableDefinitions.errorMessageRawRenderer = {
            forRenderer: true,
            returnDependencies: () => ({
                rawRendererValue: {
                    dependencyType: "stateVariable",
                    variableName: "rawRendererValue",
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
                removeStrings: {
                    dependencyType: "stateVariable",
                    variableName: "removeStrings",
                },
                showPreview: {
                    dependencyType: "stateVariable",
                    variableName: "showPreview",
                },
                immediateValue: {
                    dependencyType: "stateVariable",
                    variableName: "immediateValue",
                },
            }),
            definition: function ({ dependencyValues }) {
                let errorMessage = null;

                if (
                    dependencyValues.showPreview &&
                    dependencyValues.rawRendererValue !== null &&
                    dependencyValues.rawRendererValue !== ""
                ) {
                    const placeholder = "\uFF3F";

                    if (dependencyValues.immediateValue?.tree === placeholder) {
                        // if we have a raw renderer value and immediate value is the placeholder,
                        // then we have latex that we could not parse.
                        // Show the error message from parsing in the preview instead of the placeholder.

                        errorMessage = calculateMathExpressionFromLatex({
                            latex: dependencyValues.rawRendererValue,
                            unionFromU: dependencyValues.unionFromU,
                            functionSymbols: dependencyValues.functionSymbols,
                            splitSymbols: dependencyValues.splitSymbols,
                            parseScientificNotation:
                                dependencyValues.parseScientificNotation,
                            removeStrings: dependencyValues.removeStrings,
                        }).errorMessage;
                    }
                }

                return {
                    setValue: {
                        errorMessageRawRenderer: errorMessage,
                    },
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
                returnNumberDisplayStateVariableDefinitions(),
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

    let errorMessage = null;
    try {
        expression = fromLatex(latex);
    } catch (e) {
        // TODO: error on bad latex
        expression = me.fromAst("\uFF3F");

        if (e.name === "ParseError") {
            errorMessage = e.message;
        }
    }
    return { expression, errorMessage };
}
