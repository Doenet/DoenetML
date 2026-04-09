import { enumerateSelectionCombinations } from "@doenet/utils";
import { extractConstantSortAttribute } from "../utils/variants";
import {
    checkForExcludedCombination,
    estimateNumberOfDuplicateCombinations,
    estimateNumberOfNumberCombinationsExcluded,
    mergeContainingNumberCombinations,
} from "../utils/excludeCombinations";
import { createPrimesList } from "../utils/primeNumbers";
import { sampleFromNumberList } from "../utils/randomNumbers";
import CompositeComponent from "./abstract/CompositeComponent";

export default class SelectPrimeNumbers extends CompositeComponent {
    static componentType = "selectPrimeNumbers";

    static takesIndex = true;

    static allowInSchemaAsComponent = ["integer"];

    static createsVariants = true;

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        attributes.from = {
            createComponentOfType: "integer",
            createStateVariable: "from",
            defaultValue: 2,
            public: true,
        };
        attributes.to = {
            createComponentOfType: "integer",
            createStateVariable: "to",
            defaultValue: 100,
            public: true,
        };

        attributes.exclude = {
            createComponentOfType: "numberList",
            createStateVariable: "exclude",
            defaultValue: [],
            public: true,
        };

        attributes.numToSelect = {
            createComponentOfType: "integer",
            createStateVariable: "numToSelect",
            defaultValue: 1,
            public: true,
        };
        attributes.withReplacement = {
            createComponentOfType: "boolean",
            createStateVariable: "withReplacement",
            defaultValue: false,
            public: true,
        };
        attributes.sort = {
            createComponentOfType: "text",
            createStateVariable: "sort",
            defaultValue: "unsorted",
            public: true,
            toLowerCase: true,
            valueForTrue: "increasing",
            valueForNone: "unsorted",
            validValues: ["unsorted", "increasing", "decreasing"],
        };
        attributes.excludeCombinations = {
            createComponentOfType: "_listOfNumberLists",
        };

        attributes.asList = {
            createPrimitiveOfType: "boolean",
            createStateVariable: "asList",
            defaultValue: true,
        };

