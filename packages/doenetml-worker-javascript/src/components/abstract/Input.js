import {
    returnLabelAttributes,
    returnLabelStateVariableDefinitions,
} from "../../utils/label";
import InlineComponent from "./InlineComponent";
import { codedDiagnostic } from "../../utils/diagnostics";
import {
    contentTranslator,
    returnContentLocaleDependencies,
} from "../../utils/contentLocale";
import {
    BLANK_PLACEHOLDER,
    SLOT_PATTERN,
} from "../../utils/embeddedMathInputs";
import { latexToText, stripAlignmentMarkers } from "../../utils/math";

export default class Input extends InlineComponent {
    constructor(args) {
        super(args);

        Object.assign(this.actions, {
            focusChanged: this.focusChanged.bind(this),
        });
    }

    static componentType = "_input";

    static renderChildren = true;

    /**
     * Whether `<m>` may render this input inside the typeset expression rather
     * than flattening it to its value.
     *
     * An embedded input's width has to be known before MathJax typesets, because
     * MathJax writes column widths and delimiter sizes into the output at typeset
     * time and cannot reflow around a control that grows afterwards. So this is
     * opt-in per input type, and an input that changes size as the reader types
     * does not qualify.
     */
    static canBeEmbeddedInMath = false;

    static createAttributesObject() {
        let attributes = super.createAttributesObject();
        attributes.collaborateGroups = {
            createComponentOfType: "collaborateGroups",
            createStateVariable: "collaborateGroups",
            defaultValue: null,
            public: true,
            excludeFromSchema: true,
            description:
                "Groups of users that collaborate when working with this input. (Currently ignored.)",
        };

        attributes.labelPosition = {
            createComponentOfType: "text",
            createStateVariable: "labelPosition",
            defaultValue: "start",
            public: true,
            forRenderer: true,
            toLowerCase: true,
            validValues: [
                {
                    value: "start",
                    description:
                        "Place the label before the input: to its left in a left-to-right document, to its right in a right-to-left one.",
                },
                {
                    value: "end",
                    description:
                        "Place the label after the input: to its right in a left-to-right document, to its left in a right-to-left one.",
                },
            ],
            description: "Position of the label relative to the input.",
        };

        attributes.forAnswer = {
            createReferences: true,
            description:
                "References to `<answer>` elements that this input should submit to.",
        };

        Object.assign(attributes, returnLabelAttributes());

        return attributes;
    }

