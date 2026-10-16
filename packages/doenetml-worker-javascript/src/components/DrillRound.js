import CompositeComponent from "./abstract/CompositeComponent";
import { deepClone } from "@doenet/utils";
import {
    gatherVariantComponents,
    setUpVariantSeedAndRng,
} from "../utils/variants";
import { createNewComponentIndices } from "../utils/componentIndices";

/**
 * The question template of a `<drill>` (all of the drill's children, wrapped
 * here by the parser), holding exactly one live copy of it at a time.
 *
 * The copy is remade whenever the drill's `roundKey` changes, inside a group
 * seeded with `baseSeed|roundKey`, so every `<select>`, `<selectFromSequence>`
 * and `shuffleOrder` in it chooses afresh each round, the same way for the
 * same variant and round. The old copy is replaced rather than hidden, so the
 * number of components, and the saved state, stay the same however many
 * rounds are played. The saved-state ids of a copy are prefixed with its
 * round, so a reload rebuilds the current round with the student's work in it.
 */
export default class DrillRound extends CompositeComponent {
    static componentType = "_drillRound";

    static componentDocs = {
        summary:
            "Internal: holds the question template of a drill and one live copy of it",
    };

    static excludeFromSchema = true;

    static createsVariants = true;

    static includeBlankStringChildren = true;

    static stateVariableToEvaluateAfterReplacements =
        "readyToExpandWhenResolved";

    static keepChildrenSerialized({ serializedComponent }) {
        if (serializedComponent.children === undefined) {
            return [];
        }
        return Object.keys(serializedComponent.children);
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
            definition: ({ dependencyValues }) => ({
                setValue: {
                    serializedChildren: dependencyValues.serializedChildren,
                },
            }),
        };

        stateVariableDefinitions.baseSeed = {
            returnDependencies: ({ sharedParameters }) => ({
                variantSeed: {
                    dependencyType: "value",
                    value: sharedParameters.variantSeed,
                },
            }),
            definition: ({ dependencyValues }) => ({
                setValue: { baseSeed: dependencyValues.variantSeed },
            }),
        };

        // `null` until the drill is first started, so no question exists
        // (and none can be inspected) before then.
        stateVariableDefinitions.roundKey = {
            returnDependencies: () => ({
                roundKey: {
                    dependencyType: "parentStateVariable",
                    variableName: "roundKey",
                },
            }),
            definition: ({ dependencyValues }) => ({
                setValue: { roundKey: dependencyValues.roundKey ?? null },
            }),
        };

        stateVariableDefinitions.readyToExpandWhenResolved = {
            returnDependencies: () => ({
                roundKey: {
                    dependencyType: "stateVariable",
                    variableName: "roundKey",
                },
            }),
            // when this state variable is marked stale
            // it indicates we should update replacement
            // For this to work, must get value in replacement functions
            // so that the variable is marked fresh
            markStale: () => ({ updateReplacements: true }),
            definition: () => ({
                setValue: { readyToExpandWhenResolved: true },
            }),
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
                return {
                    setValue: {
                        generatedVariantInfo: {
                            seed: dependencyValues.variantSeed,
                            meta: { createdBy: componentIdx },
                            subvariants: [],
                        },
                    },
                };
            },
        };

        return stateVariableDefinitions;
    }

    static async createSerializedReplacements({
        component,
        nComponents,
        workspace,
    }) {
        await component.stateValues.readyToExpandWhenResolved;
        const roundKey = await component.stateValues.roundKey;
        workspace.roundKey = roundKey;

        if (roundKey === null) {
            return { replacements: [], diagnostics: [], nComponents };
        }

        return await this.replacementForRound({
            component,
            roundKey,
            nComponents,
        });
    }

    static async replacementForRound({ component, roundKey, nComponents }) {
        const baseSeed = await component.stateValues.baseSeed;

        const replacements = [
            {
                type: "serialized",
                componentType: "group",
                componentIdx: 0, // will be replaced, below
                attributes: {},
                doenetAttributes: {},
                state: {},
                variants: {
                    desiredVariant: { seed: `${baseSeed}|${roundKey}` },
                },
                children: deepClone(
                    await component.stateValues.serializedChildren,
                ),
            },
        ];

        const idxResult = createNewComponentIndices(replacements, nComponents, {
            prefix: `${component.stateId}|${roundKey}|`,
            num: 0,
        });

        return {
            replacements: idxResult.components,
            diagnostics: [],
            nComponents: idxResult.nComponents,
        };
    }

    static async calculateReplacementChanges({
        component,
        nComponents,
        workspace,
    }) {
        await component.stateValues.readyToExpandWhenResolved;
        const roundKey = await component.stateValues.roundKey;

        if (roundKey === workspace.roundKey) {
            return { replacementChanges: [], diagnostics: [], nComponents };
        }
        workspace.roundKey = roundKey;

        let serializedReplacements = [];
        if (roundKey !== null) {
            const result = await this.replacementForRound({
                component,
                roundKey,
                nComponents,
            });
            serializedReplacements = result.replacements;
            nComponents = result.nComponents;
        }

        return {
            replacementChanges: [
                {
                    changeType: "add",
                    changeTopLevelReplacements: true,
                    firstReplacementInd: 0,
                    numberReplacementsToReplace: component.replacements.length,
                    serializedReplacements,
                    replacementsToWithhold: 0,
                },
            ],
            diagnostics: [],
            nComponents,
        };
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

    /**
     * Like a `<repeat>`'s: a template with no randomness in it is a single
     * variant; one with randomness has no fixed number of variants, since it
     * is played afresh each round.
     */
    static determineNumberOfUniqueVariants({
        serializedComponent,
        componentInfoObjects,
        infoDiagnostics,
    }) {
        let numVariants = serializedComponent.variants?.numVariants;

        if (numVariants !== undefined) {
            return { success: true, numVariants };
        }

        const descendantVariantComponents = gatherVariantComponents({
            serializedComponents: serializedComponent.children,
            componentInfoObjects,
        });

        for (const descendant of descendantVariantComponents) {
            const descendantClass =
                componentInfoObjects.allComponentClasses[
                    descendant.componentType
                ];
            const result = descendantClass.determineNumberOfUniqueVariants({
                serializedComponent: descendant,
                componentInfoObjects,
                infoDiagnostics,
            });
            if (!result.success || result.numVariants !== 1) {
                return { success: false };
            }
        }

        if (!serializedComponent.variants) {
            serializedComponent.variants = {};
        }
        serializedComponent.variants.numVariants = 1;
        return { success: true, numVariants: 1 };
    }

    static getUniqueVariant({ serializedComponent, variantIndex }) {
        if (serializedComponent.variants?.numVariants !== 1) {
            return { success: false };
        }
        if (variantIndex !== 1) {
            return { success: false };
        }
        return { success: true, desiredVariant: { index: 1 } };
    }

    addOwnPotentialRendererTypes(rendererTypes, visited) {
        super.addOwnPotentialRendererTypes(rendererTypes, visited);

        this.addPotentialRendererTypesFromSerializedChildren(rendererTypes);
    }
}
