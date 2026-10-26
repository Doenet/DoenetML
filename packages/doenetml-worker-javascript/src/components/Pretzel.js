import BlockScoredComponent from "./abstract/BlockScoredComponent";
import { codedDiagnostic } from "../utils/diagnostics";

/**
 * Parse a text response as a finite integer.
 * Returns `null` for blank or non-integer responses.
 */
function parseIntegerResponse(response) {
    const trimmedResponse = response.trim();
    if (trimmedResponse === "") {
        return null;
    }

    const numberResponse = Number(trimmedResponse);
    return Number.isInteger(numberResponse) ? numberResponse : null;
}

/**
 * Return true if a response represents the distractor marker `x`.
 */
function isDistractorResponse(response) {
    return response.trim().toLowerCase() === "x";
}

/**
 * Compute response offset modulo the number of effective (non-distractor) problems.
 */
function calculateResponseOffset({
    numericResponse,
    effectiveProblemNum,
    numEffectiveProblems,
}) {
    return (
        (numericResponse - effectiveProblemNum + numEffectiveProblems) %
        numEffectiveProblems
    );
}

/**
 * Compute pretzel credit from current responses.
 *
 * Non-distractor responses must share a consistent offset modulo the number of
 * non-distractor problems, and all distractor responses must be `x`.
 */
function calculatePretzelCredit({
    problemOrder,
    currentResponses,
    distractors,
    mode,
}) {
    const distractorSet = new Set(distractors);
    const numProblems = problemOrder.length;
    const numEffectiveProblems = numProblems - distractorSet.size;

    if (numEffectiveProblems === 0) {
        return currentResponses.every(isDistractorResponse) ? 1 : 0;
    }

    const problemNumToEffectiveProblemNum = Array(numProblems).fill(null);
    let effectiveProblemNum = 0;
    for (let problemNum = 0; problemNum < numProblems; problemNum++) {
        if (!distractorSet.has(problemNum)) {
            problemNumToEffectiveProblemNum[problemNum] = effectiveProblemNum;
            effectiveProblemNum++;
        }
    }

    const offsets = [];
    const expectedOffset =
        mode === "circuit"
            ? // Circuit mode enforces a +1 step modulo the number of
              // effective problems; when there is exactly one effective
              // problem, +1 wraps to offset 0.
              numEffectiveProblems === 1
                ? 0
                : 1
            : null;

    for (let i = 0; i < numProblems; i++) {
        const problemNum = problemOrder[i];
        const response = currentResponses[i] ?? "";

        if (distractorSet.has(problemNum)) {
            if (!isDistractorResponse(response)) {
                return 0;
            }
            continue;
        }

        const numericResponse = parseIntegerResponse(response);
        if (numericResponse === null) {
            return 0;
        }

        const effectiveProblemNum = problemNumToEffectiveProblemNum[problemNum];
        const offset = calculateResponseOffset({
            numericResponse,
            effectiveProblemNum,
            numEffectiveProblems,
        });

        if (mode === "circuit") {
            if (offset !== expectedOffset) {
                return 0;
            }
            continue;
        }

        offsets.push(offset);
    }

    if (mode === "circuit") {
        return 1;
    }

    const offset0 = offsets[0];
    const sameOffsets = offsets.every((offset) => offset === offset0);

    return sameOffsets ? 1 : 0;
}

export default class Pretzel extends BlockScoredComponent {
    constructor(args) {
        super(args);

        Object.assign(this.actions, {
            recordVisibilityChange: this.recordVisibilityChange.bind(this),
            submitAnswer: this.submitAnswer.bind(this),
        });
    }

    static componentType = "pretzel";

    static componentDocs = {
        summary:
            "A response-matching component where students enter a sequence to match statements and answers",
    };
    static renderChildren = true;

    static additionalSchemaChildren = ["problem"];
    static additionalSchemaChildrenDoNotInherit = true;

