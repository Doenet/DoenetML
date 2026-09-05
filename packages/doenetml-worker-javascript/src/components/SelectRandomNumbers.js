import { sampleFromRandomNumbers } from "../utils/randomNumbers";
import { returnNumberDisplayAttributes } from "../utils/numberDisplay";
import SampleRandomNumbers from "./SampleRandomNumbers";
import { convertUnresolvedAttributesForComponentType } from "../utils/dast/convertNormalizedDast";
export default class SelectRandomNumbers extends SampleRandomNumbers {
    static componentType = "selectRandomNumbers";

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

        attributes.numToSelect = {
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
