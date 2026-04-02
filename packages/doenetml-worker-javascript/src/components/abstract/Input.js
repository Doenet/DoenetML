import {
    returnLabelAttributes,
    returnLabelStateVariableDefinitions,
} from "../../utils/label";
import InlineComponent from "./InlineComponent";

export default class Input extends InlineComponent {
    constructor(args) {
        super(args);

        Object.assign(this.actions, {
            focusChanged: this.focusChanged.bind(this),
        });
    }

    static componentType = "_input";

    static renderChildren = true;

    static createAttributesObject() {
        let attributes = super.createAttributesObject();
        attributes.collaborateGroups = {
            createComponentOfType: "collaborateGroups",
            createStateVariable: "collaborateGroups",
            defaultValue: null,
            public: true,
            excludeFromSchema: true,
        };

        attributes.labelPosition = {
            createComponentOfType: "text",
            createStateVariable: "labelPosition",
            defaultValue: "left",
            public: true,
            forRenderer: true,
            toLowerCase: true,
            validValues: ["left", "right"],
        };

        attributes.forAnswer = {
            createReferences: true,
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

        stateVariableDefinitions.creditAchieved = {
            forRenderer: true,
            returnDependencies: () => ({
                componentDeterminingDisplayedCorrectness: {
                    dependencyType: "stateVariable",
                    variableName: "componentDeterminingDisplayedCorrectness",
                },
            }),
            definition: function ({ dependencyValues }) {
                let creditAchieved = 0;
                if (dependencyValues.componentDeterminingDisplayedCorrectness) {
                    creditAchieved =
                        dependencyValues
                            .componentDeterminingDisplayedCorrectness
                            .stateValues.creditAchieved;
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
            }),
            definition({ dependencyValues }) {
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

                if (
                    shortDescription === "" &&
                    !dependencyValues.label &&
                    !hasExternalForLabel
                ) {
                    let objectNeedingLabel =
                        dependencyValues.createdFromSugar &&
                        dependencyValues.answerAncestor
                            ? "an `<answer>` creating an input"
                            : `\`<${componentClass.componentType}>\``;

                    diagnostics.push({
                        type: "accessibility",
                        level: 1,
                        message: `For accessibility, ${objectNeedingLabel} must have a short description or a label.`,
                    });
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