        return attributes;
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.excludedCombinations = {
            returnDependencies: () => ({
                excludeCombinations: {
                    dependencyType: "attributeComponent",
                    attributeName: "excludeCombinations",
                    variableNames: ["lists"],
                },
                numToSelect: {
                    dependencyType: "stateVariable",
                    variableName: "numToSelect",
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

        stateVariableDefinitions.selectedValues = {
            immutable: true,
            hasEssential: true,
            shadowVariable: true,
            additionalStateVariablesDefined: [
                {
                    variableName: "errorMessage",
                    hasEssential: true,
                    shadowVariable: true,
                    immutable: true,
                },
            ],
            returnDependencies: ({ sharedParameters }) => ({
                numToSelect: {
                    dependencyType: "stateVariable",
                    variableName: "numToSelect",
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
                variantRng: {
                    dependencyType: "value",
                    value: sharedParameters.variantRng,
                    doNotProxy: true,
                },
            }),
            definition: makeSelection,
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

        stateVariableDefinitions.readyToExpandWhenResolved = {
            returnDependencies: () => ({
                selectedValues: {
                    dependencyType: "stateVariable",
                    variableName: "selectedValues",
                },
            }),
            definition: function () {
                return { setValue: { readyToExpandWhenResolved: true } };
            },
        };

        return stateVariableDefinitions;
    }

    static async createSerializedReplacements({
        component,
        workspace,
        nComponents,
    }) {
        if (workspace.replacementsCreated === undefined) {
            workspace.replacementsCreated = 0;
        }

        const stateIdInfo = {
            prefix: `${component.stateId}|`,
            num: workspace.replacementsCreated,
        };

        let diagnostics = [];

        let errorMessage = await component.stateValues.errorMessage;
        if (errorMessage) {
            return {
                replacements: [
                    {
                        type: "serialized",
                        componentType: "_error",
                        componentIdx: nComponents++,
                        state: { message: errorMessage },
                        attributes: {},
                        doenetAttributes: {},
                        children: [],
                    },
                ],
                diagnostics,
                nComponents,
            };
        }

        let replacements = [];

        for (let value of await component.stateValues.selectedValues) {
            replacements.push({
                type: "serialized",
                componentType: "integer",
                componentIdx: nComponents++,
                stateId: `${stateIdInfo.prefix}${stateIdInfo.num++}`,
                state: { value, fixed: true },
                attributes: {},
                doenetAttributes: {},
                children: [],
            });
        }

        workspace.replacementsCreated = stateIdInfo.num;

        return {
            replacements,
            diagnostics,
            nComponents,
        };
    }

    static calculateReplacementChanges({ nComponents }) {
        return { replacementChanges: [], nComponents };
    }

    static determineNumberOfUniqueVariants({ serializedComponent }) {
        let numToSelect = 1,
            withReplacement = false;

        let numToSelectComponent =
            serializedComponent.attributes.numToSelect?.component;
        if (numToSelectComponent) {
            // only implemented if have an integer with a single string child
            if (
                numToSelectComponent.componentType === "integer" &&
                numToSelectComponent.children?.length === 1 &&
                typeof numToSelectComponent.children[0] === "string"
            ) {
                numToSelect = Number(numToSelectComponent.children[0]);

                if (!(Number.isInteger(numToSelect) && numToSelect >= 0)) {
                    console.log(
                        `cannot determine unique variants of selectPrimeNumbers as numToSelect isn't a non-negative integer.`,
                    );
                    return { success: false };
                }
            } else {
                console.log(
                    `cannot determine unique variants of selectPrimeNumbers as numToSelect isn't constant number.`,
                );
                return { success: false };
            }
        }

        let withReplacementComponent =
            serializedComponent.attributes.withReplacement?.component;
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
                    console.log(
                        `cannot determine unique variants of selectPrimeNumbers as withReplacement isn't constant boolean.`,
                    );
                    return { success: false };
                }
            } else {
                console.log(
                    `cannot determine unique variants of selectPrimeNumbers as withReplacement isn't constant boolean.`,
                );
                return { success: false };
            }
        }

        let primePars = {};

        let fromComponent = serializedComponent.attributes.from?.component;
        if (fromComponent) {
            // only implemented if have a single string child
            if (
                fromComponent.children?.length === 1 &&
                typeof fromComponent.children[0] === "string"
            ) {
                let from = Number(fromComponent.children[0]);
                if (!Number.isFinite(from)) {
                    console.log(
                        `cannot determine unique variants of selectPrimeNumbers as from isn't a number.`,
                    );
                    return { success: false };
                }
                primePars.from = from;
            } else {
                console.log(
                    `cannot determine unique variants of selectPrimeNumbers as from isn't a constant.`,
                );
                return { success: false };
            }
        }

        let toComponent = serializedComponent.attributes.to?.component;
        if (toComponent) {
            // only implemented if have a single string child
            if (
                toComponent.children?.length === 1 &&
                typeof toComponent.children[0] === "string"
            ) {
                let to = Number(toComponent.children[0]);
                if (!Number.isFinite(to)) {
                    console.log(
                        `cannot determine unique variants of selectPrimeNumbers as to isn't a number.`,
                    );
                    return { success: false };
                }
                primePars.to = to;
            } else {
                console.log(
                    `cannot determine unique variants of selectPrimeNumbers as to isn't a constant.`,
                );
                return { success: false };
            }
        }

        if (serializedComponent.attributes.excludeCombinations) {
            console.log(
                "have not implemented unique variants of a selectPrimeNumbers with excludeCombinations",
            );
            return { success: false };
        }

        let excludeComponent =
            serializedComponent.attributes.exclude?.component;
        if (excludeComponent) {
            if (
                !excludeComponent.children.every(
                    (x) =>
                        x.children?.length === 1 &&
                        typeof x.children[0] === "string",
                )
            ) {
                console.log(
                    "have not implemented unique variants of a selectPrimeNumbers with non-constant exclude",
                );
                return { success: false };
            }
            let exclude = excludeComponent.children.map((x) =>
                Number(x.children[0]),
            );

            if (!exclude.every(Number.isFinite)) {
                console.log(
                    "have not implemented unique variants of a selectPrimeNumbers with non-constant exclude",
                );
                return { success: false };
            }
            primePars.exclude = exclude;
        }

        let sortResult = extractConstantSortAttribute(
            serializedComponent,
            "selectPrimeNumbers",
            numToSelect,
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
            numVariants = primes.length;
            for (
                let n = primes.length - 1;
                n > primes.length - numToSelect;
                n--
            ) {
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

function makeSelection({ dependencyValues }) {
    // console.log(`make selection`)
    // console.log(dependencyValues)

    if (dependencyValues.numToSelect < 1) {
        return {
            setEssentialValue: {
                errorMessage: "",
                selectedValues: [],
            },
            setValue: {
                errorMessage: "",
                selectedValues: [],
            },
        };
    }

    let numUniqueRequired = 1;
    if (!dependencyValues.withReplacement) {
        numUniqueRequired = dependencyValues.numToSelect;
    }

    let possibleValues = dependencyValues.possibleValues;
    let numValues = possibleValues.length;

    if (numUniqueRequired > numValues) {
        let errorMessage =
            "Cannot select " +
            numUniqueRequired +
            " values from a list of primes of length " +
            numValues;
        return {
            setEssentialValue: {
                errorMessage,
                selectedValues: null,
            },
            setValue: {
                errorMessage,
                selectedValues: null,
            },
        };
    }

    // if desiredIndices is specfied, use those
    if (
        dependencyValues.variants &&
        dependencyValues.variants.desiredVariant !== undefined
    ) {
        let desiredValues = dependencyValues.variants.desiredVariant.values;
        if (desiredValues !== undefined) {
            if (desiredValues.length !== dependencyValues.numToSelect) {
                let errorMessage =
                    "Number of values specified for select must match number to select";
                return {
                    setEssentialValue: {
                        errorMessage,
                        selectedValues: null,
                    },
                    setValue: {
                        errorMessage,
                        selectedValues: null,
                    },
                };
            }

            desiredValues = desiredValues.map(Number);

            if (!desiredValues.every((x) => possibleValues.includes(x))) {
                let errorMessage =
                    "All values specified for select prime number must be in the list of primes";
                return {
                    setEssentialValue: {
                        errorMessage,
                        selectedValues: null,
                    },
                    setValue: {
                        errorMessage,
                        selectedValues: null,
                    },
                };
            }

            if (
                checkForExcludedCombination({
                    type: "number",
                    excludedCombinations: dependencyValues.excludedCombinations,
                    values: desiredValues,
                })
            ) {
                let errorMessage =
                    "Specified values of selectPrimeNumbers was an excluded combination";
                return {
                    setEssentialValue: {
                        errorMessage,
                        selectedValues: null,
                    },
                    setValue: {
                        errorMessage,
                        selectedValues: null,
                    },
                };
            }

            return {
                setEssentialValue: {
                    errorMessage: "",
                    selectedValues: desiredValues,
                },
                setValue: { errorMessage: "", selectedValues: desiredValues },
            };
        }
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
            if (
                dependencyValues.excludedCombinations.some((x) =>
                    x.some(Number.isNaN),
                )
            ) {
                let numberDuplicated = estimateNumberOfDuplicateCombinations(
                    dependencyValues.excludedCombinations,
                    numValues,
                    dependencyValues.withReplacement,
                );

                numCombinationsExcluded -= numberDuplicated;

                if (numCombinationsExcluded > 0.7 * numPossibilities) {
                    let errorMessage =
                        "Excluded over 70% of combinations in selectPrimeNumbers";
                    return {
                        setEssentialValue: {
                            errorMessage,
                            selectedValues: null,
                        },
                        setValue: {
                            errorMessage,
                            selectedValues: null,
                        },
                    };
                }
            } else {
                let errorMessage =
                    "Excluded over 70% of combinations in selectPrimeNumbers";
                return {
                    setEssentialValue: {
                        errorMessage,
                        selectedValues: null,
                    },
                    setValue: {
                        errorMessage,
                        selectedValues: null,
                    },
                };
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
            // this won't happen, as occurs with prob < 10^(-30)
            let errorMessage =
                "By extremely unlikely fluke, couldn't select combination of random values";
            return {
                setEssentialValue: {
                    errorMessage,
                    selectedValues: null,
                },
                setValue: {
                    errorMessage,
                    selectedValues: null,
                },
            };
        }
    }

    if (dependencyValues.sort === "increasing") {
        selectedValues.sort((a, b) => a - b);
    } else if (dependencyValues.sort === "decreasing") {
        selectedValues.sort((a, b) => b - a);
    }

    return {
        setEssentialValue: { errorMessage: "", selectedValues },
        setValue: { errorMessage: "", selectedValues },
    };
}
