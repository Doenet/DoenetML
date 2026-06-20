import Input from "./abstract/Input";
import me from "math-expressions";
import { deepCompare, convertValueToMathExpression } from "@doenet/utils";
import BaseComponent from "./abstract/BaseComponent";
import {
    buildNumberDisplayParameters,
    returnNumberDisplayAttributeComponentShadowing,
    returnNumberDisplayAttributes,
    returnNumberDisplayStateVariableDefinitions,
} from "../utils/numberDisplay";
import {
    latexToMathFactory,
    normalizeLatexString,
    roundForDisplay,
    stripLatex,
} from "../utils/math";

const blankMath = () => me.fromAst("\uff3f");

export class FractionInput extends Input {
    constructor(args) {
        super(args);

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

    static componentType = "fractionInput";

    static componentDocs = {
        summary:
            "An interactive fraction input with a numerator and a denominator, each accepting a math value.",
    };
    static variableForImplicitProp = "value";

    static processWhenJustUpdatedForNewComponent = true;

    static renderChildren = true;

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        attributes.prefillNumerator = {
            description: "Initial value displayed in the numerator input.",
            createComponentOfType: "math",
            createStateVariable: "prefillNumerator",
            defaultValue: blankMath(),
            public: true,
            copyComponentAttributesForCreatedComponent: [
                "format",
                "functionSymbols",
                "splitSymbols",
                "parseScientificNotation",
            ],
        };
        attributes.prefillDenominator = {
            description: "Initial value displayed in the denominator input.",
            createComponentOfType: "math",
            createStateVariable: "prefillDenominator",
            defaultValue: blankMath(),
            public: true,
            copyComponentAttributesForCreatedComponent: [
                "format",
                "functionSymbols",
                "splitSymbols",
                "parseScientificNotation",
            ],
        };
        attributes.format = {
            description: "Input format for the numerator and denominator.",
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
        attributes.splitSymbols = {
            description:
                "Whether multi-character symbols are split into a product of variables.",
            createComponentOfType: "boolean",
            createStateVariable: "splitSymbols",
            defaultValue: true,
            public: true,
        };
        attributes.parseScientificNotation = {
            description:
                "Whether to parse expressions like 1e3 as scientific notation.",
            createComponentOfType: "boolean",
            createStateVariable: "parseScientificNotation",
            defaultValue: false,
            public: true,
        };

        Object.assign(attributes, returnNumberDisplayAttributes());

        attributes.unionFromU = {
            description: 'Whether "U" between sets is parsed as union.',
            createComponentOfType: "boolean",
            createStateVariable: "unionFromU",
            defaultValue: false,
            public: true,
        };
        attributes.minComponentWidth = {
            createComponentOfType: "integer",
            createStateVariable: "minComponentWidth",
            defaultValue: 0,
            clamp: [0, Infinity],
            description:
                "Minimum rendered width for the numerator and denominator, in pixels.",
        };

        return attributes;
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
                group: "fractionInputComponents",
                componentTypes: ["_fractionInputComponent"],
                excludeFromSchema: true,
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

        stateVariableDefinitions.valueChanged = {
            description:
                "Whether the saved fraction has been changed from its initial state.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "boolean",
            },
            returnDependencies: () => ({
                fractionChildren: {
                    dependencyType: "child",
                    childGroups: ["fractionInputComponents"],
                    variableNames: ["valueChanged"],
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        valueChanged: dependencyValues.fractionChildren.some(
                            (child) => child.stateValues.valueChanged,
                        ),
                    },
                };
            },
        };

        stateVariableDefinitions.immediateValueChanged = {
            description:
                "Whether the live fraction differs from its initial state.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "boolean",
            },
            returnDependencies: () => ({
                fractionChildren: {
                    dependencyType: "child",
                    childGroups: ["fractionInputComponents"],
                    variableNames: ["immediateValueChanged"],
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        immediateValueChanged:
                            dependencyValues.fractionChildren.some(
                                (child) =>
                                    child.stateValues.immediateValueChanged,
                            ),
                    },
                };
            },
        };

