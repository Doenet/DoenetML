import { serializedAttributeComponent } from "../utils/literalAttribute";
import { enumerateSelectionCombinations } from "@doenet/utils";
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
import { createPrimesList } from "../utils/primeNumbers";
import { sampleFromNumberList } from "../utils/randomNumbers";
import ValueListComponent from "./abstract/ValueListComponent";
import {
    NO_SELECT_ERROR,
    choicesDecidedByDoenetML,
    returnChoicesDecidedByDoenetMLDefinition,
    returnSelectErrorReportDefinition,
    selectError,
    selectFailureType,
    selectionResult,
    keptSelection,
    NUM_TO_SELECT_VARIABLE,
    withNumToSelect,
} from "../utils/selectErrors";

/**
 * Selects prime numbers once, from the variant's generator. It is a list
 * component (`ValueListComponent`): it holds the selection in one array,
 * `selectedValues`, and a parent sees one `<integer>` per value.
 */
export default class SelectPrimeNumbers extends ValueListComponent {
    constructor(args) {
        super(args);
        // Whether a failure to select is an error or a missing selection
        // with an info (`selectFailureType`)
        this.doenetAttributes.choicesDecidedByDoenetML =
            choicesDecidedByDoenetML({
                component: this,
                attributeNames: [
                    "from",
                    "to",
                    "exclude",
                    "numToSelect",
                    "withReplacement",
                    "excludeCombinations",
                ],
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
        return this.doenetAttributes.choicesDecidedByDoenetML !== false;
    }

    static componentType = "selectPrimeNumbers";

    static listEntryComponentType = "integer";

    static listEntryValuesVariable = "selectedValues";

    static listEntriesTakeWrites = true;

    static componentDocs = {
        summary:
            "Randomly selects prime numbers from a range to create document variants",
    };
    static allowInSchemaAsComponent = ["integer"];

    static createsVariants = true;

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        attributes.from = {
            description:
                "Lower bound (inclusive) of the prime range to select from.",
            createComponentOfType: "integer",
            createStateVariable: "from",
            // fixed with the selection made from it
            immutable: true,
            defaultValue: 2,
            public: true,
        };
        attributes.to = {
            description:
                "Upper bound (inclusive) of the prime range to select from.",
            createComponentOfType: "integer",
            createStateVariable: "to",
            // fixed with the selection made from it
            immutable: true,
            defaultValue: 100,
            public: true,
        };

        attributes.exclude = {
            description: "Primes to exclude from the selection.",
            createComponentOfType: "numberList",
            createStateVariable: "exclude",
            // fixed with the selection made from it
            immutable: true,
            defaultValue: [],
            public: true,
        };

        attributes.numToSelect = {
            description: "How many prime numbers to select.",
            createComponentOfType: "integer",
            createStateVariable: "specifiedNumToSelect",
            // fixed with the selection made from it; the public `numToSelect`
            // is kept with the selection (`NUM_TO_SELECT_VARIABLE`)
            immutable: true,
            defaultValue: 1,
        };
        attributes.withReplacement = {
            description:
                "Whether the same prime can be selected more than once.",
            createComponentOfType: "boolean",
            createStateVariable: "withReplacement",
            // fixed with the selection made from it
            immutable: true,
            defaultValue: false,
            public: true,
        };
        attributes.sort = {
            description: "Sort order applied to the selected primes.",
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
                        "Sort the selected primes in increasing order.",
                },
                {
                    value: "decreasing",
                    description:
                        "Sort the selected primes in decreasing order.",
                },
            ],
        };
        attributes.excludeCombinations = {
            createComponentOfType: "_listOfNumberLists",
            description:
                "Combinations of values that should not be selected together.",
        };

        attributes.asList = {
            createPrimitiveOfType: "boolean",
            createStateVariable: "asList",
            defaultValue: true,
            description:
                "Whether to render the items separated by commas (true) or with no separator (false).",
        };

