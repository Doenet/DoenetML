import { serializedAttributeComponent } from "../utils/literalAttribute";
import Sequence from "./Sequence";
import {
    calculateSequenceParameters,
    returnSequenceValueForIndex,
    returnSequenceValues,
} from "../utils/sequence";
import { lettersToNumber, enumerateSelectionCombinations } from "@doenet/utils";

import { textToMathFactory } from "../utils/math";
import {
    extractConstantSortAttribute,
    pushVariantInfo,
} from "../utils/variants";
import {
    checkForExcludedCombination,
    estimateNumberOfDuplicateCombinations,
    estimateNumberOfNumberCombinationsExcluded,
    mergeContainingNumberCombinations,
} from "../utils/excludeCombinations";
import me from "math-expressions";
import { codedDiagnostic } from "../utils/diagnostics";
import { levelFromSource } from "../utils/decidedByDoenetML";
import {
    NO_SELECT_ERROR,
    choicesWrittenWithoutReference,
    returnChoicesDecidedByDoenetMLDefinition,
    returnSelectErrorReportDefinition,
    selectError,
    selectFailureType,
    selectionResult,
    takeSelectError,
    keptSelection,
    NUM_TO_SELECT_VARIABLE,
    withNumToSelect,
    selectionWithRequested,
} from "../utils/selectErrors";
import {
    coprimeCombinations,
    drawValidCombination,
    someValidCombination,
} from "../utils/validCombinations";
const { gcd } = me.math;

/**
 * The attributes that decide what a `<selectFromSequence>` can select. When
 * none of them can change, a failure to select is an error; otherwise it is
 * a missing selection with an info (`selectFailureType`,
 * `choicesDecidedByDoenetML`).
 */
const ATTRIBUTES_DECIDING_CHOICES = [
    "from",
    "to",
    "step",
    "length",
    "exclude",
    "numToSelect",
    "withReplacement",
    "excludeCombinations",
    "coprime",
];

export default class SelectFromSequence extends Sequence {
    constructor(args) {
        super(args);
        // so a fresh load reproduces its selection
        this.doenetAttributes.choicesWrittenWithoutReference =
            choicesWrittenWithoutReference({
                component: this,
                attributeNames: ATTRIBUTES_DECIDING_CHOICES,
                componentInfoObjects: args.componentInfoObjects,
            });
    }

    /**
     * Whether a fresh load reproduces this select's selection, so a save
     * can leave it out (`BaseComponent.definitionEssentialValuesAreReproducible`):
     * only when the DoenetML alone decides what it chooses from. A value
     * that decides it, such as an input, can have changed by the time the
     * document is loaded again, and the select must keep the choices it was
     * made with, never choosing again.
     */
    get definitionEssentialValuesReproducible() {
        return this.doenetAttributes.choicesWrittenWithoutReference !== false;
    }

    static componentType = "selectFromSequence";

    static componentDocs = {
        summary:
            "Randomly selects values from a sequence of numbers, math expressions, or letters to create document variants",
    };

    static listEntryValuesVariable = "selectedValues";

    // The selection is made once and does not change, so a value written to
    // an entry stands over the value selected there, whatever the sequence's
    // `from` or `step` become (not `sequenceWriteBasis`, as for a
    // `<sequence>`).
    static listEntryWriteBasisVariable = undefined;

    static createsVariants = true;

    // Writing one of these on a `copyWithState` is an error, as it would
    // change what is chosen, which a `copyWithState` keeps
    // (`copyWithStateChangesChoicesErrors` in `Copy.js`, D33).
    static attributesDeterminingChoices = [
        "type",
        "from",
        "to",
        "step",
        "length",
        "exclude",
        "numToSelect",
        "withReplacement",
        "excludeCombinations",
        "coprime",
    ];