        stateVariableDefinitions.numerator = {
            description: "The most recently saved numerator value.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "math",
                addAttributeComponentsShadowingStateVariables:
                    returnNumberDisplayAttributeComponentShadowing(),
            },
            returnDependencies: () => ({
                fractionChildren: {
                    dependencyType: "child",
                    childGroups: ["fractionInputComponents"],
                    variableNames: ["value"],
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        numerator:
                            dependencyValues.fractionChildren[0]?.stateValues
                                .value ?? blankMath(),
                    },
                };
            },
            inverseDefinition({ desiredStateVariableValues }) {
                return {
                    success: true,
                    instructions: [
                        {
                            setDependency: "fractionChildren",
                            desiredValue: desiredStateVariableValues.numerator,
                            childIndex: 0,
                            variableIndex: 0,
                        },
                    ],
                };
            },
        };

        stateVariableDefinitions.denominator = {
            description: "The most recently saved denominator value.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "math",
                addAttributeComponentsShadowingStateVariables:
                    returnNumberDisplayAttributeComponentShadowing(),
            },
            returnDependencies: () => ({
                fractionChildren: {
                    dependencyType: "child",
                    childGroups: ["fractionInputComponents"],
                    variableNames: ["value"],
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        denominator:
                            dependencyValues.fractionChildren[1]?.stateValues
                                .value ?? blankMath(),
                    },
                };
            },
            inverseDefinition({ desiredStateVariableValues }) {
                return {
                    success: true,
                    instructions: [
                        {
                            setDependency: "fractionChildren",
                            desiredValue:
                                desiredStateVariableValues.denominator,
                            childIndex: 1,
                            variableIndex: 0,
                        },
                    ],
                };
            },
        };

        stateVariableDefinitions.value = {
            description:
                "The most recently saved fraction value (numerator divided by denominator).",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "math",
                addAttributeComponentsShadowingStateVariables:
                    returnNumberDisplayAttributeComponentShadowing(),
            },
            returnDependencies: () => ({
                numerator: {
                    dependencyType: "stateVariable",
                    variableName: "numerator",
                },
                denominator: {
                    dependencyType: "stateVariable",
                    variableName: "denominator",
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        value: me.fromAst([
                            "/",
                            dependencyValues.numerator.tree,
                            dependencyValues.denominator.tree,
                        ]),
                    },
                };
            },
            inverseDefinition({ desiredStateVariableValues }) {
                let desiredTree = desiredStateVariableValues.value.tree;
                if (Array.isArray(desiredTree) && desiredTree[0] === "/") {
                    return {
                        success: true,
                        instructions: [
                            {
                                setDependency: "numerator",
                                desiredValue: me.fromAst(desiredTree[1]),
                            },
                            {
                                setDependency: "denominator",
                                desiredValue: me.fromAst(desiredTree[2]),
                            },
                        ],
                    };
                }
                return { success: false };
            },
        };

        stateVariableDefinitions.immediateValue = {
            description:
                "The current fraction being entered (live, before saving).",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "math",
                addAttributeComponentsShadowingStateVariables:
                    returnNumberDisplayAttributeComponentShadowing(),
            },
            returnDependencies: () => ({
                fractionChildren: {
                    dependencyType: "child",
                    childGroups: ["fractionInputComponents"],
                    variableNames: ["immediateValue"],
                },
            }),
            definition({ dependencyValues }) {
                let numerator =
                    dependencyValues.fractionChildren[0]?.stateValues
                        .immediateValue ?? blankMath();
                let denominator =
                    dependencyValues.fractionChildren[1]?.stateValues
                        .immediateValue ?? blankMath();
                return {
                    setValue: {
                        immediateValue: me.fromAst([
                            "/",
                            numerator.tree,
                            denominator.tree,
                        ]),
                    },
                };
            },
            inverseDefinition({ desiredStateVariableValues }) {
                let desiredTree =
                    desiredStateVariableValues.immediateValue.tree;
                if (Array.isArray(desiredTree) && desiredTree[0] === "/") {
                    return {
                        success: true,
                        instructions: [
                            {
                                setDependency: "fractionChildren",
                                desiredValue: me.fromAst(desiredTree[1]),
                                childIndex: 0,
                                variableIndex: 0,
                            },
                            {
                                setDependency: "fractionChildren",
                                desiredValue: me.fromAst(desiredTree[2]),
                                childIndex: 1,
                                variableIndex: 0,
                            },
                        ],
                    };
                }
                return { success: false };
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
            description: "The current fraction as a text string.",
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

        stateVariableDefinitions.componentType = {
            returnDependencies: () => ({}),
            definition: () => ({ setValue: { componentType: "math" } }),
        };

        stateVariableDefinitions.descriptionChildInd = {
            forRenderer: true,
            returnDependencies: () => ({
                allChildren: {
                    dependencyType: "child",
                    includeAllChildren: true,
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        descriptionChildInd:
                            dependencyValues.allChildren.findLastIndex(
                                (child) =>
                                    child.componentType === "description",
                            ),
                    },
                };
            },
        };

        stateVariableDefinitions.childIndicesToRender = {
            returnDependencies: () => ({
                descriptionChildInd: {
                    dependencyType: "stateVariable",
                    variableName: "descriptionChildInd",
                },
            }),
            definition({ dependencyValues }) {
                const childIndicesToRender = [0, 1];

                if (dependencyValues.descriptionChildInd !== -1) {
                    childIndicesToRender.push(
                        dependencyValues.descriptionChildInd,
                    );
                }

                return {
                    setValue: {
                        childIndicesToRender,
                    },
                };
            },
            markStale: () => ({ updateRenderedChildren: true }),
        };

        stateVariableDefinitions.focused = {
            description:
                "Whether the fraction input currently has keyboard focus.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "boolean",
            },
            returnDependencies: () => ({
                fractionChildren: {
                    dependencyType: "child",
                    childGroups: ["fractionInputComponents"],
                    variableNames: ["focused"],
                },
            }),
            definition: ({ dependencyValues }) => ({
                setValue: {
                    focused: dependencyValues.fractionChildren.some(
                        (child) => child.stateValues.focused,
                    ),
                },
            }),
        };

        return stateVariableDefinitions;
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

