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
    mathComponentInputFocusChanged,
    mathComponentInputUpdateRawValue,
    mathComponentInputUpdateValue,
    returnMathComponentInputConfigStateVariableDefinitions,
    returnMathComponentInputDisplayStateVariableDefinitions,
    returnMathInputParsingAttributes,
} from "../utils/mathComponentInput";
import {
    defineSubmitAnswerExternalAction,
    returnInputValueChangedStateVariableDefinitions,
} from "../utils/input";

const blankMath = () => me.fromAst("\uff3f");

function isFractionTree(tree) {
    return Array.isArray(tree) && tree[0] === "/";
}

function isNegatedFractionTree(tree) {
    return Array.isArray(tree) && tree[0] === "-" && isFractionTree(tree[1]);
}

// Split a math value into the numerator and denominator that the two input
// boxes display. A division becomes its two operands; a negated division puts
// the sign in the numerator; a blank stays blank in both boxes.
function decomposeFraction(mathValue) {
    let tree = mathValue?.tree;
    if (isFractionTree(tree)) {
        return {
            numerator: me.fromAst(tree[1]),
            denominator: me.fromAst(tree[2]),
        };
    }
    if (isNegatedFractionTree(tree)) {
        return {
            numerator: me.fromAst(["-", tree[1][1]]),
            denominator: me.fromAst(tree[1][2]),
        };
    }
    if (tree === undefined || tree === "\uff3f") {
        return { numerator: blankMath(), denominator: blankMath() };
    }
    return { numerator: me.fromAst(tree), denominator: me.fromAst(1) };
}

// Combine the two boxes back into a single math value (the inverse of
// decomposeFraction). When both boxes are blank, the fraction as a whole is
// blank; otherwise it stays a fraction (a denominator of 1 is kept, e.g. a/1).
function reconstructFraction(numerator, denominator) {
    let numeratorTree = numerator?.tree ?? "\uff3f";
    let denominatorTree = denominator?.tree ?? "\uff3f";
    if (numeratorTree === "\uff3f" && denominatorTree === "\uff3f") {
        return blankMath();
    }
    return me.fromAst(["/", numeratorTree, denominatorTree]);
}