    static createAttributesObject() {
        const attributes = super.createAttributesObject();

        attributes.maxNumColumns = {
            description:
                "Maximum number of columns when arranging child problems.",
            createComponentOfType: "integer",
            createStateVariable: "maxNumColumns",
            defaultValue: 2,
            public: true,
            forRenderer: true,
            clamp: [1, 4],
        };

        attributes.mode = {
            description: "Arrangement mode for the child problems.",
            createPrimitiveOfType: "string",
            createStateVariable: "mode",
            defaultValue: "pretzel",
            public: true,
            forRenderer: true,
            toLowerCase: true,
            validValues: [
                {
                    value: "pretzel",
                    description:
                        "Interleaved arrangement where each problem's answer feeds the next and one can start with any problem.",
                },
                {
                    value: "circuit",
                    description:
                        "A variant of the pretzel where one must start with the first problem.",
                },
            ],
        };

        // Set by `preprocessSerializedChildren` when a `<pretzel extend>` is
        // given problems or a `mode`, which it ignores
        attributes._ignoredChangesToExtendedPretzel = {
            createPrimitiveOfType: "boolean",
            createStateVariable: "ignoredChangesToExtendedPretzel",
            defaultValue: false,
            excludeFromSchema: true,
        };

        return attributes;
    }

    /**
     * Combine the arrangers of a pretzel that copies or extends another.
     *
     * The pretzel sugar wraps a pretzel's problems in a `_pretzelArranger`,
     * and forwards its `mode` to it. A `<pretzel copy>` or `<pretzel extend>`
     * therefore has two arrangers: first the one it copies, holding the
     * source's problems, then its own, holding the problems and `mode`
     * written on the copy (none, if nothing was written).
     *
     * - A `<pretzel copy>` arranges all of the problems together, in the
     *   `mode` written on it, if any. Its arranger was given the source's
     *   order and random choices as its desired variant. The order is kept
     *   only if it still fits: added problems change the correct answers, so
     *   they are arranged in a new order, as is a source's order that does
     *   not start with problem 1 when the copy is in circuit mode. The
     *   source's random choices are kept either way. The added problems'
     *   random choices are those the document chose for the copy's own
     *   arranger, drawn from a new seed rather than the source's.
     *   A `<problem copy>` is not arranged, so it does not count as added.
     * - A `<pretzel extend>` shows its source's arrangement, so it ignores
     *   any problems or `mode` written on it, with a warning, and takes its
     *   source's `mode`, which decides how it is graded.
     */
    static preprocessSerializedChildren({ serializedChildren, attributes }) {
        const arrangerInds = [...serializedChildren.keys()].filter(
            (ind) =>
                serializedChildren[ind]?.componentType === "_pretzelArranger",
        );
        if (arrangerInds.length < 2) {
            return;
        }

        const copiedArranger = serializedChildren[arrangerInds[0]];
        const ownArrangers = arrangerInds
            .slice(1)
            .map((ind) => serializedChildren[ind]);
        for (const ind of arrangerInds.slice(1).reverse()) {
            serializedChildren.splice(ind, 1);
        }

        const ownChildren = ownArrangers.flatMap(
            (arranger) => arranger.children ?? [],
        );
        // Only a `<problem>` is arranged; a `<problem copy>` is ignored
        // (`PretzelArranger`), so it adds no problem.
        const addedProblems = ownChildren.some(
            (child) => child?.componentType === "problem",
        );
        const ownMode = ownArrangers.findLast(
            (arranger) => arranger.attributes?.mode,
        )?.attributes.mode;

        // A linked copy has downstream dependencies on its source
        // (`postProcessCopy`); it shows its source's replacements.
        const linked = Boolean(copiedArranger.downstreamDependencies);

        // Set even when false: a copy is given its source's attributes, and a
        // copy of a `<pretzel extend>` that warned has nothing to warn about.
        attributes._ignoredChangesToExtendedPretzel = {
            type: "primitive",
            name: "_ignoredChangesToExtendedPretzel",
            primitive: {
                type: "boolean",
                value:
                    linked &&
                    (ownChildren.some((child) => typeof child === "object") ||
                        Boolean(ownMode)),
            },
        };

        if (linked) {
            if (copiedArranger.attributes.mode) {
                attributes.mode = copiedArranger.attributes.mode;
            } else {
                delete attributes.mode;
            }
            return;
        }

        copiedArranger.children = [
            ...(copiedArranger.children ?? []),
            ...ownChildren,
        ];
        if (ownMode) {
            copiedArranger.attributes.mode = ownMode;
        }

        if (!copiedArranger.variants?.desiredVariant) {
            return;
        }

        // The copy's own arrangers are not made. Record which children each
        // one held, so that the arranger can report the variant of each
        // (`variantsOfMergedComponents`), in the place of that arranger
        // among the children added to the copy.
        copiedArranger.variants = {
            ...copiedArranger.variants,
            mergedArrangers: ownArrangers.map((arranger) => ({
                componentIdx: arranger.componentIdx,
                childIdxs: (arranger.children ?? [])
                    .filter((child) => typeof child === "object")
                    .map((child) => child.componentIdx),
            })),
        };
        // The desired variant is the source arranger's `generatedVariantInfo`
        // itself (`copyVariants`), shared with the source and its other
        // copies, so change a copy of it.
        const desiredVariant = { ...copiedArranger.variants.desiredVariant };
        copiedArranger.variants = {
            ...copiedArranger.variants,
            desiredVariant,
        };
        const sourceOrder = desiredVariant.indices;
        if (
            sourceOrder &&
            (addedProblems ||
                (ownMode?.primitive.value.toLowerCase() === "circuit" &&
                    Number(sourceOrder[0]) !== 1))
        ) {
            delete desiredVariant.indices;
        }

        if (addedProblems) {
            // The source's seed would give the random choices of the added
            // problems the seeds that the source's own random choices drew
            // from it, so that they would repeat the source's values. Seed
            // the arranger anew, and give the added problems the random
            // choices that the document chose for them, which follow the
            // source's in the order the arranger hands out subvariants.
            delete desiredVariant.seed;
            // An own arranger given a variant this copy's arranger generated
            // (`variantsOfMergedComponents`), as when a container of the
            // copy is copied or the page is loaded again with the variant it
            // generated, carries that arranger's seed and order. The variant
            // the document chooses for an own arranger has no seed.
            const generated = ownArrangers.find(
                (arranger) =>
                    arranger.variants?.desiredVariant?.seed !== undefined,
            )?.variants.desiredVariant;
            if (generated) {
                desiredVariant.seed = generated.seed;
                if (generated.indices) {
                    desiredVariant.indices = generated.indices;
                }
            }
            const ownSubvariants = ownArrangers.flatMap(
                (arranger) =>
                    arranger.variants?.desiredVariant?.subvariants ?? [],
            );
            if (desiredVariant.subvariants && ownSubvariants.length > 0) {
                desiredVariant.subvariants = [
                    ...desiredVariant.subvariants,
                    ...ownSubvariants,
                ];
            }
        }
    }

