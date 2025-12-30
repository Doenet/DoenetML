import { sampleFromRandomNumbers } from "../utils/randomNumbers";
import { returnRoundingAttributes } from "../utils/rounding";
import SampleRandomNumbers from "./SampleRandomNumbers";
import { convertUnresolvedAttributesForComponentType } from "../utils/dast/convertNormalizedDast";
export default class SelectRandomNumbers extends SampleRandomNumbers {
    static componentType = "selectRandomNumbers";

    static allowInSchemaAsComponent = ["number"];

    static createsVariants = true;

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        delete attributes.numSamples;
        delete attributes.variantDeterminesSeed;

        attributes.numToSelect = {
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
                mean: {
                    dependencyType: "stateVariable",
                    variableName: "mean",
                },
                standardDeviation: {
                    dependencyType: "stateVariable",
                    variableName: "standardDeviation",
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

                        // just give the desired values without any verification
                        return {
                            setEssentialValue: {
                                selectedValues: desiredValues,
                            },
                            setValue: { selectedValues: desiredValues },
                        };
                    }
                }

                let selectedValues = sampleFromRandomNumbers(dependencyValues);

                return {
                    setEssentialValue: { selectedValues },
                    setValue: { selectedValues },
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

        let errors = [];
        let warnings = [];

        let attributesToConvert = {};
        for (let attr of Object.keys(returnRoundingAttributes())) {
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
            errors,
            warnings,
            nComponents,
        };
    }

    static determineNumberOfUniqueVariants() {
        return { success: false };
    }
}

delete SelectRandomNumbers.stateVariableToEvaluateAfterReplacements;
delete SelectRandomNumbers.calculateReplacementChanges;
