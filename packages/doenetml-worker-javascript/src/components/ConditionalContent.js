import CompositeComponent from "./abstract/CompositeComponent";
import { deepClone } from "@doenet/utils";
import { setUpVariantSeedAndRng } from "../utils/variants";
export default class ConditionalContent extends CompositeComponent {
    static componentType = "conditionalContent";

    static allowInSchemaAsComponent = ["_inline", "_block", "_graphical"];

    static includeBlankStringChildren = true;

    static createsVariants = true;

    static stateVariableToEvaluateAfterReplacements =
        "readyToExpandWhenResolved";

    static returnChildGroups() {
        return [
            {
                group: "cases",
                componentTypes: ["case"],
            },
        ];
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.numCases = {
            additionalStateVariablesDefined: ["caseChildren"],
            returnDependencies: () => ({
                caseChildren: {
                    dependencyType: "child",
                    childGroups: ["cases"],
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        caseChildren: dependencyValues.caseChildren,
                        numCases: dependencyValues.caseChildren.length,
                    },
                };
            },
        };

        stateVariableDefinitions.selectedIndex = {
            returnDependencies: () => ({
                caseChildren: {
                    dependencyType: "child",
                    childGroups: ["cases"],
                    variableNames: ["conditionSatisfied"],
                },
            }),
            definition({ dependencyValues }) {
                let selectedIndex = null;
                for (let [
                    ind,
                    child,
                ] of dependencyValues.caseChildren.entries()) {
                    if (child.stateValues.conditionSatisfied) {
                        selectedIndex = ind;
                        break;
                    }
                }

                return {
                    setValue: {
                        selectedIndex,
                    },
                };
            },
        };

        stateVariableDefinitions.readyToExpandWhenResolved = {
            returnDependencies: () => ({
                selectedIndex: {
                    dependencyType: "stateVariable",
                    variableName: "selectedIndex",
                },
            }),
            markStale: () => ({ updateReplacements: true }),
            definition() {
                return {
                    setValue: { readyToExpandWhenResolved: true },
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

    static async createSerializedReplacements({
        component,
        components,
        workspace,
        nComponents,
    }) {
        let replacementResults = await this.getReplacements(
            component,
            components,
            nComponents,
        );

        workspace.previousSelectedIndex =
            await component.stateValues.selectedIndex;

        // console.log(`replacements for ${component.componentIdx}`);
        // console.log(JSON.parse(JSON.stringify(replacementResults)));
        // console.log(replacements);

        return replacementResults;
    }

    static async getReplacements(component, components, nComponents) {
        let errors = [];
        let warnings = [];

        let replacements = [];

        let caseChildren = await component.stateValues.caseChildren;

        let selectedIndex = await component.stateValues.selectedIndex;

        if (selectedIndex !== null) {
            const selectedChildComponentIdx =
                caseChildren[selectedIndex].componentIdx;

            // use state, not stateValues, as read only proxy messes up internal
            // links between descendant variant components and the components themselves

            let serializedGrandchildren = deepClone(
                await components[selectedChildComponentIdx].state
                    .serializedChildren.value,
            );
            let serializedChild = {
                type: "serialized",
                componentType: "case",
                componentIdx: nComponents++,
                state: { rendered: true },
                attributes: {},
                doenetAttributes: Object.assign(
                    {},
                    components[selectedChildComponentIdx].doenetAttributes,
                ),
                children: serializedGrandchildren,
                variants: {
                    desiredVariant: {
                        seed:
                            component.sharedParameters.variantSeed +
                            "|" +
                            selectedIndex.toString(),
                    },
                },
            };

            replacements.push(serializedChild);
        }

        return {
            replacements,
            errors,
            warnings,
            nComponents,
        };
    }

    static async calculateReplacementChanges({
        component,
        components,
        workspace,
        componentInfoObjects,
        nComponents,
    }) {
        // console.log(`calculate replacement changes for selectByCondition ${component.componentIdx}`)
        // console.log(workspace.previousSelectedIndex);
        // console.log(component.stateValues.selectedIndex);

        // TODO: don't yet have a way to return errors and warnings!
        let errors = [];
        let warnings = [];

        let selectedIndex = await component.stateValues.selectedIndex;

        if (workspace.previousSelectedIndex === selectedIndex) {
            return { replacementChanges: [], nComponents };
        }

        // delete previous replacements and create new ones
        // TODO: could we find a way to withhold old ones?
        // Either change order of replacements or allow to withhold later replacements

        let replacementChanges = [];

        let replacementResults = await this.getReplacements(
            component,
            components,
            componentInfoObjects,
            nComponents,
        );
        errors.push(...replacementResults.errors);
        warnings.push(...replacementResults.warnings);
        nComponents = replacementResults.nComponents;

        let replacementInstruction = {
            changeType: "add",
            changeTopLevelReplacements: true,
            firstReplacementInd: 0,
            numberReplacementsToReplace: component.replacements.length,
            serializedReplacements: replacementResults.replacements,
            replacementsToWithhold: 0,
        };

        replacementChanges.push(replacementInstruction);

        workspace.previousSelectedIndex = selectedIndex;

        return { replacementChanges, nComponents };
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

        if (this.serializedChildren) {
            let additionalRendererTypes =
                this.potentialRendererTypesFromSerializedComponents(
                    this.serializedChildren,
                );
            for (let rendererType of additionalRendererTypes) {
                if (!allPotentialRendererTypes.includes(rendererType)) {
                    allPotentialRendererTypes.push(rendererType);
                }
            }
        }

        return allPotentialRendererTypes;
    }
}
