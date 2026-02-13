import CompositeComponent from "./abstract/CompositeComponent";
import { deepClone } from "@doenet/utils";
import { setUpVariantSeedAndRng } from "../utils/variants";
export default class ConditionalContent extends CompositeComponent {
    static componentType = "conditionalContent";

    static allowInSchemaAnywhere = true;

    static createsVariants = true;

    static stateVariableToEvaluateAfterReplacements =
        "readyToExpandWhenResolved";

    static createAttributesObject() {
        let attributes = super.createAttributesObject();
        // the `condition` attribute is not actually used on conditionalContent,
        // but we include it here so it shows up in the schema.
        // If the conditionalContent does not have any case/else children,
        // then its condition attribute will be moved via sugar to a case child.
        attributes.condition = {
            createComponentOfType: "boolean",
        };

        return attributes;
    }

    // conditionalContent can be authored with any children.
    // Case children will be sugared in so they are the only child group.
    // We need to allow for any children in the schema.
    static additionalSchemaChildren = ["_base", "else"];

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

        stateVariableDefinitions.warnIfCondition = {
            returnDependencies: () => ({
                conditionAttribute: {
                    dependencyType: "attributeComponent",
                    attributeName: "condition",
                },
            }),
            definition({ dependencyValues }) {
                const warnings = [];
                if (dependencyValues.conditionAttribute) {
                    // If the condition attribute was not moved to a case child via sugar,
                    // then warn that it is not used on conditionalContent

                    warnings.push({
                        message:
                            "Attribute `condition` is ignored on a <conditionalContent> component with case or else children.",
                        level: 1,
                    });
                }

                return {
                    sendWarnings: warnings,
                    setValue: { warnIfCondition: null },
                };
            },
        };

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
                warnIfCondition: {
                    dependencyType: "stateVariable",
                    variableName: "warnIfCondition",
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
        );

        workspace.previousSelectedIndex =
            await component.stateValues.selectedIndex;

        // console.log(`replacements for ${component.componentIdx}`);
        // console.log(JSON.parse(JSON.stringify(replacementResults)));
        // console.log(replacements);

        return { ...replacementResults, nComponents };
    }

    static async getReplacements(component, components) {
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

            // the child of each case is a group wrapping the actual content
            let serializedChild = deepClone(
                (
                    await components[selectedChildComponentIdx].state
                        .serializedChildren.value
                )[0],
            );
            serializedChild.doenetAttributes = Object.assign(
                {},
                components[selectedChildComponentIdx].doenetAttributes,
            );
            serializedChild.variants = {
                desiredVariant: {
                    seed:
                        component.sharedParameters.variantSeed +
                        "|" +
                        selectedIndex.toString(),
                },
            };

            replacements.push(serializedChild);
        }

        return {
            replacements,
            errors,
            warnings,
        };
    }

    static async calculateReplacementChanges({
        component,
        components,
        workspace,
        nComponents,
    }) {
        // console.log(`calculate replacement changes for selectByCondition ${component.componentIdx}`)
        // console.log(workspace.previousSelectedIndex);
        // console.log(component.stateValues.selectedIndex);

        // TODO: don't yet have a way to return errors and warnings!
        const errors = [];
        const warnings = [];

        const selectedIndex = await component.stateValues.selectedIndex;

        if (workspace.previousSelectedIndex === selectedIndex) {
            return { replacementChanges: [], nComponents };
        }

        const numCases = await component.stateValues.numCases;

        if (numCases === 1) {
            // If we have just one case child and we already created the replacements before,
            // then we can just withhold all replacements (if one case is not selected)
            // or stop withholding replacements (if one case is selected) for efficiency

            if (selectedIndex === null) {
                // the one case is not selected, so withhold all replacements
                const replacementInstruction = {
                    changeType: "changeReplacementsToWithhold",
                    replacementsToWithhold: component.replacements.length,
                };

                workspace.previousSelectedIndex = selectedIndex;

                return {
                    replacementChanges: [replacementInstruction],
                    nComponents,
                };
            } else {
                const caseChildren = await component.stateValues.caseChildren;
                const selectedChildComponentIdx =
                    caseChildren[selectedIndex].componentIdx;
                const numSerializedGrandchildren = (
                    await components[selectedChildComponentIdx].stateValues
                        .serializedChildren
                ).length;

                if (
                    numSerializedGrandchildren === component.replacements.length
                ) {
                    // The one case is selected and we have created the replacements before,
                    // so just stop withholding the replacements
                    const replacementInstruction = {
                        changeType: "changeReplacementsToWithhold",
                        replacementsToWithhold: 0,
                    };

                    workspace.previousSelectedIndex = selectedIndex;

                    return {
                        replacementChanges: [replacementInstruction],
                        nComponents,
                    };
                }
            }
        }

        // delete previous replacements and create new ones
        // TODO: could we find a way to withhold old ones?
        // Either change order of replacements or allow to withhold later replacements

        const replacementChanges = [];

        const replacementResults = await this.getReplacements(
            component,
            components,
        );
        errors.push(...replacementResults.errors);
        warnings.push(...replacementResults.warnings);

        const replacementInstruction = {
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