    static createAttributesObject() {
        let attributes = super.createAttributesObject();
        attributes.numToSelect = {
            createComponentOfType: "integer",
            createStateVariable: "specifiedNumToSelect",
            // fixed with the selection made from it; the public `numToSelect`
            // is kept with the selection (`NUM_TO_SELECT_VARIABLE`)
            immutable: true,
            defaultValue: 1,
            description: "How many values to select from the sequence.",
        };
        attributes.withReplacement = {
            createComponentOfType: "boolean",
            createStateVariable: "withReplacement",
            // fixed with the selection made from it
            immutable: true,
            defaultValue: false,
            public: true,
            description:
                "Whether the same value can be selected more than once.",
        };
        attributes.sort = {
            createComponentOfType: "text",
            createStateVariable: "sort",
            defaultValue: "unsorted",
            public: true,
            toLowerCase: true,
            valueForTrue: "increasing",
            valueForFalse: "unsorted",
            validValues: [
                {
                    value: "unsorted",
                    description: "Preserve the random selection order.",
                },
                {
                    value: "increasing",
                    description:
                        "Sort the selected values in increasing order.",
                },
                {
                    value: "decreasing",
                    description:
                        "Sort the selected values in decreasing order.",
                },
            ],
            description: "Whether and how to sort the selected values.",
        };
        attributes.excludeCombinations = {
            createComponentOfType: "_componentListOfListsWithSelectableType",
            description:
                "Lists of value combinations to exclude from the selection.",
        };
        attributes.coprime = {
            createComponentOfType: "boolean",
            createStateVariable: "coprime",
            // fixed with the selection made from it
            immutable: true,
            defaultValue: false,
            public: true,
            description:
                "Require the selected numbers to be pairwise coprime (numbers only).",
        };
        return attributes;
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        // What the selection is made from is fixed with it, so a change to
        // an attribute it came from (`to="$mi"`) is ignored, as a change to
        // `numToSelect` is: the selection is never made again
        stateVariableDefinitions.from.immutable = true;
        stateVariableDefinitions.from.additionalStateVariablesDefined =
            stateVariableDefinitions.from.additionalStateVariablesDefined.map(
                (variableName) =>
                    typeof variableName === "string"
                        ? { variableName, immutable: true }
                        : { ...variableName, immutable: true },
            );
        stateVariableDefinitions.lowercase.immutable = true;

        stateVariableDefinitions.excludedCombinations = {
            immutable: true,
            returnDependencies: () => ({
                excludeCombinations: {
                    dependencyType: "attributeComponent",
                    attributeName: "excludeCombinations",
                    variableNames: ["lists"],
                },
                type: {
                    dependencyType: "stateVariable",
                    variableName: "type",
                },
                numToSelect: {
                    dependencyType: "stateVariable",
                    variableName: "specifiedNumToSelect",
                },
                coprime: {
                    dependencyType: "stateVariable",
                    variableName: "coprime",
                },
                // whether `coprime` and the `type` it is ignored for are
                // written in the DoenetML: a warning then, and an info when
                // they come from values that can change (DIAG-2). Whether
                // `excludeCombinations` is given is always written.
                coprimeDecidedByDoenetML: {
                    dependencyType: "decidedByDoenetML",
                    attributeNames: ["coprime", "type"],
                },
            }),
            definition: function ({ dependencyValues }) {
                const diagnostics = [];
                const levelDecided = dependencyValues.coprimeDecidedByDoenetML;
                if (
                    dependencyValues.coprime &&
                    dependencyValues.type !== "number"
                ) {
                    diagnostics.push(
                        codedDiagnostic({
                            type: levelFromSource(levelDecided),
                            code: "doenet-w0051",
                        }),
                    );
                }
                if (dependencyValues.excludeCombinations !== null) {
                    let excludedCombinations =
                        dependencyValues.excludeCombinations.stateValues.lists
                            .map((x) =>
                                x.slice(0, dependencyValues.numToSelect),
                            )
                            .filter(
                                (x) =>
                                    x.length === dependencyValues.numToSelect,
                            );

                    if (dependencyValues.type === "number") {
                        while (true) {
                            let result =
                                mergeContainingNumberCombinations(
                                    excludedCombinations,
                                );
                            if (result.merged) {
                                excludedCombinations = result.combinations;
                            } else {
                                break;
                            }
                        }

                        if (dependencyValues.coprime) {
                            diagnostics.push(
                                codedDiagnostic({
                                    type: levelFromSource(levelDecided),
                                    code: "doenet-w0052",
                                }),
                            );
                        }
                    }
                    return {
                        setValue: { excludedCombinations },
                        sendDiagnostics: diagnostics,
                    };
                } else {
                    return {
                        setValue: {
                            excludedCombinations: [],
                        },
                        sendDiagnostics: diagnostics,
                    };
                }
            },
        };

        stateVariableDefinitions.variants = {
            returnDependencies: () => ({
                variants: {
                    dependencyType: "variants",
                },
            }),
            definition: function ({ dependencyValues }) {
                return { setValue: { variants: dependencyValues.variants } };
            },
        };

        stateVariableDefinitions.choicesDecidedByDoenetML =
            returnChoicesDecidedByDoenetMLDefinition({
                attributeNames: ATTRIBUTES_DECIDING_CHOICES,
            });

        stateVariableDefinitions.selectedValues = {
            immutable: true,
            hasEssential: true,
            // to keep a selection already made (`keptSelection`)
            provideEssentialValuesInDefinition: true,
            shadowVariable: true,
            additionalStateVariablesDefined: [
                {
                    variableName: "selectedIndices",
                    hasEssential: true,
                    shadowVariable: true,
                    immutable: true,
                },
                {
                    variableName: "errorMessage",
                    hasEssential: true,
                    shadowVariable: true,
                    immutable: true,
                },
                {
                    // Set with `errorMessage` and never without it; see
                    // `SelectErrorState`.
                    variableName: "errorDiagnostic",
                    hasEssential: true,
                    shadowVariable: true,
                    immutable: true,
                },
                NUM_TO_SELECT_VARIABLE,
            ],
            returnDependencies: ({ sharedParameters }) => ({
                ...selectionDependencies(),
                choicesDecidedByDoenetML: {
                    dependencyType: "stateVariable",
                    variableName: "choicesDecidedByDoenetML",
                },
                variantRng: {
                    dependencyType: "value",
                    value: sharedParameters.variantRng,
                    doNotProxy: true,
                },
            }),
            definition: (args) =>
                withNumToSelect(
                    makeSelection(args),
                    args.dependencyValues.numToSelect,
                ),
        };

        stateVariableDefinitions.isVariantComponent = {
            returnDependencies: () => ({}),
            definition: () => ({ setValue: { isVariantComponent: true } }),
        };

        stateVariableDefinitions.generatedVariantInfo = {
            returnDependencies: () => ({
                selectedIndices: {
                    dependencyType: "stateVariable",
                    variableName: "selectedIndices",
                },
            }),
            definition({ dependencyValues, componentIdx }) {
                let generatedVariantInfo = {
                    indices: dependencyValues.selectedIndices,
                    meta: { createdBy: componentIdx },
                };

                return { setValue: { generatedVariantInfo } };
            },
        };

        stateVariableDefinitions.selectErrorReported =
            returnSelectErrorReportDefinition();

        // A selection draws from the sequence without listing it, which may
        // be long.
        delete stateVariableDefinitions.sequenceValues;

        return stateVariableDefinitions;
    }

