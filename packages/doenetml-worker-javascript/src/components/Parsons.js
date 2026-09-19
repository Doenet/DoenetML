import BlockScoredComponent from "./abstract/BlockScoredComponent";
import { enumerateCombinations, enumeratePermutations } from "@doenet/utils";
import { setUpVariantSeedAndRng } from "../utils/variants";
import { codedDiagnostic } from "../utils/diagnostics";
import {
    returnLabelAttributes,
    returnLabelStateVariableDefinitions,
} from "../utils/label";
import { returnLocalizedDefaultStateVariableDefinition } from "../utils/contentLocale";

/**
 * Compute the credit for an arrangement of blocks.
 *
 * `solutionIndices` are the 1-based authored indices of the blocks the reader
 * placed in the solution area, top to bottom; `correctOrder` are the authored
 * indices of the non-distractor blocks in document order. Full credit requires
 * the two to agree exactly, which also means every distractor was left
 * unused. Anything else earns no credit: grading is all-or-nothing.
 */
export function calculateParsonsCredit({ solutionIndices, correctOrder }) {
    if (solutionIndices.length !== correctOrder.length) {
        return 0;
    }
    return solutionIndices.every((v, i) => v === correctOrder[i]) ? 1 : 0;
}

export default class Parsons extends BlockScoredComponent {
    constructor(args) {
        super(args);

        Object.assign(this.actions, {
            recordVisibilityChange: this.recordVisibilityChange.bind(this),
            submitAnswer: this.submitAnswer.bind(this),
            moveBlock: this.moveBlock.bind(this),
        });
    }

    static componentType = "parsons";

    static componentDocs = {
        summary:
            "A Parsons problem: the reader arranges the correct blocks in order into a solution area and leaves the distractors unused",
    };
    static renderChildren = true;

    static createsVariants = true;

    static createAttributesObject() {
        const attributes = super.createAttributesObject();

        Object.assign(attributes, returnLabelAttributes());

        attributes.shuffleOrder = {
            createPrimitiveOfType: "boolean",
            createStateVariable: "shuffleOrder",
            defaultValue: true,
            public: true,
            description:
                "Whether the unused blocks are displayed in an order randomized per variant.",
        };

        // The two area headings land on `…PreLocalize` state variables and are
        // re-taken below, where an unspecified attribute is replaced by the
        // default in the document's language. The English `defaultValue`s here
        // are what authors see in the schema; they are never read.
        attributes.solutionLabel = {
            createComponentOfType: "text",
            createStateVariable: "solutionLabelPreLocalize",
            defaultValue: "Solution",
            description:
                "Heading of the area where the reader builds the solution.",
        };
        attributes.unusedLabel = {
            createComponentOfType: "text",
            createStateVariable: "unusedLabelPreLocalize",
            defaultValue: "Unused blocks",
            description:
                "Heading of the area holding the blocks not used in the solution.",
        };

        return attributes;
    }

    static returnChildGroups() {
        return [
            {
                group: "labels",
                componentTypes: ["label"],
            },
            {
                group: "shortDescriptions",
                componentTypes: ["shortDescription"],
            },
            {
                group: "descriptions",
                componentTypes: ["description"],
            },
            {
                group: "statements",
                componentTypes: ["statement"],
            },
            {
                group: "blocks",
                componentTypes: ["block"],
            },
        ];
    }