// A fractionInput's value is always a fraction (or blank). When a non-fraction
// value comes in from a child, the bindValueTo attribute, or an inverse
// definition, transform it to a fraction with a denominator of 1.
function ensureFraction(mathValue) {
    let tree = mathValue?.tree;
    if (isFractionTree(tree)) {
        return mathValue;
    }
    if (isNegatedFractionTree(tree)) {
        return me.fromAst(["/", ["-", tree[1][1]], tree[1][2]]);
    }
    if (tree === undefined || tree === "\uff3f") {
        return blankMath();
    }
    return me.fromAst(["/", tree, 1]);
}

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

        attributes.bindValueTo = {
            createComponentOfType: "math",
            description: "Two-way binding target for the fraction's value.",
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

        const inputValueChangedStateVariableDefinitions =
            returnInputValueChangedStateVariableDefinitions({
                valueChangedDescription:
                    "Whether the value has been changed from its initial state.",
                immediateValueChangedDescription:
                    "Whether the value, including in-progress edits, has been changed from its initial state.",
            });

        stateVariableDefinitions.valueChanged =
            inputValueChangedStateVariableDefinitions.valueChanged;

        // The fraction's value. It is linked to a `<math>` child or the
        // `bindValueTo` attribute when present (two-way), otherwise it is an
        // essential value seeded from prefillNumerator/prefillDenominator.
        stateVariableDefinitions.value = {
            description:
                "The fraction value of the input (numerator divided by denominator).",
            public: true,
            hasEssential: true,
            shadowVariable: true,
            shadowingInstructions: {
                createComponentOfType: "math",
                addAttributeComponentsShadowingStateVariables:
                    returnNumberDisplayAttributeComponentShadowing(),
            },
            set: convertValueToMathExpression,
            returnDependencies: () => ({
                mathChild: {
                    dependencyType: "child",
                    childGroups: ["maths"],
                    variableNames: ["value"],
                    proceedIfAllChildrenNotMatched: true,
                },
                bindValueTo: {
                    dependencyType: "attributeComponent",
                    attributeName: "bindValueTo",
                    variableNames: ["value"],
                },
                prefillNumerator: {
                    dependencyType: "stateVariable",
                    variableName: "prefillNumerator",
                },
                prefillDenominator: {
                    dependencyType: "stateVariable",
                    variableName: "prefillDenominator",
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
            definition({ dependencyValues }) {
                if (dependencyValues.mathChild.length > 0) {
                    return {
                        setValue: {
                            value: ensureFraction(
                                dependencyValues.mathChild[0].stateValues.value,
                            ),
                        },
                    };
                } else if (dependencyValues.bindValueTo) {
                    return {
                        setValue: {
                            value: ensureFraction(
                                dependencyValues.bindValueTo.stateValues.value,
                            ),
                        },
                    };
                } else {
                    return {
                        useEssentialOrDefaultValue: {
                            value: {
                                defaultValue: reconstructFraction(
                                    dependencyValues.prefillNumerator,
                                    dependencyValues.prefillDenominator,
                                ),
                            },
                        },
                    };
                }
            },
            inverseDefinition({
                desiredStateVariableValues,
                dependencyValues,
            }) {
                let desiredValue = ensureFraction(
                    desiredStateVariableValues.value,
                );
                let instructions = [
                    { setDependency: "valueChanged", desiredValue: true },
                    {
                        setDependency: "immediateValueChanged",
                        desiredValue: true,
                    },
                ];

                if (dependencyValues.mathChild.length > 0) {
                    instructions.push({
                        setDependency: "mathChild",
                        desiredValue,
                        variableIndex: 0,
                        childIndex: 0,
                    });
                } else if (dependencyValues.bindValueTo) {
                    instructions.push({
                        setDependency: "bindValueTo",
                        desiredValue,
                        variableIndex: 0,
                    });
                } else {
                    instructions.push({
                        setEssentialValue: "value",
                        value: desiredValue,
                    });
                }
                return { success: true, instructions };
            },
        };

        stateVariableDefinitions.immediateValueChanged =
            inputValueChangedStateVariableDefinitions.immediateValueChanged;

        // The fraction value reflecting the user's in-progress edits.
        stateVariableDefinitions.immediateValue = {
            description:
                "The fraction value reflecting the user's in-progress edits.",
            public: true,
            hasEssential: true,
            shadowVariable: true,
            shadowingInstructions: {
                createComponentOfType: "math",
                addAttributeComponentsShadowingStateVariables:
                    returnNumberDisplayAttributeComponentShadowing(),
            },
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
            definition({
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
            inverseDefinition({
                desiredStateVariableValues,
                initialChange,
                shadowedVariable,
            }) {
                let desiredValue = ensureFraction(
                    desiredStateVariableValues.immediateValue,
                );
                let instructions = [
                    {
                        setEssentialValue: "immediateValue",
                        value: desiredValue,
                    },
                    {
                        setDependency: "immediateValueChanged",
                        desiredValue: true,
                    },
                ];

                if (!(initialChange || shadowedVariable)) {
                    instructions.push({
                        setDependency: "value",
                        desiredValue,
                    });
                }

                return { success: true, instructions };
            },
        };

        // The numerator and denominator boxes display the decomposition of the
        // value; editing one routes back through `value`.
        stateVariableDefinitions.numerator = {
            description: "The numerator of the fraction.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "math",
                addAttributeComponentsShadowingStateVariables:
                    returnNumberDisplayAttributeComponentShadowing(),
            },
            returnDependencies: () => ({
                value: {
                    dependencyType: "stateVariable",
                    variableName: "value",
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        numerator: decomposeFraction(dependencyValues.value)
                            .numerator,
                    },
                };
            },
            inverseDefinition({
                desiredStateVariableValues,
                dependencyValues,
            }) {
                let { denominator } = decomposeFraction(dependencyValues.value);
                return {
                    success: true,
                    instructions: [
                        {
                            setDependency: "value",
                            desiredValue: reconstructFraction(
                                desiredStateVariableValues.numerator,
                                denominator,
                            ),
                        },
                    ],
                };
            },
        };

        stateVariableDefinitions.denominator = {
            description: "The denominator of the fraction.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "math",
                addAttributeComponentsShadowingStateVariables:
                    returnNumberDisplayAttributeComponentShadowing(),
            },
            returnDependencies: () => ({
                value: {
                    dependencyType: "stateVariable",
                    variableName: "value",
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        denominator: decomposeFraction(dependencyValues.value)
                            .denominator,
                    },
                };
            },
            inverseDefinition({
                desiredStateVariableValues,
                dependencyValues,
            }) {
                let { numerator } = decomposeFraction(dependencyValues.value);
                return {
                    success: true,
                    instructions: [
                        {
                            setDependency: "value",
                            desiredValue: reconstructFraction(
                                numerator,
                                desiredStateVariableValues.denominator,
                            ),
                        },
                    ],
                };
            },
        };

        // The live numerator/denominator the boxes edit, decomposed from
        // immediateValue and routed back to it (without committing the value).
        stateVariableDefinitions.componentImmediateValueNumerator = {
            returnDependencies: () => ({
                immediateValue: {
                    dependencyType: "stateVariable",
                    variableName: "immediateValue",
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        componentImmediateValueNumerator: decomposeFraction(
                            dependencyValues.immediateValue,
                        ).numerator,
                    },
                };
            },
            inverseDefinition({
                desiredStateVariableValues,
                dependencyValues,
                initialChange,
            }) {
                let { denominator } = decomposeFraction(
                    dependencyValues.immediateValue,
                );
                return {
                    success: true,
                    instructions: [
                        {
                            setDependency: "immediateValue",
                            desiredValue: reconstructFraction(
                                desiredStateVariableValues.componentImmediateValueNumerator,
                                denominator,
                            ),
                            treatAsInitialChange: initialChange,
                        },
                    ],
                };
            },
        };

        stateVariableDefinitions.componentImmediateValueDenominator = {
            returnDependencies: () => ({
                immediateValue: {
                    dependencyType: "stateVariable",
                    variableName: "immediateValue",
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        componentImmediateValueDenominator: decomposeFraction(
                            dependencyValues.immediateValue,
                        ).denominator,
                    },
                };
            },
            inverseDefinition({
                desiredStateVariableValues,
                dependencyValues,
                initialChange,
            }) {
                let { numerator } = decomposeFraction(
                    dependencyValues.immediateValue,
                );
                return {
                    success: true,
                    instructions: [
                        {
                            setDependency: "immediateValue",
                            desiredValue: reconstructFraction(
                                numerator,
                                desiredStateVariableValues.componentImmediateValueDenominator,
                            ),
                            treatAsInitialChange: initialChange,
                        },
                    ],
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

        // Expose this component's index so _fractionInputComponent sub-boxes can
        // build the correct per-input key ("fractionInputIdx/numerator" etc.).
        stateVariableDefinitions.componentIdx = {
            returnDependencies: () => ({}),
            definition({ componentIdx }) {
                return { setValue: { componentIdx } };
            },
        };

        // Expose the controlling answer's per-input coloring state so that the
        // _fractionInputComponent sub-boxes can read them via parentStateVariable.
        // Mirrors the logic in abstract/Input.js creditAchieved: checks both
        // answerAncestor (fractionInput inside answer) and answerSpecifiedInForAnswer
        // (fractionInput outside answer linked via forAnswer).
        stateVariableDefinitions.colorInputsSeparately = {
            stateVariablesDeterminingDependencies: [
                "answerSpecifiedInForAnswer",
            ],
            returnDependencies({ stateValues }) {
                const deps = {
                    answerAncestor: {
                        dependencyType: "stateVariable",
                        variableName: "answerAncestor",
                    },
                };
                if (stateValues.answerSpecifiedInForAnswer !== null) {
                    deps.forAnswerColorInputsSeparately = {
                        dependencyType: "stateVariable",
                        componentIdx: stateValues.answerSpecifiedInForAnswer,
                        variableName: "colorInputsSeparately",
                        variablesOptional: true,
                    };
                }
                return deps;
            },
            definition({ dependencyValues }) {
                // answerAncestor takes precedence — if the fractionInput is
                // inside an answer, use that answer's setting and ignore any
                // forAnswer attribute (which would be a misconfiguration).
                if (dependencyValues.answerAncestor) {
                    return {
                        setValue: {
                            colorInputsSeparately:
                                dependencyValues.answerAncestor.stateValues
                                    .colorInputsSeparately ?? false,
                        },
                    };
                }
                return {
                    setValue: {
                        colorInputsSeparately:
                            dependencyValues.forAnswerColorInputsSeparately ??
                            false,
                    },
                };
            },
        };

        stateVariableDefinitions.creditAchievedPerInput = {
            stateVariablesDeterminingDependencies: [
                "colorInputsSeparately",
                "answerAncestor",
                "answerSpecifiedInForAnswer",
            ],
            returnDependencies({ stateValues }) {
                if (!stateValues.colorInputsSeparately) {
                    return {};
                }
                if (stateValues.answerAncestor) {
                    // Inside the answer — use ancestor dep.
                    return {
                        answerCreditAchievedPerInput: {
                            dependencyType: "ancestor",
                            componentType: "answer",
                            variableNames: ["creditAchievedPerInput"],
                        },
                    };
                }
                if (stateValues.answerSpecifiedInForAnswer !== null) {
                    // External forAnswer input — fetch with stateVariable dep.
                    return {
                        answerCreditAchievedPerInput: {
                            dependencyType: "stateVariable",
                            componentIdx:
                                stateValues.answerSpecifiedInForAnswer,
                            variableName: "creditAchievedPerInput",
                            returnAsComponentObject: true,
                            variablesOptional: true,
                        },
                    };
                }
                return {};
            },
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        creditAchievedPerInput:
                            dependencyValues.answerCreditAchievedPerInput
                                ?.stateValues?.creditAchievedPerInput ?? {},
                    },
                };
            },
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

        // Each box reads its value from the parent fractionInput
        // (numerator or denominator) and routes edits back to it.
        stateVariableDefinitions.value = {
            stateVariablesDeterminingDependencies: ["part"],
            returnDependencies: ({ stateValues }) => ({
                parentComponentValue: {
                    dependencyType: "parentStateVariable",
                    parentComponentType: "fractionInput",
                    variableName:
                        stateValues.part === "denominator"
                            ? "denominator"
                            : "numerator",
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        value:
                            dependencyValues.parentComponentValue ??
                            blankMath(),
                    },
                };
            },
            inverseDefinition({ desiredStateVariableValues }) {
                return {
                    success: true,
                    instructions: [
                        {
                            setDependency: "parentComponentValue",
                            desiredValue: desiredStateVariableValues.value,
                        },
                    ],
                };
            },
        };

        stateVariableDefinitions.immediateValue = {
            stateVariablesDeterminingDependencies: ["part"],
            returnDependencies: ({ stateValues }) => ({
                parentComponentImmediateValue: {
                    dependencyType: "parentStateVariable",
                    parentComponentType: "fractionInput",
                    variableName:
                        stateValues.part === "denominator"
                            ? "componentImmediateValueDenominator"
                            : "componentImmediateValueNumerator",
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        immediateValue:
                            dependencyValues.parentComponentImmediateValue ??
                            blankMath(),
                    },
                };
            },
            inverseDefinition({ desiredStateVariableValues, initialChange }) {
                return {
                    success: true,
                    instructions: [
                        {
                            setDependency: "parentComponentImmediateValue",
                            desiredValue:
                                desiredStateVariableValues.immediateValue,
                            treatAsInitialChange: initialChange,
                        },
                    ],
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

        // Mirror the parent fractionInput's correctness state variables so the
        // mathInput renderer can color each input box's border.
        stateVariableDefinitions.colorCorrectness = {
            forRenderer: true,
            returnDependencies: () => ({
                parentColorCorrectness: {
                    dependencyType: "parentStateVariable",
                    parentComponentType: "fractionInput",
                    variableName: "colorCorrectness",
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        colorCorrectness:
                            dependencyValues.parentColorCorrectness ?? false,
                    },
                };
            },
        };

        stateVariableDefinitions.creditAchieved = {
            forRenderer: true,
            stateVariablesDeterminingDependencies: ["part"],
            returnDependencies({ stateValues }) {
                const deps = {
                    parentCreditAchieved: {
                        dependencyType: "parentStateVariable",
                        parentComponentType: "fractionInput",
                        variableName: "creditAchieved",
                    },
                    parentColorInputsSeparately: {
                        dependencyType: "parentStateVariable",
                        parentComponentType: "fractionInput",
                        variableName: "colorInputsSeparately",
                    },
                };
                // This component can't make its dependency graph conditional on a
                // parent state variable, so request the per-part map here and only
                // read it in definition when the parent has colorInputsSeparately on.
                deps.parentCreditAchievedPerInput = {
                    dependencyType: "parentStateVariable",
                    parentComponentType: "fractionInput",
                    variableName: "creditAchievedPerInput",
                };
                deps.parentComponentIdx = {
                    dependencyType: "parentStateVariable",
                    parentComponentType: "fractionInput",
                    variableName: "componentIdx",
                };
                deps.part = {
                    dependencyType: "stateVariable",
                    variableName: "part",
                };
                return deps;
            },
            definition({ dependencyValues }) {
                const fallback = dependencyValues.parentCreditAchieved ?? 0;
                if (
                    dependencyValues.parentColorInputsSeparately &&
                    dependencyValues.parentCreditAchievedPerInput &&
                    dependencyValues.parentComponentIdx !== undefined &&
                    dependencyValues.part
                ) {
                    const key = `${dependencyValues.parentComponentIdx}/${dependencyValues.part}`;
                    const perPartCredit =
                        dependencyValues.parentCreditAchievedPerInput[key];
                    return {
                        setValue: {
                            creditAchieved:
                                perPartCredit !== undefined
                                    ? perPartCredit
                                    : fallback,
                        },
                    };
                }
                return {
                    setValue: { creditAchieved: fallback },
                };
            },
        };

        stateVariableDefinitions.justSubmitted = {
            forRenderer: true,
            returnDependencies: () => ({
                parentJustSubmitted: {
                    dependencyType: "parentStateVariable",
                    parentComponentType: "fractionInput",
                    variableName: "justSubmitted",
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        justSubmitted:
                            dependencyValues.parentJustSubmitted ?? false,
                    },
                };
            },
        };

        stateVariableDefinitions.numAttemptsLeft = {
            forRenderer: true,
            returnDependencies: () => ({
                parentNumAttemptsLeft: {
                    dependencyType: "parentStateVariable",
                    parentComponentType: "fractionInput",
                    variableName: "numAttemptsLeft",
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        numAttemptsLeft:
                            dependencyValues.parentNumAttemptsLeft ?? Infinity,
                    },
                };
            },
        };

        stateVariableDefinitions.includeValidationStateInShortDescription = {
            forRenderer: true,
            returnDependencies: () => ({}),
            definition() {
                return {
                    setValue: {
                        includeValidationStateInShortDescription: false,
                    },
                };
            },
        };

        return stateVariableDefinitions;
    }
}
