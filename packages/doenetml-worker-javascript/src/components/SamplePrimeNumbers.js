import { createPrimesList } from "../utils/primeNumbers";
import { sampleFromNumberList } from "../utils/randomNumbers";
import { setUpVariantSeedAndRng } from "../utils/variants";
import ValueListComponent from "./abstract/ValueListComponent";

/**
 * Samples prime numbers. It is a list component (`ValueListComponent`): it
 * holds the samples in one array, `sampledValues`, and a parent sees one
 * `<integer>` per sample. With `fixed="false"`, a value written to a sample
 * (`$ns[2]`, a point dragged) is kept for that sample (`entryWrites`) until
 * it is drawn again.
 */
export default class SamplePrimeNumbers extends ValueListComponent {
    constructor(args) {
        super(args);

        Object.assign(this.actions, {
            resample: this.resample.bind(this),
        });
    }
    static componentType = "samplePrimeNumbers";

    static listEntryComponentType = "integer";

    static listEntryValuesVariable = "sampledValues";

    static listEntriesTakeWrites = true;

    // `variantDeterminesSeed` is false by default, so these samples are drawn
    // from a date-seeded generator and a fresh build of the same document
    // under the same variant does not reproduce them. They exist nowhere but
    // in the saved state, so they are persisted rather than treated as a
    // definition's recomputable work (Doenet/DoenetML#1940).
    static definitionEssentialValuesAreReproducible = false;

    static componentDocs = {
        summary: "Samples random prime numbers",
    };
    static allowInSchemaAsComponent = ["integer"];

    // Saved samples are read back on load rather than drawn afresh
    // (`sampledValues`).
    static processWhenJustUpdatedForNewComponent = true;

    static createsVariants = true;

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        attributes.numSamples = {
            description: "Number of prime samples to draw.",
            createComponentOfType: "number",
            createStateVariable: "numSamples",
            defaultValue: 1,
            public: true,
        };

        attributes.from = {
            description:
                "Lower bound (inclusive) of the prime range to sample from.",
            createComponentOfType: "integer",
            createStateVariable: "from",
            defaultValue: 2,
            public: true,
        };
        attributes.to = {
            description:
                "Upper bound (inclusive) of the prime range to sample from.",
            createComponentOfType: "integer",
            createStateVariable: "to",
            defaultValue: 100,
            public: true,
        };

        attributes.exclude = {
            description: "Primes to exclude from the sample.",
            createComponentOfType: "numberList",
            createStateVariable: "exclude",
            defaultValue: [],
            public: true,
        };

        attributes.variantDeterminesSeed = {
            description:
                "Whether the document's variant index determines the random seed.",
            createPrimitiveOfType: "boolean",
            createStateVariable: "variantDeterminesSeed",
            defaultPrimitiveValue: false,
            public: true,
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

        stateVariableDefinitions.sampledValues = {
            shadowVariable: true,
            hasEssential: true,
            stateVariablesDeterminingDependencies: ["variantDeterminesSeed"],
            returnDependencies({ stateValues, sharedParameters }) {
                let dependencies = {
                    numSamples: {
                        dependencyType: "stateVariable",
                        variableName: "numSamples",
                    },
                    possibleValues: {
                        dependencyType: "stateVariable",
                        variableName: "possibleValues",
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
                if (dependencyValues.numSamples < 1) {
                    return {
                        setEssentialValue: { sampledValues: [] },
                        setValue: { sampledValues: [] },
                    };
                }

                // if loaded in values from database (justUpdatedForNewComponent)
                // or just resampled values from action (in which case there will be no changes)
                // then don't resample the values but just use the current ones
                if (
                    Object.keys(changes).length === 0 ||
                    justUpdatedForNewComponent
                ) {
                    return {
                        useEssentialOrDefaultValue: { sampledValues: true },
                    };
                }

                let sampledValues = sampleFromNumberList({
                    possibleValues: dependencyValues.possibleValues,
                    numSamples: dependencyValues.numSamples,
                    rng: dependencyValues.rng,
                });

                return {
                    setEssentialValue: { sampledValues },
                    setValue: { sampledValues },
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
        sharedParameters.rngWithDateSeed =
            sharedParameters.rngClass(seedForRandomNumbers);
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
        let sampledValues = sampleFromNumberList({
            possibleValues: await this.stateValues.possibleValues,
            numSamples: await this.stateValues.numSamples,
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