    static returnStateVariableDefinitions() {
        const stateVariableDefinitions = super.returnStateVariableDefinitions();

        Object.assign(
            stateVariableDefinitions,
            returnLabelStateVariableDefinitions(),
        );

        Object.assign(stateVariableDefinitions, {
            solutionLabel: returnLocalizedDefaultStateVariableDefinition({
                name: "solutionLabel",
                translatedDefault: (t) => t("parsons-solution-label"),
                description:
                    "Heading of the area where the reader builds the solution.",
            }),
            unusedLabel: returnLocalizedDefaultStateVariableDefinition({
                name: "unusedLabel",
                translatedDefault: (t) => t("parsons-unused-label"),
                description:
                    "Heading of the area holding the blocks not used in the solution.",
            }),
        });

        stateVariableDefinitions.shortDescription = {
            description:
                "A short accessibility description of this component; it is read by screen readers but not rendered visually.",
            forRenderer: true,
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            returnDependencies: () => ({
                shortDescriptionChild: {
                    dependencyType: "child",
                    childGroups: ["shortDescriptions"],
                    variableNames: ["text"],
                },
                label: {
                    dependencyType: "stateVariable",
                    variableName: "label",
                },
            }),
            definition({ dependencyValues }) {
                let shortDescription = "";
                const diagnostics = [];

                if (dependencyValues.shortDescriptionChild.length > 0) {
                    const shortDescriptionChild =
                        dependencyValues.shortDescriptionChild[
                            dependencyValues.shortDescriptionChild.length - 1
                        ];
                    shortDescription =
                        shortDescriptionChild.stateValues.text.trim();
                }

                // The reader operates real controls here, so unlike an
                // `<answer>` that only checks a condition, a parsons must be
                // named for a screen reader.
                if (shortDescription === "" && !dependencyValues.label) {
                    diagnostics.push(
                        codedDiagnostic({
                            type: "accessibility",
                            level: 1,
                            code: "doenet-a0003",
                            args: { component: "parsons" },
                        }),
                    );
                }

                return {
                    setValue: { shortDescription },
                    sendDiagnostics: diagnostics,
                };
            },
        };

        stateVariableDefinitions.descriptionChildInd = {
            forRenderer: true,
            returnDependencies: () => ({
                allChildren: {
                    dependencyType: "child",
                    includeAllChildren: true,
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        descriptionChildInd:
                            dependencyValues.allChildren.findLastIndex(
                                (child) =>
                                    child.componentType === "description",
                            ),
                    },
                };
            },
        };

        stateVariableDefinitions.statementChildInd = {
            forRenderer: true,
            returnDependencies: () => ({
                allChildren: {
                    dependencyType: "child",
                    includeAllChildren: true,
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        statementChildInd:
                            dependencyValues.allChildren.findLastIndex(
                                (child) => child.componentType === "statement",
                            ),
                    },
                };
            },
        };

        stateVariableDefinitions.blockChildIndices = {
            forRenderer: true,
            returnDependencies: () => ({
                allChildren: {
                    dependencyType: "child",
                    includeAllChildren: true,
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        blockChildIndices: dependencyValues.allChildren
                            .map((child, ind) =>
                                child.componentType === "block" ? ind : -1,
                            )
                            .filter((ind) => ind !== -1),
                    },
                };
            },
        };

        stateVariableDefinitions.childIndicesToRender = {
            returnDependencies: () => ({
                statementChildInd: {
                    dependencyType: "stateVariable",
                    variableName: "statementChildInd",
                },
                blockChildIndices: {
                    dependencyType: "stateVariable",
                    variableName: "blockChildIndices",
                },
                descriptionChildInd: {
                    dependencyType: "stateVariable",
                    variableName: "descriptionChildInd",
                },
            }),
            definition({ dependencyValues }) {
                const childIndicesToRender = [];

                if (dependencyValues.statementChildInd !== -1) {
                    childIndicesToRender.push(
                        dependencyValues.statementChildInd,
                    );
                }
                childIndicesToRender.push(
                    ...dependencyValues.blockChildIndices,
                );
                if (dependencyValues.descriptionChildInd !== -1) {
                    childIndicesToRender.push(
                        dependencyValues.descriptionChildInd,
                    );
                }

                return { setValue: { childIndicesToRender } };
            },
            markStale: () => ({ updateRenderedChildren: true }),
        };

        stateVariableDefinitions.numBlocks = {
            description: "The number of `<block>` children.",
            public: true,
            forRenderer: true,
            shadowingInstructions: {
                createComponentOfType: "integer",
            },
            returnDependencies: () => ({
                blockChildren: {
                    dependencyType: "child",
                    childGroups: ["blocks"],
                },
            }),
            definition({ dependencyValues }) {
                const numBlocks = dependencyValues.blockChildren.length;

                // Reported here rather than from `correctOrder`, because a
                // renderer-facing variable is evaluated as soon as the
                // document loads, so the author sees the warning at once.
                const diagnostics = [];
                if (numBlocks === 0) {
                    diagnostics.push(
                        codedDiagnostic({
                            type: "warning",
                            code: "doenet-w0164",
                        }),
                    );
                }

                return {
                    setValue: { numBlocks },
                    sendDiagnostics: diagnostics,
                };
            },
        };

        stateVariableDefinitions.numDistractors = {
            description:
                "The number of `<block>` children marked as distractors.",
            public: true,
            forRenderer: true,
            shadowingInstructions: {
                createComponentOfType: "integer",
            },
            returnDependencies: () => ({
                blockChildren: {
                    dependencyType: "child",
                    childGroups: ["blocks"],
                    variableNames: ["isDistractor"],
                },
            }),
            definition({ dependencyValues }) {
                const numBlocks = dependencyValues.blockChildren.length;
                const numDistractors = dependencyValues.blockChildren.filter(
                    (block) => block.stateValues.isDistractor,
                ).length;

                const diagnostics = [];
                if (numBlocks > 0 && numDistractors === numBlocks) {
                    diagnostics.push(
                        codedDiagnostic({
                            type: "warning",
                            code: "doenet-w0165",
                        }),
                    );
                }

                return {
                    setValue: { numDistractors },
                    sendDiagnostics: diagnostics,
                };
            },
        };

        stateVariableDefinitions.correctOrder = {
            description:
                "The indices of the non-distractor blocks in the order they were written, counting from 1, which is the arrangement that earns credit.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "numberList",
            },
            returnDependencies: () => ({
                blockChildren: {
                    dependencyType: "child",
                    childGroups: ["blocks"],
                    variableNames: ["isDistractor"],
                },
            }),
            definition({ dependencyValues }) {
                const correctOrder = [];
                dependencyValues.blockChildren.forEach((block, ind) => {
                    if (!block.stateValues.isDistractor) {
                        correctOrder.push(ind + 1);
                    }
                });

                return { setValue: { correctOrder } };
            },
        };