    static determineNumberOfUniqueVariants({
        serializedComponent,
        infoDiagnostics,
    }) {
        const info = (diagnostic) =>
            pushVariantInfo(infoDiagnostics, diagnostic, serializedComponent);
        let numToSelect = 1,
            withReplacement = false;

        let sequenceType = serializedComponent.attributes.type.primitive.value;

        let numToSelectComponent = serializedAttributeComponent(
            serializedComponent.attributes.numToSelect,
        );
        if (numToSelectComponent) {
            // only implemented if have an integer with a single string child
            if (
                numToSelectComponent.componentType === "integer" &&
                numToSelectComponent.children?.length === 1 &&
                typeof numToSelectComponent.children[0] === "string"
            ) {
                numToSelect = Number(numToSelectComponent.children[0]);

                if (!Number.isInteger(numToSelect)) {
                    info({
                        code: "doenet-i0022",
                        component: "selectFromSequence",
                    });
                    return { success: false };
                }
                // A negative number selects nothing at run time, the same as 0,
                // so it adds the single variant of selecting nothing
                numToSelect = Math.max(numToSelect, 0);
            } else {
                info({ code: "doenet-i0023", component: "selectFromSequence" });
                return { success: false };
            }
        }

        // Selecting nothing has exactly one outcome, whatever withReplacement,
        // the options or the range, so return before reading anything that
        // might not be countable
        if (numToSelect === 0) {
            serializedComponent.variants.numVariants = 1;
            serializedComponent.variants.uniqueVariantData = {
                excludeIndices: [],
                nOptions: 0,
                numToSelect: 0,
                withReplacement: false,
            };
            return { success: true, numVariants: 1 };
        }

        let coprimeCombinationsComponent = serializedAttributeComponent(
            serializedComponent.attributes.coprime,
        );
        if (coprimeCombinationsComponent) {
            // unique variants is only implemented if know that coprime is false,
            // i.e., if have an boolean with a single string child that is "false"
            if (!(
                coprimeCombinationsComponent.componentType === "boolean" &&
                coprimeCombinationsComponent.children?.length === 1 &&
                typeof coprimeCombinationsComponent.children[0] === "string" &&
                coprimeCombinationsComponent.children[0]
                    .trim()
                    .toLowerCase() === "false"
            )) {
                info({ code: "doenet-i0026", component: "selectFromSequence" });
                return { success: false };
            }
        }

        let withReplacementComponent = serializedAttributeComponent(
            serializedComponent.attributes.withReplacement,
        );
        if (withReplacementComponent) {
            // only implemented if have an boolean with a boolean value or a single string child
            if (withReplacementComponent.componentType === "boolean") {
                if (
                    withReplacementComponent.children?.length === 1 &&
                    typeof withReplacementComponent.children[0] === "string"
                ) {
                    withReplacement =
                        withReplacementComponent.children[0].toLowerCase() ===
                        "true";
                } else if (
                    (withReplacementComponent.children === undefined ||
                        withReplacementComponent.children.length === 0) &&
                    typeof withReplacementComponent.state?.value === "boolean"
                ) {
                    withReplacement = withReplacementComponent.state.value;
                } else {
                    info({
                        code: "doenet-i0024",
                        component: "selectFromSequence",
                    });
                    return { success: false };
                }
            } else {
                info({ code: "doenet-i0024", component: "selectFromSequence" });
                return { success: false };
            }
        }

        let sequencePars = {
            from: null,
            to: null,
            step: null,
            length: null,
        };

        let fromComponent = serializedAttributeComponent(
            serializedComponent.attributes.from,
        );
        if (fromComponent) {
            // from itself is a component with selectable type
            let fromComponent2 = fromComponent.children[0];
            // only implemented if have a single string child
            if (
                fromComponent2.children?.length === 1 &&
                typeof fromComponent2.children[0] === "string"
            ) {
                let from;

                if (sequenceType === "number") {
                    from = Number(fromComponent2.children[0]);
                    if (!Number.isFinite(from)) {
                        info({
                            code: "doenet-i0029",
                            component: "selectFromSequence",
                            args: {
                                type: "number",
                                attribute: "from",
                                expected: "number",
                            },
                        });
                        return { success: false };
                    }
                } else if (sequenceType === "letters") {
                    from = lettersToNumber(fromComponent2.children[0]);
                    if (!Number.isFinite(from)) {
                        info({
                            code: "doenet-i0029",
                            component: "selectFromSequence",
                            args: {
                                type: "letters",
                                attribute: "from",
                                expected: "letters-combination",
                            },
                        });
                        return { success: false };
                    }
                } else {
                    let fromText = textToMathFactory({
                        functionSymbols: ["f", "g"],
                    });
                    try {
                        from = fromText(fromComponent2.children[0]);
                    } catch (e) {
                        info({
                            code: "doenet-i0029",
                            component: "selectFromSequence",
                            args: {
                                type: "math",
                                attribute: "from",
                                expected: "math-expression",
                            },
                        });
                        return { success: false };
                    }
                }
                sequencePars.from = from;
            } else {
                info({
                    code: "doenet-i0027",
                    component: "selectFromSequence",
                    args: { attribute: "from" },
                });
                return { success: false };
            }
        }

        let toComponent = serializedAttributeComponent(
            serializedComponent.attributes.to,
        );
        if (toComponent) {
            // to itself is a component with selectable type
            let toComponent2 = toComponent.children[0];
            // only implemented if have a single string child
            if (
                toComponent2.children?.length === 1 &&
                typeof toComponent2.children[0] === "string"
            ) {
                let to;

                if (sequenceType === "number") {
                    to = Number(toComponent2.children[0]);
                    if (!Number.isFinite(to)) {
                        info({
                            code: "doenet-i0029",
                            component: "selectFromSequence",
                            args: {
                                type: "number",
                                attribute: "to",
                                expected: "number",
                            },
                        });
                        return { success: false };
                    }
                } else if (sequenceType === "letters") {
                    to = lettersToNumber(toComponent2.children[0]);
                    if (!Number.isFinite(to)) {
                        info({
                            code: "doenet-i0029",
                            component: "selectFromSequence",
                            args: {
                                type: "letters",
                                attribute: "to",
                                expected: "letters-combination",
                            },
                        });
                        return { success: false };
                    }
                } else {
                    let fromText = textToMathFactory({
                        functionSymbols: ["f", "g"],
                    });
                    try {
                        to = fromText(toComponent2.children[0]);
                    } catch (e) {
                        info({
                            code: "doenet-i0029",
                            component: "selectFromSequence",
                            args: {
                                type: "math",
                                attribute: "to",
                                expected: "math-expression",
                            },
                        });
                        return { success: false };
                    }
                }
                sequencePars.to = to;
            } else {
                info({
                    code: "doenet-i0027",
                    component: "selectFromSequence",
                    args: { attribute: "to" },
                });
                return { success: false };
            }
        }

        let stepComponent = serializedAttributeComponent(
            serializedComponent.attributes.step,
        );
        if (stepComponent) {
            // only implemented if have a single string child
            if (
                stepComponent.children?.length === 1 &&
                typeof stepComponent.children[0] === "string"
            ) {
                let step;

                if (sequenceType === "number") {
                    step = Number(stepComponent.children[0]);
                    if (!Number.isFinite(step)) {
                        info({
                            code: "doenet-i0029",
                            component: "selectFromSequence",
                            args: {
                                type: "number",
                                attribute: "step",
                                expected: "number",
                            },
                        });
                        return { success: false };
                    }
                } else if (sequenceType === "letters") {
                    step = Number(stepComponent.children[0]);
                    if (!Number.isInteger(step)) {
                        info({
                            code: "doenet-i0029",
                            component: "selectFromSequence",
                            args: {
                                type: "letters",
                                attribute: "step",
                                expected: "integer",
                            },
                        });
                        return { success: false };
                    }
                } else {
                    let fromText = textToMathFactory({
                        functionSymbols: ["f", "g"],
                    });
                    try {
                        step = fromText(stepComponent.children[0]);
                    } catch (e) {
                        info({
                            code: "doenet-i0029",
                            component: "selectFromSequence",
                            args: {
                                type: "math",
                                attribute: "step",
                                expected: "math-expression",
                            },
                        });
                        return { success: false };
                    }
                }
                sequencePars.step = step;
            } else {
                info({
                    code: "doenet-i0027",
                    component: "selectFromSequence",
                    args: { attribute: "step" },
                });
                return { success: false };
            }
        }

        let lengthComponent = serializedAttributeComponent(
            serializedComponent.attributes.length,
        );
        if (lengthComponent) {
            // only implemented if have a single string child
            if (
                lengthComponent.children?.length === 1 &&
                typeof lengthComponent.children[0] === "string"
            ) {
                let length = Number(lengthComponent.children[0]);
                if (!Number.isInteger(length)) {
                    info({
                        code: "doenet-i0030",
                        component: "selectFromSequence",
                    });
                    return { success: false };
                }
                sequencePars.length = length;
            } else {
                info({
                    code: "doenet-i0027",
                    component: "selectFromSequence",
                    args: { attribute: "length" },
                });
                return { success: false };
            }
        }

        if (serializedComponent.attributes.excludeCombinations) {
            info({ code: "doenet-i0032", component: "selectFromSequence" });
            return { success: false };
        }

        let excludes = [];

        let excludeComponent = serializedAttributeComponent(
            serializedComponent.attributes.exclude,
        );
        if (excludeComponent) {
            if (sequenceType === "math") {
                info({ code: "doenet-i0033", component: "selectFromSequence" });
                return { success: false };
            }
            if (
                !excludeComponent.children.every(
                    (x) =>
                        x.children?.length === 1 &&
                        typeof x.children[0] === "string",
                )
            ) {
                info({ code: "doenet-i0034", component: "selectFromSequence" });
                return { success: false };
            }
            if (sequenceType === "letters") {
                excludes = excludeComponent.children.map((x) =>
                    lettersToNumber(x.children[0]),
                );
            } else {
                excludes = excludeComponent.children.map((x) =>
                    Number(x.children[0]),
                );
            }

            if (!excludes.every(Number.isFinite)) {
                info({ code: "doenet-i0034", component: "selectFromSequence" });
                return { success: false };
            }
        }

        let sortResult = extractConstantSortAttribute(
            serializedComponent,
            "selectFromSequence",
            numToSelect,
            infoDiagnostics,
        );
        if (!sortResult.success) {
            return { success: false };
        }

        sequencePars = calculateSequenceParameters(sequencePars);

        let nOptions = sequencePars.length;
        let excludeIndices = [];
        if (excludes.length > 0) {
            if (sequenceType !== "math") {
                excludes.sort((a, b) => a - b);
                excludes = excludes.filter((x, ind, a) => x != a[ind - 1]); // remove duplicates
                for (let item of excludes) {
                    if (item < sequencePars.from) {
                        continue;
                    }
                    let ind = (item - sequencePars.from) / sequencePars.step;
                    if (ind > sequencePars.length - 1 + 1e-10) {
                        break;
                    }
                    if (Math.abs(ind - Math.round(ind)) < 1e-10) {
                        nOptions--;
                        excludeIndices.push(ind);
                    }
                }
            }
        }

        if (nOptions <= 0) {
            return { success: false };
        }

        let uniqueVariantData = {
            excludeIndices,
            nOptions,
            numToSelect,
            withReplacement,
        };

        serializedComponent.variants.uniqueVariantData = uniqueVariantData;

        let numVariants;

        if (withReplacement || numToSelect === 1) {
            numVariants = Math.pow(nOptions, numToSelect);
        } else {
            numVariants = 1;
            for (let n = nOptions; n > nOptions - numToSelect; n--) {
                numVariants *= n;
            }
        }

        if (!(numVariants > 0)) {
            return { success: false };
        }

        serializedComponent.variants.numVariants = numVariants;

        return {
            success: true,
            numVariants: numVariants,
        };
    }

