import BlockScoredComponent from "./abstract/BlockScoredComponent";
import { enumerateCombinations } from "@doenet/utils";
import { setUpVariantSeedAndRng } from "../utils/variants";
import { codedDiagnostic } from "../utils/diagnostics";
import {
    returnLabelAttributes,
    returnLabelStateVariableDefinitions,
} from "../utils/label";
import { returnLocalizedDefaultStateVariableDefinition } from "../utils/contentLocale";
import {
    returnSubmittedResponsesStateVariableDefinitions,
    submitScoredComponentResponses,
} from "../utils/answer";

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

/**
 * Whether a parsons shuffles its blocks: the `shuffleOrder` primitive, which
 * unlike `<choiceInput>`'s defaults to true when absent.
 */
function shufflesOrder(serializedComponent) {
    const primitive = serializedComponent.attributes?.shuffleOrder?.primitive;
    return primitive === undefined ? true : Boolean(primitive.value);
}

/**
 * The `index`-th permutation of `values`, counting from 1, computed directly
 * from the index rather than by enumerating every permutation before it:
 * there are n! of them, and a parsons shuffles by default.
 */
function permutationAtIndex(values, index) {
    const remaining = [...values];
    const factorials = [1];
    for (let i = 1; i <= remaining.length; i++) {
        factorials[i] = factorials[i - 1] * i;
    }

    const permutation = [];
    let k = index - 1;
    for (let n = remaining.length; n > 0; n--) {
        const pick = Math.floor(k / factorials[n - 1]);
        k -= pick * factorials[n - 1];
        permutation.push(remaining.splice(pick, 1)[0]);
    }
    return permutation;
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
            highlighted: true,
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
            highlighted: true,
            description:
                "Heading of the area where the reader builds the solution.",
        };
        attributes.unusedLabel = {
            createComponentOfType: "text",
            createStateVariable: "unusedLabelPreLocalize",
            defaultValue: "Unused blocks",
            highlighted: true,
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

        Object.assign(
            stateVariableDefinitions,
            returnSubmittedResponsesStateVariableDefinitions({
                responseComponentType: "integer",
                missingValue: null,
                descriptions: {
                    numSubmittedResponses:
                        "The number of blocks in the most recently submitted solution.",
                    submittedResponses:
                        "The indices of the blocks in the most recently submitted solution, counting from 1, from top to bottom.",
                },
            }),
        );

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

        // One pass over the children gives the renderer where to find the
        // statement, the blocks and the description among `children`, and
        // the core which children to render at all (not the labels).
        stateVariableDefinitions.childIndicesToRender = {
            additionalStateVariablesDefined: [
                { variableName: "statementChildInd", forRenderer: true },
                { variableName: "blockChildIndices", forRenderer: true },
                { variableName: "descriptionChildInd", forRenderer: true },
            ],
            returnDependencies: () => ({
                allChildren: {
                    dependencyType: "child",
                    includeAllChildren: true,
                },
            }),
            definition({ dependencyValues }) {
                const types = dependencyValues.allChildren.map(
                    (child) => child.componentType,
                );
                const statementChildInd = types.lastIndexOf("statement");
                const descriptionChildInd = types.lastIndexOf("description");
                const blockChildIndices = types.flatMap((type, ind) =>
                    type === "block" ? [ind] : [],
                );

                const childIndicesToRender = [...blockChildIndices];
                if (statementChildInd !== -1) {
                    childIndicesToRender.unshift(statementChildInd);
                }
                if (descriptionChildInd !== -1) {
                    childIndicesToRender.push(descriptionChildInd);
                }

                return {
                    setValue: {
                        childIndicesToRender,
                        statementChildInd,
                        blockChildIndices,
                        descriptionChildInd,
                    },
                };
            },
            markStale: () => ({ updateRenderedChildren: true }),
        };

        // `numBlocks` and `numDistractors` are `forRenderer` although the
        // renderer never reads them: a renderer-facing variable is evaluated
        // as soon as the document loads, which is what makes their warnings
        // reach the author at once rather than on the first submission.
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

        // A hidden block takes no part: it is not shown, cannot be moved, and
        // is not expected in the solution.
        stateVariableDefinitions.activeBlockIndices = {
            additionalStateVariablesDefined: ["blockTexts"],
            returnDependencies: () => ({
                blockChildren: {
                    dependencyType: "child",
                    childGroups: ["blocks"],
                    variableNames: ["hidden", "text"],
                },
            }),
            definition({ dependencyValues }) {
                const blocks = dependencyValues.blockChildren;
                return {
                    setValue: {
                        activeBlockIndices: blocks.flatMap((block, ind) =>
                            block.stateValues.hidden ? [] : [ind + 1],
                        ),
                        blockTexts: blocks.map(
                            (block) => block.stateValues.text,
                        ),
                    },
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
                    variableNames: ["isDistractor", "hidden"],
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        correctOrder: dependencyValues.blockChildren.flatMap(
                            (block, ind) =>
                                block.stateValues.isDistractor ||
                                block.stateValues.hidden
                                    ? []
                                    : [ind + 1],
                        ),
                    },
                };
            },
        };

        stateVariableDefinitions.blockOrder = {
            description:
                "The indices of the blocks, counting from 1, in the order the unused blocks are displayed for this variant.",
            public: true,
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

        // The reader's arrangement, as written: the authored indices of the
        // blocks in the solution area, top to bottom. This is the one piece of
        // state the reader changes, so it is essential; `solutionIndices`
        // below is the same list with any block that no longer takes part
        // (hidden, or gone) left out.
        stateVariableDefinitions.arrangement = {
            hasEssential: true,
            returnDependencies: () => ({}),
            definition: () => ({
                useEssentialOrDefaultValue: {
                    arrangement: {
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
                            setEssentialValue: "arrangement",
                            value: [...desiredStateVariableValues.arrangement],
                        },
                    ],
                };
            },
        };

        stateVariableDefinitions.solutionIndices = {
            forRenderer: true,
            returnDependencies: () => ({
                arrangement: {
                    dependencyType: "stateVariable",
                    variableName: "arrangement",
                },
                activeBlockIndices: {
                    dependencyType: "stateVariable",
                    variableName: "activeBlockIndices",
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        solutionIndices: dependencyValues.arrangement.filter(
                            (ind) =>
                                dependencyValues.activeBlockIndices.includes(
                                    ind,
                                ),
                        ),
                    },
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
                activeBlockIndices: {
                    dependencyType: "stateVariable",
                    variableName: "activeBlockIndices",
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
                                dependencyValues.activeBlockIndices.includes(
                                    ind,
                                ) &&
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
                numBlocks: {
                    dependencyType: "stateVariable",
                    variableName: "numBlocks",
                },
            }),
            definition({ dependencyValues }) {
                // With no blocks there is no problem to get right.
                const creditAchievedIfSubmit =
                    dependencyValues.numBlocks === 0
                        ? 0
                        : calculateParsonsCredit({
                              solutionIndices: dependencyValues.solutionIndices,
                              correctOrder: dependencyValues.correctOrder,
                          });
                return { setValue: { creditAchievedIfSubmit } };
            },
        };

        stateVariableDefinitions.showCheckWork = {
            forRenderer: true,
            returnDependencies: () => ({
                suppressCheckWork: {
                    dependencyType: "stateVariable",
                    variableName: "suppressCheckWork",
                },
                // A section with `sectionWideCheckWork` submits its answers
                // from one button and asks them to hide their own.
                ancestorSuppressingAnswerSubmitButtons: {
                    dependencyType: "ancestor",
                    variableNames: ["suppressAnswerSubmitButtons"],
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        showCheckWork:
                            !dependencyValues.suppressCheckWork &&
                            !dependencyValues
                                .ancestorSuppressingAnswerSubmitButtons
                                ?.stateValues.suppressAnswerSubmitButtons,
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
     * 1; appended when omitted, clamped when out of range), or back to the
     * unused blocks. One action serves the buttons, the keyboard and pointer
     * drops. A request that would change nothing is ignored.
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
        if (toArea !== "solution" && toArea !== "unused") {
            return;
        }
        if (toPosition != null && !Number.isInteger(toPosition)) {
            return;
        }

        const activeBlockIndices = await this.stateValues.activeBlockIndices;
        if (!activeBlockIndices.includes(blockIndex)) {
            return;
        }

        const solutionIndices = await this.stateValues.solutionIndices;
        const nextSolutionIndices = solutionIndices.filter(
            (ind) => ind !== blockIndex,
        );

        let position = null;
        if (toArea === "solution") {
            const requested =
                toPosition == null
                    ? nextSolutionIndices.length
                    : toPosition - 1;
            const pos = Math.max(
                0,
                Math.min(requested, nextSolutionIndices.length),
            );
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
                    stateVariable: "arrangement",
                    value: nextSolutionIndices,
                },
            ],
            actionId,
            sourceInformation,
            skipRendererUpdate: true,
            event: {
                verb: "interacted",
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
        // A grader reading the submission sees the blocks' text, not the
        // indices the shuffled pile happened to give them.
        const blockTexts = await this.stateValues.blockTexts;

        return await submitScoredComponentResponses({
            component: this,
            responseComponentType: "integer",
            describeResponse: (blockIndex) =>
                blockTexts[blockIndex - 1] || String(blockIndex),
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

    static determineNumberOfUniqueVariants({
        serializedComponent,
        componentInfoObjects,
        infoDiagnostics,
    }) {
        const cachedNumVariants = serializedComponent.variants?.numVariants;
        if (cachedNumVariants !== undefined) {
            return { success: true, numVariants: cachedNumVariants };
        }

        if (!shufflesOrder(serializedComponent)) {
            return super.determineNumberOfUniqueVariants({
                serializedComponent,
                componentInfoObjects,
                infoDiagnostics,
            });
        }

        let numBlocks = 0;

        for (const child of serializedComponent.children ?? []) {
            if (typeof child === "string") {
                continue;
            }
            if (child.componentType === "block") {
                numBlocks++;
                continue;
            }

            // A label, statement or description cannot produce a block. A
            // composite can, unless it says it makes something else or is a
            // `<setup>`, which makes nothing (the variant components inside
            // it are counted by the base class).
            const isComposite = componentInfoObjects.isInheritedComponentType({
                inheritedComponentType: child.componentType,
                baseComponentType: "_composite",
            });
            if (!isComposite || child.componentType === "setup") {
                continue;
            }
            if (
                child.attributes?.createComponentOfType?.primitive.value !==
                "block"
            ) {
                return { success: false };
            }
            if (child.attributes.numComponents?.primitive !== undefined) {
                const newBlocks = Number(
                    child.attributes.numComponents.primitive.value,
                );
                if (Number.isInteger(newBlocks) && newBlocks >= 0) {
                    numBlocks += newBlocks;
                } else {
                    return { success: false };
                }
            } else {
                numBlocks++;
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

        if (!shufflesOrder(serializedComponent)) {
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

        const permutedIndices = permutationAtIndex(
            [...Array(numBlocks).keys()].map((x) => x + 1),
            permutationsIndex,
        );

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