        stateVariableDefinitions.blockOrder = {
            description:
                "The indices of the blocks, counting from 1, in the order the unused blocks are displayed for this variant.",
            public: true,
            forRenderer: true,
            shadowVariable: true,
            shadowingInstructions: {
                createComponentOfType: "numberList",
            },
            returnDependencies: ({ sharedParameters }) => ({
                numBlocks: {
                    dependencyType: "stateVariable",
                    variableName: "numBlocks",
                },
                shuffleOrder: {
                    dependencyType: "stateVariable",
                    variableName: "shuffleOrder",
                },
                variantSeed: {
                    dependencyType: "value",
                    value: sharedParameters.variantSeed,
                },
                rngClass: {
                    dependencyType: "value",
                    value: sharedParameters.rngClass,
                    doNotProxy: true,
                },
                variants: {
                    dependencyType: "variants",
                },
            }),
            definition({ dependencyValues }) {
                const numBlocks = dependencyValues.numBlocks;
                const blockOrder = [...Array(numBlocks).keys()].map(
                    (x) => x + 1,
                );

                if (!dependencyValues.shuffleOrder) {
                    return { setValue: { blockOrder } };
                }

                const diagnostics = [];

                // if desired indices are specified, use those
                const desiredBlockOrder =
                    dependencyValues.variants?.desiredVariant?.indices;
                if (desiredBlockOrder !== undefined) {
                    if (desiredBlockOrder.length !== numBlocks) {
                        diagnostics.push(
                            codedDiagnostic({
                                type: "info",
                                code: "doenet-i0053",
                            }),
                        );
                    } else {
                        const indices = desiredBlockOrder.map(Number);
                        if (
                            !indices.every(
                                (x) =>
                                    Number.isInteger(x) &&
                                    x >= 1 &&
                                    x <= numBlocks,
                            )
                        ) {
                            diagnostics.push(
                                codedDiagnostic({
                                    type: "info",
                                    code: "doenet-i0007",
                                    args: { component: "parsons" },
                                }),
                            );
                        } else if (new Set(indices).size !== numBlocks) {
                            diagnostics.push(
                                codedDiagnostic({
                                    type: "info",
                                    code: "doenet-i0054",
                                }),
                            );
                        } else {
                            return {
                                setValue: { blockOrder: indices },
                                sendDiagnostics: diagnostics,
                            };
                        }
                    }
                }

                const variantRng = dependencyValues.rngClass(
                    dependencyValues.variantSeed + "co",
                );

                // shuffle order every time get new children
                // https://stackoverflow.com/a/12646864
                for (let i = numBlocks - 1; i > 0; i--) {
                    const rand = variantRng();
                    const j = Math.floor(rand * (i + 1));
                    [blockOrder[i], blockOrder[j]] = [
                        blockOrder[j],
                        blockOrder[i],
                    ];
                }

                return {
                    setValue: { blockOrder },
                    sendDiagnostics: diagnostics,
                };
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
                blockOrder: {
                    dependencyType: "stateVariable",
                    variableName: "blockOrder",
                },
                shuffleOrder: {
                    dependencyType: "stateVariable",
                    variableName: "shuffleOrder",
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
                const generatedVariantInfo = {
                    seed: dependencyValues.variantSeed,
                    meta: { createdBy: componentIdx },
                };

                if (dependencyValues.shuffleOrder) {
                    generatedVariantInfo.indices = dependencyValues.blockOrder;
                }

                const subvariants = (generatedVariantInfo.subvariants = []);

                for (const descendant of dependencyValues.variantDescendants) {
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

        // The reader's arrangement: the authored indices of the blocks in the
        // solution area, top to bottom. Every other block is unused. This is
        // the one piece of state the reader changes, so it is essential.
        stateVariableDefinitions.solutionIndices = {
            forRenderer: true,
            hasEssential: true,
            returnDependencies: () => ({}),
            definition: () => ({
                useEssentialOrDefaultValue: {
                    solutionIndices: {
                        get defaultValue() {
                            return [];
                        },
                    },
                },
            }),
            inverseDefinition({ desiredStateVariableValues }) {
                return {
                    success: true,
                    instructions: [
                        {
                            setEssentialValue: "solutionIndices",
                            value: [
                                ...desiredStateVariableValues.solutionIndices,
                            ],
                        },
                    ],
                };
            },
        };

        stateVariableDefinitions.unusedIndices = {
            forRenderer: true,
            returnDependencies: () => ({
                blockOrder: {
                    dependencyType: "stateVariable",
                    variableName: "blockOrder",
                },
                solutionIndices: {
                    dependencyType: "stateVariable",
                    variableName: "solutionIndices",
                },
            }),
            definition({ dependencyValues }) {
                // The pile keeps the variant's order, so a block removed from
                // the solution returns to the slot it started in.
                return {
                    setValue: {
                        unusedIndices: dependencyValues.blockOrder.filter(
                            (ind) =>
                                !dependencyValues.solutionIndices.includes(ind),
                        ),
                    },
                };
            },
        };

        stateVariableDefinitions.currentResponses = {
            description:
                "The indices of the blocks currently in the solution area, counting from 1, from top to bottom.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "integer",
            },
            isArray: true,
            entryPrefixes: ["currentResponse"],
            returnArraySizeDependencies: () => ({
                solutionIndices: {
                    dependencyType: "stateVariable",
                    variableName: "solutionIndices",
                },
            }),
            returnArraySize({ dependencyValues }) {
                return [dependencyValues.solutionIndices.length];
            },
            returnArrayDependenciesByKey() {
                return {
                    globalDependencies: {
                        solutionIndices: {
                            dependencyType: "stateVariable",
                            variableName: "solutionIndices",
                        },
                    },
                };
            },
            arrayDefinitionByKey({ globalDependencyValues, arrayKeys }) {
                const currentResponses = {};
                for (const arrayKey of arrayKeys) {
                    currentResponses[arrayKey] =
                        globalDependencyValues.solutionIndices[
                            Number(arrayKey)
                        ];
                }
                return { setValue: { currentResponses } };
            },
        };

        stateVariableDefinitions.creditAchievedIfSubmit = {
            returnDependencies: () => ({
                solutionIndices: {
                    dependencyType: "stateVariable",
                    variableName: "solutionIndices",
                },
                correctOrder: {
                    dependencyType: "stateVariable",
                    variableName: "correctOrder",
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        creditAchievedIfSubmit: calculateParsonsCredit({
                            solutionIndices: dependencyValues.solutionIndices,
                            correctOrder: dependencyValues.correctOrder,
                        }),
                    },
                };
            },
        };

        stateVariableDefinitions.numSubmittedResponses = {
            description:
                "The number of blocks in the most recently submitted solution.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "number",
            },
            hasEssential: true,
            defaultValue: 0,
            returnDependencies: () => ({}),
            definition: () => ({
                useEssentialOrDefaultValue: {
                    numSubmittedResponses: true,
                },
            }),
            inverseDefinition({ desiredStateVariableValues }) {
                return {
                    success: true,
                    instructions: [
                        {
                            setEssentialValue: "numSubmittedResponses",
                            value: desiredStateVariableValues.numSubmittedResponses,
                        },
                    ],
                };
            },
        };

        stateVariableDefinitions.submittedResponses = {
            description:
                "The indices of the blocks in the most recently submitted solution, counting from 1, from top to bottom.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "integer",
            },
            isArray: true,
            allowExtraArrayKeysInInverse: true,
            entryPrefixes: ["submittedResponse"],
            defaultValueByArrayKey: () => null,
            hasEssential: true,
            inverseShadowToSetEntireArray: true,
            doNotCombineInverseArrayInstructions: true,
            returnArraySizeDependencies: () => ({
                numSubmittedResponses: {
                    dependencyType: "stateVariable",
                    variableName: "numSubmittedResponses",
                },
            }),
            returnArraySize({ dependencyValues }) {
                return [dependencyValues.numSubmittedResponses];
            },
            returnArrayDependenciesByKey() {
                const globalDependencies = {
                    numSubmittedResponses: {
                        dependencyType: "stateVariable",
                        variableName: "numSubmittedResponses",
                    },
                };
                return { globalDependencies };
            },
            arrayDefinitionByKey({ globalDependencyValues }) {
                const essentialSubmittedResponses = {};

                for (
                    let ind = 0;
                    ind < globalDependencyValues.numSubmittedResponses;
                    ind++
                ) {
                    // this function doesn't change the values once they set for the first time
                    // (The values will just be changed using the inverse function)
                    essentialSubmittedResponses[ind] = true;
                }

                return {
                    useEssentialOrDefaultValue: {
                        submittedResponses: essentialSubmittedResponses,
                    },
                };
            },
            inverseArrayDefinitionByKey: function ({
                desiredStateVariableValues,
                initialChange,
            }) {
                if (!initialChange) {
                    return { success: false };
                }

                return {
                    success: true,
                    instructions: [
                        {
                            setDependency: "numSubmittedResponses",
                            desiredValue:
                                desiredStateVariableValues.submittedResponses
                                    .length,
                        },
                        {
                            setEssentialValue: "submittedResponses",
                            value: [
                                ...desiredStateVariableValues.submittedResponses,
                            ],
                        },
                    ],
                };
            },
        };

        stateVariableDefinitions.showCheckWork = {
            forRenderer: true,
            returnDependencies: () => ({
                suppressCheckWork: {
                    dependencyType: "stateVariable",
                    variableName: "suppressCheckWork",
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        showCheckWork: !dependencyValues.suppressCheckWork,
                    },
                };
            },
        };

        return stateVariableDefinitions;
    }