    static getUniqueVariant({ serializedComponent, variantIndex }) {
        let numVariants = serializedComponent.variants?.numVariants;
        if (numVariants === undefined) {
            return { success: false };
        }

        if (
            !Number.isInteger(variantIndex) ||
            variantIndex < 1 ||
            variantIndex > numVariants
        ) {
            return { success: false };
        }

        let uniqueVariantData = serializedComponent.variants.uniqueVariantData;
        let excludeIndices = uniqueVariantData.excludeIndices;
        let nOptions = uniqueVariantData.nOptions;
        let numToSelect = uniqueVariantData.numToSelect;
        let withReplacement = uniqueVariantData.withReplacement;

        let getSingleIndex = function (num) {
            let ind = num;
            for (let excludeInd of excludeIndices) {
                if (ind >= excludeInd) {
                    ind++;
                }
            }

            return ind;
        };

        if (numToSelect === 1) {
            return {
                success: true,
                desiredVariant: {
                    indices: [getSingleIndex(variantIndex - 1) + 1],
                },
            };
        }

        let numbers = enumerateSelectionCombinations({
            numberOfIndices: numToSelect,
            numberOfOptions: nOptions,
            maxNumber: variantIndex,
            withReplacement,
        })[variantIndex - 1];
        let indices = numbers.map(getSingleIndex).map((x) => x + 1);
        return { success: true, desiredVariant: { indices: indices } };
    }
}

