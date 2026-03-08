import { enumerateCombinations, enumeratePermutations } from "@doenet/utils";
import { setUpVariantSeedAndRng } from "../utils/variants";
import CompositeComponent from "./abstract/CompositeComponent";

/**
 * Determine which given answer should pair with a displayed problem.
 * Distractor problems pair with their own answers; non-distractors pair with
 * the previous non-distractor answer, wrapping around.
 */
function getCorrespondingAnswerIdx({ problemIdx, numProblems, distractorSet }) {
    if (distractorSet.has(problemIdx)) {
        return problemIdx;
    }

    let answerIdx = (problemIdx - 1 + numProblems) % numProblems;
    let numIndicesChecked = 0;
    while (distractorSet.has(answerIdx) && numIndicesChecked < numProblems) {
        answerIdx = (answerIdx - 1 + numProblems) % numProblems;
        numIndicesChecked++;
    }

    return answerIdx;
}

export default class PretzelArranger extends CompositeComponent {
    static componentType = "_pretzelArranger";

    static createsVariants = true;

    static serializeReplacementsForChildren = true;
    static replacementsAlreadyInResolver = true;

    static useSerializedChildrenComponentIndices = true;

    static keepChildrenSerialized({ serializedComponent }) {
        if (serializedComponent.children === undefined) {
            return [];
        } else {
            return Object.keys(serializedComponent.children);
        }
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.serializedProblemChildren = {
            returnDependencies: () => ({
                serializedChildren: {
                    dependencyType: "serializedChildren",
                    doNotProxy: true,
                },
            }),
            definition: function ({ dependencyValues }) {
                return {
                    setValue: {
                        serializedProblemChildren:
                            dependencyValues.serializedChildren.filter(
                                (child) => child.componentType === "problem",
                            ),
                    },
                };
            },
        };

        stateVariableDefinitions.numProblems = {
            public: true,
            shadowingInstructions: {
                createComponentOfType: "integer",
            },
            returnDependencies: () => ({
                serializedProblemChildren: {
                    dependencyType: "stateVariable",
                    variableName: "serializedProblemChildren",
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        numProblems:
                            dependencyValues.serializedProblemChildren.length,
                    },
                };
            },
        };

        stateVariableDefinitions.problemOrder = {
            forRenderer: true,
            shadowVariable: true,
            returnDependencies: ({ sharedParameters }) => ({
                numProblems: {
                    dependencyType: "stateVariable",
                    variableName: "numProblems",
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
            definition: function ({ dependencyValues }) {
                let numProblems = dependencyValues.numProblems;
                let warnings = [];
                let problemOrder;

                // if desiredIndices is specified, use those
                let desiredProblemOrder =
                    dependencyValues.variants?.desiredVariant?.indices;
                if (desiredProblemOrder !== undefined) {
                    if (desiredProblemOrder.length !== numProblems) {
                        warnings.push({
                            message:
                                "Ignoring indices specified for problem as number of indices doesn't match number of problem children.",
                            level: 2,
                        });
                    } else {
                        desiredProblemOrder = desiredProblemOrder.map(Number);
                        if (!desiredProblemOrder.every(Number.isInteger)) {
                            throw Error(
                                "All indices specified for pretzel must be integers",
                            );
                        }
                        if (
                            !desiredProblemOrder.every(
                                (x) => x >= 1 && x <= numProblems,
                            )
                        ) {
                            warnings.push({
                                message:
                                    "Ignoring indices specified for pretzel as some indices out of range.",
                                level: 2,
                            });
                        } else if (
                            new Set(desiredProblemOrder).size !== numProblems
                        ) {
                            warnings.push({
                                message:
                                    "Ignoring indices specified for pretzel as some indices are repeated.",
                                level: 2,
                            });
                        } else {
                            return {
                                setValue: {
                                    problemOrder: desiredProblemOrder,
                                },
                            };
                        }
                    }
                }

                let variantRng = dependencyValues.rngClass(
                    dependencyValues.variantSeed + "co",
                );

                // shuffle order every time get new children
                // https://stackoverflow.com/a/12646864
                problemOrder = [...Array(numProblems).keys()].map((x) => x + 1);
                for (let i = numProblems - 1; i > 0; i--) {
                    const rand = variantRng();
                    const j = Math.floor(rand * (i + 1));
                    [problemOrder[i], problemOrder[j]] = [
                        problemOrder[j],
                        problemOrder[i],
                    ];
                }
                return {
                    setValue: { problemOrder },
                    sendWarnings: warnings,
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
                problemOrder: {
                    dependencyType: "stateVariable",
                    variableName: "problemOrder",
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
                    indices: dependencyValues.problemOrder,
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

        stateVariableDefinitions.statements = {
            additionalStateVariablesDefined: [
                "givenAnswers",
                "validProblems",
                "distractors",
            ],
            returnDependencies: () => ({
                serializedProblemChildren: {
                    dependencyType: "stateVariable",
                    variableName: "serializedProblemChildren",
                },
            }),
            definition({ dependencyValues }) {
                const statements = [];
                const givenAnswers = [];
                const distractors = [];
                let validProblems = true;
                const warnings = [];
                for (const [
                    idx,
                    problem,
                ] of dependencyValues.serializedProblemChildren.entries()) {
                    let lastStatement = null;
                    let lastGivenAnswer = null;
                    for (const child of problem.children) {
                        if (child.componentType === "statement") {
                            lastStatement = child;
                        } else if (child.componentType === "givenAnswer") {
                            const givenAnswerContent = child.children.find(
                                (grandchild) =>
                                    grandchild.componentType ===
                                    "_postponeRenderContainer",
                            );

                            // `givenAnswer` is transformed by `postponeRenderSugar`
                            // in parser normalization so that one child is
                            // `_postponeRenderContainer` (and there can also be
                            // one or more `<title>` children). Pretzel reuses that
                            // same component shape, then intentionally unwraps
                            // it here by cloning the child content and retagging
                            // as `span` for pretzel replacements.
                            if (givenAnswerContent) {
                                lastGivenAnswer = {
                                    ...givenAnswerContent,
                                    componentType: "span",
                                    attributes: {
                                        ...givenAnswerContent.attributes,
                                    },
                                };

                                // copy componentIdx and name from `givenAnswer`
                                // so references resolve to the givenAnswer content
                                lastGivenAnswer.componentIdx =
                                    child.componentIdx;
                                if (child.attributes.name) {
                                    lastGivenAnswer.attributes.name =
                                        child.attributes.name;
                                }
                            }
                        }
                    }

                    if (lastStatement === null || lastGivenAnswer === null) {
                        validProblems = false;
                    }
                    statements.push(lastStatement);
                    givenAnswers.push(lastGivenAnswer);

                    if (problem.attributes.isDistractor?.primitive.value) {
                        distractors.push(idx);
                    }
                }

                if (!validProblems) {
                    warnings.push({
                        message:
                            "Invalid pretzel: each <problem> must contain one <statement> and one <answer> or <givenAnswer>.",
                        level: 1,
                    });
                }

                return {
                    setValue: {
                        statements,
                        givenAnswers,
                        validProblems,
                        distractors,
                    },
                    sendWarnings: warnings,
                };
            },
        };

        stateVariableDefinitions.readyToExpandWhenResolved = {
            returnDependencies: () => ({
                problemOrder: {
                    dependencyType: "stateVariable",
                    variableName: "problemOrder",
                },
                statements: {
                    dependencyType: "stateVariable",
                    variableName: "statements",
                },
                givenAnswers: {
                    dependencyType: "stateVariable",
                    variableName: "givenAnswers",
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

        const errors = [];
        const warnings = [];

        let replacements = [];

        const numProblems = await component.stateValues.numProblems;
        const problemOrder = await component.stateValues.problemOrder;
        const statements = await component.stateValues.statements;
        const givenAnswers = await component.stateValues.givenAnswers;
        const distractors = await component.stateValues.distractors;
        const distractorSet = new Set(distractors);

        for (let i = 0; i < numProblems; i++) {
            const problemIdx = problemOrder[i] - 1;
            const thisStatement = statements[problemIdx];
            const answerIdx = getCorrespondingAnswerIdx({
                problemIdx,
                numProblems,
                distractorSet,
            });
            let correspondingAnswer = givenAnswers[answerIdx];

            if (correspondingAnswer === null) {
                replacements.push({
                    type: "serialized",
                    componentType: "span",
                    componentIdx: nComponents++,
                    stateId: `${stateIdInfo.prefix}${stateIdInfo.num++}`,
                    attributes: {},
                    doenetAttributes: {},
                    state: {},
                    children: [],
                });
            } else {
                replacements.push(correspondingAnswer);
            }
            replacements.push({
                type: "serialized",
                componentType: "textInput",
                componentIdx: nComponents++,
                stateId: `${stateIdInfo.prefix}${stateIdInfo.num++}`,
                attributes: {
                    width: {
                        type: "component",
                        name: "width",
                        component: {
                            type: "serialized",
                            componentType: "componentSize",
                            componentIdx: nComponents++,
                            stateId: `${stateIdInfo.prefix}${stateIdInfo.num++}`,
                            state: {
                                componentSize: { size: 15, isAbsolute: true },
                            },
                            children: [],
                            attributes: {},
                            doenetAttributes: {},
                        },
                    },
                },
                doenetAttributes: {},
                state: {},
                children: [
                    {
                        type: "serialized",
                        componentType: "shortDescription",
                        componentIdx: nComponents++,
                        stateId: `${stateIdInfo.prefix}${stateIdInfo.num++}`,
                        state: {},
                        children: [
                            {
                                type: "serialized",
                                componentType: "text",
                                componentIdx: nComponents++,
                                stateId: `${stateIdInfo.prefix}${stateIdInfo.num++}`,
                                state: {
                                    value: "Enter number in sequence for this answer or X if it is a distractor",
                                },
                                children: [],
                                attributes: {},
                                doenetAttributes: {},
                            },
                        ],
                        attributes: {},
                        doenetAttributes: {},
                    },
                ],
            });
            if (thisStatement === null) {
                replacements.push({
                    type: "serialized",
                    componentType: "statement",
                    componentIdx: nComponents++,
                    stateId: `${stateIdInfo.prefix}${stateIdInfo.num++}`,
                    attributes: {},
                    doenetAttributes: {},
                    state: {},
                    children: [],
                });
            } else {
                replacements.push(thisStatement);
            }
        }

        workspace.replacementsCreated = stateIdInfo.num;

        return {
            replacements,
            errors,
            warnings,
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
        });
    }

    static determineNumberOfUniqueVariants({
        serializedComponent,
        componentInfoObjects,
    }) {
        let numProblems = 0;

        for (let child of serializedComponent.children) {
            if (child.componentType === "problem") {
                numProblems++;
            } else if (
                componentInfoObjects.isInheritedComponentType({
                    inheritedComponentType: child.componentType,
                    baseComponentType: "_composite",
                }) &&
                child.attributes.createComponentOfType?.primitive.value ===
                    "problem"
            ) {
                if (child.attributes.numProblems?.primitive !== undefined) {
                    let newProblems = Number(
                        child.attributes.numProblems?.primitive.value,
                    );
                    if (Number.isInteger(newProblems) && newProblems >= 0) {
                        numProblems += newProblems;
                    } else {
                        return { success: false };
                    }
                } else {
                    numProblems++;
                }
            } else {
                return { success: false };
            }
        }

        let numberOfPermutations = 1;
        for (let i = 2; i <= numProblems; i++) {
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

        // adjust variants info added by call to super
        serializedComponent.variants.numVariants = numVariants;
        serializedComponent.variants.uniqueVariantData = {
            numVariantsByDescendant:
                serializedComponent.variants.uniqueVariantData
                    .numVariantsByDescendant,
            numberOfPermutations,
            numProblems,
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
        let numProblems =
            serializedComponent.variants.uniqueVariantData.numProblems;

        // treat permutations as another descendant variant component
        let numbersOfOptions = [...numVariantsByDescendant];
        numbersOfOptions.push(numberOfPermutations);

        let indicesForEachOption = enumerateCombinations({
            numberOfOptionsByIndex: numbersOfOptions,
            maxNumber: variantIndex,
        })[variantIndex - 1].map((x) => x + 1);

        let permutationsIndex = indicesForEachOption.pop();

        let indicesForEachDescendant = indicesForEachOption;

        // choose a permutation based on permutations index
        let indicesToPermute = [...Array(numProblems).keys()].map((x) => x + 1);

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