    recordVisibilityChange({ isVisible }) {
        this.coreFunctions.requestRecordEvent({
            verb: "visibilityChanged",
            object: {
                componentIdx: this.componentIdx,
                componentType: this.componentType,
            },
            result: { isVisible },
        });
    }

    /**
     * Move one block: into the solution area at `toPosition` (counting from
     * 1; appended when omitted or out of range), or back to the unused
     * blocks. One action serves the buttons, the keyboard and pointer drops.
     */
    async moveBlock({
        blockIndex,
        toArea,
        toPosition,
        actionId,
        sourceInformation = {},
        skipRendererUpdate = false,
    }) {
        if (
            (await this.stateValues.disabled) ||
            (await this.stateValues.fixed)
        ) {
            return;
        }

        const numBlocks = await this.stateValues.numBlocks;
        if (
            !Number.isInteger(blockIndex) ||
            blockIndex < 1 ||
            blockIndex > numBlocks
        ) {
            return;
        }
        if (toArea !== "solution" && toArea !== "unused") {
            return;
        }

        const solutionIndices = await this.stateValues.solutionIndices;
        const nextSolutionIndices = solutionIndices.filter(
            (ind) => ind !== blockIndex,
        );

        let position = null;
        if (toArea === "solution") {
            let pos = Number.isInteger(toPosition)
                ? toPosition - 1
                : nextSolutionIndices.length;
            pos = Math.max(0, Math.min(pos, nextSolutionIndices.length));
            nextSolutionIndices.splice(pos, 0, blockIndex);
            position = pos + 1;
        }

        const unchanged =
            nextSolutionIndices.length === solutionIndices.length &&
            nextSolutionIndices.every((ind, i) => ind === solutionIndices[i]);
        if (unchanged) {
            return;
        }

        await this.coreFunctions.performUpdate({
            updateInstructions: [
                {
                    updateType: "updateValue",
                    componentIdx: this.componentIdx,
                    stateVariable: "solutionIndices",
                    value: nextSolutionIndices,
                },
            ],
            actionId,
            sourceInformation,
            skipRendererUpdate: true,
            event: {
                verb: "moved",
                object: {
                    componentIdx: this.componentIdx,
                    componentType: this.componentType,
                },
                result: {
                    blockIndex,
                    toArea,
                    position,
                    response: nextSolutionIndices,
                },
            },
        });

        return await this.coreFunctions.triggerChainedActions({
            componentIdx: this.componentIdx,
            actionId,
            sourceInformation,
            skipRendererUpdate,
        });
    }