export default class FractionComponentInput extends BaseComponent {
    constructor(args) {
        super(args);

        Object.assign(this.actions, {
            updateRawValue: this.updateRawValue.bind(this),
            updateValue: this.updateValue.bind(this),
            focusChanged: this.focusChanged.bind(this),
        });
    }

    static componentType = "_fractionInputComponent";
    static rendererType = "mathInput";

    static variableForImplicitProp = "value";

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        // "numerator" or "denominator"; set by the fractionInput sugar
        attributes.part = {
            createPrimitiveOfType: "string",
            createStateVariable: "part",
            defaultValue: null,
        };

        return attributes;
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.minWidth = {
            forRenderer: true,
            returnDependencies: () => ({
                fractionInputAncestor: {
                    dependencyType: "ancestor",
                    componentType: "fractionInput",
                    variableNames: ["minComponentWidth"],
                },
            }),
            definition({ dependencyValues }) {
                if (dependencyValues.fractionInputAncestor) {
                    return {
                        setValue: {
                            minWidth:
                                dependencyValues.fractionInputAncestor
                                    .stateValues.minComponentWidth,
                        },
                    };
                } else {
                    return { setValue: { minWidth: 0 } };
                }
            },
        };

        // don't specify attributes on fractionComponentInput
        // instead gets these state variables from the parent fractionInput:
        // format, functionSymbols, splitSymbols, parseScientificNotation
        // displayDigits, displayDecimals, displaySmallAsZero, unionFromU
        stateVariableDefinitions.format = {
            returnDependencies: () => ({
                parentFormat: {
                    dependencyType: "parentStateVariable",
                    parentComponentType: "fractionInput",
                    variableName: "format",
                },
            }),
            definition({ dependencyValues }) {
                return { setValue: { format: dependencyValues.parentFormat } };
            },
        };

        stateVariableDefinitions.functionSymbols = {
            returnDependencies: () => ({
                parentFunctionSymbols: {
                    dependencyType: "parentStateVariable",
                    parentComponentType: "fractionInput",
                    variableName: "functionSymbols",
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        functionSymbols: dependencyValues.parentFunctionSymbols,
                    },
                };
            },
        };

        stateVariableDefinitions.splitSymbols = {
            returnDependencies: () => ({
                parentSplitSymbols: {
                    dependencyType: "parentStateVariable",
                    parentComponentType: "fractionInput",
                    variableName: "splitSymbols",
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        splitSymbols: dependencyValues.parentSplitSymbols,
                    },
                };
            },
        };

        stateVariableDefinitions.parseScientificNotation = {
            returnDependencies: () => ({
                parentParseScientificNotation: {
                    dependencyType: "parentStateVariable",
                    parentComponentType: "fractionInput",
                    variableName: "parseScientificNotation",
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        parseScientificNotation:
                            dependencyValues.parentParseScientificNotation,
                    },
                };
            },
        };

        stateVariableDefinitions.displayDigits = {
            returnDependencies: () => ({
                parentDisplayDigits: {
                    dependencyType: "parentStateVariable",
                    parentComponentType: "fractionInput",
                    variableName: "displayDigits",
                },
            }),
            definition({ dependencyValues, usedDefault }) {
                let result = {
                    setValue: {
                        displayDigits: dependencyValues.parentDisplayDigits,
                    },
                };

                if (usedDefault.parentDisplayDigits) {
                    result.markAsUsedDefault = { displayDigits: true };
                }

                return result;
            },
        };

