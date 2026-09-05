import {
    sampleFromRandomNumbers,
    validGaussianParameters,
    validBinomialParameters,
    validHypergeometricParameters,
    validPoissonMean,
} from "../utils/randomNumbers";
import { returnNumberDisplayAttributes } from "../utils/numberDisplay";
import { setUpVariantSeedAndRng } from "../utils/variants";
import CompositeComponent from "./abstract/CompositeComponent";
import { convertUnresolvedAttributesForComponentType } from "../utils/dast/convertNormalizedDast";
export default class SampleRandomNumbers extends CompositeComponent {
    constructor(args) {
        super(args);

        Object.assign(this.actions, {
            resample: this.resample.bind(this),
        });
    }
    static componentType = "sampleRandomNumbers";

    static componentDocs = {
        summary: "Samples random numbers from a distribution",
    };
    static takesIndex = true;

    static allowInSchemaAsComponent = ["number"];

    static createsVariants = true;

    static stateVariableToEvaluateAfterReplacements =
        "readyToExpandWhenResolved";

    static processWhenJustUpdatedForNewComponent = true;

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        attributes.numSamples = {
            description: "Number of samples to draw.",
            createComponentOfType: "number",
            createStateVariable: "numSamples",
            defaultValue: 1,
            public: true,
        };

        // possible types
        // discreteuniform: determined by from, to, and step
        // uniform: between from and to (step ignored)
        // gaussian: gaussian with prescribed mean and standard deviation
        // hypergeometric: determined by numTotal, numSuccesses, and numDraws
        // binomial: determined by numTrials and probability
        // poisson: determined by mean

        attributes.type = {
            description: "Distribution from which to sample.",
            createComponentOfType: "text",
            createStateVariable: "type",
            defaultValue: "uniform",
            public: true,
            toLowerCase: true,
            validValues: [
                {
                    value: "uniform",
                    description:
                        "Continuous uniform distribution over `[from, to]`.",
                },
                {
                    value: "discreteUniform",
                    description:
                        "Discrete uniform distribution over integers in `[from, to]`.",
                },
                {
                    value: "gaussian",
                    description:
                        "Normal (Gaussian) distribution with the specified mean and standard deviation.",
                },
                {
                    value: "hypergeometric",
                    description:
                        "Number of successes when drawing `numDraws` items without replacement from a population of `numTotal` items containing `numSuccesses` successes.",
                },
                {
                    value: "binomial",
                    description:
                        "Number of successes in `numTrials` independent trials that each succeed with the given `probability`.",
                },
                {
                    value: "poisson",
                    description:
                        "Poisson distribution with the specified mean (which defaults to 1).",
                },
            ],
        };

        // No default here, because there is no single one to give: an unspecified
        // mean is 0 for a gaussian and 1 for a poisson, and the schema this
        // attribute generates is read by the editor and the reference docs, where
        // one of those numbers presented as the default would be wrong half the
        // time. Each distribution supplies its own below, where the type is known.
        attributes.mean = {
            createComponentOfType: "number",
            createStateVariable: "specifiedMean",
            defaultValue: null,
            description:
                "Mean of the sampling distribution (Gaussian or Poisson). Defaults to 0 for Gaussian and 1 for Poisson.",
        };

        attributes.standardDeviation = {
            createComponentOfType: "number",
            createStateVariable: "specifiedStandardDeviation",
            defaultValue: 1,
            description:
                "Standard deviation of the sampling distribution (Gaussian).",
        };

        attributes.variance = {
            createComponentOfType: "number",
            createStateVariable: "specifiedVariance",
            defaultValue: 1,
            description: "Variance of the sampling distribution (Gaussian).",
        };

        attributes.from = {
            createComponentOfType: "number",
            createStateVariable: "specifiedFrom",
            defaultValue: null,
            description: "Lower bound of the sampling range.",
        };

