import ValueListComponent, {
    entryValueOfType,
    restoredEntryWrite,
    sameEntryValue,
} from "./abstract/ValueListComponent";
import MathComponent from "./Math";
import {
    returnSequenceValues,
    returnStandardSequenceAttributes,
    returnStandardSequenceStateVariableDefinitions,
} from "../utils/sequence";
import { setUpVariantSeedAndRng } from "../utils/variants";
import {
    analyzeRepeatTemplate,
    evaluateRepeatTemplate,
    invertRepeatTemplate,
} from "../utils/repeatTemplate";
import { mathValueForDisplay } from "../utils/valueFunctions/math";

/**
 * A `<repeat>` or `<repeatForSequence>` whose template is one value, made a
 * list component by the pass in `utils/dast/repeatLists.ts`, which decides
 * which qualify. Part of Doenet/DoenetML#2163 (F6); see
 * `docs/f6-repeat-templates-as-lists.md`.
 *
 * Where the repeat made a copy of its template for each iteration, the list
 * keeps the template serialized (`repeatTemplate`) and computes entry k from
 * it with what the template reads at index k (`utils/repeatTemplate.js`):
 * - entry k of a list (`$i`, `$v`, `$l[$i]`; `repeatEntry`), each a
 *   dependency of that entry alone;
 * - a value that is the same at every index, which a child of the list reads
 *   once (`repeatTemplateConstant`).
 *
 * The number of entries is the number of iterations the repeat had: the
 * length of its sequence, or the number of items it iterates `for`. Its value
 * and index stay the lists the value-reference pass made them
 * (`_repeatValues`, `_repeatIndices`), children of the list that read its
 * `forValues` and `numIterates`.
 *
 * A value written to an entry is written to what the template reads at that
 * index, as a write to the iteration's component was: to entry k of a list it
 * reads, or to a value it reads at every index, which changes every entry.
 * One that the template would take only by changing its text is kept as
 * written to the entry (`entryWrites`) until the entry's value changes.
 *
 * It draws its variant seed from its parent as the repeat did, so the random
 * values after it in the document are those the repeat left them.
 */
export default class RepeatValueList extends ValueListComponent {
    static componentType = "_repeatValueList";
    static excludeFromSchema = true;

    static listEntryComponentType = "math";

    static listEntryTypeAttribute = "entryType";

    static listEntryTypeFromAttribute(attribute) {
        return attribute?.type === "primitive"
            ? String(attribute.primitive.value)
            : undefined;
    }

    // An entry is fixed only as the template was, by its own `fixed` or an
    // ancestor's.
    static listEntriesFixedByDefault = false;

    // A value the template would take only by changing its text is kept as
    // written to the entry.
    static listEntriesTakeWrites = true;

    static createsVariants = true;

    static keepChildrenSerialized({ serializedComponent }) {
        return Object.keys(serializedComponent.children ?? []).filter(
            (ind) =>
                serializedComponent.children[ind].doenetAttributes
                    ?.repeatTemplate,
        );
    }

    static createAttributesObject() {
        const attributes = super.createAttributesObject();
        // A `<repeatForSequence>`'s, which a list made from a `<repeat>`
        // does not set.
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
        attributes.entryType = {
            createPrimitiveOfType: "string",
        };
        // the template's own, which the list holds when it is a `<math>`
        const mathAttributes = MathComponent.createAttributesObject();
        attributes.simplify = mathAttributes.simplify;
        attributes.expand = mathAttributes.expand;
        return attributes;
    }

    static returnChildGroups() {
        return [
            {
                group: "iterationLists",
                componentTypes: ["_repeatValues", "_repeatIndices"],
            },
            {
                group: "constants",
                componentTypes: ["_base"],
            },
        ];
    }

