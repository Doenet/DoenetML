import {
    multivariateSamplingDiagnostics,
    sampleFromMultivariateDistribution,
    validMultivariateHypergeometricParameters,
} from "../utils/randomNumbers";
import { setUpVariantSeedAndRng } from "../utils/variants";
import ValueListComponent from "./abstract/ValueListComponent";

/**
 * The parameters the `means` and `variances` arrays are computed from. They are
 * global rather than per-key because every category's moment is determined by the
 * whole population, not just by its own entry — and both arrays read exactly the
 * same ones, so a distribution added later adds its parameters here once.
 */
function returnMomentDependencies() {
    return {
        globalDependencies: {
            type: {
                dependencyType: "stateVariable",
                variableName: "type",
            },
            numInCategories: {
                dependencyType: "stateVariable",
                variableName: "numInCategories",
            },
            numDraws: {
                dependencyType: "stateVariable",
                variableName: "numDraws",
            },
            numTotal: {
                dependencyType: "stateVariable",
                variableName: "numTotal",
            },
        },
    };
}

/**
 * Whether the closed forms the `means` and `variances` arrays use apply to what
 * the author asked for. Those formulas are the multivariate hypergeometric's, so
 * they describe a distribution only when that is the one named and its parameters
 * are ones it can be sampled from. Anything else — no `type` at all, parameters
 * that describe no population, or a population refused as too slow to draw from —
 * has no moments to report and gets the NaN its samples get; another distribution
 * will bring its own branch.
 */
function hasHypergeometricMoments(globalDependencyValues) {
    return (
        globalDependencyValues.type === "hypergeometric" &&
        validMultivariateHypergeometricParameters(globalDependencyValues)
    );
}

/**
 * Samples one number per category, drawn together. It is a list component
 * (`ValueListComponent`): it holds the sample in one array, `sampledValues`,
 * and a parent sees one `<number>` per category. With `fixed="false"`, a
 * value written to an entry is kept for that entry (`entryWrites`) until the
 * sample is drawn again.
 */
export default class SampleMultivariateRandomNumber extends ValueListComponent {
    constructor(args) {
        super(args);

        Object.assign(this.actions, {
            resample: this.resample.bind(this),
        });
    }

    static componentType = "sampleMultivariateRandomNumber";

    static listEntryComponentType = "number";

    static listEntryValuesVariable = "sampledValues";

    static listEntriesTakeWrites = true;

    // `variantDeterminesSeed` is false by default, so these samples are drawn
    // from a date-seeded generator and a fresh build of the same document
    // under the same variant does not reproduce them. They exist nowhere but
    // in the saved state, so they are persisted rather than treated as a
    // definition's recomputable work (Doenet/DoenetML#1940).
    static definitionEssentialValuesAreReproducible = false;

    static componentDocs = {
        summary:
            "Samples one number per category from a multivariate distribution, drawn together rather than independently",
    };

    static allowInSchemaAsComponent = ["number"];

    // Saved samples are read back on load rather than drawn afresh
    // (`sampledValues`).
    static processWhenJustUpdatedForNewComponent = true;

    static createsVariants = true;

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        // possible types
        // hypergeometric: determined by numInCategories and numDraws

        // Deliberately has no default. `hypergeometric` is the only distribution
        // implemented so far, but it is unlikely to stay the most natural default —
        // a joint gaussian is the more usual multivariate distribution. Defaulting
        // to one now would let documents come to rely on it, and any later change
        // would silently reinterpret them. Requiring the attribute keeps that door
        // open at the cost of one word in every document.
        attributes.type = {
            description:
                "Multivariate distribution from which to sample. Required; there is no default.",
            createComponentOfType: "text",
            createStateVariable: "type",
            defaultValue: null,
            public: true,
            toLowerCase: true,
            validValues: [
                {
                    value: "hypergeometric",
                    description:
                        "Number of items of each category obtained when drawing `numDraws` items without replacement from a population partitioned into categories of the sizes given by `numInCategories`.",
                },
            ],
        };

        attributes.numInCategories = {
            createComponentOfType: "numberList",
            createStateVariable: "numInCategories",
            defaultValue: [],
            public: true,
            description:
                "Number of items of each category in the population drawn from. Its length determines how many numbers are sampled.",
        };

        attributes.numDraws = {
            createComponentOfType: "number",
            createStateVariable: "numDraws",
            defaultValue: null,
            public: true,
            description:
                "Number of items drawn without replacement from the population.",
        };