        attributes.to = {
            createComponentOfType: "number",
            createStateVariable: "specifiedTo",
            defaultValue: null,
            description: "Upper bound of the sampling range.",
        };

        attributes.step = {
            createComponentOfType: "number",
            createStateVariable: "specifiedStep",
            defaultValue: 1,
            description:
                "Step size between samples for the discrete-uniform distribution.",
        };

        attributes.exclude = {
            createComponentOfType: "numberList",
            createStateVariable: "exclude",
            defaultValue: [],
            description: "Values to exclude from the sample space.",
        };

        attributes.numTotal = {
            createComponentOfType: "number",
            createStateVariable: "specifiedNumTotal",
            defaultValue: null,
            description: "Size of the population drawn from (hypergeometric).",
        };

        attributes.numSuccesses = {
            createComponentOfType: "number",
            createStateVariable: "specifiedNumSuccesses",
            defaultValue: null,
            description:
                "Number of successes in the population drawn from (hypergeometric).",
        };

        attributes.numDraws = {
            createComponentOfType: "number",
            createStateVariable: "specifiedNumDraws",
            defaultValue: null,
            description:
                "Number of items drawn without replacement to form each sample (hypergeometric).",
        };

        attributes.numTrials = {
            createComponentOfType: "number",
            createStateVariable: "specifiedNumTrials",
            defaultValue: 1,
            description:
                "Number of independent trials making up each sample (binomial).",
        };

        attributes.probability = {
            createComponentOfType: "number",
            createStateVariable: "specifiedProbability",
            defaultValue: 0.5,
            description: "Probability that each trial succeeds (binomial).",
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

        stateVariableDefinitions.step = {
            description:
                "Step size between sample values (for discrete distributions).",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "number",
            },
            returnDependencies: () => ({
                type: {
                    dependencyType: "stateVariable",
                    variableName: "type",
                },
                specifiedStep: {
                    dependencyType: "stateVariable",
                    variableName: "specifiedStep",
                },
            }),
            definition({ dependencyValues }) {
                let step;
                if (dependencyValues.type === "discreteuniform") {
                    step = dependencyValues.specifiedStep;
                } else {
                    step = null;
                }
                return { setValue: { step } };
            },
        };