/**
 * What a `<selectFromSequence>` selects from, and how many: the dependencies
 * of `selectedValues`, other than the generator.
 */
function selectionDependencies() {
    return {
        numToSelect: {
            dependencyType: "stateVariable",
            variableName: "specifiedNumToSelect",
        },
        withReplacement: {
            dependencyType: "stateVariable",
            variableName: "withReplacement",
        },
        length: {
            dependencyType: "stateVariable",
            variableName: "length",
        },
        from: {
            dependencyType: "stateVariable",
            variableName: "from",
        },
        step: {
            dependencyType: "stateVariable",
            variableName: "step",
        },
        exclude: {
            dependencyType: "stateVariable",
            variableName: "exclude",
        },
        excludedCombinations: {
            dependencyType: "stateVariable",
            variableName: "excludedCombinations",
        },
        coprime: {
            dependencyType: "stateVariable",
            variableName: "coprime",
        },
        type: {
            dependencyType: "stateVariable",
            variableName: "type",
        },
        lowercase: {
            dependencyType: "stateVariable",
            variableName: "lowercase",
        },
        sort: {
            dependencyType: "stateVariable",
            variableName: "sort",
        },
        variants: {
            dependencyType: "stateVariable",
            variableName: "variants",
        },
    };
}

/**
 * The indices the requested variant gives, wrapped onto the sequence, or
 * `undefined` when it gives none. They are taken as given, whatever the
 * select would choose now (`selectionWithRequested`): a select keeps the
 * choices it was made with, as it keeps what it chose from, and never chooses
 * again (#2389). `null`, which a select that could not select records in its
 * variant (`generatedVariantInfo`), or `[]`, is a selection of nothing.
 * Indices that aren't integers, which no select records, give none.
 */
function requestedIndices(dependencyValues) {
    let desiredIndices = dependencyValues.variants?.desiredVariant?.indices;
    if (desiredIndices === null) {
        return [];
    }
    if (!Array.isArray(desiredIndices)) {
        return undefined;
    }
    desiredIndices = desiredIndices.map(Number);
    if (!desiredIndices.every(Number.isInteger)) {
        return undefined;
    }
    let n = dependencyValues.length;
    if (desiredIndices.length > 0 && !(n > 0)) {
        return undefined;
    }
    return desiredIndices.map((x) => ((((x - 1) % n) + n) % n) + 1);
}

/**
 * The selection of the indices `indices`, from 1, into the sequence: the
 * value each names, whether or not it is excluded now.
 */
function selectionOfIndices(dependencyValues, indices) {
    const selectedValues = indices.map((indexFrom1) =>
        returnSequenceValueForIndex({
            index: indexFrom1 - 1,
            from: dependencyValues.from,
            step: dependencyValues.step,
            length: dependencyValues.length,
            exclude: [],
            type: dependencyValues.type,
            lowercase: dependencyValues.lowercase,
        }),
    );
    return selectionResult(NO_SELECT_ERROR, {
        selectedValues,
        selectedIndices: indices,
    });
}

function makeSelection({ dependencyValues, essentialValues }) {
    // A selection already made, as on a reload, is kept
    const kept = keptSelection(
        essentialValues,
        [
            "selectedValues",
            "selectedIndices",
            "errorMessage",
            "errorDiagnostic",
            "numToSelect",
        ],
        {
            // a math is saved as its expression tree
            selectedValues: (values) =>
                dependencyValues.type === "math" && Array.isArray(values)
                    ? values.map((value) =>
                          value?.tree !== undefined ? value : me.fromAst(value),
                      )
                    : values,
        },
    );
    if (kept) {
        return kept;
    }

    return selectionWithRequested({
        requested: requestedIndices(dependencyValues),
        dependencyValues,
        select: makeFreshSelection,
        rngKey: "variantRng",
        takeRequested: (indices) =>
            selectionOfIndices(dependencyValues, indices),
        emptySelection: selectionResult(NO_SELECT_ERROR, {
            selectedValues: [],
            selectedIndices: [],
        }),
    });
}