    static returnChildGroups() {
        return [
            {
                group: "problems",
                componentTypes: ["statement"],
                excludeFromSchema: true,
            },
            {
                group: "textInputs",
                componentTypes: ["textInput"],
                excludeFromSchema: true,
            },
            {
                group: "givenAnswers",
                componentTypes: ["span"],
                excludeFromSchema: true,
            },
        ];
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.textInputs = {
            returnDependencies: () => ({
                textInputs: {
                    dependencyType: "child",
                    childGroups: ["textInputs"],
                },
            }),
            definition: function ({ dependencyValues }) {
                return {
                    setValue: {
                        textInputs: dependencyValues.textInputs,
                    },
                };
            },
        };

        // TODO: temporary dependency bridge to read arranger state through the
        // first textInput replacement; replace with direct composite-state
        // dependency once available.
        stateVariableDefinitions.problemOrder = {
            stateVariablesDeterminingDependencies: ["textInputs"],
            additionalStateVariablesDefined: ["distractors"],
            returnDependencies({ stateValues }) {
                if (stateValues.textInputs.length > 0) {
                    return {
                        problemOrder: {
                            dependencyType: "sourceCompositeStateVariable",
                            replacementIdx:
                                stateValues.textInputs[0].componentIdx,
                            variableName: "problemOrder",
                        },
                        distractors: {
                            dependencyType: "sourceCompositeStateVariable",
                            replacementIdx:
                                stateValues.textInputs[0].componentIdx,
                            variableName: "distractors",
                        },
                    };
                } else {
                    return {};
                }
            },
            definition: function ({ dependencyValues }) {
                return {
                    setValue: {
                        problemOrder: dependencyValues.problemOrder ?? [],
                        distractors: dependencyValues.distractors ?? [],
                    },
                };
            },
        };

        stateVariableDefinitions.numProblems = {
            description: "The number of child problems.",
            public: true,
            forRenderer: true,
            shadowingInstructions: {
                createComponentOfType: "integer",
            },
            returnDependencies: () => ({
                problemChildren: {
                    dependencyType: "child",
                    childGroups: ["problems"],
                },
                ignoredChangesToExtendedPretzel: {
                    dependencyType: "stateVariable",
                    variableName: "ignoredChangesToExtendedPretzel",
                },
            }),
            definition({ dependencyValues }) {
                const diagnostics = [];
                if (dependencyValues.ignoredChangesToExtendedPretzel) {
                    diagnostics.push(
                        codedDiagnostic({
                            type: "warning",
                            code: "doenet-w0178",
                        }),
                    );
                }
                return {
                    setValue: {
                        numProblems: dependencyValues.problemChildren.length,
                    },
                    sendDiagnostics: diagnostics,
                };
            },
        };

        stateVariableDefinitions.currentResponses = {
            description: "The current responses across all child problems.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            isArray: true,
            entryPrefixes: ["currentResponse"],
            returnArraySizeDependencies: () => ({
                numProblems: {
                    dependencyType: "stateVariable",
                    variableName: "numProblems",
                },
            }),
            returnArraySize({ dependencyValues }) {
                return [dependencyValues.numProblems];
            },
            returnArrayDependenciesByKey({ arrayKeys }) {
                const dependenciesByKey = {};
                for (const arrayKey of arrayKeys) {
                    dependenciesByKey[arrayKey] = {
                        textInput: {
                            dependencyType: "child",
                            childGroups: ["textInputs"],
                            childIndices: [arrayKey],
                            variableNames: ["value"],
                        },
                    };
                }

                return { dependenciesByKey };
            },
            arrayDefinitionByKey({ dependencyValuesByKey }) {
                const currentResponses = {};

                for (const arrayKey in dependencyValuesByKey) {
                    currentResponses[arrayKey] =
                        dependencyValuesByKey[
                            arrayKey
                        ].textInput[0].stateValues.value;
                }

                return {
                    setValue: { currentResponses },
                };
            },
        };

        stateVariableDefinitions.creditAchievedIfSubmit = {
            returnDependencies: () => ({
                problemOrder: {
                    dependencyType: "stateVariable",
                    variableName: "problemOrder",
                },
                currentResponses: {
                    dependencyType: "stateVariable",
                    variableName: "currentResponses",
                },
                distractors: {
                    dependencyType: "stateVariable",
                    variableName: "distractors",
                },
                mode: {
                    dependencyType: "stateVariable",
                    variableName: "mode",
                },
            }),
            definition({ dependencyValues }) {
                const problemOrder = dependencyValues.problemOrder.map(
                    (p) => p - 1,
                );

                return {
                    setValue: {
                        creditAchievedIfSubmit: calculatePretzelCredit({
                            problemOrder,
                            currentResponses: dependencyValues.currentResponses,
                            distractors: dependencyValues.distractors,
                            mode: dependencyValues.mode,
                        }),
                    },
                };
            },
        };

        stateVariableDefinitions.numSubmittedResponses = {
            description: "The number of responses submitted.",
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
            description: "The most recently submitted responses.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            isArray: true,
            allowExtraArrayKeysInInverse: true,
            entryPrefixes: ["submittedResponse"],
            defaultValueByArrayKey: () => "\uFF3F",
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
                let globalDependencies = {
                    numSubmittedResponses: {
                        dependencyType: "stateVariable",
                        variableName: "numSubmittedResponses",
                    },
                };
                return { globalDependencies };
            },
            arrayDefinitionByKey({ globalDependencyValues }) {
                let componentType = [];

                if (globalDependencyValues.submittedResponsesComponentType) {
                    componentType.push(
                        ...globalDependencyValues.submittedResponsesComponentType.slice(
                            0,
                            globalDependencyValues.numSubmittedResponses,
                        ),
                    );
                }

                let essentialSubmittedResponses = {};

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
        let instructions = [
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
        let currentResponses = await this.stateValues.currentResponses;

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

        const responseText = [];
        for (const response of currentResponses) {
            if (response.toString) {
                try {
                    responseText.push(response.toString());
                } catch (e) {
                    responseText.push("\uff3f");
                }
            } else {
                responseText.push(response);
            }
        }

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
                    componentTypes: Array(currentResponses.length).fill("text"),
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
}
