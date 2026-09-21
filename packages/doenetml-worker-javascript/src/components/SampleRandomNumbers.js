import {
    sampleFromRandomNumbers,
    validGaussianParameters,
    validLogNormalParameters,
    validBinomialParameters,
    validHypergeometricParameters,
    validPoissonMean,
    normalMixtureMoments,
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

    // `variantDeterminesSeed` is false by default, so these samples are drawn
    // from a date-seeded generator and a fresh build of the same document
    // under the same variant does not reproduce them. They exist nowhere but
    // in the saved state, so they are persisted rather than treated as a
    // definition's recomputable work (Doenet/DoenetML#1940).
    static definitionEssentialValuesAreReproducible = false;

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

        // `type` and the count are the two attributes every use of this
        // component sets on purpose, and between them they decide what it does:
        // which distribution, and how many values from it. Every other attribute
        // here parameterizes one distribution, and is grouped with the rest of
        // that distribution's parameters below, so that the reference page opens
        // on the choice rather than on fifteen parameters for six distributions
        // the reader is not using.
        attributes.numSamples = {
            highlighted: true,
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
        // lognormal: exponential of a gaussian with prescribed logMean and
        //     logStandardDeviation
        // normalmixture: one of several gaussians, chosen with probability in
        //     proportion to its weight, prescribed by means, standardDeviations
        //     and weights
        // hypergeometric: determined by numTotal, numSuccesses, and numDraws
        // binomial: determined by numTrials and probability
        // poisson: determined by mean

        attributes.type = {
            highlighted: true,
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
                    value: "logNormal",
                    description:
                        "Log-normal distribution: the exponential of a normal distribution with the specified `logMean` and `logStandardDeviation`.",
                },
                {
                    value: "normalMixture",
                    description:
                        "Mixture of normal distributions: each value comes from one of the distributions described by `means` and `standardDeviations`, chosen with probability in proportion to its entry in `weights`.",
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
            groupName: "sampling-gaussian",
            createComponentOfType: "number",
            createStateVariable: "specifiedMean",
            defaultValue: null,
            description:
                "Mean of the sampling distribution (Gaussian or Poisson). Defaults to 0 for Gaussian and 1 for Poisson.",
        };

        attributes.standardDeviation = {
            groupName: "sampling-gaussian",
            createComponentOfType: "number",
            createStateVariable: "specifiedStandardDeviation",
            defaultValue: 1,
            description:
                "Standard deviation of the sampling distribution (Gaussian).",
        };

        attributes.variance = {
            groupName: "sampling-gaussian",
            createComponentOfType: "number",
            createStateVariable: "specifiedVariance",
            defaultValue: 1,
            description: "Variance of the sampling distribution (Gaussian).",
        };

        // The log-normal's parameters are named apart from the gaussian's because
        // they describe a different thing: they are the center and spread of the
        // normal distribution whose exponential the samples are, not of the samples
        // themselves. Reusing `mean` would have made `mean="0"` produce values
        // averaging about 1.65, and the reported `mean` disagree with the attribute
        // of the same name.
        attributes.logMean = {
            groupName: "sampling-lognormal",
            createComponentOfType: "number",
            createStateVariable: "specifiedLogMean",
            defaultValue: 0,
            description:
                "Mean of the underlying normal distribution (log-normal).",
        };

        attributes.logStandardDeviation = {
            groupName: "sampling-lognormal",
            createComponentOfType: "number",
            createStateVariable: "specifiedLogStandardDeviation",
            defaultValue: 1,
            description:
                "Standard deviation of the underlying normal distribution (log-normal).",
        };

        attributes.logVariance = {
            groupName: "sampling-lognormal",
            createComponentOfType: "number",
            createStateVariable: "specifiedLogVariance",
            defaultValue: 1,
            description:
                "Variance of the underlying normal distribution (log-normal).",
        };

        // The mixture's parameters are lists rather than scalars, and named in the
        // plural to keep them apart from the gaussian's `mean` and
        // `standardDeviation`: they describe several normal distributions at once,
        // and which one a given value came from is not something the component
        // reports. `means` is also the only one of the three with no default,
        // because its length is what says how many components there are.
        attributes.means = {
            groupName: "sampling-mixture",
            createComponentOfType: "numberList",
            createStateVariable: "specifiedMeans",
            defaultValue: [],
            description:
                "Means of the normal distributions being mixed (normal mixture). How many are listed is how many components the mixture has.",
        };

        attributes.standardDeviations = {
            groupName: "sampling-mixture",
            createComponentOfType: "numberList",
            createStateVariable: "specifiedStandardDeviations",
            defaultValue: [1],
            description:
                "Standard deviations of the normal distributions being mixed (normal mixture). A single value applies to every component.",
        };

        attributes.variances = {
            groupName: "sampling-mixture",
            createComponentOfType: "numberList",
            createStateVariable: "specifiedVariances",
            defaultValue: [1],
            description:
                "Variances of the normal distributions being mixed (normal mixture). A single value applies to every component.",
        };

        attributes.weights = {
            groupName: "sampling-mixture",
            createComponentOfType: "numberList",
            createStateVariable: "specifiedWeights",
            defaultValue: [1],
            description:
                "Relative weight of each normal distribution being mixed (normal mixture), which need not add up to 1. A single value applies to every component, weighting them equally.",
        };

        attributes.from = {
            groupName: "sampling-range",
            createComponentOfType: "number",
            createStateVariable: "specifiedFrom",
            defaultValue: null,
            description: "Lower bound of the sampling range.",
        };

        attributes.to = {
            groupName: "sampling-range",
            createComponentOfType: "number",
            createStateVariable: "specifiedTo",
            defaultValue: null,
            description: "Upper bound of the sampling range.",
        };

        attributes.step = {
            groupName: "sampling-range",
            createComponentOfType: "number",
            createStateVariable: "specifiedStep",
            defaultValue: 1,
            description:
                "Step size between samples for the discrete-uniform distribution.",
        };

        attributes.exclude = {
            groupName: "sampling-range",
            createComponentOfType: "numberList",
            createStateVariable: "specifiedExclude",
            defaultValue: [],
            description: "Values to exclude from the sample space.",
        };

        attributes.numTotal = {
            groupName: "sampling-discrete",
            createComponentOfType: "number",
            createStateVariable: "specifiedNumTotal",
            defaultValue: null,
            description: "Size of the population drawn from (hypergeometric).",
        };

        attributes.numSuccesses = {
            groupName: "sampling-discrete",
            createComponentOfType: "number",
            createStateVariable: "specifiedNumSuccesses",
            defaultValue: null,
            description:
                "Number of successes in the population drawn from (hypergeometric).",
        };

        attributes.numDraws = {
            groupName: "sampling-discrete",
            createComponentOfType: "number",
            createStateVariable: "specifiedNumDraws",
            defaultValue: null,
            description:
                "Number of items drawn without replacement to form each sample (hypergeometric).",
        };

        attributes.numTrials = {
            groupName: "sampling-discrete",
            createComponentOfType: "number",
            createStateVariable: "specifiedNumTrials",
            defaultValue: 1,
            description:
                "Number of independent trials making up each sample (binomial).",
        };

        attributes.probability = {
            groupName: "sampling-discrete",
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
                // Redeclaring these as `leaveRaw` drops everything else the
                // helper put on them, the docs grouping included, which left the
                // five of them loose in "Other" beside this component's own
                // parameters. They shape how a number is written rather than
                // which numbers are drawn, so they belong under their own
                // heading as they do everywhere the helper is used unaltered.
                groupName: numberDisplayAttrs[attrName].groupName,
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

        // The excluded values as the author gave them. Like every other
        // distribution parameter, these go through a definition of their own rather
        // than straight off the attribute, so that `<selectRandomNumbers>` can freeze
        // them: a selection is drawn once, and an exclusion set that kept following a
        // reference would leave the reported moments describing a different set of
        // values than the numbers on the page came from (Doenet/DoenetML#1997).
        //
        // The list is copied for the reason the mixture's three are: the list an
        // attribute hands over belongs to the `<numberList>` the attribute created,
        // which rewrites it in place when a reference inside it changes, so passing
        // it through would leave this tracking the reference however immutable it was
        // declared.
        stateVariableDefinitions.exclude = {
            returnDependencies: () => ({
                specifiedExclude: {
                    dependencyType: "stateVariable",
                    variableName: "specifiedExclude",
                },
            }),
            definition: ({ dependencyValues }) => ({
                setValue: { exclude: [...dependencyValues.specifiedExclude] },
            }),
        };

        stateVariableDefinitions.step = {
            description:
                "Step size between sample values (for discrete distributions).",
            groupName: "sampling-range",
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
            groupName: "sampling-range",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "number",
            },
            additionalStateVariablesDefined: [
                {
                    variableName: "to",
                    public: true,
                    groupName: "sampling-range",
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
            groupName: "sampling-discrete",
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
            groupName: "sampling-discrete",
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
            groupName: "sampling-discrete",
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
            groupName: "sampling-discrete",
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
            groupName: "sampling-discrete",
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
            additionalStateVariablesDefined: [
                { variableName: "gaussianVariance" },
            ],
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
                // Which of the two the author set decides both, so they are settled
                // together and everything downstream reads these rather than the
                // attributes: the reported variance would otherwise recompute from
                // a reference that had since changed, describing a spread the
                // selection was not drawn from.
                const fromStandardDeviation =
                    usedDefault.specifiedVariance &&
                    !usedDefault.specifiedStandardDeviation;

                return {
                    setValue: {
                        // A supplied standard deviation is kept as written rather
                        // than squared and rooted back: that round trip loses its
                        // sign, so `standardDeviation="-2"` would be sampled as 2
                        // while the warning says it must be non-negative.
                        gaussianStandardDeviation: fromStandardDeviation
                            ? dependencyValues.specifiedStandardDeviation
                            : Math.sqrt(dependencyValues.specifiedVariance),
                        // and a supplied variance is likewise kept as written, so
                        // that reporting it back does not round-trip through a root
                        gaussianVariance: fromStandardDeviation
                            ? dependencyValues.specifiedStandardDeviation ** 2
                            : dependencyValues.specifiedVariance,
                    },
                };
            },
        };

        // The log-normal's parameters as the author gave them. Public, unlike the
        // gaussian's, because they are the only description of the distribution the
        // author wrote: the reported `mean` and `variance` are of the samples, and
        // neither recovers a parameter without the other.
        stateVariableDefinitions.logMean = {
            groupName: "sampling-lognormal",
            description:
                "Mean of the underlying normal distribution (log-normal).",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "number",
            },
            returnDependencies: () => ({
                specifiedLogMean: {
                    dependencyType: "stateVariable",
                    variableName: "specifiedLogMean",
                },
            }),
            definition: ({ dependencyValues }) => ({
                setValue: { logMean: dependencyValues.specifiedLogMean },
            }),
        };

        stateVariableDefinitions.logStandardDeviation = {
            groupName: "sampling-lognormal",
            description:
                "Standard deviation of the underlying normal distribution (log-normal).",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "number",
            },
            additionalStateVariablesDefined: [
                {
                    variableName: "logVariance",
                    public: true,
                    groupName: "sampling-lognormal",
                    shadowingInstructions: {
                        createComponentOfType: "number",
                    },
                    description:
                        "Variance of the underlying normal distribution (log-normal).",
                },
            ],
            returnDependencies: () => ({
                specifiedLogVariance: {
                    dependencyType: "stateVariable",
                    variableName: "specifiedLogVariance",
                },
                specifiedLogStandardDeviation: {
                    dependencyType: "stateVariable",
                    variableName: "specifiedLogStandardDeviation",
                },
            }),
            definition({ dependencyValues, usedDefault }) {
                // settled together, and for the same reasons, as the gaussian pair
                // above: whichever the author wrote decides both, and each is kept
                // as written rather than round-tripped through the other, which
                // would lose the sign of a negative spread
                const fromStandardDeviation =
                    usedDefault.specifiedLogVariance &&
                    !usedDefault.specifiedLogStandardDeviation;

                return {
                    setValue: {
                        logStandardDeviation: fromStandardDeviation
                            ? dependencyValues.specifiedLogStandardDeviation
                            : Math.sqrt(dependencyValues.specifiedLogVariance),
                        logVariance: fromStandardDeviation
                            ? dependencyValues.specifiedLogStandardDeviation **
                              2
                            : dependencyValues.specifiedLogVariance,
                    },
                };
            },
        };

        // The mixture's parameters as the author gave them. Public for the same
        // reason the log-normal's are: the reported `mean` and `variance` are of the
        // mixture as a whole, and no component's own center or spread can be read
        // back out of them.
        stateVariableDefinitions.means = {
            groupName: "sampling-mixture",
            description:
                "Means of the normal distributions being mixed (normal mixture).",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "numberList",
            },
            returnDependencies: () => ({
                specifiedMeans: {
                    dependencyType: "stateVariable",
                    variableName: "specifiedMeans",
                },
            }),
            definition: ({ dependencyValues }) => ({
                // A copy, not the list the attribute handed over: that one belongs to
                // the `<numberList>` the attribute created, which rewrites it in place
                // when a reference inside it changes. Holding onto it would leave this
                // property following the reference even where it is frozen --- a
                // `<selectRandomNumbers>` would report parameters its values were
                // never drawn from --- and would hand every reader a list that changes
                // under them. The other two below are copied for the same reason.
                setValue: { means: [...dependencyValues.specifiedMeans] },
            }),
        };

        stateVariableDefinitions.standardDeviations = {
            groupName: "sampling-mixture",
            description:
                "Standard deviations of the normal distributions being mixed (normal mixture).",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "numberList",
            },
            additionalStateVariablesDefined: [
                {
                    variableName: "variances",
                    public: true,
                    groupName: "sampling-mixture",
                    shadowingInstructions: {
                        createComponentOfType: "numberList",
                    },
                    description:
                        "Variances of the normal distributions being mixed (normal mixture).",
                },
            ],
            returnDependencies: () => ({
                specifiedVariances: {
                    dependencyType: "stateVariable",
                    variableName: "specifiedVariances",
                },
                specifiedStandardDeviations: {
                    dependencyType: "stateVariable",
                    variableName: "specifiedStandardDeviations",
                },
            }),
            definition({ dependencyValues, usedDefault }) {
                // settled together, and for the same reasons, as the gaussian and
                // log-normal pairs above: whichever the author wrote decides both,
                // and each is kept as written rather than round-tripped through the
                // other, which would lose the sign of a negative spread. Neither is
                // expanded to one value per component here --- the author's own list
                // is what a reader of these properties asked for, and a single value
                // standing for every component is expanded where it is used.
                const fromStandardDeviations =
                    usedDefault.specifiedVariances &&
                    !usedDefault.specifiedStandardDeviations;

                return {
                    setValue: {
                        standardDeviations: fromStandardDeviations
                            ? [...dependencyValues.specifiedStandardDeviations]
                            : dependencyValues.specifiedVariances.map(
                                  (variance) => Math.sqrt(variance),
                              ),
                        variances: fromStandardDeviations
                            ? dependencyValues.specifiedStandardDeviations.map(
                                  (standardDeviation) => standardDeviation ** 2,
                              )
                            : [...dependencyValues.specifiedVariances],
                    },
                };
            },
        };

        stateVariableDefinitions.weights = {
            groupName: "sampling-mixture",
            description:
                "Relative weight of each normal distribution being mixed (normal mixture), as written rather than scaled to add up to 1.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "numberList",
            },
            returnDependencies: () => ({
                specifiedWeights: {
                    dependencyType: "stateVariable",
                    variableName: "specifiedWeights",
                },
            }),
            definition: ({ dependencyValues }) => ({
                setValue: { weights: [...dependencyValues.specifiedWeights] },
            }),
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

        // The three moments are what an author reads off the component --- the
        // values themselves arrive as its replacements rather than as a property ---
        // so they are the properties the reference page opens on. The parameter
        // properties beside them repeat the attributes that set them, and sit in
        // their distribution's group as those attributes do.
        //
        // These three carry a group of their own rather than inheriting one,
        // because a property with no group takes the group of the attribute it
        // shares a name with: `mean`, `standardDeviation` and `variance` are
        // gaussian attributes, but as properties they report the moments of
        // whichever distribution is in use, and filing them under the gaussian
        // would tell a reader of a poisson or binomial the wrong thing.
        stateVariableDefinitions.mean = {
            description: "Mean of the sampling distribution.",
            stateVariablesDeterminingDependencies: ["type"],
            highlighted: true,
            groupName: "sampling-moments",
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
                } else if (stateValues.type === "lognormal") {
                    dependencies.logMean = {
                        dependencyType: "stateVariable",
                        variableName: "logMean",
                    };
                    dependencies.logStandardDeviation = {
                        dependencyType: "stateVariable",
                        variableName: "logStandardDeviation",
                    };
                } else if (stateValues.type === "normalmixture") {
                    dependencies.means = {
                        dependencyType: "stateVariable",
                        variableName: "means",
                    };
                    dependencies.standardDeviations = {
                        dependencyType: "stateVariable",
                        variableName: "standardDeviations",
                    };
                    dependencies.weights = {
                        dependencyType: "stateVariable",
                        variableName: "weights",
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
                } else if (dependencyValues.type === "lognormal") {
                    // e^(mu + sigma^2 / 2), which overflows to Infinity for
                    // parameters whose distribution genuinely has a mean larger
                    // than a number can hold.
                    //
                    // The halving is done before the squaring rather than
                    // after: `sigma ** 2` is already Infinity for a spread past
                    // about 1.3e154, and adding a center to an Infinity loses
                    // the center, so a spread in that range beside a center
                    // below -sigma^2/2 reported Infinity where the true mean is
                    // 0. `(sigma / 2) * sigma` divides exactly and so overflows
                    // only once sigma^2/2 is itself past what a number can hold,
                    // which is past where any center could bring the sum back
                    // into range.
                    mean = validLogNormalParameters(dependencyValues)
                        ? Math.exp(
                              dependencyValues.logMean +
                                  (dependencyValues.logStandardDeviation / 2) *
                                      dependencyValues.logStandardDeviation,
                          )
                        : NaN;
                } else if (dependencyValues.type === "normalmixture") {
                    // the weighted average of the component means, which
                    // `normalMixtureMoments` computes alongside the variance
                    mean = normalMixtureMoments(dependencyValues).mean;
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
            highlighted: true,
            groupName: "sampling-moments",
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
                    dependencies.gaussianVariance = {
                        dependencyType: "stateVariable",
                        variableName: "gaussianVariance",
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
                } else if (stateValues.type === "lognormal") {
                    dependencies.logMean = {
                        dependencyType: "stateVariable",
                        variableName: "logMean",
                    };
                    dependencies.logStandardDeviation = {
                        dependencyType: "stateVariable",
                        variableName: "logStandardDeviation",
                    };
                } else if (stateValues.type === "normalmixture") {
                    dependencies.means = {
                        dependencyType: "stateVariable",
                        variableName: "means",
                    };
                    dependencies.standardDeviations = {
                        dependencyType: "stateVariable",
                        variableName: "standardDeviations",
                    };
                    dependencies.weights = {
                        dependencyType: "stateVariable",
                        variableName: "weights",
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
                    // a spread or center that describes no distribution leaves no
                    // moments to report either, matching what the samples report
                    variance = validGaussianParameters(dependencyValues)
                        ? dependencyValues.gaussianVariance
                        : NaN;
                } else if (dependencyValues.type === "lognormal") {
                    const logStandardDeviation =
                        dependencyValues.logStandardDeviation;
                    if (!validLogNormalParameters(dependencyValues)) {
                        variance = NaN;
                    } else if (logStandardDeviation === 0) {
                        // A spread of exactly zero is one value repeated, whose
                        // variance is 0, and saying so here is both cheaper and
                        // surer than asking the formula below: its logarithmic
                        // factor is then -Infinity, which cancels against the
                        // +Infinity a center past about 9e307 quadruples to and
                        // gives NaN for a distribution that is perfectly
                        // determined.
                        variance = 0;
                    } else {
                        const logVariance = logStandardDeviation ** 2;

                        // (1 - e^(-sigma^2)) e^(2 mu + 2 sigma^2), which is the
                        // textbook (e^(sigma^2) - 1) e^(2 mu + sigma^2) with a
                        // factor of e^(sigma^2) moved from the left factor to
                        // the right, evaluated as a single exponential so that
                        // neither factor is formed on its own.
                        //
                        // Both factors overflow for parameters whose variance is
                        // an ordinary number, in opposite directions, so a
                        // product of the two is wrong at both ends. Written the
                        // textbook way a spread past sigma^2 = 710 overflows the
                        // left factor while a center far below it underflows the
                        // right, and the product is NaN where the truth is
                        // e^-200 (logMean="-1000" logVariance="900"). Written as
                        // a product the other way round the left factor is
                        // bounded in (0, 1], but a center large enough that the
                        // *squares* of the values overflow while the values
                        // themselves do not --- logMean between about 355 and
                        // 709 --- overflows the right factor, and the product is
                        // Infinity where the truth is 1.7e307 (logMean="356"
                        // logStandardDeviation="0.1"). Adding the logarithm of
                        // the left factor to the exponent instead leaves only
                        // the Infinity the whole expression earns.
                        //
                        // That logarithm is taken as 2 ln(sigma) once the square
                        // is small, because sigma^2 is where the precision goes:
                        // it falls into the subnormals below a spread of about
                        // 1.5e-154 and is 0 below about 1e-162, at spreads whose
                        // variance is an ordinary number once the center is
                        // large. ln(1 - e^(-x)) is ln(x) - x/2 + ..., so below
                        // the cut the term dropped is at most 5e-301 of an
                        // exponent, far under what the result can resolve, while
                        // the cut is itself above the smallest normal number so
                        // nothing subnormal reaches `expm1` --- which above it
                        // keeps a small spread from losing its precision to the
                        // 1 it is subtracted from.
                        const logFactor =
                            logVariance > 1e-300
                                ? Math.log(-Math.expm1(-logVariance))
                                : 2 * Math.log(logStandardDeviation);

                        // the exponent is 2 mu + 2 sigma^2, evaluated at a
                        // quarter scale because those two terms each overflow on
                        // their own --- 2 mu past a center of 9e307, 2 sigma^2
                        // past a spread of 9.5e153 --- for parameters whose sum
                        // is an ordinary number, and Infinity + -Infinity is NaN
                        variance = Math.exp(
                            4 *
                                (dependencyValues.logMean / 2 +
                                    (logStandardDeviation / 2) *
                                        logStandardDeviation) +
                                logFactor,
                        );
                    }
                } else if (dependencyValues.type === "normalmixture") {
                    // the spread within the components plus the spread between
                    // them; see `normalMixtureMoments` for why it is computed that
                    // way round rather than as E[X^2] - E[X]^2
                    variance = normalMixtureMoments(dependencyValues).variance;
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
            highlighted: true,
            groupName: "sampling-moments",
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
                    logMean: {
                        dependencyType: "stateVariable",
                        variableName: "logMean",
                    },
                    logStandardDeviation: {
                        dependencyType: "stateVariable",
                        variableName: "logStandardDeviation",
                    },
                    means: {
                        dependencyType: "stateVariable",
                        variableName: "means",
                    },
                    standardDeviations: {
                        dependencyType: "stateVariable",
                        variableName: "standardDeviations",
                    },
                    weights: {
                        dependencyType: "stateVariable",
                        variableName: "weights",
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
            logStandardDeviation: await this.stateValues.logStandardDeviation,
            logMean: await this.stateValues.logMean,
            means: await this.stateValues.means,
            standardDeviations: await this.stateValues.standardDeviations,
            weights: await this.stateValues.weights,
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
