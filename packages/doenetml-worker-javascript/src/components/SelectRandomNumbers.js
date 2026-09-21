import { sampleFromRandomNumbers } from "../utils/randomNumbers";
import { returnNumberDisplayAttributes } from "../utils/numberDisplay";
import SampleRandomNumbers from "./SampleRandomNumbers";
import { convertUnresolvedAttributesForComponentType } from "../utils/dast/convertNormalizedDast";
export default class SelectRandomNumbers extends SampleRandomNumbers {
    // `<sampleRandomNumbers>` offers a `resample` action, and this component
    // has no use for it: it draws once from the variant's generator, and
    // `selectedValues` is immutable so that the draw stays the draw. The
    // inherited action also writes `sampledValues`, the variable deleted
    // below in favor of `selectedValues`, so calling it threw on a variable
    // that is not there -- a console stack trace, nothing said to the author,
    // and the throw carrying off whatever else shared the trigger on its way
    // out: past `CallAction.callAction`'s own trailing `triggerChainedActions`,
    // so anything chained with `triggerWith` never ran, and on out of the
    // un-`try`'d loop in `TriggerSet.triggerActions` that had called it, so the
    // rest of a `<triggerSet>` never ran either. Removing the action leaves
    // `<callAction>` to report that the action is unavailable, which is what
    // an author who asked for it needs to hear.
    constructor(args) {
        super(args);

        delete this.actions.resample;
    }

    static componentType = "selectRandomNumbers";

    // Unlike `<sampleRandomNumbers>`, which it extends, this draws from the
    // variant's generator -- it deletes `variantDeterminesSeed` and takes
    // `sharedParameters.variantRng` unconditionally -- so a fresh build of the
    // same document under the same variant reproduces its selection and there
    // is nothing to persist.
    static definitionEssentialValuesAreReproducible = true;

    static componentDocs = {
        summary:
            "Selects a fixed set of random numbers to create document variants",
    };
    static takesIndex = true;

    static allowInSchemaAsComponent = ["number"];

    static createsVariants = true;

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        delete attributes.numSamples;
        delete attributes.variantDeterminesSeed;

        // The count `<sampleRandomNumbers>` highlights is deleted above, so this
        // takes its place beside the inherited `type` in the highlighted section.
        attributes.numToSelect = {
            highlighted: true,
            description: "How many random numbers to select.",
            createComponentOfType: "integer",
            createStateVariable: "numToSelect",
            defaultValue: 1,
            public: true,
        };

        return attributes;
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

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

        stateVariableDefinitions.step.immutable = true;
        stateVariableDefinitions.from.immutable = true;
        stateVariableDefinitions.from.additionalStateVariablesDefined[0].immutable = true;
        stateVariableDefinitions.from.additionalStateVariablesDefined[1].immutable = true;

        // The distribution parameters are frozen alongside the moments: a selection
        // is made once, so a parameter that kept updating would describe something
        // other than the numbers on the page.
        stateVariableDefinitions.numTotal.immutable = true;
        stateVariableDefinitions.numSuccesses.immutable = true;
        stateVariableDefinitions.numDraws.immutable = true;
        stateVariableDefinitions.numTrials.immutable = true;
        stateVariableDefinitions.probability.immutable = true;

        // The gaussian, log-normal, normal-mixture and poisson parameters are frozen
        // for the same reason, and additionally because `selectedValues` reads them
        // directly:
        // they are what the selection was drawn from, so a moment derived from them
        // later must see what the draw saw, not whatever a reference has since
        // become.
        stateVariableDefinitions.gaussianMean.immutable = true;
        stateVariableDefinitions.gaussianStandardDeviation.immutable = true;
        stateVariableDefinitions.gaussianStandardDeviation.additionalStateVariablesDefined[0].immutable = true;
        stateVariableDefinitions.logMean.immutable = true;
        stateVariableDefinitions.logStandardDeviation.immutable = true;
        stateVariableDefinitions.logStandardDeviation.additionalStateVariablesDefined[0].immutable = true;
        stateVariableDefinitions.means.immutable = true;
        stateVariableDefinitions.standardDeviations.immutable = true;
        stateVariableDefinitions.standardDeviations.additionalStateVariablesDefined[0].immutable = true;
        stateVariableDefinitions.weights.immutable = true;
        stateVariableDefinitions.poissonMean.immutable = true;

        stateVariableDefinitions.mean.immutable = true;
        stateVariableDefinitions.variance.immutable = true;
        stateVariableDefinitions.standardDeviation.immutable = true;

        delete stateVariableDefinitions.sampledValues;

        stateVariableDefinitions.selectedValues = {
            immutable: true,
            hasEssential: true,
            shadowVariable: true,
            returnDependencies: ({ sharedParameters }) => ({
                numSamples: {
                    dependencyType: "stateVariable",
                    variableName: "numToSelect",
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
                // the gaussian's parameters as written, not the reported moments,
                // which are NaN for anything unusable and so could not say which of
                // the two was wrong
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
                variants: {
                    dependencyType: "stateVariable",
                    variableName: "variants",
                },
                rng: {
                    dependencyType: "value",
                    value: sharedParameters.variantRng,
                    doNotProxy: true,
                },
            }),
            definition({ dependencyValues }) {
                if (dependencyValues.numSamples < 1) {
                    return {
                        setEssentialValue: { selectedValues: [] },
                        setValue: { selectedValues: [] },
                    };
                }

                if (
                    dependencyValues.variants &&
                    dependencyValues.variants.desiredVariant
                ) {
                    let desiredValues =
                        dependencyValues.variants.desiredVariant.values;
                    if (desiredValues) {
                        if (
                            desiredValues.length !== dependencyValues.numSamples
                        ) {
                            throw Error(
                                "Number of values specified for selectRandomNumber must match number to select",
                            );
                        }

                        // Take the values as given, but still check the parameters
                        // they came from: replaying a variant should report the same
                        // problems as generating it, rather than accepting the saved
                        // numbers silently. Asking for none draws nothing, so the
                        // variant's own randomness is untouched.
                        const { diagnostics } = sampleFromRandomNumbers({
                            ...dependencyValues,
                            numSamples: 0,
                        });

                        return {
                            setEssentialValue: {
                                selectedValues: desiredValues,
                            },
                            setValue: { selectedValues: desiredValues },
                            sendDiagnostics: diagnostics,
                        };
                    }
                }

                const { sampledValues: selectedValues, diagnostics } =
                    sampleFromRandomNumbers(dependencyValues);

                return {
                    setEssentialValue: { selectedValues },
                    setValue: { selectedValues },
                    sendDiagnostics: diagnostics,
                };
            },
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
        componentInfoObjects,
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

        for (let value of await component.stateValues.selectedValues) {
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

    static determineNumberOfUniqueVariants() {
        return { success: false };
    }
}

delete SelectRandomNumbers.stateVariableToEvaluateAfterReplacements;
delete SelectRandomNumbers.calculateReplacementChanges;
