import CompositeComponent from "./abstract/CompositeComponent";
import { postProcessCopy } from "../utils/copy";
import { enumerateCombinations, enumeratePermutations } from "@doenet/utils";
import { setUpVariantSeedAndRng } from "../utils/variants";
import { returnGroupIntoComponentTypeSeparatedBySpacesOutsideParens } from "./commonsugar/lists";
import { createNewComponentIndices } from "../utils/componentIndices";

export default class Shuffle extends CompositeComponent {
    static componentType = "shuffle";

    static allowInSchemaAsComponent = ["_inline", "_block", "_graphical"];

    static createsVariants = true;

    static stateVariableToEvaluateAfterReplacements =
        "readyToExpandWhenResolved";

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        attributes.type = {
            createPrimitiveOfType: "string",
        };

        attributes.asList = {
            createPrimitiveOfType: "boolean",
            createStateVariable: "asList",
            defaultValue: true,
        };

        return attributes;
    }

    static returnSugarInstructions() {
        let sugarInstructions = super.returnSugarInstructions();

        function breakStringsMacrosIntoTypeBySpaces({
            matchedChildren,
            componentAttributes,
            componentInfoObjects,
            nComponents,
        }) {
            // only if all children are strings or macros
            if (
                !matchedChildren.every(
                    (child) =>
                        typeof child === "string" ||
                        (child.extending && "Ref" in child.extending),
                )
            ) {
                return { success: false };
            }

            let type;
            if (componentAttributes.type?.value) {
                type = componentAttributes.type.value;
            } else {
                return { success: false };
            }

            if (!["math", "text", "number", "boolean"].includes(type)) {
                console.warn(`Invalid type ${type}`);
                return { success: false };
            }

            // break any string by white space and wrap pieces with type
            let groupIntoComponentTypesSeparatedBySpaces =
                returnGroupIntoComponentTypeSeparatedBySpacesOutsideParens({
                    componentType: type,
                    forceComponentType: true,
                });
            let result = groupIntoComponentTypesSeparatedBySpaces({
                matchedChildren,
                componentInfoObjects,
                nComponents,
            });

            if (result.success) {
                let newChildren = result.newChildren;

                return {
                    success: true,
                    newChildren,
                    nComponents: result.nComponents,
                };
            } else {
                return { success: false };
            }
        }

        sugarInstructions.push({
            replacementFunction: breakStringsMacrosIntoTypeBySpaces,
        });

        return sugarInstructions;
    }

    static returnChildGroups() {
        return [
            {
                group: "anything",
                componentTypes: ["_base"],
            },
        ];
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.originalComponentIndices = {
            additionalStateVariablesDefined: ["numComponents"],
            returnDependencies: () => ({
                children: {
                    dependencyType: "child",
                    childGroups: ["anything"],
                    variableNames: ["componentIndicesInList"],
                    variablesOptional: true,
                },
            }),
            definition({ dependencyValues }) {
                let originalComponentIndices = [];
                for (let child of dependencyValues.children) {
                    if (child.stateValues?.componentIndicesInList) {
                        originalComponentIndices.push(
                            ...child.stateValues.componentIndicesInList,
                        );
                    } else {
                        originalComponentIndices.push(child.componentIdx);
                    }
                }

                return {
                    setValue: {
                        originalComponentIndices,
                        numComponents: originalComponentIndices.length,
                    },
                };
            },
        };

        stateVariableDefinitions.componentOrder = {
            returnDependencies({ sharedParameters }) {
                let dependencies = {
                    variantSeed: {
                        dependencyType: "value",
                        value: sharedParameters.variantSeed,
                    },
                    rngClass: {
                        dependencyType: "value",
                        value: sharedParameters.rngClass,
                        doNotProxy: true,
                    },
                    numComponents: {
                        dependencyType: "stateVariable",
                        variableName: "numComponents",
                    },
                    variants: {
                        dependencyType: "variants",
                    },
                };
                return dependencies;
            },
            definition({ dependencyValues }) {
                let warnings = [];

                let numComponents = dependencyValues.numComponents;

                // if desiredIndices is specfied, use those
                let desiredComponentOrder =
                    dependencyValues.variants?.desiredVariant?.indices;
                if (desiredComponentOrder !== undefined) {
                    if (desiredComponentOrder.length !== numComponents) {
                        warnings.push({
                            message:
                                "Ignoring indices specified for shuffle as number of indices doesn't match number of components.",
                            level: 2,
                        });
                    } else {
                        desiredComponentOrder =
                            desiredComponentOrder.map(Number);
                        if (!desiredComponentOrder.every(Number.isInteger)) {
                            throw Error(
                                "All indices specified for shuffle must be integers",
                            );
                        }
                        if (
                            !desiredComponentOrder.every(
                                (x) => x >= 1 && x <= numComponents,
                            )
                        ) {
                            warnings.push({
                                message:
                                    "Ignoring indices specified for shuffle as some indices out of range.",
                                level: 2,
                            });
                        } else {
                            return {
                                setValue: {
                                    componentOrder: desiredComponentOrder,
                                },
                            };
                        }
                    }
                }

                let variantRng = dependencyValues.rngClass(
                    dependencyValues.variantSeed + "co",
                );

                // https://stackoverflow.com/a/12646864
                let componentOrder = [...Array(numComponents).keys()].map(
                    (x) => x + 1,
                );
                for (let i = numComponents - 1; i > 0; i--) {
                    const rand = variantRng();
                    const j = Math.floor(rand * (i + 1));
                    [componentOrder[i], componentOrder[j]] = [
                        componentOrder[j],
                        componentOrder[i],
                    ];
                }

                return {
                    setValue: {
                        componentOrder,
                    },
                    sendWarnings: warnings,
                };
            },
        };

        stateVariableDefinitions.readyToExpandWhenResolved = {
            returnDependencies: () => ({
                sortedValues: {
                    dependencyType: "stateVariable",
                    variableName: "componentOrder",
                },
            }),
            markStale: () => ({ updateReplacements: true }),
            definition: function () {
                return { setValue: { readyToExpandWhenResolved: true } };
            },
        };

        stateVariableDefinitions.generatedVariantInfo = {
            additionalStateVariablesDefined: ["isVariantComponent"],
            returnDependencies: ({
                componentInfoObjects,
                sharedParameters,
            }) => ({
                variantSeed: {
                    dependencyType: "value",
                    value: sharedParameters.variantSeed,
                },
                componentOrder: {
                    dependencyType: "stateVariable",
                    variableName: "componentOrder",
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
                    meta: { createdBy: componentIdx },
                    indices: dependencyValues.componentOrder,
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
                        isVariantComponent: true,
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
    }

    static async createSerializedReplacements({
        component,
        components,
        componentInfoObjects,
        workspace,
        nComponents,
    }) {
        let errors = [];
        let warnings = [];

        let replacements = [];

        let componentsCopied = [];

        let originalComponentIndices =
            await component.stateValues.originalComponentIndices;

        for (let ind of await component.stateValues.componentOrder) {
            let replacementSource =
                components[originalComponentIndices[ind - 1]];

            if (replacementSource) {
                componentsCopied.push(replacementSource.componentIdx);

                const serializedComponent = await replacementSource.serialize();

                const res = createNewComponentIndices(
                    [serializedComponent],
                    nComponents,
                );
                nComponents = res.nComponents;

                replacements.push(...res.components);
            }
        }

        replacements = postProcessCopy({
            serializedComponents: replacements,
            componentIdx: component.componentIdx,
            addShadowDependencies: true,
            markAsPrimaryShadow: true,
        });

        workspace.componentsCopied = componentsCopied;

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
        componentInfoObjects,
        workspace,
        nComponents,
    }) {
        // TODO: don't yet have a way to return errors and warnings!
        let errors = [];
        let warnings = [];

        let componentsToCopy = [];

        let originalComponentIndices =
            await component.stateValues.originalComponentIndices;

        for (let ind of await component.stateValues.componentOrder) {
            let replacementSource =
                components[originalComponentIndices[ind - 1]];

            if (replacementSource) {
                componentsToCopy.push(replacementSource.componentIdx);
            }
        }

        if (
            componentsToCopy.length == workspace.componentsCopied.length &&
            workspace.componentsCopied.every(
                (x, i) => x === componentsToCopy[i],
            )
        ) {
            return { replacementChanges: [], nComponents };
        }

        // for now, just recreate
        let replacementResults = await this.createSerializedReplacements({
            component,
            components,
            componentInfoObjects,
            workspace,
            nComponents,
        });

        let replacements = replacementResults.replacements;
        errors.push(...replacementResults.errors);
        warnings.push(...replacementResults.warnings);
        nComponents = replacements.nComponents;

        let replacementChanges = [
            {
                changeType: "add",
                changeTopLevelReplacements: true,
                firstReplacementInd: 0,
                numberReplacementsToReplace: component.replacements.length,
                serializedReplacements: replacements,
            },
        ];

        return { replacementChanges, nComponents };
    }

    static determineNumberOfUniqueVariants({
        serializedComponent,
        componentInfoObjects,
    }) {
        let numComponents = 0;

        for (let child of serializedComponent.children) {
            if (
                componentInfoObjects.isInheritedComponentType({
                    inheritedComponentType: child.componentType,
                    baseComponentType: "_composite",
                })
            ) {
                if (child.attributes.createComponentOfType?.primitive) {
                    if (
                        child.attributes.numComponents?.primitive !== undefined
                    ) {
                        let newComponents = Number(
                            child.attributes.numComponents?.primitive.value,
                        );
                        if (
                            Number.isInteger(newComponents) &&
                            newComponents >= 0
                        ) {
                            numComponents += newComponents;
                        } else {
                            return { success: false };
                        }
                    } else {
                        numComponents++;
                    }
                } else {
                    return { success: false };
                }
            } else {
                numComponents++;
            }
        }

        let numberOfPermutations = 1;
        for (let i = 2; i <= numComponents; i++) {
            numberOfPermutations *= i;
        }

        let result = super.determineNumberOfUniqueVariants({
            serializedComponent,
            componentInfoObjects,
        });

        if (!result.success) {
            return { success: false };
        }

        let numVariants = result.numVariants * numberOfPermutations;

        if (!(numVariants > 0)) {
            return { success: false };
        }

        // adjust variants info added by call to super
        serializedComponent.variants.numVariants = numVariants;
        serializedComponent.variants.uniqueVariantData = {
            numVariantsByDescendant:
                serializedComponent.variants.uniqueVariantData
                    .numVariantsByDescendant,
            numberOfPermutations,
            numComponents,
        };

        return { success: true, numVariants };
    }

    static getUniqueVariant({
        serializedComponent,
        variantIndex,
        componentInfoObjects,
    }) {
        let numVariants = serializedComponent.variants?.numVariants;
        if (numVariants === undefined) {
            return { success: false };
        }

        if (
            !Number.isInteger(variantIndex) ||
            variantIndex < 1 ||
            variantIndex > numVariants
        ) {
            return { success: false };
        }

        let numVariantsByDescendant =
            serializedComponent.variants.uniqueVariantData
                .numVariantsByDescendant;
        let descendantVariantComponents =
            serializedComponent.variants.descendantVariantComponents;
        let numberOfPermutations =
            serializedComponent.variants.uniqueVariantData.numberOfPermutations;
        let numComponents =
            serializedComponent.variants.uniqueVariantData.numComponents;

        // treat permutations as another descendant variant component
        let numbersOfOptions = [...numVariantsByDescendant];
        numbersOfOptions.push(numberOfPermutations);

        let indicesForEachOption = enumerateCombinations({
            numberOfOptionsByIndex: numbersOfOptions,
            maxNumber: variantIndex,
        })[variantIndex - 1].map((x) => x + 1);

        let permutationsIndex = indicesForEachOption.pop();

        let indicesForEachDescendant = indicesForEachOption;

        // choice a permutation based on permutations index
        let indicesToPermute = [...Array(numComponents).keys()].map(
            (x) => x + 1,
        );

        let permutedIndices = enumeratePermutations({
            values: indicesToPermute,
            maxNumber: permutationsIndex,
        })[permutationsIndex - 1];

        // for each descendant, get unique variant corresponding
        // to the selected variant number and include that as a subvariant

        let haveNontrivialSubvariants = false;
        let subvariants = [];

        for (
            let descendantNum = 0;
            descendantNum < numVariantsByDescendant.length;
            descendantNum++
        ) {
            if (numVariantsByDescendant[descendantNum] > 1) {
                let descendant = descendantVariantComponents[descendantNum];
                let compClass =
                    componentInfoObjects.allComponentClasses[
                        descendant.componentType
                    ];
                let result = compClass.getUniqueVariant({
                    serializedComponent: descendant,
                    variantIndex: indicesForEachDescendant[descendantNum],
                    componentInfoObjects,
                });
                if (!result.success) {
                    return { success: false };
                }
                subvariants.push(result.desiredVariant);
                haveNontrivialSubvariants = true;
            } else {
                subvariants.push({});
            }
        }

        let desiredVariant = { indices: permutedIndices };
        if (haveNontrivialSubvariants) {
            desiredVariant.subvariants = subvariants;
        }

        return { success: true, desiredVariant };
    }
}