/** The selection a `<selectFromSequence>` makes itself, given no choices. */
function makeFreshSelection(dependencyValues) {
    // An error when the DoenetML decides that nothing can be selected, and a
    // missing selection with an info when a value does (D38, DIAG-7)
    const failureType = selectFailureType(
        dependencyValues.choicesDecidedByDoenetML,
    );

    if (dependencyValues.numToSelect < 1) {
        return selectionResult(NO_SELECT_ERROR, {
            selectedValues: [],
            selectedIndices: [],
        });
    }

    let numUniqueRequired = 1;
    if (!dependencyValues.withReplacement) {
        numUniqueRequired = dependencyValues.numToSelect;
    }

    if (numUniqueRequired > dependencyValues.length) {
        const error = selectError({
            code: "doenet-e0036",
            args: {
                numToSelect: numUniqueRequired,
                length: dependencyValues.length,
            },
            type: failureType,
        });
        return selectionResult(error, {
            selectedValues: null,
            selectedIndices: null,
        });
    }

    let numCombinationsExcluded = dependencyValues.excludedCombinations.length;

    let coprime = dependencyValues.coprime;

    if (dependencyValues.type === "number") {
        let error = null;
        numCombinationsExcluded = estimateNumberOfNumberCombinationsExcluded({
            excludedCombinations: dependencyValues.excludedCombinations,
            numValues:
                dependencyValues.length - dependencyValues.exclude.length,
            withReplacement: dependencyValues.withReplacement,
            numToSelect: dependencyValues.numToSelect,
        });

        if (coprime) {
            const lastNumber =
                dependencyValues.from +
                (dependencyValues.length - 1) * dependencyValues.step;
            if (numCombinationsExcluded > 0) {
                // No need to send warning since already sent
                // in definition of excludeCombinations
                coprime = false;
            } else if (
                !Number.isInteger(dependencyValues.from) ||
                !Number.isInteger(dependencyValues.step) ||
                dependencyValues.from <= 0 ||
                lastNumber <= 0
            ) {
                error = selectError({
                    code: "doenet-e0041",
                    type: failureType,
                });
            } else if (
                gcd(dependencyValues.from, dependencyValues.step) !== 1
            ) {
                error = selectError({
                    code: "doenet-e0042",
                    type: failureType,
                });
            } else if (dependencyValues.numToSelect === 1) {
                coprime = false;
            } else if (
                dependencyValues.length - dependencyValues.exclude.length <=
                1
            ) {
                // It is possible that there is only one number to choose from,
                // in which case, we cannot select coprime numbers, unless that number is 1.
                // We have to verify that there is more than one number available only if 1 isn't a possibility.
                if (
                    dependencyValues.from > 1 ||
                    dependencyValues.exclude.includes(1)
                ) {
                    // One situation and so one code, reached two ways: a
                    // sequence short enough to tell from `length` alone, and
                    // one whose values have to be generated to tell. The
                    // short-circuit is what keeps the second from being
                    // generated when the first already answered.
                    if (
                        dependencyValues.length <= 1 ||
                        returnSequenceValues(dependencyValues).length <= 1
                    ) {
                        error = selectError({
                            code: "doenet-e0043",
                            type: failureType,
                        });
                    }
                }
            }

            // Every value sharing a factor, which only an `exclude` can
            // make, as `from` and `step` have none: no draw could be
            // coprime. Found before drawing, as a select given a requested
            // variant's choices finds what it would report without drawing
            // (`selectionWithRequested`), so this error, which the DoenetML
            // can decide, is reported in every variant (DIAG-7).
            if (
                !error &&
                coprime &&
                dependencyValues.exclude.length > 0 &&
                !valuesHaveNoCommonFactor(dependencyValues)
            ) {
                error = selectError({
                    code: "doenet-e0045",
                    type: failureType,
                });
            }
        }

        if (error) {
            return selectionResult(error, {
                selectedValues: null,
                selectedIndices: null,
            });
        }
    } else {
        // No need to send warning since already sent
        // in definition of excludeCombinations
        coprime = false;
    }

    let selectedValues, selectedIndices;

    if (numCombinationsExcluded === 0 && !coprime) {
        let selectedObj = selectValuesAndIndices({
            stateValues: dependencyValues,
            numUniqueRequired: numUniqueRequired,
            numToSelect: dependencyValues.numToSelect,
            withReplacement: dependencyValues.withReplacement,
            rng: dependencyValues.variantRng,
            failureType,
        });

        if (selectedObj.errorMessage) {
            return selectionResult(takeSelectError(selectedObj), {
                selectedValues: null,
                selectedIndices: null,
            });
        }

        selectedValues = selectedObj.selectedValues;
        selectedIndices = selectedObj.selectedIndices;
    } else {
        let numPossibilitiesLowerBound =
            dependencyValues.length - dependencyValues.exclude.length;

        if (dependencyValues.withReplacement) {
            numPossibilitiesLowerBound = Math.pow(
                numPossibilitiesLowerBound,
                dependencyValues.numToSelect,
            );
        } else {
            let n = numPossibilitiesLowerBound;
            for (let i = 1; i < dependencyValues.numToSelect; i++) {
                numPossibilitiesLowerBound *= n - i;
            }
        }

        if (numCombinationsExcluded > 0.7 * numPossibilitiesLowerBound) {
            // may have excluded over 70% of combinations
            // need to determine actual number of possibilities
            // to see if really have excluded that many combinations

            let numPossibilities = 0;
            for (let index = 0; index < dependencyValues.length; index++) {
                if (
                    returnSequenceValueForIndex({
                        index,
                        from: dependencyValues.from,
                        step: dependencyValues.step,
                        length: dependencyValues.length,
                        exclude: dependencyValues.exclude,
                        type: dependencyValues.type,
                    }) !== null
                ) {
                    numPossibilities++;
                }
            }

            if (dependencyValues.withReplacement) {
                numPossibilities = Math.pow(
                    numPossibilities,
                    dependencyValues.numToSelect,
                );
            } else {
                let n = numPossibilities;
                for (let i = 1; i < dependencyValues.numToSelect; i++) {
                    numPossibilities *= n - i;
                }
            }

            if (numCombinationsExcluded > 0.7 * numPossibilities) {
                // A combination naming NaN can name the same one twice, so the
                // estimate is revised down before the threshold is believed.
                // Nothing else can revise it, so a count that survives — or
                // one there was nothing to revise — is the same failure and
                // the same code.
                if (
                    dependencyValues.type === "number" &&
                    dependencyValues.excludedCombinations.some((x) =>
                        x.some(Number.isNaN),
                    )
                ) {
                    numCombinationsExcluded -=
                        estimateNumberOfDuplicateCombinations(
                            dependencyValues.excludedCombinations,
                            dependencyValues.length -
                                dependencyValues.exclude.length,
                            dependencyValues.withReplacement,
                        );
                }

                if (numCombinationsExcluded > 0.7 * numPossibilities) {
                    const error = selectError({
                        code: "doenet-e0044",
                        type: failureType,
                    });
                    return selectionResult(error, {
                        selectedValues: null,
                        selectedIndices: null,
                    });
                }
            }
        }

        // The combinations to draw from: those of the sequence's values,
        // excluded values left out, that aren't an excluded combination and,
        // with `coprime`, have no common factor.
        const space = {
            numValues: dependencyValues.length,
            numToSelect: dependencyValues.numToSelect,
            withReplacement: dependencyValues.withReplacement,
            valueAt: (index) =>
                returnSequenceValueForIndex({
                    index,
                    from: dependencyValues.from,
                    step: dependencyValues.step,
                    exclude: dependencyValues.exclude,
                    type: dependencyValues.type,
                    lowercase: dependencyValues.lowercase,
                }),
            isValid: (values) =>
                (dependencyValues.excludedCombinations.length === 0 ||
                    !checkForExcludedCombination({
                        type: dependencyValues.type,
                        excludedCombinations:
                            dependencyValues.excludedCombinations,
                        values,
                    })) &&
                // the values are integers, as `coprime` requires
                (!coprime || integerGcd(values) === 1),
        };

        // Whether a valid combination exists is decided by the values, so
        // it is found before any draw, and a select with none fails the same
        // way in every variant (SEL-4, DIAG-7): with `coprime`, as values
        // that all share a factor do (`6 10 15`, two at a time, have none),
        // and otherwise as excluding too many combinations does.
        if (!someValidCombination(space)) {
            const error = selectError({
                code: coprime ? "doenet-e0045" : "doenet-e0044",
                type: failureType,
            });
            return selectionResult(error, {
                selectedValues: null,
                selectedIndices: null,
            });
        }

        // Draw, and draw again when a combination isn't valid. When most
        // are valid, a few draws find one.
        let foundValidCombination = false;
        for (let sampnum = 0; sampnum < 200; sampnum++) {
            let selectedObj = selectValuesAndIndices({
                stateValues: dependencyValues,
                numUniqueRequired: numUniqueRequired,
                numToSelect: dependencyValues.numToSelect,
                withReplacement: dependencyValues.withReplacement,
                rng: dependencyValues.variantRng,
                failureType,
            });

            if (selectedObj.errorMessage) {
                return selectionResult(takeSelectError(selectedObj), {
                    selectedValues: null,
                    selectedIndices: null,
                });
            }

            if (space.isValid(selectedObj.selectedValues)) {
                selectedValues = selectedObj.selectedValues;
                selectedIndices = selectedObj.selectedIndices;
                foundValidCombination = true;
                break;
            }
        }

        if (!foundValidCombination) {
            // The draws found none, so valid combinations are rare: draw
            // among them exactly, so the select never fails by chance
            // (SEL-4). One exists, as found above. Coprime combinations are
            // counted rather than gone through, as there can be far too many
            // combinations to go through (1 and the even numbers to 2000,
            // three at a time); `coprime` is never set with excluded
            // combinations.
            if (coprime) {
                const possible = returnSequenceValues(dependencyValues, true);
                const drawn = coprimeCombinations({
                    values: possible.map((x) => x.value),
                    numToSelect: dependencyValues.numToSelect,
                    withReplacement: dependencyValues.withReplacement,
                }).draw(dependencyValues.variantRng);
                selectedValues = drawn.values;
                selectedIndices = drawn.indices.map(
                    (index) => possible[index].originalIndex + 1,
                );
            } else {
                const drawn = drawValidCombination({
                    ...space,
                    rng: dependencyValues.variantRng,
                });
                selectedValues = drawn.values;
                selectedIndices = drawn.indices.map((index) => index + 1);
            }
        }
    }

    if (dependencyValues.sort !== "unsorted") {
        // combine selectedIndices and selectedValues to sort together
        let combinedList = [];
        for (let [ind, val] of selectedValues.entries()) {
            combinedList.push({ value: val, index: selectedIndices[ind] });
        }

        if (dependencyValues.type === "number") {
            if (dependencyValues.sort === "increasing") {
                combinedList.sort((a, b) => a.value - b.value);
            } else if (dependencyValues.sort === "decreasing") {
                combinedList.sort((a, b) => b.value - a.value);
            }
        } else if (dependencyValues.type === "letters") {
            // sort according to their numerical value, not as words
            if (dependencyValues.sort === "increasing") {
                combinedList.sort(
                    (a, b) =>
                        lettersToNumber(a.value) - lettersToNumber(b.value),
                );
            } else if (dependencyValues.sort === "decreasing") {
                combinedList.sort(
                    (a, b) =>
                        lettersToNumber(b.value) - lettersToNumber(a.value),
                );
            }
        }

        selectedValues = combinedList.map((x) => x.value);
        selectedIndices = combinedList.map((x) => x.index);

        // don't sort type math
    }

    return selectionResult(NO_SELECT_ERROR, {
        selectedValues,
        selectedIndices,
    });
}