        attributes.variantDeterminesSeed = {
            description:
                "Whether the document's variant index determines the random seed.",
            createPrimitiveOfType: "boolean",
            createStateVariable: "variantDeterminesSeed",
            defaultPrimitiveValue: false,
            public: true,
        };

        return attributes;
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.numCategories = {
            description:
                "Number of categories the population is partitioned into, which is how many numbers are sampled.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "integer",
            },
            additionalStateVariablesDefined: [
                {
                    variableName: "numTotal",
                    public: true,
                    shadowingInstructions: {
                        createComponentOfType: "number",
                    },
                    description:
                        "Total number of items in the population drawn from, i.e. the sum of `numInCategories`.",
                },
            ],
            returnDependencies: () => ({
                numInCategories: {
                    dependencyType: "stateVariable",
                    variableName: "numInCategories",
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        numCategories: dependencyValues.numInCategories.length,
                        numTotal: dependencyValues.numInCategories.reduce(
                            (a, c) => a + c,
                            0,
                        ),
                    },
                };
            },
        };

        stateVariableDefinitions.means = {
            description:
                "Expected number of items sampled from each category, i.e. `numDraws * numInCategories[i] / numTotal`.",
            isArray: true,
            entryPrefixes: ["mean"],
            public: true,
            shadowingInstructions: {
                createComponentOfType: "number",
            },
            returnArraySizeDependencies: () => ({
                numCategories: {
                    dependencyType: "stateVariable",
                    variableName: "numCategories",
                },
            }),
            returnArraySize({ dependencyValues }) {
                return [dependencyValues.numCategories];
            },
            returnArrayDependenciesByKey: returnMomentDependencies,
            arrayDefinitionByKey({ globalDependencyValues, arrayKeys }) {
                let means = {};

                const N = globalDependencyValues.numTotal;
                const n = globalDependencyValues.numDraws;

                const valid = hasHypergeometricMoments(globalDependencyValues);

                for (let arrayKey of arrayKeys) {
                    if (!valid) {
                        means[arrayKey] = NaN;
                    } else if (N > 0) {
                        means[arrayKey] =
                            (n *
                                globalDependencyValues.numInCategories[
                                    arrayKey
                                ]) /
                            N;
                    } else {
                        // every category of an empty population is empty, and the
                        // only valid draw from it is the empty one, so `n K_i / N`
                        // is 0/0 for a count that is determined to be zero
                        means[arrayKey] = 0;
                    }
                }

                return { setValue: { means } };
            },
        };

        stateVariableDefinitions.variances = {
            description:
                "Variance of the number of items sampled from each category.",
            isArray: true,
            entryPrefixes: ["variance"],
            public: true,
            shadowingInstructions: {
                createComponentOfType: "number",
            },
            returnArraySizeDependencies: () => ({
                numCategories: {
                    dependencyType: "stateVariable",
                    variableName: "numCategories",
                },
            }),
            returnArraySize({ dependencyValues }) {
                return [dependencyValues.numCategories];
            },
            returnArrayDependenciesByKey: returnMomentDependencies,
            arrayDefinitionByKey({ globalDependencyValues, arrayKeys }) {
                let variances = {};

                const N = globalDependencyValues.numTotal;
                const n = globalDependencyValues.numDraws;

                const valid = hasHypergeometricMoments(globalDependencyValues);

                for (let arrayKey of arrayKeys) {
                    if (!valid) {
                        variances[arrayKey] = NaN;
                        continue;
                    }

                    // each category's marginal count is univariate hypergeometric,
                    // so it carries the same closed form — which divides by N - 1
                    // in its finite population correction, and by N in p, so it is
                    // undefined for a population of at most one item. Such a draw
                    // is determined, and so has variance 0.
                    if (N > 1) {
                        const p =
                            globalDependencyValues.numInCategories[arrayKey] /
                            N;
                        variances[arrayKey] =
                            (n * p * (1 - p) * (N - n)) / (N - 1);
                    } else {
                        variances[arrayKey] = 0;
                    }
                }

                return { setValue: { variances } };
            },
        };

        stateVariableDefinitions.sampledValues = {
            shadowVariable: true,
            hasEssential: true,
            stateVariablesDeterminingDependencies: ["variantDeterminesSeed"],
            returnDependencies({ stateValues, sharedParameters }) {
                let dependencies = {
                    type: {
                        dependencyType: "stateVariable",
                        variableName: "type",
                    },
                    numInCategories: {
                        dependencyType: "stateVariable",
                        variableName: "numInCategories",
                    },
                    numDraws: {
                        dependencyType: "stateVariable",
                        variableName: "numDraws",
                    },
                };
                if (stateValues.variantDeterminesSeed) {
                    dependencies.rng = {
                        dependencyType: "value",
                        value: sharedParameters.variantRng,
                        doNotProxy: true,
                    };
                } else {
                    dependencies.rng = {
                        dependencyType: "value",
                        value: sharedParameters.rngWithDateSeed,
                        doNotProxy: true,
                    };
                }
                return dependencies;
            },
            definition({
                dependencyValues,
                changes,
                justUpdatedForNewComponent,
            }) {
                // if loaded in values from database (justUpdatedForNewComponent)
                // or just resampled values from action (in which case there will be no changes)
                // then don't resample the values but just use the current ones
                if (
                    Object.keys(changes).length === 0 ||
                    justUpdatedForNewComponent
                ) {
                    // Keep the counts, but re-check the parameters: they have not
                    // changed, so whatever was wrong with them still is, and an
                    // author who reloads a document should not lose the explanation
                    // for why its counts are NaN. This draws nothing, so a variant
                    // stays reproducible.
                    return {
                        useEssentialOrDefaultValue: { sampledValues: true },
                        sendDiagnostics:
                            multivariateSamplingDiagnostics(dependencyValues),
                    };
                }

                const { sampledValues, diagnostics } =
                    sampleFromMultivariateDistribution(dependencyValues);

                return {
                    setEssentialValue: { sampledValues },
                    setValue: { sampledValues },
                    sendDiagnostics: diagnostics,
                };
            },
            inverseDefinition({ desiredStateVariableValues }) {
                return {
                    success: true,
                    instructions: [
                        {
                            setEssentialValue: "sampledValues",
                            value: desiredStateVariableValues.sampledValues,
                        },
                    ],
                };
            },
        };

        stateVariableDefinitions.isVariantComponent = {
            returnDependencies: () => ({}),
            definition: () => ({ setValue: { isVariantComponent: true } }),
        };

        stateVariableDefinitions.generatedVariantInfo = {
            returnDependencies: ({ sharedParameters }) => ({
                variantSeed: {
                    dependencyType: "value",
                    value: sharedParameters.variantSeed,
                },
            }),
            definition({ dependencyValues, componentIdx }) {
                let generatedVariantInfo = {
                    seed: dependencyValues.variantSeed,
                    meta: {
                        createdBy: componentIdx,
                    },
                };

                return {
                    setValue: {
                        generatedVariantInfo,
                    },
                };
            },
        };

        return stateVariableDefinitions;
    }

    static setUpVariant({
        serializedComponent,
        sharedParameters,
        descendantVariantComponents,
    }) {
        setUpVariantSeedAndRng({
            serializedComponent,
            sharedParameters,
            descendantVariantComponents,
        });

        // seed from date plus a few digits from variant
        let seedForRandomNumbers =
            sharedParameters.variantRng().toString().slice(2, 8) + +new Date();
        sharedParameters.rngWithDateSeed = new sharedParameters.rngClass(
            seedForRandomNumbers,
        );
    }

    static determineNumberOfUniqueVariants({
        serializedComponent,
        componentInfoObjects,
        infoDiagnostics,
    }) {
        let variantDeterminesSeed =
            serializedComponent.attributes.variantDeterminesSeed.primitive
                .value;

        if (variantDeterminesSeed) {
            return { success: false };
        } else {
            return super.determineNumberOfUniqueVariants({
                serializedComponent,
                componentInfoObjects,
                infoDiagnostics,
            });
        }
    }

    async resample({
        actionId,
        sourceInformation = {},
        skipRendererUpdate = false,
    }) {
        // Any diagnostic these parameters raise was already sent when `sampledValues`
        // was first computed, and resampling cannot change them, so there is nothing
        // new to report here — and an action has no `sendDiagnostics` in any case.
        const { sampledValues } = sampleFromMultivariateDistribution({
            type: await this.stateValues.type,
            numInCategories: await this.stateValues.numInCategories,
            numDraws: await this.stateValues.numDraws,
            rng: (await this.stateValues.variantDeterminesSeed)
                ? this.sharedParameters.variantRng
                : this.sharedParameters.rngWithDateSeed,
        });

        return await this.coreFunctions.performUpdate({
            updateInstructions: [
                {
                    updateType: "updateValue",
                    componentIdx: this.componentIdx,
                    stateVariable: "sampledValues",
                    value: sampledValues,
                },
            ],
            actionId,
            sourceInformation,
            skipRendererUpdate,
        });
    }
}
