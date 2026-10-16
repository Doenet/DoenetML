import { entryValueOfType } from "./ValueListComponent";
import {
    returnSequenceValues,
    returnStandardSequenceAttributes,
    returnStandardSequenceStateVariableDefinitions,
} from "../../utils/sequence";
import { setUpVariantSeedAndRng } from "../../utils/variants";
import {
    analyzeRepeatTemplate,
    evaluateRepeatTemplate,
    evaluatesSymbolically,
    functionEvaluator,
    invertRepeatTemplate,
} from "../../utils/repeatTemplate";

/**
 * What a repeat made a list (`RepeatValueList`, `RepeatPointList`) shares,
 * whatever its entries: how it counts its entries as the repeat counted its
 * iterations, the template it keeps and analyses once, its entries computed
 * from the template at each index, and the variant seed it draws as the
 * repeat did. Part of Doenet/DoenetML#2163 (F6); see
 * `docs/f6-repeat-templates-as-lists.md`.
 */

/** The static members of a repeat made a list, assigned to its class. */
export const REPEAT_LIST_STATICS = {
    excludeFromSchema: true,

    // The text of the template's components as written to an entry
    // (`entryWrites`), when they took a value by changing it, kept past the
    // end of the entries as a withheld iteration kept its own.
    listEntriesTakeWrites: true,
    listKeepsEntryWritesPastEnd: true,

    createsVariants: true,

    keepChildrenSerialized({ serializedComponent }) {
        return Object.keys(serializedComponent.children ?? []).filter(
            (ind) =>
                serializedComponent.children[ind].doenetAttributes
                    ?.repeatTemplate,
        );
    },

    setUpVariant({
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
    },

    determineNumberOfUniqueVariants({ serializedComponent }) {
        serializedComponent.variants = {
            ...serializedComponent.variants,
            numVariants: 1,
        };
        return { success: true, numVariants: 1 };
    },

    getUniqueVariant({ variantIndex }) {
        if (variantIndex !== 1) {
            return { success: false };
        }
        return { success: true, desiredVariant: { index: variantIndex } };
    },
};

/**
 * Add to `attributes` those of the repeat the list was made from: a
 * `<repeatForSequence>`'s sequence (whose `type` a list made from a
 * `<repeat>` does not set), a `<repeat>`'s `for`, and the names of the value
 * and index.
 */
export function addRepeatListAttributes(attributes) {
    Object.assign(attributes, returnStandardSequenceAttributes());
    attributes.type = { ...attributes.type, defaultValue: "number" };
    attributes.for = {
        createComponentOfType: "group",
    };
    attributes.valueName = {
        createPrimitiveOfType: "string",
    };
    attributes.indexName = {
        createPrimitiveOfType: "string",
    };
}

/**
 * Add to `stateVariableDefinitions` how the list counts its entries
 * (`numIterates`, as the repeat counted its iterations, the `forValues` its
 * `_repeatValues` reads, and `computedNumEntries`), its template
 * (`templateAnalysis`), the lists the template reads an entry of
 * (`entryListPrefixes`), and its variant.
 */
export function addRepeatListDefinitions(stateVariableDefinitions) {
    Object.assign(
        stateVariableDefinitions,
        returnStandardSequenceStateVariableDefinitions(),
    );

    stateVariableDefinitions.sourcesComponentIdx = {
        returnDependencies: () => ({
            forAttr: {
                dependencyType: "attributeComponent",
                attributeName: "for",
            },
        }),
        definition: ({ dependencyValues }) => ({
            setValue: {
                sourcesComponentIdx:
                    dependencyValues.forAttr?.componentIdx ?? null,
            },
        }),
    };

    // As the repeat counts its iterations: the items of its `for`, or
    // the values of its sequence (`RepeatForSequence.forValues`).
    stateVariableDefinitions.numIterates = {
        additionalStateVariablesDefined: ["forValues"],
        stateVariablesDeterminingDependencies: ["sourcesComponentIdx"],
        returnDependencies({ stateValues }) {
            if (stateValues.sourcesComponentIdx !== null) {
                return {
                    sources: {
                        dependencyType: "replacement",
                        compositeIdx: stateValues.sourcesComponentIdx,
                        recursive: true,
                        recurseNonStandardComposites: true,
                        variableNames: ["numEntries"],
                        variablesOptional: true,
                    },
                };
            }
            return {
                type: {
                    dependencyType: "stateVariable",
                    variableName: "type",
                },
                length: {
                    dependencyType: "stateVariable",
                    variableName: "length",
                },
                from: {
                    dependencyType: "stateVariable",
                    variableName: "from",
                },
                step: {
                    dependencyType: "stateVariable",
                    variableName: "step",
                },
                exclude: {
                    dependencyType: "stateVariable",
                    variableName: "exclude",
                },
                lowercase: {
                    dependencyType: "stateVariable",
                    variableName: "lowercase",
                },
            };
        },
        definition({ dependencyValues }) {
            if (dependencyValues.sources) {
                const numIterates = dependencyValues.sources
                    .filter(
                        (source) =>
                            typeof source !== "string" || source.trim() !== "",
                    )
                    .reduce(
                        (count, source) =>
                            count + (source.stateValues?.numEntries ?? 1),
                        0,
                    );
                return { setValue: { numIterates, forValues: [] } };
            }
            const forValues = returnSequenceValues(dependencyValues);
            return {
                setValue: { numIterates: forValues.length, forValues },
            };
        },
    };

    // One entry per iteration the repeat had.
    stateVariableDefinitions.computedNumEntries = {
        returnDependencies: () => ({
            numIterates: {
                dependencyType: "stateVariable",
                variableName: "numIterates",
            },
        }),
        markStale: () => ({ updateReplacements: true }),
        definition: ({ dependencyValues }) => ({
            setValue: { computedNumEntries: dependencyValues.numIterates },
        }),
    };

    stateVariableDefinitions.templateAnalysis = {
        returnDependencies: () => ({
            serializedChildren: {
                dependencyType: "serializedChildren",
                doNotProxy: true,
            },
        }),
        definition({ dependencyValues }) {
            const template = dependencyValues.serializedChildren.find(
                (child) => child.doenetAttributes?.repeatTemplate,
            );
            // A reference to the whole list shadows its values, and
            // holds no template.
            return {
                setValue: {
                    templateAnalysis: template
                        ? analyzeRepeatTemplate(template)
                        : {
                              nodes: [],
                              entryLists: [],
                              entryCoordinates: [],
                          },
                },
            };
        },
    };

    // Whether each `<evaluate>` of the template evaluates its function
    // symbolically, by the node's index, as `<evaluate>` decides from the
    // function's `symbolic`.
    stateVariableDefinitions.evaluateSymbolically = {
        stateVariablesDeterminingDependencies: ["templateAnalysis"],
        returnDependencies({ stateValues }) {
            return {
                templateAnalysis: {
                    dependencyType: "stateVariable",
                    variableName: "templateAnalysis",
                },
                functions: {
                    dependencyType: "child",
                    childGroups: ["constants"],
                    childIndices: functionConstants(
                        stateValues.templateAnalysis,
                    ),
                    variableNames: ["symbolic"],
                    variablesOptional: true,
                },
            };
        },
        definition({ dependencyValues }) {
            const { templateAnalysis, functions } = dependencyValues;
            const constants = functionConstants(templateAnalysis);
            const evaluateSymbolically = {};
            for (const [ind, node] of templateAnalysis.nodes.entries()) {
                if (node.type === "evaluate") {
                    const fn = functions[constants.indexOf(node.function)];
                    evaluateSymbolically[ind] = evaluatesSymbolically(
                        node,
                        fn?.stateValues.symbolic,
                    );
                }
            }
            return { setValue: { evaluateSymbolically } };
        },
    };

    // For each list the template reads an entry of, the prefix of the names
    // of its entries (`number3`), by which the values depend on them.
    stateVariableDefinitions.entryListPrefixes = {
        stateVariablesDeterminingDependencies: ["templateAnalysis"],
        returnDependencies({ stateValues }) {
            const dependencies = {};
            for (const [
                e,
                componentIdx,
            ] of stateValues.templateAnalysis.entryLists.entries()) {
                dependencies[`prefix${e}`] = {
                    dependencyType: "stateVariable",
                    componentIdx,
                    variableName: "listEntryVariablePrefix",
                };
            }
            return dependencies;
        },
        definition({ dependencyValues }) {
            const entryListPrefixes = [];
            for (let e = 0; `prefix${e}` in dependencyValues; e++) {
                entryListPrefixes.push(dependencyValues[`prefix${e}`]);
            }
            return { setValue: { entryListPrefixes } };
        },
    };

    // Whether the entries of each of those lists take a write, read only when
    // a value is written, apart from what the values depend on, as it may
    // read the values (`<numberList fixed="$r[1]=1">`). As a reference to an
    // entry (`ValueRef`), which reads its list's `modifyIndirectly` too, so
    // that a write the template can take elsewhere goes there.
    stateVariableDefinitions.entryListsCanBeModified = {
        stateVariablesDeterminingDependencies: ["templateAnalysis"],
        returnDependencies({ stateValues }) {
            const dependencies = {};
            for (const [
                e,
                componentIdx,
            ] of stateValues.templateAnalysis.entryLists.entries()) {
                dependencies[`canBeModified${e}`] = {
                    dependencyType: "stateVariable",
                    componentIdx,
                    variableName: "entriesCanBeModified",
                    variablesOptional: true,
                };
                dependencies[`modifyIndirectly${e}`] = {
                    dependencyType: "stateVariable",
                    componentIdx,
                    variableName: "modifyIndirectly",
                    variablesOptional: true,
                };
            }
            return dependencies;
        },
        definition({ dependencyValues }) {
            const entryListsCanBeModified = [];
            for (let e = 0; `canBeModified${e}` in dependencyValues; e++) {
                entryListsCanBeModified.push(
                    (dependencyValues[`canBeModified${e}`] ?? false) &&
                        dependencyValues[`modifyIndirectly${e}`] !== false,
                );
            }
            return { setValue: { entryListsCanBeModified } };
        },
    };

    // Whether each value the template reads at every index takes a write.
    stateVariableDefinitions.constantsCanBeModified = {
        returnDependencies: () => ({
            constants: {
                dependencyType: "child",
                childGroups: ["constants"],
                variableNames: ["canBeModified"],
                variablesOptional: true,
            },
        }),
        definition: ({ dependencyValues }) => ({
            setValue: {
                constantsCanBeModified: dependencyValues.constants.map(
                    (constant) => constant.stateValues.canBeModified === true,
                ),
            },
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
        definition: ({ dependencyValues, componentIdx }) => ({
            setValue: {
                generatedVariantInfo: {
                    seed: dependencyValues.variantSeed,
                    meta: { createdBy: componentIdx },
                    subvariants: [],
                },
            },
        }),
    };
}

/**
 * The constants of `templateAnalysis` that its `<evaluate>`s evaluate, in
 * order: the indices, among the list's `constants`, of their functions.
 */
function functionConstants(templateAnalysis) {
    return [
        ...new Set(
            templateAnalysis.nodes
                .filter(
                    (node) =>
                        node.type === "evaluate" && node.function !== undefined,
                )
                .map((node) => node.function),
        ),
    ].sort((a, b) => a - b);
}

/**
 * The dependencies of a value computed through the `<evaluate>` nodes
 * `evaluateNodes` of the template: of each, the one form of its function it
 * evaluates (`evaluateSymbolically`), so that the function computes only
 * that one, as for `<evaluate>`. `templateEvaluators` reads them.
 */
export function evaluatorDependencies({
    templateAnalysis,
    evaluateSymbolically,
    evaluateNodes,
}) {
    const dependencies = {
        evaluateSymbolically: {
            dependencyType: "stateVariable",
            variableName: "evaluateSymbolically",
        },
    };
    for (const ind of evaluateNodes) {
        const node = templateAnalysis.nodes[ind];
        if (node.function === undefined) {
            continue;
        }
        dependencies[`function${ind}`] = {
            dependencyType: "child",
            childGroups: ["constants"],
            childIndices: [node.function],
            variableNames: [
                evaluateSymbolically[ind] ? "symbolicfs" : "numericalfs",
                "numInputs",
            ],
            variablesOptional: true,
        };
    }
    return dependencies;
}

/**
 * The function each `<evaluate>` node evaluates its inputs with, by the
 * node's index, from the dependencies of `evaluatorDependencies`.
 */
function templateEvaluators(globalDependencyValues) {
    const evaluators = {};
    for (const [ind, symbolically] of Object.entries(
        globalDependencyValues.evaluateSymbolically ?? {},
    )) {
        const fn = globalDependencyValues[`function${ind}`]?.[0];
        evaluators[ind] = functionEvaluator({
            symbolically,
            functionValues: fn?.stateValues,
        });
    }
    return evaluators;
}

/**
 * The array of entries `arrayName` of entry type `entryType` in place of
 * `baseValues`: entry k is the template's value with what it reads at index
 * k (`evaluateRepeatTemplate`), and a value written to it is written through
 * the template (`invertRepeatTemplate`). `settingsDependencies` are the
 * list's state variables holding the template's own settings
 * (`simplify`, `expand`), if any.
 */
export function repeatTemplateEntriesDefinition({
    baseValues,
    arrayName,
    entryType,
    settingsDependencies = {},
}) {
    return {
        ...baseValues,
        stateVariablesDeterminingDependencies: [
            "templateAnalysis",
            "entryListPrefixes",
            "evaluateSymbolically",
        ],
        returnArrayDependenciesByKey({ arrayKeys, stateValues }) {
            const globalDependencies = {
                ...evaluatorDependencies({
                    templateAnalysis: stateValues.templateAnalysis,
                    evaluateSymbolically: stateValues.evaluateSymbolically,
                    evaluateNodes:
                        stateValues.templateAnalysis.nodes[0]?.evaluateNodes ??
                        [],
                }),
                templateAnalysis: {
                    dependencyType: "stateVariable",
                    variableName: "templateAnalysis",
                },
                // What decides whether a write is taken is read only when
                // one is (`readWritability`), so the values do not depend on
                // it, which may itself read the values (`<numberList
                // fixed="$r[1]=1">` that the template reads).
                constants: {
                    dependencyType: "child",
                    childGroups: ["constants"],
                    variableNames: ["value"],
                    variablesOptional: true,
                },
                ...settingsDependencies,
            };
            const { entryLists } = stateValues.templateAnalysis;
            const dependenciesByKey = {};
            for (const arrayKey of arrayKeys) {
                const index = Number(arrayKey) + 1;
                const dependencies = {
                    write: {
                        dependencyType: "stateVariable",
                        variableName: `entryWrite${index}`,
                    },
                };
                for (const e of entryLists.keys()) {
                    dependencies[`entry${e}`] = entryCodeDependency({
                        templateAnalysis: stateValues.templateAnalysis,
                        entryListPrefixes: stateValues.entryListPrefixes,
                        e,
                        index,
                    });
                }
                dependenciesByKey[arrayKey] = dependencies;
            }
            return { globalDependencies, dependenciesByKey };
        },
        arrayDefinitionByKey({
            globalDependencyValues,
            dependencyValuesByKey,
            arrayKeys,
        }) {
            const entries = {};
            const unchangedChecks = {};
            for (const arrayKey of arrayKeys) {
                entries[arrayKey] = evaluateRepeatTemplate(
                    templateContext({
                        globalDependencyValues,
                        dependencyValues: dependencyValuesByKey[arrayKey],
                    }),
                );
                unchangedChecks[arrayKey] = true;
            }
            return {
                setValue: { [arrayName]: entries },
                checkForActualChange: { [arrayName]: unchangedChecks },
            };
        },
        async inverseArrayDefinitionByKey({
            desiredStateVariableValues,
            globalDependencyValues,
            dependencyValuesByKey,
            dependencyNamesByKey,
            stateValues,
        }) {
            if (await stateValues.entriesFixed) {
                return { success: false };
            }
            const writability = await readWritability(stateValues);
            const instructions = [];
            for (const arrayKey in desiredStateVariableValues[arrayName]) {
                const dependencyValues = dependencyValuesByKey[arrayKey];
                if (!dependencyValues) {
                    continue;
                }
                const inverse = invertRepeatTemplate({
                    ...templateContext({
                        globalDependencyValues,
                        dependencyValues,
                        writability,
                    }),
                    desiredValue: entryValueOfType(
                        desiredStateVariableValues[arrayName][arrayKey],
                        entryType,
                    ),
                });
                if (!inverse.success) {
                    return { success: false };
                }
                if (Object.keys(inverse.texts).length > 0) {
                    instructions.push({
                        setDependency: dependencyNamesByKey[arrayKey].write,
                        desiredValue: {
                            ...dependencyValues.write,
                            ...inverse.texts,
                        },
                    });
                }
                for (const { code, desiredValue } of inverse.writes) {
                    if (code.entry !== undefined) {
                        instructions.push({
                            setDependency:
                                dependencyNamesByKey[arrayKey][
                                    `entry${code.entry}`
                                ],
                            desiredValue,
                        });
                    } else {
                        instructions.push({
                            setDependency: "constants",
                            desiredValue,
                            childIndex: code.constant,
                            variableIndex: 0,
                        });
                    }
                }
            }
            return { success: true, instructions };
        },
    };
}

/**
 * The dependency of entry `index` (from 1) of what entry code `e` of
 * `templateAnalysis` reads: the entry of its list, by the prefix of the
 * names of the list's entries (`entryListPrefixes`), or a coordinate of that
 * entry (`entryCoordinates`), as `$l[index][2]` reads it, through the entry
 * property (`x2`) a list of maths computes for each entry and takes a write
 * to.
 */
export function entryCodeDependency({
    templateAnalysis,
    entryListPrefixes,
    e,
    index,
}) {
    const componentIdx = templateAnalysis.entryLists[e];
    const coordinate = templateAnalysis.entryCoordinates[e];
    if (coordinate !== null) {
        return {
            dependencyType: "stateVariableFromUnresolvedPath",
            componentIdx,
            unresolvedPath: [
                {
                    name: "",
                    index: [
                        { value: [String(index)] },
                        { value: [String(coordinate)] },
                    ],
                },
            ],
            variablesOptional: true,
        };
    }
    return {
        dependencyType: "stateVariable",
        componentIdx,
        variableName: `${entryListPrefixes[e]}${index}`,
        variablesOptional: true,
    };
}

/**
 * What decides whether a write is taken, read when one is: which lists the
 * template reads entries of take a write, which values it reads at every
 * index do.
 */
export async function readWritability(stateValues) {
    return {
        entryListsCanBeModified: await stateValues.entryListsCanBeModified,
        constantsCanBeModified: await stateValues.constantsCanBeModified,
    };
}

/**
 * The template's settings, the text of its components as written to one
 * entry, and the values of its codes at that entry's index. `writability`,
 * read only when a value is written (`readWritability`), says which codes
 * take a write.
 */
export function templateContext({
    globalDependencyValues,
    dependencyValues,
    writability,
}) {
    const constants = globalDependencyValues.constants;
    return {
        analysis: globalDependencyValues.templateAnalysis,
        settings: {
            simplify: globalDependencyValues.simplify,
            expand: globalDependencyValues.expand,
        },
        texts: dependencyValues.write ?? undefined,
        evaluators: templateEvaluators(globalDependencyValues),
        codeValue: (code) =>
            code.entry !== undefined
                ? dependencyValues[`entry${code.entry}`]
                : constants[code.constant]?.stateValues.value,
        codeCanBeModified: (code) =>
            code.entry !== undefined
                ? writability?.entryListsCanBeModified[code.entry] === true
                : writability?.constantsCanBeModified[code.constant] === true,
    };
}