        stateVariableDefinitions.displayDecimals = {
            returnDependencies: () => ({
                parentDisplayDecimals: {
                    dependencyType: "parentStateVariable",
                    parentComponentType: "fractionInput",
                    variableName: "displayDecimals",
                },
            }),
            definition({ dependencyValues, usedDefault }) {
                let result = {
                    setValue: {
                        displayDecimals: dependencyValues.parentDisplayDecimals,
                    },
                };

                if (usedDefault.parentDisplayDecimals) {
                    result.markAsUsedDefault = { displayDecimals: true };
                }

                return result;
            },
        };

        stateVariableDefinitions.displaySmallAsZero = {
            returnDependencies: () => ({
                parentDisplaySmallAsZero: {
                    dependencyType: "parentStateVariable",
                    parentComponentType: "fractionInput",
                    variableName: "displaySmallAsZero",
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        displaySmallAsZero:
                            dependencyValues.parentDisplaySmallAsZero,
                    },
                };
            },
        };

        stateVariableDefinitions.padZeros = {
            returnDependencies: () => ({
                parentPadZeros: {
                    dependencyType: "parentStateVariable",
                    parentComponentType: "fractionInput",
                    variableName: "padZeros",
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        padZeros: dependencyValues.parentPadZeros,
                    },
                };
            },
        };

        stateVariableDefinitions.avoidScientificNotation = {
            returnDependencies: () => ({
                parentAvoidScientificNotation: {
                    dependencyType: "parentStateVariable",
                    parentComponentType: "fractionInput",
                    variableName: "avoidScientificNotation",
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        avoidScientificNotation:
                            dependencyValues.parentAvoidScientificNotation,
                    },
                };
            },
        };

        stateVariableDefinitions.unionFromU = {
            returnDependencies: () => ({
                parentUnionFromU: {
                    dependencyType: "parentStateVariable",
                    parentComponentType: "fractionInput",
                    variableName: "unionFromU",
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: { unionFromU: dependencyValues.parentUnionFromU },
                };
            },
        };

        // get prefill from parent fractionInput, depending on part
        stateVariableDefinitions.prefill = {
            stateVariablesDeterminingDependencies: ["part"],
            returnDependencies: ({ stateValues }) => ({
                parentPrefill: {
                    dependencyType: "parentStateVariable",
                    parentComponentType: "fractionInput",
                    variableName:
                        stateValues.part === "denominator"
                            ? "prefillDenominator"
                            : "prefillNumerator",
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        prefill: dependencyValues.parentPrefill ?? blankMath(),
                    },
                };
            },
        };

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

        stateVariableDefinitions.value = {
            hasEssential: true,
            shadowVariable: true,
            set: convertValueToMathExpression,
            returnDependencies: () => ({
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
                return {
                    useEssentialOrDefaultValue: {
                        value: {
                            defaultValue: dependencyValues.prefill,
                        },
                    },
                };
            },
            inverseDefinition: function ({ desiredStateVariableValues }) {
                return {
                    success: true,
                    instructions: [
                        {
                            setDependency: "valueChanged",
                            desiredValue: true,
                        },
                        {
                            setDependency: "immediateValueChanged",
                            desiredValue: true,
                        },
                        {
                            setEssentialValue: "value",
                            value: desiredStateVariableValues.value,
                        },
                    ],
                };
            },
        };

        stateVariableDefinitions.immediateValue = {
            hasEssential: true,
            shadowVariable: true,
            set: convertValueToMathExpression,
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
            definition: function ({
                dependencyValues,
                changes,
                justUpdatedForNewComponent,
                usedDefault,
            }) {
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

        stateVariableDefinitions.componentType = {
            returnDependencies: () => ({}),
            definition: () => ({ setValue: { componentType: "math" } }),
        };

        stateVariableDefinitions.focused = {
            forRenderer: true,
            hasEssential: true,
            defaultValue: false,
            public: true,
            description:
                "Whether this part of the fraction input currently has keyboard focus.",
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

        // Provide an accessible name/description for each part's textarea.
        stateVariableDefinitions.shortDescription = {
            forRenderer: true,
            returnDependencies: () => ({
                part: {
                    dependencyType: "stateVariable",
                    variableName: "part",
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        shortDescription: dependencyValues.part ?? "",
                    },
                };
            },
        };

        return stateVariableDefinitions;
    }

    async updateRawValue({
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

    async focusChanged({ focused, actionId, sourceInformation }) {
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
}
