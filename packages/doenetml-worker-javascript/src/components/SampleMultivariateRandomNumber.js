import {
    sampleFromMultivariateDistribution,
    validMultivariateHypergeometricParameters,
} from "../utils/randomNumbers";
import { returnNumberDisplayAttributes } from "../utils/numberDisplay";
import { setUpVariantSeedAndRng } from "../utils/variants";
import CompositeComponent from "./abstract/CompositeComponent";
import { convertUnresolvedAttributesForComponentType } from "../utils/dast/convertNormalizedDast";

export default class SampleMultivariateRandomNumber extends CompositeComponent {
    constructor(args) {
        super(args);

        Object.assign(this.actions, {
            resample: this.resample.bind(this),
        });
    }

    static componentType = "sampleMultivariateRandomNumber";

    static componentDocs = {
        summary:
            "Samples a single vector-valued random number from a multivariate distribution, expanding to one number per category",
    };

    static takesIndex = true;

    static allowInSchemaAsComponent = ["number"];

    static createsVariants = true;

    static stateVariableToEvaluateAfterReplacements =
        "readyToExpandWhenResolved";

    static processWhenJustUpdatedForNewComponent = true;

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        // possible types
        // hypergeometric: determined by numInCategories and numDraws

        attributes.type = {
            description: "Multivariate distribution from which to sample.",
            createComponentOfType: "text",
            createStateVariable: "type",
            defaultValue: "hypergeometric",
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

        const numberDisplayAttrs = returnNumberDisplayAttributes();
        for (let attrName in numberDisplayAttrs) {
            attributes[attrName] = {
                leaveRaw: true,
                description: numberDisplayAttrs[attrName].description,
            };
        }

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
            returnArrayDependenciesByKey() {
                return {
                    globalDependencies: {
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
            },
            arrayDefinitionByKey({ globalDependencyValues, arrayKeys }) {
                let means = {};

                const N = globalDependencyValues.numTotal;
                const n = globalDependencyValues.numDraws;

                // parameters that describe no distribution have no moments either,
                // so report the NaN that their samples report
                const valid = validMultivariateHypergeometricParameters(
                    globalDependencyValues,
                );

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
            returnArrayDependenciesByKey() {
                return {
                    globalDependencies: {
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
            },
            arrayDefinitionByKey({ globalDependencyValues, arrayKeys }) {
                let variances = {};

                const N = globalDependencyValues.numTotal;
                const n = globalDependencyValues.numDraws;

                const valid = validMultivariateHypergeometricParameters(
                    globalDependencyValues,
                );

                for (let arrayKey of arrayKeys) {
                    if (!valid) {
                        variances[arrayKey] = NaN;
                        continue;
                    }

                    // each category's marginal count is univariate hypergeometric,
                    // so it carries the same finite population correction, whose
                    // (N - n) / (N - 1) is 0/0 for a population of at most one
                    // item — which is determined, and so has variance 0
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
                    return {
                        useEssentialOrDefaultValue: { sampledValues: true },
                    };
                }

                let sampledValues =
                    sampleFromMultivariateDistribution(dependencyValues);

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

        stateVariableDefinitions.readyToExpandWhenResolved = {
            returnDependencies: () => ({
                sampledValues: {
                    dependencyType: "stateVariable",
                    variableName: "sampledValues",
                },
            }),
            markStale: () => ({ updateReplacements: true }),
            definition: function () {
                return { setValue: { readyToExpandWhenResolved: true } };
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

    static async createSerializedReplacements({
        component,
        componentInfoObjects,
        startNum = 0,
        nComponents,
        workspace,
    }) {
        if (workspace.replacementsCreated === undefined) {
            workspace.replacementsCreated = 0;
        }

        const stateIdInfo = {
            prefix: `${component.stateId}|`,
            num: workspace.replacementsCreated,
        };

        let diagnostics = [];

        let attributesToConvert = {};
        for (let attr of Object.keys(returnNumberDisplayAttributes())) {
            if (attr in component.attributes) {
                attributesToConvert[attr] = component.attributes[attr];
            }
        }

        let replacements = [];

        for (let value of (await component.stateValues.sampledValues).slice(
            startNum,
        )) {
            let attributesFromComposite = {};

            if (Object.keys(attributesToConvert).length > 0) {
                const res = convertUnresolvedAttributesForComponentType({
                    attributes: attributesToConvert,
                    componentType: "number",
                    componentInfoObjects,
                    nComponents,
                    stateIdInfo,
                });

                attributesFromComposite = res.attributes;
                nComponents = res.nComponents;
            }

            replacements.push({
                type: "serialized",
                componentType: "number",
                componentIdx: nComponents++,
                stateId: `${stateIdInfo.prefix}${stateIdInfo.num++}`,
                attributes: attributesFromComposite,
                state: { value, fixed: true },
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

    static async calculateReplacementChanges({
        component,
        componentInfoObjects,
        nComponents,
        workspace,
    }) {
        let diagnostics = [];

        let replacementChanges = [];

        let sampledValues = await component.stateValues.sampledValues;

        // if have fewer results than replacements, adjust replacementsToWithhold
        if (sampledValues.length < component.replacements.length) {
            let numberToWithhold =
                component.replacements.length - sampledValues.length;

            if (numberToWithhold !== component.replacementsToWithhold) {
                let replacementInstruction = {
                    changeType: "changeReplacementsToWithhold",
                    replacementsToWithhold: numberToWithhold,
                };
                replacementChanges.push(replacementInstruction);
            }
        } else {
            // need to reuse all previous samples, don't withhold any
            if (component.replacementsToWithhold > 0) {
                let replacementInstruction = {
                    changeType: "changeReplacementsToWithhold",
                    replacementsToWithhold: 0,
                };
                replacementChanges.push(replacementInstruction);
            }

            if (sampledValues.length > component.replacements.length) {
                let result = await this.createSerializedReplacements({
                    component,
                    componentInfoObjects,
                    startNum: component.replacements.length,
                    nComponents,
                    workspace,
                });
                diagnostics.push(...result.diagnostics);
                nComponents = result.nComponents;

                let replacementInstruction = {
                    changeType: "add",
                    changeTopLevelReplacements: true,
                    firstReplacementInd: component.replacements.length,
                    numberReplacementsToReplace: 0,
                    serializedReplacements: result.replacements,
                };
                replacementChanges.push(replacementInstruction);
            }
        }

        // update values of the remainder of the replacements
        let numUpdate = Math.min(
            component.replacements.length,
            sampledValues.length,
        );

        for (let ind = 0; ind < numUpdate; ind++) {
            let replacementInstruction = {
                changeType: "updateStateVariables",
                component: component.replacements[ind],
                stateChanges: { value: sampledValues[ind] },
            };
            replacementChanges.push(replacementInstruction);
        }

        return { replacementChanges, diagnostics, nComponents };
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
        let sampledValues = sampleFromMultivariateDistribution({
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