        stateVariableDefinitions.from = {
            description: "Lower bound of the sampling range.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "number",
            },
            additionalStateVariablesDefined: [
                {
                    variableName: "to",
                    public: true,
                    shadowingInstructions: {
                        createComponentOfType: "number",
                    },
                    description: "Upper bound of the sampling range.",
                },
                {
                    variableName: "numDiscreteValues",
                },
            ],
            returnDependencies: () => ({
                type: {
                    dependencyType: "stateVariable",
                    variableName: "type",
                },
                specifiedFrom: {
                    dependencyType: "stateVariable",
                    variableName: "specifiedFrom",
                },
                specifiedTo: {
                    dependencyType: "stateVariable",
                    variableName: "specifiedTo",
                },
                step: {
                    dependencyType: "stateVariable",
                    variableName: "step",
                },
                exclude: {
                    dependencyType: "stateVariable",
                    variableName: "exclude",
                },
            }),
            definition({ dependencyValues }) {
                if (
                    !["discreteuniform", "uniform"].includes(
                        dependencyValues.type,
                    )
                ) {
                    return {
                        setValue: {
                            from: null,
                            to: null,
                            numDiscreteValues: null,
                        },
                    };
                }

                let step = dependencyValues.step;
                let exclude = dependencyValues.exclude;

                let from = dependencyValues.specifiedFrom;
                let to = dependencyValues.specifiedTo;
                let numDiscreteValues = null;
                if (to === null) {
                    if (from === null) {
                        from = 0;
                    }
                    if (dependencyValues.type === "uniform") {
                        to = from + 1;
                    } else {
                        // make sure from isn't excluded
                        while (exclude.includes(from)) {
                            from += step;
                        }

                        to = from + step;

                        // make sure to isn't excluded, so that have exactly two values
                        let i = 1;
                        while (exclude.includes(to)) {
                            // Note: make sure calculate to using exact same sequence of operations as actual values
                            // so don't have differences due to floating point rounding
                            i++;
                            to = from + i * step;
                        }

                        numDiscreteValues = 2;
                    }
                } else {
                    if (from === null) {
                        if (dependencyValues.type === "uniform") {
                            from = 0;
                        } else {
                            let targetFrom = 0;
                            numDiscreteValues = Math.floor(
                                (to - targetFrom) / step + 1,
                            );
                            if (numDiscreteValues < 1) {
                                numDiscreteValues = 0;
                                from = null;
                            } else {
                                from = to - (numDiscreteValues - 1) * step;

                                let numExcluded = 0;
                                for (let i = 0; i < numDiscreteValues; i++) {
                                    let val = from + i * step;
                                    if (exclude.includes(val)) {
                                        numExcluded++;
                                    }
                                }
                                numDiscreteValues -= numExcluded;
                            }
                        }
                    } else {
                        // to and from defined
                        // if discrete uniform, adjust to make integer number of steps
                        if (dependencyValues.type === "discreteuniform") {
                            numDiscreteValues = Math.floor(
                                (to - from) / step + 1,
                            );
                            if (numDiscreteValues < 1) {
                                numDiscreteValues = 0;
                            } else {
                                to = from + (numDiscreteValues - 1) * step;

                                let numExcluded = 0;
                                for (let i = 0; i < numDiscreteValues; i++) {
                                    let val = from + i * step;
                                    if (exclude.includes(val)) {
                                        numExcluded++;
                                    }
                                }
                                numDiscreteValues -= numExcluded;
                            }
                        }
                    }
                }

                return { setValue: { from, to, numDiscreteValues } };
            },
        };

        // The Poisson rate as the author gave it, before `mean` reduces an unusable
        // one to NaN. The sampler needs the original: told only that the rate is NaN,
        // it could not tell a malformed value from one too large to draw promptly,
        // and would report the wrong reason to the author.
        // The distribution parameters are exposed through derived state variables
        // rather than straight off the attributes, so that `<selectRandomNumbers>`
        // can freeze them alongside the moments it already freezes. A public value
        // that kept updating while the frozen selection ignored it would describe a
        // distribution the component is not using.
        stateVariableDefinitions.numTotal = {
            description: "Size of the population drawn from (hypergeometric).",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "number",
            },
            returnDependencies: () => ({
                specifiedNumTotal: {
                    dependencyType: "stateVariable",
                    variableName: "specifiedNumTotal",
                },
            }),
            definition: ({ dependencyValues }) => ({
                setValue: { numTotal: dependencyValues.specifiedNumTotal },
            }),
        };

        stateVariableDefinitions.numSuccesses = {
            description:
                "Number of successes in the population drawn from (hypergeometric).",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "number",
            },
            returnDependencies: () => ({
                specifiedNumSuccesses: {
                    dependencyType: "stateVariable",
                    variableName: "specifiedNumSuccesses",
                },
            }),
            definition: ({ dependencyValues }) => ({
                setValue: {
                    numSuccesses: dependencyValues.specifiedNumSuccesses,
                },
            }),
        };

        stateVariableDefinitions.numDraws = {
            description:
                "Number of items drawn without replacement to form each sample (hypergeometric).",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "number",
            },
            returnDependencies: () => ({
                specifiedNumDraws: {
                    dependencyType: "stateVariable",
                    variableName: "specifiedNumDraws",
                },
            }),
            definition: ({ dependencyValues }) => ({
                setValue: { numDraws: dependencyValues.specifiedNumDraws },
            }),
        };

        stateVariableDefinitions.numTrials = {
            description:
                "Number of independent trials making up each sample (binomial).",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "number",
            },
            returnDependencies: () => ({
                specifiedNumTrials: {
                    dependencyType: "stateVariable",
                    variableName: "specifiedNumTrials",
                },
            }),
            definition: ({ dependencyValues }) => ({
                setValue: { numTrials: dependencyValues.specifiedNumTrials },
            }),
        };

        stateVariableDefinitions.probability = {
            description: "Probability that each trial succeeds (binomial).",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "number",
            },
            returnDependencies: () => ({
                specifiedProbability: {
                    dependencyType: "stateVariable",
                    variableName: "specifiedProbability",
                },
            }),
            definition: ({ dependencyValues }) => ({
                setValue: {
                    probability: dependencyValues.specifiedProbability,
                },
            }),
        };

        // The gaussian's parameters as the author gave them, before the reported
        // moments reduce an unusable pair to NaN. The sampler needs the originals
        // for the same reason `poissonMean` exists: told only that both are NaN, its
        // warning would implicate a mean the author never wrote when it was the
        // spread that was wrong.
        stateVariableDefinitions.gaussianMean = {
            returnDependencies: () => ({
                specifiedMean: {
                    dependencyType: "stateVariable",
                    variableName: "specifiedMean",
                },
            }),
            definition: ({ dependencyValues }) => ({
                setValue: { gaussianMean: dependencyValues.specifiedMean ?? 0 },
            }),
        };

        stateVariableDefinitions.gaussianStandardDeviation = {
            returnDependencies: () => ({
                specifiedVariance: {
                    dependencyType: "stateVariable",
                    variableName: "specifiedVariance",
                },
                specifiedStandardDeviation: {
                    dependencyType: "stateVariable",
                    variableName: "specifiedStandardDeviation",
                },
            }),
            definition({ dependencyValues, usedDefault }) {
                // whichever of the two the author set; the same choice the reported
                // variance makes below
                const variance =
                    usedDefault.specifiedVariance &&
                    !usedDefault.specifiedStandardDeviation
                        ? dependencyValues.specifiedStandardDeviation ** 2
                        : dependencyValues.specifiedVariance;

                return {
                    setValue: {
                        gaussianStandardDeviation: Math.sqrt(variance),
                    },
                };
            },
        };

        stateVariableDefinitions.poissonMean = {
            returnDependencies: () => ({
                specifiedMean: {
                    dependencyType: "stateVariable",
                    variableName: "specifiedMean",
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        // a Poisson distribution with mean zero is degenerate, so
                        // an unspecified rate is 1 rather than the 0 a gaussian takes
                        poissonMean: dependencyValues.specifiedMean ?? 1,
                    },
                };
            },
        };

        stateVariableDefinitions.mean = {
            description: "Mean of the sampling distribution.",
            stateVariablesDeterminingDependencies: ["type"],
            public: true,
            shadowingInstructions: {
                createComponentOfType: "number",
            },
            returnDependencies({ stateValues }) {
                let dependencies = {
                    type: {
                        dependencyType: "stateVariable",
                        variableName: "type",
                    },
                };
                if (stateValues.type === "gaussian") {
                    dependencies.mean = {
                        dependencyType: "stateVariable",
                        variableName: "gaussianMean",
                    };
                    dependencies.standardDeviation = {
                        dependencyType: "stateVariable",
                        variableName: "gaussianStandardDeviation",
                    };
                } else if (stateValues.type === "poisson") {
                    dependencies.poissonMean = {
                        dependencyType: "stateVariable",
                        variableName: "poissonMean",
                    };
                } else if (stateValues.type === "hypergeometric") {
                    dependencies.numTotal = {
                        dependencyType: "stateVariable",
                        variableName: "numTotal",
                    };
                    dependencies.numSuccesses = {
                        dependencyType: "stateVariable",
                        variableName: "numSuccesses",
                    };
                    dependencies.numDraws = {
                        dependencyType: "stateVariable",
                        variableName: "numDraws",
                    };
                } else if (stateValues.type === "binomial") {
                    dependencies.numTrials = {
                        dependencyType: "stateVariable",
                        variableName: "numTrials",
                    };
                    dependencies.probability = {
                        dependencyType: "stateVariable",
                        variableName: "probability",
                    };
                } else {
                    dependencies.from = {
                        dependencyType: "stateVariable",
                        variableName: "from",
                    };
                    dependencies.to = {
                        dependencyType: "stateVariable",
                        variableName: "to",
                    };
                    if (stateValues.type === "discreteuniform") {
                        dependencies.exclude = {
                            dependencyType: "stateVariable",
                            variableName: "exclude",
                        };
                        dependencies.step = {
                            dependencyType: "stateVariable",
                            variableName: "step",
                        };
                        dependencies.numDiscreteValues = {
                            dependencyType: "stateVariable",
                            variableName: "numDiscreteValues",
                        };
                    }
                }

                return dependencies;
            },
            definition({ dependencyValues }) {
                let mean;
                if (dependencyValues.type === "gaussian") {
                    mean = validGaussianParameters(dependencyValues)
                        ? dependencyValues.mean
                        : NaN;
                } else if (dependencyValues.type === "poisson") {
                    // out-of-range parameters describe no distribution, so this
                    // case and the two below report NaN, just as their samples do
                    mean = validPoissonMean(dependencyValues.poissonMean)
                        ? dependencyValues.poissonMean
                        : NaN;
                } else if (dependencyValues.type === "hypergeometric") {
                    mean = validHypergeometricParameters(dependencyValues)
                        ? (dependencyValues.numDraws *
                              dependencyValues.numSuccesses) /
                          dependencyValues.numTotal
                        : NaN;
                } else if (dependencyValues.type === "binomial") {
                    mean = validBinomialParameters(dependencyValues)
                        ? dependencyValues.numTrials *
                          dependencyValues.probability
                        : NaN;
                } else if (
                    dependencyValues.type === "discreteuniform" &&
                    dependencyValues.exclude.length > 0
                ) {
                    // calculate manually in this case
                    mean = 0;
                    let numOrigValues = Math.round(
                        (dependencyValues.to - dependencyValues.from) /
                            dependencyValues.step +
                            1,
                    );
                    for (let i = 0; i < numOrigValues; i++) {
                        let val =
                            dependencyValues.from + i * dependencyValues.step;
                        if (!dependencyValues.exclude.includes(val)) {
                            mean += val;
                        }
                    }
                    mean /= dependencyValues.numDiscreteValues;
                } else {
                    mean = (dependencyValues.from + dependencyValues.to) / 2;
                }
                return { setValue: { mean } };
            },
        };

        stateVariableDefinitions.variance = {
            description: "Variance of the sampling distribution.",
            stateVariablesDeterminingDependencies: ["type"],
            public: true,
            shadowingInstructions: {
                createComponentOfType: "number",
            },
            returnDependencies({ stateValues }) {
                let dependencies = {
                    type: {
                        dependencyType: "stateVariable",
                        variableName: "type",
                    },
                };
                if (stateValues.type === "gaussian") {
                    dependencies.specifiedVariance = {
                        dependencyType: "stateVariable",
                        variableName: "specifiedVariance",
                    };
                    dependencies.specifiedStandardDeviation = {
                        dependencyType: "stateVariable",
                        variableName: "specifiedStandardDeviation",
                    };
                    // read only to decide whether there is a distribution at all
                    dependencies.mean = {
                        dependencyType: "stateVariable",
                        variableName: "gaussianMean",
                    };
                    dependencies.standardDeviation = {
                        dependencyType: "stateVariable",
                        variableName: "gaussianStandardDeviation",
                    };
                } else if (stateValues.type === "poisson") {
                    // the variance of a Poisson distribution equals its mean,
                    // so depend on `mean` rather than repeat its defaulting logic
                    dependencies.mean = {
                        dependencyType: "stateVariable",
                        variableName: "mean",
                    };
                } else if (stateValues.type === "hypergeometric") {
                    dependencies.numTotal = {
                        dependencyType: "stateVariable",
                        variableName: "numTotal",
                    };
                    dependencies.numSuccesses = {
                        dependencyType: "stateVariable",
                        variableName: "numSuccesses",
                    };
                    dependencies.numDraws = {
                        dependencyType: "stateVariable",
                        variableName: "numDraws",
                    };
                } else if (stateValues.type === "binomial") {
                    dependencies.numTrials = {
                        dependencyType: "stateVariable",
                        variableName: "numTrials",
                    };
                    dependencies.probability = {
                        dependencyType: "stateVariable",
                        variableName: "probability",
                    };
                } else {
                    dependencies.from = {
                        dependencyType: "stateVariable",
                        variableName: "from",
                    };
                    dependencies.to = {
                        dependencyType: "stateVariable",
                        variableName: "to",
                    };
                    if (stateValues.type === "discreteuniform") {
                        dependencies.exclude = {
                            dependencyType: "stateVariable",
                            variableName: "exclude",
                        };
                        dependencies.step = {
                            dependencyType: "stateVariable",
                            variableName: "step",
                        };
                        dependencies.numDiscreteValues = {
                            dependencyType: "stateVariable",
                            variableName: "numDiscreteValues",
                        };
                    }
                }

                return dependencies;
            },
            definition({ dependencyValues, usedDefault }) {
                let variance;
                if (dependencyValues.type === "gaussian") {
                    if (
                        usedDefault.specifiedVariance &&
                        !usedDefault.specifiedStandardDeviation
                    ) {
                        variance =
                            dependencyValues.specifiedStandardDeviation ** 2;
                    } else {
                        variance = dependencyValues.specifiedVariance;
                    }
                    // a spread or center that describes no distribution leaves no
                    // moments to report either, matching what the samples report
                    if (!validGaussianParameters(dependencyValues)) {
                        variance = NaN;
                    }
                } else if (dependencyValues.type === "poisson") {
                    // the variance of a Poisson distribution equals its mean,
                    // including the NaN that an out-of-range mean reports
                    variance = dependencyValues.mean;
                } else if (dependencyValues.type === "hypergeometric") {
                    const N = dependencyValues.numTotal;
                    const K = dependencyValues.numSuccesses;
                    const n = dependencyValues.numDraws;
                    if (!validHypergeometricParameters(dependencyValues)) {
                        variance = NaN;
                    } else if (N === 1) {
                        // the finite population correction (N - n) / (N - 1) below
                        // is 0/0 for a population of one item, which is determined
                        // and so has variance 0
                        variance = 0;
                    } else {
                        variance =
                            (n * (K / N) * ((N - K) / N) * (N - n)) / (N - 1);
                    }
                } else if (dependencyValues.type === "binomial") {
                    variance = validBinomialParameters(dependencyValues)
                        ? dependencyValues.numTrials *
                          dependencyValues.probability *
                          (1 - dependencyValues.probability)
                        : NaN;
                } else if (dependencyValues.type === "discreteuniform") {
                    if (dependencyValues.exclude.length > 0) {
                        // calculate manually in this case
                        let sum = 0;
                        variance = 0;
                        let numOrigValues = Math.round(
                            (dependencyValues.to - dependencyValues.from) /
                                dependencyValues.step +
                                1,
                        );
                        for (let i = 0; i < numOrigValues; i++) {
                            let val =
                                dependencyValues.from +
                                i * dependencyValues.step;
                            if (!dependencyValues.exclude.includes(val)) {
                                sum += val;
                                variance += val * val;
                            }
                        }
                        let N = dependencyValues.numDiscreteValues;
                        variance -= (sum * sum) / N;
                        variance /= N; // use population variance as this isn't a sample, it's the whole distribution
                    } else {
                        variance =
                            ((dependencyValues.numDiscreteValues ** 2 - 1) *
                                dependencyValues.step ** 2) /
                            12;
                    }
                } else {
                    // uniform
                    variance =
                        (dependencyValues.to - dependencyValues.from) ** 2 / 12;
                }
                return { setValue: { variance } };
            },
        };

        stateVariableDefinitions.standardDeviation = {
            description: "Standard deviation of the sampling distribution.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "number",
            },
            returnDependencies: () => ({
                variance: {
                    dependencyType: "stateVariable",
                    variableName: "variance",
                },
            }),
            definition: ({ dependencyValues }) => ({
                setValue: {
                    standardDeviation: Math.sqrt(dependencyValues.variance),
                },
            }),
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
                    type: {
                        dependencyType: "stateVariable",
                        variableName: "type",
                    },
                    from: {
                        dependencyType: "stateVariable",
                        variableName: "from",
                    },
                    to: {
                        dependencyType: "stateVariable",
                        variableName: "to",
                    },
                    step: {
                        dependencyType: "stateVariable",
                        variableName: "step",
                    },
                    exclude: {
                        dependencyType: "stateVariable",
                        variableName: "exclude",
                    },
                    numDiscreteValues: {
                        dependencyType: "stateVariable",
                        variableName: "numDiscreteValues",
                    },
                    // the gaussian's parameters as written, not the reported
                    // moments, which are NaN for anything unusable and so could not
                    // say which of the two was wrong
                    mean: {
                        dependencyType: "stateVariable",
                        variableName: "gaussianMean",
                    },
                    standardDeviation: {
                        dependencyType: "stateVariable",
                        variableName: "gaussianStandardDeviation",
                    },
                    numTotal: {
                        dependencyType: "stateVariable",
                        variableName: "numTotal",
                    },
                    numSuccesses: {
                        dependencyType: "stateVariable",
                        variableName: "numSuccesses",
                    },
                    numDraws: {
                        dependencyType: "stateVariable",
                        variableName: "numDraws",
                    },
                    numTrials: {
                        dependencyType: "stateVariable",
                        variableName: "numTrials",
                    },
                    probability: {
                        dependencyType: "stateVariable",
                        variableName: "probability",
                    },
                    poissonMean: {
                        dependencyType: "stateVariable",
                        variableName: "poissonMean",
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
                    // Keep the values, but re-check the parameters: they have not
                    // changed, so whatever was wrong with them still is, and an
                    // author who reloads a document should not lose the explanation
                    // for why its samples are NaN. Asking for no samples draws
                    // nothing, so this consumes no randomness and leaves a variant
                    // reproducible.
                    const { diagnostics } = sampleFromRandomNumbers({
                        ...dependencyValues,
                        numSamples: 0,
                    });

                    return {
                        useEssentialOrDefaultValue: { sampledValues: true },
                        sendDiagnostics: diagnostics,
                    };
                }

                const { sampledValues, diagnostics } =
                    sampleFromRandomNumbers(dependencyValues);

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

        // if have fewer result than samples, adjust replacementsToWithhold
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
        // Any diagnostic these parameters raise was already sent when `sampledValues`
        // was first computed, and resampling cannot change them, so there is nothing
        // new to report here — and an action has no `sendDiagnostics` in any case.
        const { sampledValues } = sampleFromRandomNumbers({
            type: await this.stateValues.type,
            numSamples: await this.stateValues.numSamples,
            standardDeviation: await this.stateValues.gaussianStandardDeviation,
            mean: await this.stateValues.gaussianMean,
            to: await this.stateValues.to,
            from: await this.stateValues.from,
            step: await this.stateValues.step,
            exclude: await this.stateValues.exclude,
            numDiscreteValues: await this.stateValues.numDiscreteValues,
            numTotal: await this.stateValues.numTotal,
            numSuccesses: await this.stateValues.numSuccesses,
            numDraws: await this.stateValues.numDraws,
            numTrials: await this.stateValues.numTrials,
            probability: await this.stateValues.probability,
            poissonMean: await this.stateValues.poissonMean,
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
