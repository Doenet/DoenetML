import { enumerateCombinations, enumeratePermutations } from "@doenet/utils";
import { setUpVariantSeedAndRng } from "../utils/variants";
import CompositeComponent from "./abstract/CompositeComponent";

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
            additionalStateVariablesDefined: ["givenAnswers", "validProblems"],
            returnDependencies: () => ({
                numProblems: {
                    dependencyType: "stateVariable",
                    variableName: "numProblems",
                },
                serializedProblemChildren: {
                    dependencyType: "stateVariable",
                    variableName: "serializedProblemChildren",
                },
            }),
            definition({ dependencyValues }) {
                const statements = [];
                const givenAnswers = [];
                let validProblems = true;
                const warnings = [];
                for (const problem of dependencyValues.serializedProblemChildren) {
                    let lastStatement = null;
                    let lastGivenAnswer = null;
                    for (const child of problem.children) {
                        if (child.componentType === "statement") {
                            lastStatement = child;
                        } else if (child.componentType === "givenAnswer") {
                            lastGivenAnswer = child.children[0];
                            lastGivenAnswer.componentType = "span";
                        }
                    }

                    if (lastStatement === null || lastGivenAnswer === null) {
                        validProblems = false;
                    }
                    statements.push(lastStatement);
                    givenAnswers.push(lastGivenAnswer);
                }

                if (!validProblems) {
                    warnings.push({
                        message:
                            "Invalid pretzel as a problem is missing a <statement> or a <givenAnswer>",
                        level: 1,
                    });
                }

                return {
                    setValue: { statements, givenAnswers, validProblems },
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

    static async createSerializedReplacements({ component, nComponents }) {
        const errors = [];
        const warnings = [];

        let replacements = [];

        const numProblems = await component.stateValues.numProblems;
        const problemOrder = await component.stateValues.problemOrder;
        const statements = await component.stateValues.statements;
        const givenAnswers = await component.stateValues.givenAnswers;

        for (let i = 0; i < numProblems; i++) {
            const problemIdx = problemOrder[i] - 1;
            const thisStatement = statements[problemIdx];
            const prevAnswer =
                givenAnswers[(problemIdx - 1 + numProblems) % numProblems];

            replacements.push(prevAnswer);
            replacements.push({
                type: "serialized",
                componentType: "textInput",
                componentIdx: nComponents++,
                attributes: {
                    width: {
                        type: "component",
                        name: "width",
                        component: {
                            type: "serialized",
                            componentType: "componentSize",
                            componentIdx: nComponents++,
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
                children: [],
            });
            replacements.push(thisStatement);
        }

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
