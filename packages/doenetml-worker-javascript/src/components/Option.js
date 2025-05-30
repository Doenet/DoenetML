import BaseComponent from "./abstract/BaseComponent";
import { setUpVariantSeedAndRng } from "../utils/variants";

export default class Option extends BaseComponent {
    static componentType = "option";
    static rendererType = undefined;

    static includeBlankStringChildren = true;

    static createsVariants = true;

    static inSchemaOnlyInheritAs = [];
    static allowInSchemaAsComponent = undefined;

    static keepChildrenSerialized({ serializedComponent }) {
        if (serializedComponent.children === undefined) {
            return [];
        } else {
            return Object.keys(serializedComponent.children);
        }
    }

    // since don't have child groups, tell schema about children here
    static additionalSchemaChildren = ["_base"];

    static createAttributesObject() {
        let attributes = super.createAttributesObject();
        attributes.selectForVariants = {
            createComponentOfType: "textListFromString",
            createStateVariable: "selectForVariants",
            defaultValue: [],
            public: true,
        };
        attributes.selectWeight = {
            createComponentOfType: "number",
            createStateVariable: "selectWeight",
            defaultValue: 1,
            public: true,
        };
        return attributes;
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.serializedChildren = {
            returnDependencies: () => ({
                serializedChildren: {
                    dependencyType: "serializedChildren",
                    doNotProxy: true,
                },
            }),
            definition: function ({ dependencyValues }) {
                return {
                    setValue: {
                        serializedChildren: dependencyValues.serializedChildren,
                    },
                };
            },
        };

        stateVariableDefinitions.isVariantComponent = {
            returnDependencies: () => ({}),
            definition: () => ({ setValue: { isVariantComponent: true } }),
        };

        stateVariableDefinitions.generatedVariantInfo = {
            returnDependencies: ({
                sharedParameters,
                componentInfoObjects,
            }) => ({
                variantSeed: {
                    dependencyType: "value",
                    value: sharedParameters.variantSeed,
                },
                variantDescendants: {
                    dependencyType: "descendant",
                    componentTypes: Object.keys(
                        componentInfoObjects.componentTypesCreatingVariants,
                    ),
                    variableNames: [
                        "isVariantComponent",
                        "generatedVariantInfo",
                    ],
                    useReplacementsForComposites: true,
                    recurseToMatchedChildren: false,
                    variablesOptional: true,
                    includeNonActiveChildren: true,
                    ignoreReplacementsOfEncounteredComposites: true,
                },
            }),
            definition({ dependencyValues, componentIdx }) {
                let generatedVariantInfo = {
                    seed: dependencyValues.variantSeed,
                    meta: {
                        createdBy: componentIdx,
                    },
                };

                let subvariants = (generatedVariantInfo.subvariants = []);
                for (let descendant of dependencyValues.variantDescendants) {
                    if (descendant.stateValues.isVariantComponent) {
                        subvariants.push(
                            descendant.stateValues.generatedVariantInfo,
                        );
                    } else if (descendant.stateValues.generatedVariantInfo) {
                        subvariants.push(
                            ...descendant.stateValues.generatedVariantInfo
                                .subvariants,
                        );
                    }
                }

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
            useSubpartVariantRng: true,
        });
    }

    get allPotentialRendererTypes() {
        let allPotentialRendererTypes = super.allPotentialRendererTypes;

        let additionalRendererTypes =
            this.potentialRendererTypesFromSerializedComponents(
                this.serializedChildren,
            );
        for (let rendererType of additionalRendererTypes) {
            if (!allPotentialRendererTypes.includes(rendererType)) {
                allPotentialRendererTypes.push(rendererType);
            }
        }

        return allPotentialRendererTypes;
    }
}
