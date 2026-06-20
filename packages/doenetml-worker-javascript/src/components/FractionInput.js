import Input from "./abstract/Input";
import me from "math-expressions";
import { convertValueToMathExpression } from "@doenet/utils";
import BaseComponent from "./abstract/BaseComponent";
import {
    buildNumberDisplayParameters,
    returnNumberDisplayAttributeComponentShadowing,
    returnNumberDisplayAttributes,
    returnNumberDisplayStateVariableDefinitions,
} from "../utils/numberDisplay";
import { roundForDisplay } from "../utils/math";
import {
    defineSubmitAnswerExternalAction,
    mathComponentInputFocusChanged,
    mathComponentInputUpdateRawValue,
    mathComponentInputUpdateValue,
    returnInputValueChangedStateVariableDefinitions,
    returnMathComponentInputConfigStateVariableDefinitions,
    returnMathComponentInputDisplayStateVariableDefinitions,
    returnMathInputParsingAttributes,
} from "../utils/mathComponentInput";

const blankMath = () => me.fromAst("\uff3f");

export class FractionInput extends Input {
    constructor(args) {
        super(args);

        defineSubmitAnswerExternalAction(this);
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
        Object.assign(attributes, returnMathInputParsingAttributes());

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
            updateRawValue: mathComponentInputUpdateRawValue.bind(this),
            updateValue: mathComponentInputUpdateValue.bind(this),
            focusChanged: mathComponentInputFocusChanged.bind(this),
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

        // configuration read from the parent fractionInput (parsing,
        // number-display, width), plus componentType and focused
        Object.assign(
            stateVariableDefinitions,
            returnMathComponentInputConfigStateVariableDefinitions({
                parentComponentType: "fractionInput",
            }),
        );

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

        Object.assign(
            stateVariableDefinitions,
            returnInputValueChangedStateVariableDefinitions(),
        );

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

        // valueForDisplay, text, and rawRendererValue
        Object.assign(
            stateVariableDefinitions,
            returnMathComponentInputDisplayStateVariableDefinitions(),
        );

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
}