        return attributes;
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.excludedCombinations = {
            // fixed with the selection made from it
            immutable: true,
            returnDependencies: () => ({
                excludeCombinations: {
                    dependencyType: "attributeComponent",
                    attributeName: "excludeCombinations",
                    variableNames: ["lists"],
                },
                numToSelect: {
                    dependencyType: "stateVariable",
                    variableName: "specifiedNumToSelect",
                },
            }),
            definition: function ({ dependencyValues }) {
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

                    return {
                        setValue: { excludedCombinations },
                    };
                } else {
                    return { setValue: { excludedCombinations: [] } };
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

        stateVariableDefinitions.possibleValues = {
            // fixed with the selection made from it
            immutable: true,
            returnDependencies: () => ({
                from: {
                    dependencyType: "stateVariable",
                    variableName: "from",
                },
                to: {
                    dependencyType: "stateVariable",
                    variableName: "to",
                },
                exclude: {
                    dependencyType: "stateVariable",
                    variableName: "exclude",
                },
            }),
            definition({ dependencyValues }) {
                let primes = createPrimesList({
                    from: dependencyValues.from,
                    to: dependencyValues.to,
                    exclude: dependencyValues.exclude,
                });

                return { setValue: { possibleValues: primes } };
            },
        };

        stateVariableDefinitions.choicesDecidedByDoenetML =
            returnChoicesDecidedByDoenetMLDefinition();

        stateVariableDefinitions.selectedValues = {
            immutable: true,
            hasEssential: true,
            // to keep a selection already made (`keptSelection`)
            provideEssentialValuesInDefinition: true,
            shadowVariable: true,
            additionalStateVariablesDefined: [
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
                selectedValues: {
                    dependencyType: "stateVariable",
                    variableName: "selectedValues",
                },
            }),
            definition({ dependencyValues, componentIdx }) {
                let generatedVariantInfo = {
                    values: dependencyValues.selectedValues,
                    meta: { createdBy: componentIdx },
                };

                return { setValue: { generatedVariantInfo } };
            },
        };

        stateVariableDefinitions.selectErrorReported =
            returnSelectErrorReportDefinition();

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
                        component: "selectPrimeNumbers",
                    });
                    return { success: false };
                }
                // A negative number selects nothing at run time, the same as 0,
                // so it adds the single variant of selecting nothing
                numToSelect = Math.max(numToSelect, 0);
            } else {
                info({ code: "doenet-i0023", component: "selectPrimeNumbers" });
                return { success: false };
            }
        }

        // Selecting nothing has exactly one outcome, whatever withReplacement,
        // the options or the range, so return before reading anything that
        // might not be countable
        if (numToSelect === 0) {
            serializedComponent.variants.numVariants = 1;
            serializedComponent.variants.uniqueVariantData = {
                primes: [],
                numToSelect: 0,
                withReplacement: false,
            };
            return { success: true, numVariants: 1 };
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
                        component: "selectPrimeNumbers",
                    });
                    return { success: false };
                }
            } else {
                info({ code: "doenet-i0024", component: "selectPrimeNumbers" });
                return { success: false };
            }
        }

        let primePars = {};

        let fromComponent = serializedAttributeComponent(
            serializedComponent.attributes.from,
        );
        if (fromComponent) {
            // only implemented if have a single string child
            if (
                fromComponent.children?.length === 1 &&
                typeof fromComponent.children[0] === "string"
            ) {
                let from = Number(fromComponent.children[0]);
                if (!Number.isFinite(from)) {
                    info({
                        code: "doenet-i0028",
                        component: "selectPrimeNumbers",
                        args: { attribute: "from" },
                    });
                    return { success: false };
                }
                primePars.from = from;
            } else {
                info({
                    code: "doenet-i0027",
                    component: "selectPrimeNumbers",
                    args: { attribute: "from" },
                });
                return { success: false };
            }
        }

        let toComponent = serializedAttributeComponent(
            serializedComponent.attributes.to,
        );
        if (toComponent) {
            // only implemented if have a single string child
            if (
                toComponent.children?.length === 1 &&
                typeof toComponent.children[0] === "string"
            ) {
                let to = Number(toComponent.children[0]);
                if (!Number.isFinite(to)) {
                    info({
                        code: "doenet-i0028",
                        component: "selectPrimeNumbers",
                        args: { attribute: "to" },
                    });
                    return { success: false };
                }
                primePars.to = to;
            } else {
                info({
                    code: "doenet-i0027",
                    component: "selectPrimeNumbers",
                    args: { attribute: "to" },
                });
                return { success: false };
            }
        }

        if (serializedComponent.attributes.excludeCombinations) {
            info({ code: "doenet-i0032", component: "selectPrimeNumbers" });
            return { success: false };
        }

        let excludeComponent = serializedAttributeComponent(
            serializedComponent.attributes.exclude,
        );
        if (excludeComponent) {
            if (
                !excludeComponent.children.every(
                    (x) =>
                        x.children?.length === 1 &&
                        typeof x.children[0] === "string",
                )
            ) {
                info({ code: "doenet-i0034", component: "selectPrimeNumbers" });
                return { success: false };
            }
            let exclude = excludeComponent.children.map((x) =>
                Number(x.children[0]),
            );

            if (!exclude.every(Number.isFinite)) {
                info({ code: "doenet-i0034", component: "selectPrimeNumbers" });
                return { success: false };
            }
            primePars.exclude = exclude;
        }

        let sortResult = extractConstantSortAttribute(
            serializedComponent,
            "selectPrimeNumbers",
            numToSelect,
            infoDiagnostics,
        );
        if (!sortResult.success) {
            return { success: false };
        }

        let primes = createPrimesList(primePars);

        if (primes.length <= 0) {
            return { success: false };
        }

        let uniqueVariantData = {
            primes,
            numToSelect,
            withReplacement,
        };

        serializedComponent.variants.uniqueVariantData = uniqueVariantData;

        let numVariants;

        if (withReplacement || numToSelect === 1) {
            numVariants = Math.pow(primes.length, numToSelect);
        } else {
            numVariants = 1;
            for (let n = primes.length; n > primes.length - numToSelect; n--) {
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
        let primes = uniqueVariantData.primes;
        let numToSelect = uniqueVariantData.numToSelect;
        let withReplacement = uniqueVariantData.withReplacement;

        if (numToSelect === 1) {
            return {
                success: true,
                desiredVariant: { values: [primes[variantIndex - 1]] },
            };
        }

        let numbers = enumerateSelectionCombinations({
            numberOfIndices: numToSelect,
            numberOfOptions: primes.length,
            maxNumber: variantIndex,
            withReplacement,
        })[variantIndex - 1];
        let values = numbers.map((x) => primes[x]);
        return { success: true, desiredVariant: { values } };
    }
}