/**
 * The greatest common divisor of the integers `values`, by Euclid's
 * algorithm: what `gcd` gives, without its cost for each type it handles,
 * since the exact draw of a coprime selection asks it of every combination.
 */
function integerGcd(values) {
    let divisor = 0;
    for (const value of values) {
        let a = Math.abs(divisor);
        let b = Math.abs(value);
        while (b !== 0) {
            [a, b] = [b, a % b];
        }
        divisor = a;
    }
    return divisor;
}

/**
 * Whether the values of the number sequence `dependencyValues`, those not
 * excluded, have no common factor (a greatest common divisor of 1). Stops at
 * the first values that show it, so a long sequence is not generated.
 */
function valuesHaveNoCommonFactor(dependencyValues) {
    let divisor = 0;
    for (let index = 0; index < dependencyValues.length; index++) {
        const value = returnSequenceValueForIndex({
            index,
            from: dependencyValues.from,
            step: dependencyValues.step,
            exclude: dependencyValues.exclude,
            type: dependencyValues.type,
        });
        if (value === null) {
            continue;
        }
        divisor = gcd(divisor, value);
        if (divisor === 1) {
            return true;
        }
    }
    return false;
}

function selectValuesAndIndices({
    stateValues,
    numUniqueRequired = 1,
    numToSelect = 1,
    withReplacement = false,
    rng,
    failureType,
}) {
    let selectedValues = [];
    let selectedIndices = [];

    if (
        stateValues.exclude.length + numUniqueRequired <
        0.5 * stateValues.length
    ) {
        // the simplest case where the likelihood of getting excluded is less than 50%
        // just randomly select from all possibilities
        // and use rejection method to resample if an excluded is hit
        // or repeat a value when withReplacement=false

        let drewFromAll = true;
        for (let ind = 0; ind < numToSelect; ind++) {
            // with 100 chances with at least 50% success,
            // prob of failure less than 10^(-30)
            let foundValid = false;
            let componentValue;
            let selectedIndex;
            for (let sampnum = 0; sampnum < 100; sampnum++) {
                // random number in [0, 1)
                let rand = rng();
                // random integer from 1 to length
                selectedIndex = Math.floor(rand * stateValues.length) + 1;

                if (
                    !withReplacement &&
                    selectedIndices.includes(selectedIndex)
                ) {
                    continue;
                }

                componentValue = returnSequenceValueForIndex({
                    index: selectedIndex - 1,
                    from: stateValues.from,
                    step: stateValues.step,
                    exclude: stateValues.exclude,
                    type: stateValues.type,
                    lowercase: stateValues.lowercase,
                });

                // try again if hit excluded value
                if (componentValue === null) {
                    continue;
                }

                foundValid = true;
                break;
            }

            if (!foundValid) {
                // The draws found no valid value, which is very unlikely,
                // but a choice never fails by chance (SEL-4): draw the whole
                // selection again from the list of valid values, below. A
                // selection either way is uniform among the valid ones.
                drewFromAll = false;
                break;
            }

            selectedValues.push(componentValue);
            selectedIndices.push(selectedIndex);
        }

        if (drewFromAll) {
            return { selectedValues, selectedIndices };
        }
        selectedValues = [];
        selectedIndices = [];
    }

    // for cases when a large fraction might be excluded
    // we will generate the list of possible values and pick from those

    let possibleValuesAndIndices = returnSequenceValues(stateValues, true);

    let numPossibleValues = possibleValuesAndIndices.length;

    if (numUniqueRequired > numPossibleValues) {
        return {
            ...selectError({
                code: "doenet-e0046",
                args: { numToSelect: numUniqueRequired, numPossibleValues },
                type: failureType,
            }),
            selectedValues: null,
            selectedIndices: null,
        };
    }

    if (numUniqueRequired === 1) {
        for (let ind = 0; ind < numToSelect; ind++) {
            // random number in [0, 1)
            let rand = rng();
            // random integer from 0 to numPossibleValues-1
            let ind = Math.floor(rand * numPossibleValues);

            selectedIndices.push(
                possibleValuesAndIndices[ind].originalIndex + 1,
            );
            selectedValues.push(possibleValuesAndIndices[ind].value);
        }

        return { selectedValues, selectedIndices };
    }

    // need to select more than one value without replacement
    // shuffle array and choose first elements
    // https://stackoverflow.com/a/12646864
    for (let i = possibleValuesAndIndices.length - 1; i > 0; i--) {
        const rand = rng();
        const j = Math.floor(rand * (i + 1));
        [possibleValuesAndIndices[i], possibleValuesAndIndices[j]] = [
            possibleValuesAndIndices[j],
            possibleValuesAndIndices[i],
        ];
    }

    let selectedValuesAndIndices = possibleValuesAndIndices.slice(
        0,
        numToSelect,
    );
    selectedValues = selectedValuesAndIndices.map((x) => x.value);
    selectedIndices = selectedValuesAndIndices.map((x) => x.originalIndex + 1);

    return { selectedValues, selectedIndices };
}