    async submitAnswer({
        actionId,
        sourceInformation = {},
        skipRendererUpdate = false,
    }) {
        const numAttemptsLeft = await this.stateValues.numAttemptsLeft;
        if (numAttemptsLeft < 1) {
            return;
        }

        const disabled = await this.stateValues.disabled;
        if (disabled) {
            return;
        }

        const creditAchieved = (await this.stateValues.handGraded)
            ? 0
            : await this.stateValues.creditAchievedIfSubmit;

        // request to update credit
        const instructions = [
            {
                updateType: "updateValue",
                componentIdx: this.componentIdx,
                stateVariable: "creditAchieved",
                value: creditAchieved,
            },
            {
                updateType: "updateValue",
                componentIdx: this.componentIdx,
                stateVariable: "responseHasBeenSubmitted",
                value: true,
            },
        ];

        // add submitted responses to instruction for answer
        const currentResponses = await this.stateValues.currentResponses;

        instructions.push({
            updateType: "updateValue",
            componentIdx: this.componentIdx,
            stateVariable: "submittedResponses",
            value: currentResponses,
        });

        instructions.push({
            updateType: "updateValue",
            componentIdx: this.componentIdx,
            stateVariable: "justSubmitted",
            value: true,
        });

        instructions.push({
            updateType: "updateValue",
            componentIdx: this.componentIdx,
            stateVariable: "creditAchievedDependenciesAtSubmit",
            value: await this.stateValues.creditAchievedDependencies,
        });

        instructions.push({
            updateType: "updateValue",
            componentIdx: this.componentIdx,
            stateVariable: "numSubmissions",
            value: (await this.stateValues.numSubmissions) + 1,
        });

        if (creditAchieved < 1) {
            instructions.push({
                updateType: "updateValue",
                componentIdx: this.componentIdx,
                stateVariable: "numIncorrectSubmissions",
                value: (await this.stateValues.numIncorrectSubmissions) + 1,
            });
        }

        const responseText = currentResponses.map((response) =>
            String(response),
        );

        instructions.push({
            updateType: "recordItemSubmission",
            componentNumber: await this.stateValues.inComponentNumber,
            submittedComponent: this.componentIdx,
            response: currentResponses,
            responseText,
            creditAchieved,
        });

        await this.coreFunctions.performUpdate({
            updateInstructions: instructions,
            actionId,
            sourceInformation,
            skipRendererUpdate: true,
            event: {
                verb: "submitted",
                object: {
                    componentIdx: this.componentIdx,
                    componentType: this.componentType,
                    answerNumber: this.answerNumber,
                    rootName: this.rootName,
                },
                result: {
                    response: currentResponses,
                    responseText,
                    componentTypes: Array(currentResponses.length).fill(
                        "integer",
                    ),
                    creditAchieved,
                },
            },
        });

        return await this.coreFunctions.triggerChainedActions({
            componentIdx: this.componentIdx,
            actionId,
            sourceInformation,
            skipRendererUpdate,
        });
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

    /**
     * Whether this parsons shuffles its blocks: the `shuffleOrder` primitive,
     * which unlike `<choiceInput>`'s defaults to true when absent.
     */
    static _shufflesFromSerialized(serializedComponent) {
        const primitive =
            serializedComponent.attributes?.shuffleOrder?.primitive;
        return primitive === undefined ? true : Boolean(primitive.value);
    }

    static determineNumberOfUniqueVariants({
        serializedComponent,
        componentInfoObjects,
        infoDiagnostics,
    }) {
        if (!this._shufflesFromSerialized(serializedComponent)) {
            return super.determineNumberOfUniqueVariants({
                serializedComponent,
                componentInfoObjects,
                infoDiagnostics,
            });
        }

        let numBlocks = 0;

        for (const child of serializedComponent.children) {
            if (child.componentType === "block") {
                numBlocks++;
            } else if (
                componentInfoObjects.isInheritedComponentType({
                    inheritedComponentType: child.componentType,
                    baseComponentType: "_composite",
                }) &&
                child.attributes.createComponentOfType?.primitive.value ===
                    "block"
            ) {
                if (child.attributes.numComponents?.primitive !== undefined) {
                    const newBlocks = Number(
                        child.attributes.numComponents?.primitive.value,
                    );
                    if (Number.isInteger(newBlocks) && newBlocks >= 0) {
                        numBlocks += newBlocks;
                    } else {
                        return { success: false };
                    }
                } else {
                    numBlocks++;
                }
            } else if (
                ![
                    "label",
                    "shortDescription",
                    "description",
                    "statement",
                ].includes(child.componentType) &&
                typeof child !== "string"
            ) {
                return { success: false };
            }
        }

        let numberOfPermutations = 1;
        for (let i = 2; i <= numBlocks; i++) {
            numberOfPermutations *= i;
        }

        const result = super.determineNumberOfUniqueVariants({
            serializedComponent,
            componentInfoObjects,
            infoDiagnostics,
        });

        if (!result.success) {
            return { success: false };
        }

        const numVariants = result.numVariants * numberOfPermutations;

        // adjust variants info added by call to super
        serializedComponent.variants.numVariants = numVariants;
        serializedComponent.variants.uniqueVariantData = {
            numVariantsByDescendant:
                serializedComponent.variants.uniqueVariantData
                    .numVariantsByDescendant,
            numberOfPermutations,
            numBlocks,
        };

        return { success: true, numVariants };
    }

    static getUniqueVariant({
        serializedComponent,
        variantIndex,
        componentInfoObjects,
    }) {
        const numVariants = serializedComponent.variants?.numVariants;
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

        if (!this._shufflesFromSerialized(serializedComponent)) {
            return super.getUniqueVariant({
                serializedComponent,
                variantIndex,
                componentInfoObjects,
            });
        }

        const numVariantsByDescendant =
            serializedComponent.variants.uniqueVariantData
                .numVariantsByDescendant;
        const descendantVariantComponents =
            serializedComponent.variants.descendantVariantComponents;
        const numberOfPermutations =
            serializedComponent.variants.uniqueVariantData.numberOfPermutations;
        const numBlocks =
            serializedComponent.variants.uniqueVariantData.numBlocks;

        // treat permutations as another descendant variant component
        const numbersOfOptions = [...numVariantsByDescendant];
        numbersOfOptions.push(numberOfPermutations);

        const indicesForEachOption = enumerateCombinations({
            numberOfOptionsByIndex: numbersOfOptions,
            maxNumber: variantIndex,
        })[variantIndex - 1].map((x) => x + 1);

        const permutationsIndex = indicesForEachOption.pop();

        const indicesForEachDescendant = indicesForEachOption;

        // choose a permutation based on permutations index
        const indicesToPermute = [...Array(numBlocks).keys()].map((x) => x + 1);

        const permutedIndices = enumeratePermutations({
            values: indicesToPermute,
            maxNumber: permutationsIndex,
        })[permutationsIndex - 1];

        // for each descendant, get unique variant corresponding
        // to the selected variant number and include that as a subvariant

        let haveNontrivialSubvariants = false;
        const subvariants = [];

        for (
            let descendantNum = 0;
            descendantNum < numVariantsByDescendant.length;
            descendantNum++
        ) {
            if (numVariantsByDescendant[descendantNum] > 1) {
                const descendant = descendantVariantComponents[descendantNum];
                const compClass =
                    componentInfoObjects.allComponentClasses[
                        descendant.componentType
                    ];
                const result = compClass.getUniqueVariant({
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

        const desiredVariant = { indices: permutedIndices };
        if (haveNontrivialSubvariants) {
            desiredVariant.subvariants = subvariants;
        }

        return { success: true, desiredVariant };
    }
}