/**
 * What a `<selectPrimeNumbers>` selects from, and how many: the dependencies
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
        possibleValues: {
            dependencyType: "stateVariable",
            variableName: "possibleValues",
        },
        excludedCombinations: {
            dependencyType: "stateVariable",
            variableName: "excludedCombinations",
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
 * The values the requested variant gives, or `null` when it gives none.
 * They are taken as given, whatever the select would choose now: a select
 * keeps the choices it was made with, as it keeps what it chose from, and
 * never chooses again (#2389). A select that could not select records
 * `null` values in its variant (`generatedVariantInfo`), which give none.
 */
function valuesFromVariant(dependencyValues) {
    const desiredValues = dependencyValues.variants?.desiredVariant?.values;
    if (!Array.isArray(desiredValues) || desiredValues.length === 0) {
        return null;
    }
    return desiredValues.map(Number);
}

function makeSelection({ dependencyValues, essentialValues }) {
    // A selection already made, as on a reload, is kept
    const kept = keptSelection(essentialValues, [
        "selectedValues",
        "errorMessage",
        "errorDiagnostic",
        "numToSelect",
    ]);
    if (kept) {
        return kept;
    }

    // console.log(`make selection`)
    // console.log(dependencyValues)

    if (dependencyValues.numToSelect < 1) {
        return selectionResult(NO_SELECT_ERROR, { selectedValues: [] });
    }

    // An error when the DoenetML decides that nothing can be selected, and a
    // missing selection with an info when a value does (D38, DIAG-7)
    const type = selectFailureType(dependencyValues.choicesDecidedByDoenetML);

    let numUniqueRequired = 1;
    if (!dependencyValues.withReplacement) {
        numUniqueRequired = dependencyValues.numToSelect;
    }

    let possibleValues = dependencyValues.possibleValues;
    let numValues = possibleValues.length;

    if (numUniqueRequired > numValues) {
        const error = selectError({
            code: "doenet-e0047",
            args: { numToSelect: numUniqueRequired, numValues },
            type,
        });
        return selectionResult(error, { selectedValues: null });
    }

    // The values the requested variant gives, taken as given
    const desiredValues = valuesFromVariant(dependencyValues);
    if (desiredValues !== null) {
        return selectionResult(NO_SELECT_ERROR, {
            selectedValues: desiredValues,
        });
    }

    let numCombinationsExcluded = estimateNumberOfNumberCombinationsExcluded({
        excludedCombinations: dependencyValues.excludedCombinations,
        numValues,
        withReplacement: dependencyValues.withReplacement,
        numToSelect: dependencyValues.numToSelect,
    });

    let selectedValues;

    if (numCombinationsExcluded === 0) {
        selectedValues = sampleFromNumberList({
            possibleValues,
            numUniqueRequired,
            numSamples: dependencyValues.numToSelect,
            rng: dependencyValues.variantRng,
        });
    } else {
        let numPossibilities = numValues;

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
            // As in `SelectFromSequence`: a combination naming NaN can name
            // the same one twice, so the estimate is revised down before the
            // threshold is believed. A count that survives — or one there was
            // nothing to revise — is the same failure and the same code.
            if (
                dependencyValues.excludedCombinations.some((x) =>
                    x.some(Number.isNaN),
                )
            ) {
                numCombinationsExcluded -=
                    estimateNumberOfDuplicateCombinations(
                        dependencyValues.excludedCombinations,
                        numValues,
                        dependencyValues.withReplacement,
                    );
            }

            if (numCombinationsExcluded > 0.7 * numPossibilities) {
                const error = selectError({ code: "doenet-e0051", type });
                return selectionResult(error, { selectedValues: null });
            }
        }

        // with 200 chances with at least 70% success,
        // prob of failure less than 10^(-30)
        let foundValidCombination = false;
        for (let sampnum = 0; sampnum < 200; sampnum++) {
            selectedValues = sampleFromNumberList({
                possibleValues,
                numUniqueRequired,
                numSamples: dependencyValues.numToSelect,
                rng: dependencyValues.variantRng,
            });

            // try again if hit excluded combination
            if (
                checkForExcludedCombination({
                    type: "number",
                    excludedCombinations: dependencyValues.excludedCombinations,
                    values: selectedValues,
                })
            ) {
                continue;
            }

            foundValidCombination = true;
            break;
        }

        if (!foundValidCombination) {
            // this won't happen, as occurs with prob < 10^(-30), and depends
            // on the variant alone
            const error = selectError({ code: "doenet-e0052", type: "info" });
            return selectionResult(error, { selectedValues: null });
        }
    }

    if (dependencyValues.sort === "increasing") {
        selectedValues.sort((a, b) => a - b);
    } else if (dependencyValues.sort === "decreasing") {
        selectedValues.sort((a, b) => b - a);
    }

    return selectionResult(NO_SELECT_ERROR, { selectedValues });
}