    static returnStateVariableDefinitions() {
        const stateVariableDefinitions = super.returnStateVariableDefinitions();

        let componentClass = this;

        const labelDefinitions = returnLabelStateVariableDefinitions({
            getLabelFromParentIfSugared: true,
        });
        Object.assign(stateVariableDefinitions, labelDefinitions);

        // how many values an input returns
        stateVariableDefinitions.numValues = {
            returnDependencies: () => ({}),
            definition: () => ({ setValue: { numValues: 1 } }),
        };

        stateVariableDefinitions.answerAncestor = {
            returnDependencies: () => ({
                answerAncestor: {
                    dependencyType: "ancestor",
                    componentType: "answer",
                    variableNames: [
                        "delegateCheckWorkToInput",
                        "justSubmitted",
                        "creditAchieved",
                        "showCorrectness",
                        "colorCorrectness",
                        "submitLabel",
                        "submitLabelNoCorrectness",
                        "numAttemptsLeft",
                        "creditIsReducedByAttempt",
                        "numIncorrectSubmissions",
                        "numPreviousIncorrectSubmissions",
                        "creditFactorUsed",
                        "nextCreditFactor",
                        "forceFullCheckWorkButton",
                        "forceSmallCheckWorkButton",
                        "labelsForAnswer",
                        "colorInputsSeparately",
                    ],
                },
            }),
            definition: function ({ dependencyValues }) {
                return {
                    setValue: {
                        answerAncestor: dependencyValues.answerAncestor,
                    },
                };
            },
        };

        stateVariableDefinitions.sectionDeterminingColorCorrectness = {
            returnDependencies: () => ({
                ancestorForOverride: {
                    dependencyType: "ancestor",
                    variableNames: ["descendantColorCorrectnessBasedOnIdx"],
                },
            }),
            definition({ dependencyValues }) {
                let sectionDeterminingColorCorrectness = null;
                if (
                    typeof dependencyValues.ancestorForOverride?.stateValues
                        .descendantColorCorrectnessBasedOnIdx === "number"
                ) {
                    sectionDeterminingColorCorrectness =
                        dependencyValues.ancestorForOverride.stateValues
                            .descendantColorCorrectnessBasedOnIdx;
                }

                return {
                    setValue: { sectionDeterminingColorCorrectness },
                };
            },
        };

        stateVariableDefinitions.answerSpecifiedInForAnswer = {
            returnDependencies: () => ({
                forAnswer: {
                    dependencyType: "attributeRefResolutions",
                    attributeName: "forAnswer",
                },
            }),
            definition({ dependencyValues }) {
                if (dependencyValues.forAnswer?.length === 1) {
                    const forAnswer = dependencyValues.forAnswer[0];

                    if (!forAnswer.unresolvedPath) {
                        return {
                            setValue: {
                                answerSpecifiedInForAnswer:
                                    forAnswer.componentIdx,
                            },
                        };
                    }
                }
                return {
                    setValue: {
                        answerSpecifiedInForAnswer: null,
                    },
                };
            },
        };

        stateVariableDefinitions.componentDeterminingDisplayedCorrectness = {
            stateVariablesDeterminingDependencies: [
                "sectionDeterminingColorCorrectness",
                "answerAncestor",
                "answerSpecifiedInForAnswer",
            ],
            returnDependencies({ stateValues }) {
                let dependencies = {};
                if (stateValues.sectionDeterminingColorCorrectness !== null) {
                    dependencies.sectionDeterminingColorCorrectness = {
                        dependencyType: "multipleStateVariables",
                        componentIdx:
                            stateValues.sectionDeterminingColorCorrectness,
                        variableNames: [
                            "justSubmitted",
                            // The section colors its inputs by the same credit
                            // its button reports, so the two can never disagree;
                            // it is `null` wherever the score already says it,
                            // hence the fallback below.
                            "creditAchievedForCheckWork",
                            "creditAchieved",
                            "showCorrectness",
                            "colorCorrectness",
                        ],
                        variablesOptional: true,
                    };
                } else if (stateValues.answerAncestor) {
                    dependencies.answerAncestor = {
                        dependencyType: "stateVariable",
                        variableName: "answerAncestor",
                    };
                } else if (stateValues.answerSpecifiedInForAnswer !== null) {
                    dependencies.answerSpecifiedInForAnswer = {
                        dependencyType: "multipleStateVariables",
                        componentIdx: stateValues.answerSpecifiedInForAnswer,
                        variableNames: [
                            "justSubmitted",
                            "creditAchieved",
                            "showCorrectness",
                            "colorCorrectness",
                            "colorInputsSeparately",
                        ],
                        variablesOptional: true,
                    };
                }
                return dependencies;
            },
            definition({ dependencyValues }) {
                let componentDeterminingDisplayedCorrectness = null;
                if (dependencyValues.sectionDeterminingColorCorrectness) {
                    componentDeterminingDisplayedCorrectness =
                        dependencyValues.sectionDeterminingColorCorrectness;
                } else if (dependencyValues.answerAncestor) {
                    componentDeterminingDisplayedCorrectness =
                        dependencyValues.answerAncestor;
                } else if (dependencyValues.answerSpecifiedInForAnswer) {
                    componentDeterminingDisplayedCorrectness =
                        dependencyValues.answerSpecifiedInForAnswer;
                }

                return {
                    setValue: { componentDeterminingDisplayedCorrectness },
                };
            },
        };

        stateVariableDefinitions.justSubmitted = {
            forRenderer: true,
            returnDependencies: () => ({
                componentDeterminingDisplayedCorrectness: {
                    dependencyType: "stateVariable",
                    variableName: "componentDeterminingDisplayedCorrectness",
                },
            }),
            definition: function ({ dependencyValues }) {
                let justSubmitted = false;

                if (dependencyValues.componentDeterminingDisplayedCorrectness) {
                    if (
                        dependencyValues
                            .componentDeterminingDisplayedCorrectness
                            .stateValues.justSubmitted
                    ) {
                        justSubmitted = true;
                    }
                }
                return {
                    setValue: { justSubmitted },
                };
            },
        };

        stateVariableDefinitions.showCorrectness = {
            forRenderer: true,
            returnDependencies: () => ({
                showCorrectnessFlag: {
                    dependencyType: "flag",
                    flagName: "showCorrectness",
                },
                componentDeterminingDisplayedCorrectness: {
                    dependencyType: "stateVariable",
                    variableName: "componentDeterminingDisplayedCorrectness",
                },
            }),
            definition({ dependencyValues }) {
                let showCorrectness;
                if (dependencyValues.componentDeterminingDisplayedCorrectness) {
                    showCorrectness =
                        dependencyValues
                            .componentDeterminingDisplayedCorrectness
                            .stateValues.showCorrectness;
                } else {
                    showCorrectness =
                        dependencyValues.showCorrectnessFlag !== false;
                }
                return { setValue: { showCorrectness } };
            },
        };

        stateVariableDefinitions.colorCorrectness = {
            forRenderer: true,
            returnDependencies: () => ({
                componentDeterminingDisplayedCorrectness: {
                    dependencyType: "stateVariable",
                    variableName: "componentDeterminingDisplayedCorrectness",
                },
                showCorrectness: {
                    dependencyType: "stateVariable",
                    variableName: "showCorrectness",
                },
            }),
            definition({ dependencyValues }) {
                let colorCorrectness = true;
                if (!dependencyValues.showCorrectness) {
                    colorCorrectness = false;
                } else if (
                    dependencyValues.componentDeterminingDisplayedCorrectness
                ) {
                    colorCorrectness =
                        dependencyValues
                            .componentDeterminingDisplayedCorrectness
                            .stateValues.colorCorrectness;
                }
                return { setValue: { colorCorrectness } };
            },
        };

        // creditAchieved on an input is used purely for display/coloring: the
        // renderer reads it to decide whether to show the input border as green
        // (1), red (0), or orange (0 < x < 1).  It is NOT the input's own
        // credit contribution — without colorInputsSeparately it simply mirrors
        // the answer's overall creditAchieved so all inputs in the same answer
        // share a uniform color.  With colorInputsSeparately it carries the
        // per-input ratio derived from the awards that reference this input.
        const variableForImplicitProp = this.variableForImplicitProp ?? "value";
        stateVariableDefinitions.creditAchieved = {
            forRenderer: true,
            stateVariablesDeterminingDependencies: [
                "answerAncestor",
                "answerSpecifiedInForAnswer",
            ],
            returnDependencies({ stateValues }) {
                const deps = {
                    componentDeterminingDisplayedCorrectness: {
                        dependencyType: "stateVariable",
                        variableName:
                            "componentDeterminingDisplayedCorrectness",
                    },
                };
                // Inputs nested inside an answer can avoid depending on
                // creditAchievedPerInput unless colorInputsSeparately is active,
                // which prevents unnecessary staleness propagation on every
                // keystroke. forAnswer inputs still fetch both variables together
                // so they can react if the referenced answer enables
                // colorInputsSeparately.
                if (
                    stateValues.answerAncestor?.stateValues
                        .colorInputsSeparately
                ) {
                    // Input is inside the answer: use ancestor dependency.
                    deps.answerCreditAchievedPerInput = {
                        dependencyType: "ancestor",
                        componentType: "answer",
                        variableNames: ["creditAchievedPerInput"],
                    };
                } else if (stateValues.answerSpecifiedInForAnswer !== null) {
                    // Input is external (forAnswer): fetch colorInputsSeparately
                    // and creditAchievedPerInput together in one dep.
                    deps.answerColoringState = {
                        dependencyType: "multipleStateVariables",
                        componentIdx: stateValues.answerSpecifiedInForAnswer,
                        variableNames: [
                            "colorInputsSeparately",
                            "creditAchievedPerInput",
                        ],
                        variablesOptional: true,
                    };
                }
                return deps;
            },
            definition: function ({ dependencyValues, componentIdx }) {
                let creditAchieved = 0;
                const comp =
                    dependencyValues.componentDeterminingDisplayedCorrectness;
                if (comp) {
                    const overallCredit =
                        comp.stateValues.creditAchievedForCheckWork ??
                        comp.stateValues.creditAchieved ??
                        0;
                    // Per-input coloring when colorInputsSeparately is active.
                    const creditAchievedPerInput =
                        dependencyValues.answerCreditAchievedPerInput
                            ?.stateValues.creditAchievedPerInput ??
                        (dependencyValues.answerColoringState?.stateValues
                            ?.colorInputsSeparately
                            ? dependencyValues.answerColoringState.stateValues
                                  .creditAchievedPerInput
                            : undefined);
                    if (
                        comp.stateValues.colorInputsSeparately &&
                        creditAchievedPerInput
                    ) {
                        const key = `${componentIdx}/${variableForImplicitProp}`;
                        let perInputCredit = creditAchievedPerInput[key];
                        if (
                            perInputCredit === undefined &&
                            variableForImplicitProp !== "value"
                        ) {
                            const keyPrefix = `${componentIdx}/`;
                            const candidateCredits = Object.entries(
                                creditAchievedPerInput,
                            )
                                .filter(([entryKey]) =>
                                    entryKey.startsWith(keyPrefix),
                                )
                                .map(([, credit]) => credit);
                            if (candidateCredits.length > 0) {
                                perInputCredit = Math.max(...candidateCredits);
                            }
                        }
                        creditAchieved =
                            perInputCredit !== undefined
                                ? perInputCredit
                                : overallCredit;
                    } else {
                        creditAchieved = overallCredit;
                    }
                }
                return {
                    setValue: { creditAchieved },
                };
            },
        };

        stateVariableDefinitions.suppressCheckWork = {
            returnDependencies: () => ({
                autoSubmit: {
                    dependencyType: "flag",
                    flagName: "autoSubmit",
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        suppressCheckWork: dependencyValues.autoSubmit,
                    },
                };
            },
        };

        stateVariableDefinitions.showCheckWork = {
            forRenderer: true,
            returnDependencies: () => ({
                answerAncestor: {
                    dependencyType: "stateVariable",
                    variableName: "answerAncestor",
                },
                suppressCheckWork: {
                    dependencyType: "stateVariable",
                    variableName: "suppressCheckWork",
                },
            }),
            definition: function ({ dependencyValues }) {
                let showCheckWork = false;
                if (
                    dependencyValues.answerAncestor &&
                    !dependencyValues.suppressCheckWork
                ) {
                    showCheckWork =
                        dependencyValues.answerAncestor.stateValues
                            .delegateCheckWorkToInput;
                }
                return {
                    setValue: { showCheckWork },
                };
            },
        };

        stateVariableDefinitions.forceFullCheckWorkButton = {
            forRenderer: true,
            returnDependencies: () => ({
                answerAncestor: {
                    dependencyType: "stateVariable",
                    variableName: "answerAncestor",
                },
                showCheckWork: {
                    dependencyType: "stateVariable",
                    variableName: "showCheckWork",
                },
            }),
            definition: function ({ dependencyValues }) {
                let forceFullCheckWorkButton = false;
                if (
                    dependencyValues.answerAncestor &&
                    dependencyValues.showCheckWork
                ) {
                    forceFullCheckWorkButton =
                        dependencyValues.answerAncestor.stateValues
                            .forceFullCheckWorkButton;
                }
                return {
                    setValue: { forceFullCheckWorkButton },
                };
            },
        };

        stateVariableDefinitions.forceSmallCheckWorkButton = {
            forRenderer: true,
            returnDependencies: () => ({
                answerAncestor: {
                    dependencyType: "stateVariable",
                    variableName: "answerAncestor",
                },
                showCheckWork: {
                    dependencyType: "stateVariable",
                    variableName: "showCheckWork",
                },
            }),
            definition: function ({ dependencyValues }) {
                let forceSmallCheckWorkButton = false;
                if (
                    dependencyValues.answerAncestor &&
                    dependencyValues.showCheckWork
                ) {
                    forceSmallCheckWorkButton =
                        dependencyValues.answerAncestor.stateValues
                            .forceSmallCheckWorkButton;
                }
                return {
                    setValue: { forceSmallCheckWorkButton },
                };
            },
        };

        stateVariableDefinitions.creditIsReducedByAttempt = {
            forRenderer: true,
            returnDependencies: () => ({
                answerAncestor: {
                    dependencyType: "stateVariable",
                    variableName: "answerAncestor",
                },
            }),
            definition: function ({ dependencyValues }) {
                let creditIsReducedByAttempt = false;
                if (dependencyValues.answerAncestor) {
                    creditIsReducedByAttempt =
                        dependencyValues.answerAncestor.stateValues
                            .creditIsReducedByAttempt;
                }
                return {
                    setValue: { creditIsReducedByAttempt },
                };
            },
        };

        stateVariableDefinitions.submitLabel = {
            forRenderer: true,
            returnDependencies: () => ({
                answerAncestor: {
                    dependencyType: "stateVariable",
                    variableName: "answerAncestor",
                },
            }),
            definition({ dependencyValues }) {
                let submitLabel;
                if (dependencyValues.answerAncestor) {
                    submitLabel =
                        dependencyValues.answerAncestor.stateValues.submitLabel;
                } else {
                    submitLabel = "";
                }
                return { setValue: { submitLabel } };
            },
        };

        stateVariableDefinitions.submitLabelNoCorrectness = {
            forRenderer: true,
            returnDependencies: () => ({
                answerAncestor: {
                    dependencyType: "stateVariable",
                    variableName: "answerAncestor",
                },
            }),
            definition({ dependencyValues }) {
                let submitLabelNoCorrectness;
                if (dependencyValues.answerAncestor) {
                    submitLabelNoCorrectness =
                        dependencyValues.answerAncestor.stateValues
                            .submitLabelNoCorrectness;
                } else {
                    submitLabelNoCorrectness = "";
                }
                return { setValue: { submitLabelNoCorrectness } };
            },
        };

        stateVariableDefinitions.numAttemptsLeft = {
            forRenderer: true,
            returnDependencies: () => ({
                answerAncestor: {
                    dependencyType: "stateVariable",
                    variableName: "answerAncestor",
                },
            }),
            definition({ dependencyValues }) {
                let numAttemptsLeft;
                if (dependencyValues.answerAncestor) {
                    numAttemptsLeft =
                        dependencyValues.answerAncestor.stateValues
                            .numAttemptsLeft;
                } else {
                    numAttemptsLeft = Infinity;
                }
                return { setValue: { numAttemptsLeft } };
            },
        };

        stateVariableDefinitions.numIncorrectSubmissions = {
            forRenderer: true,
            returnDependencies: () => ({
                answerAncestor: {
                    dependencyType: "stateVariable",
                    variableName: "answerAncestor",
                },
            }),
            definition({ dependencyValues }) {
                let numIncorrectSubmissions;
                if (dependencyValues.answerAncestor) {
                    numIncorrectSubmissions =
                        dependencyValues.answerAncestor.stateValues
                            .numIncorrectSubmissions;
                } else {
                    numIncorrectSubmissions = 0;
                }
                return { setValue: { numIncorrectSubmissions } };
            },
        };

        stateVariableDefinitions.numPreviousIncorrectSubmissions = {
            forRenderer: true,
            returnDependencies: () => ({
                answerAncestor: {
                    dependencyType: "stateVariable",
                    variableName: "answerAncestor",
                },
            }),
            definition({ dependencyValues }) {
                let numPreviousIncorrectSubmissions;
                if (dependencyValues.answerAncestor) {
                    numPreviousIncorrectSubmissions =
                        dependencyValues.answerAncestor.stateValues
                            .numPreviousIncorrectSubmissions;
                } else {
                    numPreviousIncorrectSubmissions = 0;
                }
                return { setValue: { numPreviousIncorrectSubmissions } };
            },
        };

        stateVariableDefinitions.creditFactorUsed = {
            forRenderer: true,
            returnDependencies: () => ({
                answerAncestor: {
                    dependencyType: "stateVariable",
                    variableName: "answerAncestor",
                },
            }),
            definition({ dependencyValues }) {
                let creditFactorUsed;
                if (dependencyValues.answerAncestor) {
                    creditFactorUsed =
                        dependencyValues.answerAncestor.stateValues
                            .creditFactorUsed;
                } else {
                    creditFactorUsed = 1;
                }
                return { setValue: { creditFactorUsed } };
            },
        };

        stateVariableDefinitions.nextCreditFactor = {
            forRenderer: true,
            returnDependencies: () => ({
                answerAncestor: {
                    dependencyType: "stateVariable",
                    variableName: "answerAncestor",
                },
            }),
            definition({ dependencyValues }) {
                let nextCreditFactor;
                if (dependencyValues.answerAncestor) {
                    nextCreditFactor =
                        dependencyValues.answerAncestor.stateValues
                            .nextCreditFactor;
                } else {
                    nextCreditFactor = 1;
                }
                return { setValue: { nextCreditFactor } };
            },
        };

        // Raw syntactic references from `<label for="...">` to this input.
        // This list is intentionally unfiltered: it may include labels that
        // later prove unusable for accessibility (for example, labels inside a
        // graph, or labels whose effective target resolves to another input).
        stateVariableDefinitions.labelsReferencingInputByForRaw = {
            returnDependencies: () => ({
                labelsReferencingInputByFor: {
                    dependencyType: "componentsReferencingAttribute",
                    attributeName: "for",
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        labelsReferencingInputByForRaw:
                            dependencyValues.labelsReferencingInputByFor ?? [],
                    },
                };
            },
        };

        // Semantically valid external labels for this input.
        // Unlike `labelsReferencingInputByForRaw`, this list is filtered to
        // labels that can actually serve as accessibility labels for this
        // specific input after target resolution (`forTargetInputComponentIdx`)
        // and eligibility checks (`canBeAccessibilityLabel`).
        stateVariableDefinitions.externalLabelsReferencingInputByFor = {
            stateVariablesDeterminingDependencies: [
                "answerAncestor",
                "labelsReferencingInputByForRaw",
            ],
            returnDependencies({ stateValues }) {
                const dependencies = {
                    answerAncestor: {
                        dependencyType: "stateVariable",
                        variableName: "answerAncestor",
                    },
                    rawLabelsReferencingInputByFor: {
                        dependencyType: "stateVariable",
                        variableName: "labelsReferencingInputByForRaw",
                    },
                };

                const answerLabels =
                    stateValues.answerAncestor?.stateValues?.labelsForAnswer ??
                    [];

                for (const label of [
                    ...(stateValues.labelsReferencingInputByForRaw ?? []),
                    ...answerLabels,
                ]) {
                    const labelComponentIdx = label?.componentIdx;

                    if (
                        labelComponentIdx !== undefined &&
                        labelComponentIdx !== null
                    ) {
                        dependencies[
                            `externalLabelTargetInputComponentIdx${labelComponentIdx}`
                        ] = {
                            dependencyType: "stateVariable",
                            componentIdx: labelComponentIdx,
                            variableName: "forTargetInputComponentIdx",
                        };
                        dependencies[
                            `externalLabelCanBeAccessibilityLabel${labelComponentIdx}`
                        ] = {
                            dependencyType: "stateVariable",
                            componentIdx: labelComponentIdx,
                            variableName: "canBeAccessibilityLabel",
                        };
                    }
                }

                return dependencies;
            },
            definition({ dependencyValues, componentIdx }) {
                const externalLabelsReferencingInputByFor = [];
                const seenLabelComponentIndices = new Set();

                const candidateLabels = [
                    ...(dependencyValues.rawLabelsReferencingInputByFor ?? []),
                    ...(dependencyValues.answerAncestor?.stateValues
                        ?.labelsForAnswer ?? []),
                ];

                for (const label of candidateLabels) {
                    const labelComponentIdx = label?.componentIdx;

                    if (
                        labelComponentIdx === undefined ||
                        labelComponentIdx === null ||
                        seenLabelComponentIndices.has(labelComponentIdx)
                    ) {
                        continue;
                    }

                    seenLabelComponentIndices.add(labelComponentIdx);

                    if (
                        dependencyValues[
                            `externalLabelCanBeAccessibilityLabel${labelComponentIdx}`
                        ] &&
                        dependencyValues[
                            `externalLabelTargetInputComponentIdx${labelComponentIdx}`
                        ] === componentIdx
                    ) {
                        externalLabelsReferencingInputByFor.push(label);
                    }
                }

                return {
                    setValue: {
                        externalLabelsReferencingInputByFor:
                            externalLabelsReferencingInputByFor,
                    },
                };
            },
        };

        // Renderer ids of external labels that reference this input. Grouped
        // widgets such as matrixInput and non-inline choiceInput use these ids
        // in `aria-labelledby`, while single-control inputs can continue to use
        // native `htmlFor` from the label side.
        stateVariableDefinitions.externalLabelRendererIds = {
            forRenderer: true,
            stateVariablesDeterminingDependencies: [
                "externalLabelsReferencingInputByFor",
            ],
            returnDependencies({ stateValues }) {
                const dependencies = {
                    externalLabelsReferencingInputByFor: {
                        dependencyType: "stateVariable",
                        variableName: "externalLabelsReferencingInputByFor",
                    },
                };

                const labelsReferencingInput =
                    stateValues.externalLabelsReferencingInputByFor ?? [];

                for (const label of labelsReferencingInput) {
                    const componentIdx = label?.componentIdx;
                    if (componentIdx !== undefined && componentIdx !== null) {
                        dependencies[`externalLabelRendererId${componentIdx}`] =
                            {
                                dependencyType: "rendererId",
                                componentIdx,
                            };
                    }
                }

                return dependencies;
            },
            definition({ dependencyValues }) {
                const externalLabelRendererIds = [];
                const seen = new Set();

                const labelsReferencingInput =
                    dependencyValues.externalLabelsReferencingInputByFor ?? [];

                for (const label of labelsReferencingInput) {
                    const componentIdx = label?.componentIdx;
                    if (componentIdx === undefined || componentIdx === null) {
                        continue;
                    }

                    const rendererId =
                        dependencyValues[
                            `externalLabelRendererId${componentIdx}`
                        ];

                    if (rendererId && !seen.has(rendererId)) {
                        seen.add(rendererId);
                        externalLabelRendererIds.push(rendererId);
                    }
                }

                return { setValue: { externalLabelRendererIds } };
            },
        };

        stateVariableDefinitions.shortDescription = {
            description:
                "A short accessibility description of this input; it is visible to screen readers but not rendered visually.",
            forRenderer: true,
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            returnDependencies: () => ({
                shortDescriptionChild: {
                    dependencyType: "child",
                    childGroups: ["shortDescriptions"],
                    variableNames: ["text"],
                },

                label: {
                    dependencyType: "stateVariable",
                    variableName: "label",
                },
                answerAncestor: {
                    dependencyType: "stateVariable",
                    variableName: "answerAncestor",
                },
                createdFromSugar: {
                    dependencyType: "doenetAttribute",
                    attributeName: "createdFromSugar",
                },
                externalLabelsReferencingInputByFor: {
                    dependencyType: "stateVariable",
                    variableName: "externalLabelsReferencingInputByFor",
                },
                // An input drawn inside an expression has nowhere to put a
                // visible label, so the expression it sits in names it instead.
                ...(componentClass.canBeEmbeddedInMath
                    ? {
                          mathAncestor: {
                              dependencyType: "ancestor",
                              componentType: "m",
                              variableNames: [
                                  "latexTemplate",
                                  "embeddedInputComponentIndices",
                              ],
                          },
                          ...returnContentLocaleDependencies(),
                      }
                    : {}),
            }),
            definition({ dependencyValues, componentIdx }) {
                let shortDescription = "";
                const diagnostics = [];
                if (dependencyValues.shortDescriptionChild.length > 0) {
                    const shortDescriptionChild =
                        dependencyValues.shortDescriptionChild[
                            dependencyValues.shortDescriptionChild.length - 1
                        ];

                    shortDescription =
                        shortDescriptionChild.stateValues.text.trim();
                }

                // An input is considered labeled for accessibility if it has an
                // internal label, a non-blank short description, or an external
                // `<label for="...">` whose resolved target is this input.
                const hasExternalForLabel = Boolean(
                    dependencyValues.externalLabelsReferencingInputByFor
                        ?.length,
                );

                // Nothing else named it, but it is a blank in an expression:
                // read the expression, with the gap spoken in its place, so the
                // reader hears what they are being asked to fill in. An
                // external `<label for>` counts as naming it: the renderer
                // would otherwise emit the expression as `aria-label`, which
                // takes precedence over that label.
                if (
                    shortDescription === "" &&
                    !dependencyValues.label &&
                    !hasExternalForLabel
                ) {
                    shortDescription = describeAsMathBlank({
                        dependencyValues,
                        componentIdx,
                    });
                }

                if (
                    shortDescription === "" &&
                    !dependencyValues.label &&
                    !hasExternalForLabel
                ) {
                    // Two codes rather than one with the subject passed in.
                    // The subject is a component name in one branch but an
                    // English phrase in the other, and a phrase handed over
                    // as an argument would never reach a translator.
                    const createdByAnswer =
                        dependencyValues.createdFromSugar &&
                        dependencyValues.answerAncestor;

                    diagnostics.push(
                        createdByAnswer
                            ? codedDiagnostic({
                                  type: "accessibility",
                                  level: 1,
                                  code: "doenet-a0004",
                              })
                            : codedDiagnostic({
                                  type: "accessibility",
                                  level: 1,
                                  code: "doenet-a0003",
                                  args: {
                                      component: componentClass.componentType,
                                  },
                              }),
                    );
                }

                return {
                    setValue: { shortDescription },
                    sendDiagnostics: diagnostics,
                };
            },
        };

        stateVariableDefinitions.childIndicesToRender = {
            returnDependencies: () => ({
                allChildren: {
                    dependencyType: "child",
                    includeAllChildren: true,
                },
            }),
            definition({ dependencyValues }) {
                const descriptionIdx =
                    dependencyValues.allChildren.findLastIndex(
                        (child) => child.componentType === "description",
                    );

                const childIndicesToRender =
                    descriptionIdx === -1 ? [] : [descriptionIdx];

                return { setValue: { childIndicesToRender } };
            },
            markStale: () => ({ updateRenderedChildren: true }),
        };

        stateVariableDefinitions.focused = {
            description: "Whether this input currently has keyboard focus.",
            forRenderer: true,
            hasEssential: true,
            defaultValue: false,
            public: true,
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

/**
 * Describe an embedded input by the expression it is a gap in.
 *
 * Returns `""` unless this input really is embedded in the math ancestor, so
 * that an input merely written near some math is left to the ordinary
 * unlabeled-input warning.
 *
 * The gap is named rather than left silent because MathJax reads a reserved
 * space as nothing at all — and worse, without an operand there, a following
 * binary `+` is read as a sign. Speaking the whole expression on the control
 * gives the reader the question and the place it is asked in one go.
 */
function describeAsMathBlank({ dependencyValues, componentIdx }) {
    const math = dependencyValues.mathAncestor;
    const embedded = math?.stateValues.embeddedInputComponentIndices;
    if (!embedded?.includes(componentIdx)) {
        return "";
    }

    const t = contentTranslator(dependencyValues);
    const ordinal = embedded.indexOf(componentIdx) + 1;
    const plainBlank = t("math-embedded-input-blank", undefined, "blank");
    // Only this input's gap is numbered; the others stay plain, so a reader
    // scanning the expression can tell which gap they have landed on.
    const thisBlank =
        embedded.length > 1
            ? t(
                  "math-embedded-input-blank-ordinal",
                  { ordinal, total: embedded.length },
                  `blank ${ordinal} of ${embedded.length}`,
              )
            : plainBlank;

    // Put the blank placeholder in for each gap, read the whole expression as
    // one, then put the words in. Two things force this shape: reading the
    // pieces *between* the gaps separately does not work, because a fragment
    // cut at a gap is not a whole expression and the math parser fills what is
    // missing with a placeholder of its own; and the words cannot go in before
    // parsing, because the parser passes `\text{...}` through untouched. The
    // placeholder parses as an ordinary variable, so the gaps come out of the
    // round trip intact and in the order they went in. It is the same
    // placeholder `text` and `math` use for a blank, so all three agree.
    //
    // A row of an aligned display carries its alignment marker, which is
    // layout and not mathematics: it is dropped as `Md.text` drops it, so the
    // row is spoken as the equation it is.
    const withPlaceholders = stripAlignmentMarkers(
        math.stateValues.latexTemplate ?? "",
    ).replace(SLOT_PATTERN, BLANK_PLACEHOLDER);

    // `latexToText` hands back the LaTeX itself when it cannot be parsed,
    // which still has the placeholders in it, so the reader is still told
    // where the gap is.
    const described = latexToText(withPlaceholders).trim();

    let position = 0;
    const named = described.replaceAll(BLANK_PLACEHOLDER, () =>
        position++ === ordinal - 1 ? thisBlank : plainBlank,
    );

    return named || thisBlank;
}
