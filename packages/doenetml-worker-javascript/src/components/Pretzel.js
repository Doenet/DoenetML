import BlockScoredComponent from "./abstract/BlockScoredComponent";
import {
    returnSubmittedResponsesStateVariableDefinitions,
    submitScoredComponentResponses,
} from "../utils/answer";

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

        return attributes;
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
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        numProblems: dependencyValues.problemChildren.length,
                    },
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

        Object.assign(
            stateVariableDefinitions,
            returnSubmittedResponsesStateVariableDefinitions({
                responseComponentType: "text",
                missingValue: "\uFF3F",
            }),
        );

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
        return await submitScoredComponentResponses({
            component: this,
            responseComponentType: "text",
            describeResponse(response) {
                if (response.toString) {
                    try {
                        return response.toString();
                    } catch (e) {
                        return "\uff3f";
                    }
                }
                return response;
            },
            actionId,
            sourceInformation,
            skipRendererUpdate,
        });
    }
}
