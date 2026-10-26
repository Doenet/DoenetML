import { enumerateCombinations, enumeratePermutations } from "@doenet/utils";
import {
    gatherVariantComponents,
    setUpVariantSeedAndRng,
} from "../utils/variants";
import CompositeComponent from "./abstract/CompositeComponent";
import { codedDiagnostic } from "../utils/diagnostics";

/**
 * Whether a serialized child of the arranger is a `<problem copy>` or
 * `<problem extend>`: a composite made to stand for one problem.
 */
function isProblemCopy({ child, componentInfoObjects }) {
    return (
        typeof child === "object" &&
        componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: child.componentType,
            baseComponentType: "_composite",
        }) &&
        child.attributes._createComponentOfType?.primitive.value === "problem"
    );
}

/**
 * The serialized children that the arranger arranges: its `<problem>`s.
 */
function problemChildren(children) {
    return children.filter((child) => child.componentType === "problem");
}

/**
 * The parts of a serialized `<problem>` that the arranger displays: its last
 * `<statement>` and the content of its last given answer, retagged as a
 * `span`. Either is `null` if missing. Everything else in the problem, such
 * as a hint or a `<variantControl>`, is dropped.
 *
 * The returned statement and the answer's children are the problem's own
 * serialized objects, so a desired variant assigned to a variant component
 * within them carries into the replacements.
 */
function arrangedParts(problem) {
    let statement = null;
    let givenAnswer = null;
    for (const child of problem.children) {
        if (child.componentType === "statement") {
            statement = child;
        } else if (child.componentType === "givenAnswer") {
            const givenAnswerContent = child.children.find(
                (grandchild) =>
                    grandchild.componentType === "_postponeRenderContainer",
            );

            // `givenAnswer` is transformed by `postponeRenderSugar`
            // in parser normalization so that one child is
            // `_postponeRenderContainer` (and there can also be
            // one or more `<title>` children). Pretzel reuses that
            // same component shape, then intentionally unwraps
            // it here by cloning the child content and retagging
            // as `span` for pretzel replacements.
            if (givenAnswerContent) {
                givenAnswer = {
                    ...givenAnswerContent,
                    componentType: "span",
                    attributes: {
                        ...givenAnswerContent.attributes,
                    },
                    children: (givenAnswerContent.children ?? []).filter(
                        (grandchild) =>
                            grandchild.componentType !== "label" &&
                            grandchild.componentType !== "shortDescription",
                    ),
                };

                // copy componentIdx and name from `givenAnswer`
                // so references resolve to the givenAnswer content
                givenAnswer.componentIdx = child.componentIdx;
                if (child.attributes.name) {
                    givenAnswer.attributes.name = child.attributes.name;
                }
            }
        }
    }
    return { statement, givenAnswer };
}

/**
 * The serialized content that the arranger displays from its `<problem>`
 * children, in problem order. Variants are counted and assigned over the
 * variant components within this content only, so that every variant
 * counted is one that is shown.
 */
function arrangedContent(children) {
    const content = [];
    for (const problem of problemChildren(children)) {
        const { statement, givenAnswer } = arrangedParts(problem);
        if (statement) {
            content.push(statement);
        }
        if (givenAnswer) {
            content.push(givenAnswer);
        }
    }
    return content;
}

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

function normalizePretzelMode(mode) {
    return mode?.toLowerCase() === "circuit" ? "circuit" : "pretzel";
}

/**
 * Return the subset of 1-based problem indices that are permuted for a mode.
 * In circuit mode, the first problem stays fixed and only the tail is permuted.
 */
function getProblemIndicesToPermute({ numProblems, mode }) {
    const start = mode === "circuit" ? 2 : 1;
    return [...Array(Math.max(numProblems - start + 1, 0)).keys()].map(
        (x) => x + start,
    );
}

/**
 * Build full problem order from permuted indices for a mode.
 */
function buildProblemOrderFromPermutedIndices({
    permutedIndices,
    numProblems,
    mode,
}) {
    if (mode === "circuit") {
        return numProblems === 0 ? [] : [1, ...permutedIndices];
    }

    return permutedIndices;
}

/**
 * Count order permutations available for the selected mode.
 */
function determineNumberOfPermutations({ numProblems, mode }) {
    const numProblemsToPermute = getProblemIndicesToPermute({
        numProblems,
        mode,
    }).length;

    let numberOfPermutations = 1;
    for (let i = 2; i <= numProblemsToPermute; i++) {
        numberOfPermutations *= i;
    }

    return numberOfPermutations;
}

/**
 * Shuffle problem order in a mode-aware way using the variant RNG.
 */