    static returnStateVariableDefinitions() {
        const stateVariableDefinitions = super.returnStateVariableDefinitions();

        const entryType = this.listEntryComponentType;
        const arrayName = this.listValuesArrayName;

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
                                typeof source !== "string" ||
                                source.trim() !== "",
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
                            : { nodes: [], entryLists: [] },
                    },
                };
            },
        };

        // For each list the template reads an entry of, the prefix of the
        // names of its entries (`number3`), and whether they take writes.
        stateVariableDefinitions.entryListPrefixes = {
            additionalStateVariablesDefined: ["entryListsCanBeModified"],
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
                    dependencies[`canBeModified${e}`] = {
                        dependencyType: "stateVariable",
                        componentIdx,
                        variableName: "entriesCanBeModified",
                        variablesOptional: true,
                    };
                }
                return dependencies;
            },
            definition({ dependencyValues }) {
                const entryListPrefixes = [];
                const entryListsCanBeModified = [];
                for (let e = 0; `prefix${e}` in dependencyValues; e++) {
                    entryListPrefixes.push(dependencyValues[`prefix${e}`]);
                    entryListsCanBeModified.push(
                        dependencyValues[`canBeModified${e}`] ?? false,
                    );
                }
                return {
                    setValue: { entryListPrefixes, entryListsCanBeModified },
                };
            },
        };

        const settingsDependencies = {
            simplify: {
                dependencyType: "stateVariable",
                variableName: "simplify",
            },
            expand: {
                dependencyType: "stateVariable",
                variableName: "expand",
            },
        };

        // Entry k is the template's value with what it reads at index k, or
        // the value written to it while that is unchanged.
        stateVariableDefinitions[arrayName] = {
            ...stateVariableDefinitions[arrayName],
            stateVariablesDeterminingDependencies: [
                "templateAnalysis",
                "entryListPrefixes",
            ],
            returnArrayDependenciesByKey({ arrayKeys, stateValues }) {
                const globalDependencies = {
                    templateAnalysis: {
                        dependencyType: "stateVariable",
                        variableName: "templateAnalysis",
                    },
                    constants: {
                        dependencyType: "child",
                        childGroups: ["constants"],
                        variableNames: ["value", "canBeModified"],
                        variablesOptional: true,
                    },
                    entryListsCanBeModified: {
                        dependencyType: "stateVariable",
                        variableName: "entryListsCanBeModified",
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
                    for (const [e, componentIdx] of entryLists.entries()) {
                        dependencies[`entry${e}`] = {
                            dependencyType: "stateVariable",
                            componentIdx,
                            variableName: `${stateValues.entryListPrefixes[e]}${index}`,
                            variablesOptional: true,
                        };
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
                    const dependencyValues = dependencyValuesByKey[arrayKey];
                    const computed = templateValueAt({
                        globalDependencyValues,
                        dependencyValues,
                    });
                    const write = restoredEntryWrite(
                        dependencyValues.write,
                        entryType,
                        true,
                    );
                    entries[arrayKey] =
                        write && sameEntryValue(computed, write.over)
                            ? write.value
                            : computed;
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
                const instructions = [];
                for (const arrayKey in desiredStateVariableValues[arrayName]) {
                    const dependencyValues = dependencyValuesByKey[arrayKey];
                    if (!dependencyValues) {
                        continue;
                    }
                    const desiredValue = entryValueOfType(
                        desiredStateVariableValues[arrayName][arrayKey],
                        entryType,
                    );
                    const context = templateContext({
                        globalDependencyValues,
                        dependencyValues,
                    });
                    const inverse = invertRepeatTemplate({
                        ...context,
                        desiredValue,
                    });
                    if (inverse.success) {
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
                    } else if (inverse.needsStrings) {
                        instructions.push({
                            setDependency: dependencyNamesByKey[arrayKey].write,
                            desiredValue: {
                                value: desiredValue,
                                over: templateValueAt({
                                    globalDependencyValues,
                                    dependencyValues,
                                }),
                            },
                        });
                    } else {
                        return { success: false };
                    }
                }
                return { success: true, instructions };
            },
        };

        if (entryType === "math") {
            // As a `<math>` shows its value: rounded, then simplified and
            // expanded as its value is.
            const base = stateVariableDefinitions.entryValuesForDisplay;
            stateVariableDefinitions.entryValuesForDisplay = {
                ...base,
                returnDependencies: (args) => ({
                    ...base.returnDependencies(args),
                    ...settingsDependencies,
                }),
                definition({ dependencyValues }) {
                    const values = dependencyValues.values;
                    return {
                        setValue: {
                            entryValuesForDisplay: values.map((value) =>
                                mathValueForDisplay({
                                    ...dependencyValues,
                                    value,
                                }),
                            ),
                        },
                    };
                },
            };
        }

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
            useSubpartVariantRng: true,
        });
    }

    static determineNumberOfUniqueVariants({ serializedComponent }) {
        serializedComponent.variants = {
            ...serializedComponent.variants,
            numVariants: 1,
        };
        return { success: true, numVariants: 1 };
    }

    static getUniqueVariant({ variantIndex }) {
        if (variantIndex !== 1) {
            return { success: false };
        }
        return { success: true, desiredVariant: { index: variantIndex } };
    }
}

/** The template's settings and the values of its codes at one index. */
function templateContext({ globalDependencyValues, dependencyValues }) {
    const constants = globalDependencyValues.constants;
    return {
        analysis: globalDependencyValues.templateAnalysis,
        settings: {
            simplify: globalDependencyValues.simplify,
            expand: globalDependencyValues.expand,
        },
        codeValue: (code) =>
            code.entry !== undefined
                ? dependencyValues[`entry${code.entry}`]
                : constants[code.constant]?.stateValues.value,
        codeCanBeModified: (code) =>
            code.entry !== undefined
                ? globalDependencyValues.entryListsCanBeModified[code.entry]
                : constants[code.constant]?.stateValues.canBeModified === true,
    };
}

/** The template's value at one index. */
function templateValueAt({ globalDependencyValues, dependencyValues }) {
    const context = templateContext({
        globalDependencyValues,
        dependencyValues,
    });
    return evaluateRepeatTemplate(context);
}