function shuffleProblemOrder({ numProblems, variantRng, mode }) {
    const problemIndices = getProblemIndicesToPermute({ numProblems, mode });

    for (let i = problemIndices.length - 1; i > 0; i--) {
        const rand = variantRng();
        const j = Math.floor(rand * (i + 1));
        [problemIndices[i], problemIndices[j]] = [
            problemIndices[j],
            problemIndices[i],
        ];
    }

    return buildProblemOrderFromPermutedIndices({
        permutedIndices: problemIndices,
        numProblems,
        mode,
    });
}

export default class PretzelArranger extends CompositeComponent {
    static componentType = "_pretzelArranger";

    static componentDocs = {
        summary:
            "Internal arranger that lays out subset visualizations within <pretzel>.",
    };
    static createsVariants = true;

    static replacementsAlreadyInResolver = true;

    // A copy of the arranger is made from its `<problem>` children, not from
    // the content it displays, which it could not arrange again. A linked
    // copy shows its source's replacements, which reuse the statements and
    // answers of the source's problems, so it gives them the indices of the
    // corresponding statements and answers of its own problems.
    static mapShadowedReplacementIndicesThroughSerializedChildren = true;

    static createAttributesObject() {
        const attributes = super.createAttributesObject();

        attributes.mode = {
            createPrimitiveOfType: "string",
            createStateVariable: "mode",
            defaultValue: "pretzel",
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
            definition: function ({ dependencyValues, componentInfoObjects }) {
                const diagnostics = [];

                // A `<problem copy>` or `<problem extend>` is a composite, not
                // a problem, so it has no statement or answer for the arranger
                // to take apart. It is not arranged, and not counted in
                // `determineNumberOfUniqueVariants`.
                if (
                    dependencyValues.serializedChildren.some((child) =>
                        isProblemCopy({ child, componentInfoObjects }),
                    )
                ) {
                    diagnostics.push(
                        codedDiagnostic({
                            type: "warning",
                            code: "doenet-w0176",
                        }),
                    );
                }

                return {
                    setValue: {
                        serializedProblemChildren: problemChildren(
                            dependencyValues.serializedChildren,
                        ),
                    },
                    sendDiagnostics: diagnostics,
                };
            },
        };

        stateVariableDefinitions.numProblems = {
            description: "The number of problems arranged.",
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
                mode: {
                    dependencyType: "stateVariable",
                    variableName: "mode",
                },
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
                let diagnostics = [];
                let problemOrder;
                const mode = dependencyValues.mode;

                // if desiredIndices is specified, use those
                let desiredProblemOrder =
                    dependencyValues.variants?.desiredVariant?.indices;
                if (desiredProblemOrder !== undefined) {
                    if (desiredProblemOrder.length !== numProblems) {
                        diagnostics.push(
                            codedDiagnostic({
                                type: "info",
                                code: "doenet-i0005",
                            }),
                        );
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
                            diagnostics.push(
                                codedDiagnostic({
                                    type: "info",
                                    code: "doenet-i0007",
                                    args: { component: "pretzel" },
                                }),
                            );
                        } else if (
                            new Set(desiredProblemOrder).size !== numProblems
                        ) {
                            diagnostics.push(
                                codedDiagnostic({
                                    type: "info",
                                    code: "doenet-i0008",
                                }),
                            );
                        } else if (
                            mode === "circuit" &&
                            numProblems > 0 &&
                            desiredProblemOrder[0] !== 1
                        ) {
                            diagnostics.push(
                                codedDiagnostic({
                                    type: "info",
                                    code: "doenet-i0009",
                                }),
                            );
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

                problemOrder = shuffleProblemOrder({
                    numProblems,
                    variantRng,
                    mode,
                });

                return {
                    setValue: { problemOrder },
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
                problemOrder: {
                    dependencyType: "stateVariable",
                    variableName: "problemOrder",
                },
                variants: {
                    dependencyType: "variants",
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

                let subvariants = [];

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

                // The descendants come in display order, which follows
                // `problemOrder`, but `setUpVariant` hands out subvariants in
                // the order of the displayed content (see `arrangedContent`).
                // Report them in that order, so that this info, passed back
                // as a desired variant (as when a saved variant is reloaded),
                // gives each subvariant to the component that generated it.
                // Reorder only if that order lists exactly the components
                // found here. It does not before the arranger is expanded,
                // when none are found.
                const arrangedVariantComponentIdxs =
                    dependencyValues.variants?.arrangedVariantComponentIdxs;
                const subvariantByIdx = new Map(
                    subvariants.map((subvariant) => [
                        subvariant.meta?.createdBy,
                        subvariant,
                    ]),
                );
                if (
                    arrangedVariantComponentIdxs?.length ===
                        subvariants.length &&
                    arrangedVariantComponentIdxs.every((idx) =>
                        subvariantByIdx.has(idx),
                    )
                ) {
                    subvariants = arrangedVariantComponentIdxs.map((idx) =>
                        subvariantByIdx.get(idx),
                    );
                }
                generatedVariantInfo.subvariants = subvariants;

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
                mode: {
                    dependencyType: "stateVariable",
                    variableName: "mode",
                },
            }),
            definition({ dependencyValues }) {
                const statements = [];
                const givenAnswers = [];
                const distractors = [];
                let validProblems = true;
                const diagnostics = [];
                for (const [
                    idx,
                    problem,
                ] of dependencyValues.serializedProblemChildren.entries()) {
                    const {
                        statement: lastStatement,
                        givenAnswer: lastGivenAnswer,
                    } = arrangedParts(problem);

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
                    // Deliberately keep user-facing diagnostics in terms of
                    // public authoring syntax only. Even though parser sugar
                    // can normalize `<answer>` into internal `givenAnswer`
                    // nodes, we avoid mentioning `givenAnswer` in diagnostics so
                    // we don't advertise a legacy form planned for deprecation.
                    diagnostics.push(
                        codedDiagnostic({
                            type: "warning",
                            code: "doenet-w0076",
                        }),
                    );
                }

                if (
                    dependencyValues.mode === "circuit" &&
                    distractors.includes(0)
                ) {
                    diagnostics.push(
                        codedDiagnostic({
                            type: "error",
                            code: "doenet-e0001",
                        }),
                    );
                }

                return {
                    setValue: {
                        statements,
                        givenAnswers,
                        validProblems,
                        distractors,
                    },
                    sendDiagnostics: diagnostics,
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

        const diagnostics = [];

        let replacements = [];

        const numProblems = await component.stateValues.numProblems;
        const problemOrder = await component.stateValues.problemOrder;
        const statements = await component.stateValues.statements;
        const givenAnswers = await component.stateValues.givenAnswers;
        const distractors = await component.stateValues.distractors;
        const mode = await component.stateValues.mode;
        const distractorSet = new Set(distractors);

        for (let i = 0; i < numProblems; i++) {
            const problemIdx = problemOrder[i] - 1;
            const thisStatement = statements[problemIdx];

            const answerIdx = getCorrespondingAnswerIdx({
                problemIdx,
                numProblems,
                distractorSet,
            });
            const correspondingAnswer = givenAnswers[answerIdx];

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
                state:
                    mode === "circuit" && i === 0
                        ? { value: "1", disabledPreliminary: true }
                        : {},
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
            diagnostics,
            nComponents,
        };
    }

    static setUpVariant({ serializedComponent, sharedParameters, core }) {
        // Gather the variant components of the displayed content only, as
        // `determineNumberOfUniqueVariants` counts them, so that each
        // subvariant goes to the component it was chosen for.
        const descendantVariantComponents = gatherVariantComponents({
            serializedComponents: arrangedContent(serializedComponent.children),
            componentInfoObjects: core.componentInfoObjects,
        });
        setUpVariantSeedAndRng({
            serializedComponent,
            sharedParameters,
            descendantVariantComponents,
        });

        // Record that order for `generatedVariantInfo`, which reports the
        // subvariants in it.
        serializedComponent.variants ??= {};
        serializedComponent.variants.arrangedVariantComponentIdxs =
            descendantVariantComponents.map(
                (component) => component.componentIdx,
            );
    }

    static determineNumberOfUniqueVariants({
        serializedComponent,
        componentInfoObjects,
        infoDiagnostics,
    }) {
        let numProblems = 0;
        const mode = normalizePretzelMode(
            serializedComponent.attributes.mode?.primitive?.value,
        );

        for (let child of serializedComponent.children) {
            if (child.componentType === "problem") {
                numProblems++;
            } else if (isProblemCopy({ child, componentInfoObjects })) {
                // Not arranged (see `serializedProblemChildren`), so not counted.
                continue;
            } else {
                return { success: false };
            }
        }

        let numberOfPermutations = determineNumberOfPermutations({
            numProblems,
            mode,
        });

        // Count the variants of the displayed content only: the statement and
        // answer of each arranged problem. Content that is dropped, such as a
        // hint, a `<variantControl>`, or the children of a `<problem extend>`,
        // would otherwise multiply the variants of content that is not shown.
        // The variant components are counted directly rather than through
        // their `<problem>`s, as the arranger never creates the problems to
        // pass their desired variants on.
        // `super` records its results on `variants`, which the two share.
        serializedComponent.variants ??= {};
        let result = super.determineNumberOfUniqueVariants({
            serializedComponent: {
                ...serializedComponent,
                children: arrangedContent(serializedComponent.children),
            },
            componentInfoObjects,
            infoDiagnostics,
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
            mode,
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
        const mode = normalizePretzelMode(
            serializedComponent.variants.uniqueVariantData.mode,
        );

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
        const indicesToPermute = getProblemIndicesToPermute({
            numProblems,
            mode,
        });
        const permutedIndices = buildProblemOrderFromPermutedIndices({
            permutedIndices: enumeratePermutations({
                values: indicesToPermute,
                maxNumber: permutationsIndex,
            })[permutationsIndex - 1],
            numProblems,
            mode,
        });

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
