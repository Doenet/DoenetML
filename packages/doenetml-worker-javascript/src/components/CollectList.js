import {
    blankValue,
    childDisplaySettings,
    ENTRY_PRESENTATION_ARRAYS,
    ENTRY_PRESENTATION_SOURCE_VARIABLES,
    restoredValue,
    sourceComponentOf,
    sourcePresentation,
    valueForChild,
} from "./abstract/AuthoredValueList";
import { entryKind, entryValueOfType } from "./abstract/ValueListComponent";
import { RegisteredNumberEntries } from "./abstract/ReorderedValueList";
import { returnNumberDisplayAttributes } from "../utils/numberDisplay";
import Collect from "./Collect";
import NumberList from "./NumberList";
import MathList from "./MathList";
import TextList from "./TextList";
import BooleanList from "./BooleanList";
import IntervalList from "./IntervalList";
import PointList from "./PointList";
import VectorList, {
    sumOf,
    withDisplacementsWrittenWithTails,
    writesToVector,
} from "./VectorList";
import {
    coordinatesOf,
    coordinatesValue,
    entryVariableName,
    withNumDimensions,
} from "./abstract/GraphicalValueList";

/**
 * The lists, by the type collected, that the list form of `<collect>` is
 * built on, for their display settings and how they show their entries.
 */
export const COLLECT_LIST_BASES = {
    number: NumberList,
    math: MathList,
    text: TextList,
    boolean: BooleanList,
    interval: IntervalList,
    point: PointList,
    vector: VectorList,
};

/**
 * The list form of `<collect>` (Doenet/DoenetML#2161): one list component
 * holding the values of the components it collects, which a parent reads,
 * and the viewer draws, as one child per value. The document pass
 * `utils/dast/listForms.ts` makes a `<collect>` this instead of a composite
 * when the type it collects is one of `COLLECT_LIST_BASES`, and records the
 * type in its `componentType` attribute as a primitive.
 *
 * It collects what the composite collected (`collectedSources`): the
 * descendants of `from` of that type, and the entries of a list of that type
 * among them, each counted as one item, so `maxNumber` and an index count
 * entries. Each entry reads the value of the component it comes from, or of
 * the list's entry, and a value written to it goes there; it is shown with
 * that source's display settings, unless the `<collect>` sets them, and as
 * the source shows itself: hidden by its own `hide`, in its style and, for a
 * math, its `renderMode` (`entryPresentation`), as the copy the composite
 * made of it was.
 */
function collectListClass(Base) {
    return class CollectList extends Base {
        static componentType = "_collectList";

        static excludeFromSchema = true;

        static listEntriesShownAsSources = true;

        // A `copy=` of the list is made from the same children and
        // attributes, so it reads the same sources.
        static serializeUnlinkedAsValues = false;

        // The type collected, which the document pass records.
        static listEntryTypeAttribute = "componentType";

        static listEntryTypeFromAttribute(attribute) {
            const type =
                attribute?.type === "primitive"
                    ? attribute.primitive.value
                    : undefined;
            return type in COLLECT_LIST_BASES ? type : undefined;
        }

        static classForSerializedComponent(serializedComponent) {
            const entryType = this.listEntryTypeFromAttribute(
                serializedComponent.attributes?.componentType,
            );
            return this.classForEntryType(entryType ?? "number");
        }

        static classForEntryType(entryType) {
            if (!Object.hasOwn(RegisteredCollectList, "entryTypeClasses")) {
                RegisteredCollectList.entryTypeClasses = {};
            }
            const classes = RegisteredCollectList.entryTypeClasses;
            if (!classes[entryType]) {
                classes[entryType] = collectListClass(
                    COLLECT_LIST_BASES[entryType],
                );
            }
            return classes[entryType];
        }

        static createAttributesObject() {
            let attributes = super.createAttributesObject();
            const collectAttributes = Collect.createAttributesObject();
            attributes.from = collectAttributes.from;
            // no limit unless given, as for `<collect>` (`$c.maxNumber`)
            attributes.maxNumber = collectAttributes.maxNumber;
            attributes.componentType = {
                createPrimitiveOfType: "string",
                description: collectAttributes.componentType.description,
            };
            return attributes;
        }

        static returnStateVariableDefinitions() {
            let stateVariableDefinitions =
                super.returnStateVariableDefinitions();

            const entryType = this.listEntryComponentType;
            const kind = entryKind(entryType);
            const arrayName = this.listValuesArrayName;
            const displayNames =
                kind === "math" || kind === "number"
                    ? Object.keys(returnNumberDisplayAttributes())
                    : [];

            const collectDefinitions = Collect.returnStateVariableDefinitions();
            for (const name of [
                "sourceComponentIdx",
                "sourceComponent",
                "sourceName",
            ]) {
                stateVariableDefinitions[name] = collectDefinitions[name];
            }

            stateVariableDefinitions.componentTypeToCollect = {
                returnDependencies: () => ({}),
                definition: () => ({
                    setValue: { componentTypeToCollect: entryType },
                }),
            };

            // What each entry comes from: a component collected
            // (`componentIdx`), or an entry of a list collected by the type
            // of its entries (`componentIdx` of the list, `listInd`, and the
            // name of the entry, `entryVariable`). A value reference with
            // nothing to read is not collected, as the copy made for it made
            // no component.
            stateVariableDefinitions.collectedSources = {
                stateVariablesDeterminingDependencies: ["sourceName"],
                returnDependencies({ stateValues }) {
                    if (!stateValues.sourceName) {
                        return {};
                    }
                    return {
                        descendants: {
                            dependencyType: "descendant",
                            ancestorIdx: stateValues.sourceName,
                            componentTypes: [entryType],
                            useReplacementsForComposites: true,
                            includeNonActiveChildren: true,
                            recurseToMatchedChildren: false,
                            matchListsByEntryType: true,
                            variableNames: [
                                "valueMissing",
                                "numEntries",
                                "listEntryVariablePrefix",
                            ],
                            variablesOptional: true,
                        },
                        maxNumber: {
                            dependencyType: "stateVariable",
                            variableName: "maxNumber",
                        },
                    };
                },
                definition({ dependencyValues, componentIdx }) {
                    let collectedSources = [];
                    for (const descendant of dependencyValues.descendants ??
                        []) {
                        const stateValues = descendant.stateValues ?? {};
                        if (
                            stateValues.valueMissing ||
                            descendant.componentIdx === componentIdx
                        ) {
                            continue;
                        }
                        const prefix = stateValues.listEntryVariablePrefix;
                        if (prefix === undefined) {
                            collectedSources.push({
                                componentIdx: descendant.componentIdx,
                            });
                            continue;
                        }
                        for (
                            let listInd = 0;
                            listInd < (stateValues.numEntries ?? 0);
                            listInd++
                        ) {
                            collectedSources.push({
                                componentIdx: descendant.componentIdx,
                                listInd,
                                entryVariable: `${prefix}${listInd + 1}`,
                            });
                        }
                    }
                    const maxNumber = dependencyValues.maxNumber;
                    if (
                        maxNumber !== undefined &&
                        maxNumber !== null &&
                        collectedSources.length > maxNumber
                    ) {
                        collectedSources = collectedSources.slice(
                            0,
                            Math.max(0, Math.floor(maxNumber)),
                        );
                    }
                    return {
                        setValue: { collectedSources },
                        checkForActualChange: { collectedSources: true },
                    };
                },
            };

            // One entry for each component or list entry collected.
            stateVariableDefinitions.entryStructure = {
                returnDependencies: () => ({
                    collectedSources: {
                        dependencyType: "stateVariable",
                        variableName: "collectedSources",
                    },
                }),
                definition: ({ dependencyValues }) => ({
                    setValue: {
                        entryStructure: dependencyValues.collectedSources.map(
                            (_, collectedInd) => ({ collectedInd }),
                        ),
                    },
                    checkForActualChange: { entryStructure: true },
                }),
            };

            // Each entry reads the value of where it comes from, and a value
            // written to it goes there.
            stateVariableDefinitions[arrayName] = {
                ...stateVariableDefinitions[arrayName],
                stateVariablesDeterminingDependencies: [
                    "entryStructure",
                    "collectedSources",
                ],
                returnArrayDependenciesByKey({ arrayKeys, stateValues }) {
                    const globalDependencies = {
                        entryStructure: {
                            dependencyType: "stateVariable",
                            variableName: "entryStructure",
                        },
                    };
                    const dependenciesByKey = {};
                    for (const arrayKey of arrayKeys) {
                        const collected =
                            stateValues.collectedSources[
                                stateValues.entryStructure[arrayKey]
                                    ?.collectedInd
                            ];
                        if (collected) {
                            dependenciesByKey[arrayKey] = {
                                source: {
                                    dependencyType: "stateVariable",
                                    componentIdx: collected.componentIdx,
                                    variableName:
                                        collected.entryVariable ?? "value",
                                    variablesOptional: true,
                                },
                            };
                        }
                    }
                    return { globalDependencies, dependenciesByKey };
                },
                arrayDefinitionByKey({ dependencyValuesByKey, arrayKeys }) {
                    const entries = {};
                    const unchangedChecks = {};
                    for (const arrayKey of arrayKeys) {
                        const value = dependencyValuesByKey[arrayKey]?.source;
                        entries[arrayKey] =
                            value === undefined || value === null
                                ? blankValue(kind)
                                : entryValueOfType(
                                      restoredValue(value, kind),
                                      entryType,
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
                    const instructions = [];
                    for (const arrayKey in desiredStateVariableValues[
                        arrayName
                    ]) {
                        const source =
                            globalDependencyValues.entryStructure[arrayKey];
                        if (!source) {
                            continue;
                        }
                        const value = entryValueOfType(
                            desiredStateVariableValues[arrayName][arrayKey],
                            entryType,
                        );
                        if (!dependencyNamesByKey[arrayKey]?.source) {
                            continue;
                        }
                        instructions.push({
                            setDependency:
                                dependencyNamesByKey[arrayKey].source,
                            desiredValue: valueForChild(value, {
                                stateValues: {
                                    value: dependencyValuesByKey[arrayKey]
                                        ?.source,
                                },
                            }),
                        });
                    }
                    return { success: true, instructions };
                },
            };

            // The display settings each entry is shown with, `null` for the
            // list's: those of the component it comes from, or of the entry
            // of the list, where the `<collect>` does not set them, as the
            // `<collect>`'s attributes were given to the copy it made.
            stateVariableDefinitions.entryDisplaySettings = {
                shadowVariable: true,
                stateVariablesDeterminingDependencies: ["collectedSources"],
                returnDependencies({ stateValues }) {
                    const dependencies = {
                        entryStructure: {
                            dependencyType: "stateVariable",
                            variableName: "entryStructure",
                        },
                        collectedSources: {
                            dependencyType: "stateVariable",
                            variableName: "collectedSources",
                        },
                    };
                    if (displayNames.length === 0) {
                        return dependencies;
                    }
                    for (const name of displayNames) {
                        dependencies[name] = {
                            dependencyType: "stateVariable",
                            variableName: name,
                        };
                    }
                    for (const [
                        ind,
                        collected,
                    ] of stateValues.collectedSources.entries()) {
                        dependencies[`source${ind}`] = {
                            dependencyType: "multipleStateVariables",
                            componentIdx: collected.componentIdx,
                            variableNames: [
                                ...displayNames,
                                collected.listInd === undefined
                                    ? "displaySettings"
                                    : "entryDisplaySettings",
                            ],
                            variablesOptional: true,
                        };
                    }
                    return dependencies;
                },
                definition({ dependencyValues, usedDefault }) {
                    const { entryStructure, collectedSources } =
                        dependencyValues;
                    if (displayNames.length === 0) {
                        return {
                            setValue: {
                                entryDisplaySettings: entryStructure.map(
                                    () => null,
                                ),
                            },
                        };
                    }
                    const listSettings = {};
                    const listSetsDisplay = {};
                    for (const name of displayNames) {
                        listSettings[name] = dependencyValues[name];
                        listSetsDisplay[name] = !usedDefault[name];
                    }
                    const entryDisplaySettings = entryStructure.map(
                        ({ collectedInd }) => {
                            const sourceValues =
                                dependencyValues[`source${collectedInd}`];
                            if (!sourceValues) {
                                return null;
                            }
                            // An entry of a list has the settings of its own
                            // that the list shows it with, if any.
                            const { entryDisplaySettings, ...stateValues } =
                                sourceValues.stateValues;
                            const listInd =
                                collectedSources[collectedInd].listInd;
                            if (listInd !== undefined) {
                                stateValues.displaySettings =
                                    entryDisplaySettings?.[listInd];
                            }
                            return childDisplaySettings({
                                child: { stateValues },
                                fromReference: true,
                                childUsedDefault:
                                    usedDefault[`source${collectedInd}`],
                                displayNames,
                                listSettings,
                                listSetsDisplay,
                            });
                        },
                    );
                    return { setValue: { entryDisplaySettings } };
                },
            };

            // The component each entry stands for (`sourceComponentOf`): a
            // component collected, or the referent of a reference to a whole
            // component; for an entry of a list, the component that list's
            // entry stands for, if any.
            stateVariableDefinitions.entrySourceComponents = {
                shadowVariable: true,
                stateVariablesDeterminingDependencies: ["collectedSources"],
                returnDependencies({ stateValues }) {
                    const dependencies = {
                        entryStructure: {
                            dependencyType: "stateVariable",
                            variableName: "entryStructure",
                        },
                        collectedSources: {
                            dependencyType: "stateVariable",
                            variableName: "collectedSources",
                        },
                    };
                    for (const [
                        ind,
                        collected,
                    ] of stateValues.collectedSources.entries()) {
                        dependencies[`source${ind}`] = {
                            dependencyType: "multipleStateVariables",
                            componentIdx: collected.componentIdx,
                            variableNames:
                                collected.listInd === undefined
                                    ? ["referentInfo"]
                                    : ["entrySourceComponents"],
                            variablesOptional: true,
                        };
                    }
                    return dependencies;
                },
                definition({ dependencyValues }) {
                    const { entryStructure, collectedSources } =
                        dependencyValues;
                    const entrySourceComponents = entryStructure.map(
                        ({ collectedInd }) => {
                            const collected = collectedSources[collectedInd];
                            if (!collected) {
                                return null;
                            }
                            const stateValues =
                                dependencyValues[`source${collectedInd}`]
                                    ?.stateValues ?? {};
                            if (collected.listInd === undefined) {
                                return sourceComponentOf({
                                    componentIdx: collected.componentIdx,
                                    stateValues,
                                });
                            }
                            return (
                                stateValues.entrySourceComponents?.[
                                    collected.listInd
                                ] ?? null
                            );
                        },
                    );
                    return {
                        setValue: { entrySourceComponents },
                        checkForActualChange: { entrySourceComponents: true },
                    };
                },
            };

            // How each entry's source shows itself: a component as it does
            // (`sourcePresentation`); an entry of a list as the list shows
            // that entry. An entry of an authored list is in the list's style
            // and not hidden by the list's own `hide`, as a list collected by
            // the type of its entries was not; an entry of a list form is
            // shown as that list's arrays say, with its `hide` and style.
            stateVariableDefinitions.entryPresentation = {
                shadowVariable: true,
                stateVariablesDeterminingDependencies: ["collectedSources"],
                returnDependencies({ stateValues }) {
                    const dependencies = {
                        entryStructure: {
                            dependencyType: "stateVariable",
                            variableName: "entryStructure",
                        },
                        collectedSources: {
                            dependencyType: "stateVariable",
                            variableName: "collectedSources",
                        },
                    };
                    for (const [
                        ind,
                        collected,
                    ] of stateValues.collectedSources.entries()) {
                        dependencies[`source${ind}`] = {
                            dependencyType: "multipleStateVariables",
                            componentIdx: collected.componentIdx,
                            variableNames:
                                collected.listInd === undefined
                                    ? ENTRY_PRESENTATION_SOURCE_VARIABLES
                                    : [
                                          "entryPresentation",
                                          "selectedStyle",
                                          "styleNumber",
                                          ...Object.values(
                                              ENTRY_PRESENTATION_ARRAYS,
                                          ),
                                      ],
                            variablesOptional: true,
                        };
                    }
                    return dependencies;
                },
                definition({ dependencyValues }) {
                    const { entryStructure, collectedSources } =
                        dependencyValues;
                    const entryPresentation = entryStructure.map(
                        ({ collectedInd }) => {
                            const stateValues =
                                dependencyValues[`source${collectedInd}`]
                                    ?.stateValues;
                            if (!stateValues) {
                                return {};
                            }
                            const listInd =
                                collectedSources[collectedInd].listInd;
                            if (listInd === undefined) {
                                return sourcePresentation(stateValues);
                            }
                            // A list shown as its sources shows the entry
                            // as its arrays say (`ENTRY_PRESENTATION_ARRAYS`),
                            // with its own `hide` and style where it sets
                            // them (`<collect hide="false">`).
                            const ofEntry =
                                stateValues.entryPresentation?.[listInd] ?? {};
                            const ofList = (name) =>
                                stateValues[ENTRY_PRESENTATION_ARRAYS[name]]?.[
                                    listInd
                                ];
                            return {
                                hide: ofList("hide") ?? ofEntry.hide,
                                selectedStyle:
                                    ofList("selectedStyle") ??
                                    ofEntry.selectedStyle ??
                                    stateValues.selectedStyle,
                                styleNumber:
                                    ofList("styleNumber") ??
                                    ofEntry.styleNumber ??
                                    stateValues.styleNumber,
                                renderMode:
                                    ofList("renderMode") ?? ofEntry.renderMode,
                            };
                        },
                    );
                    return { setValue: { entryPresentation } };
                },
            };

            if (this.listEntryChildRendererVariables !== undefined) {
                Object.assign(
                    stateVariableDefinitions,
                    returnCollectedGraphicalDefinitions(
                        this,
                        stateVariableDefinitions,
                    ),
                );
            }

            return stateVariableDefinitions;
        }
    };
}

/**
 * The variables of a `<vector>` that `writesToVector` writes, by the index it
 * gives each.
 */
const VECTOR_WRITTEN_VARIABLES = ["tail", "head", "displacement"];

/**
 * The definitions a list form of `<collect>` of points or vectors replaces
 * those of `GraphicalValueList` with, which read the list's children, by
 * reading the components it collects instead (`collectedSources`): the
 * number of dimensions, the largest of theirs; the values, with that many
 * coordinates each; each entry's source as the child its renderer is drawn
 * as (`entryChildren`: label, style, `draggable`, `fixed`, `hide`, and the
 * source a click or a drag of a vector goes to); and, for vectors, the tail
 * and head of each (`entryChildEndpoints`), a write to which goes to the
 * source as a drag of it does (`writesToVector`), with a displacement written
 * to an entry (`$c[1]` dragged) written with its tail. An entry of a list
 * collected is drawn as that list draws it, with its tail.
 */
function returnCollectedGraphicalDefinitions(listClass, definitions) {
    const arrayName = listClass.listValuesArrayName;
    const childRendererVariables = listClass.listEntryChildRendererVariables;
    const isVector = listClass.listEntryComponentType === "vector";
    const collected = {};

    collected.numDimensions = {
        ...definitions.numDimensions,
        stateVariablesDeterminingDependencies: ["collectedSources"],
        returnDependencies({ stateValues }) {
            const dependencies = {};
            for (const [
                ind,
                source,
            ] of stateValues.collectedSources.entries()) {
                dependencies[`source${ind}`] = {
                    dependencyType: "stateVariable",
                    componentIdx: source.componentIdx,
                    variableName: "numDimensions",
                    variablesOptional: true,
                };
            }
            return dependencies;
        },
        definition({ dependencyValues }) {
            let numDimensions = 0;
            for (const n of Object.values(dependencyValues)) {
                numDimensions = Math.max(
                    numDimensions,
                    Number.isFinite(n) ? n : 1,
                );
            }
            return {
                setValue: { numDimensions: numDimensions || 2 },
                checkForActualChange: { numDimensions: true },
            };
        },
    };

    // Each value has the list's number of dimensions, as a point or vector
    // list's does.
    const values = definitions[arrayName];
    collected[arrayName] = {
        ...values,
        returnArrayDependenciesByKey(args) {
            const dependencies = values.returnArrayDependenciesByKey(args);
            dependencies.globalDependencies = {
                ...dependencies.globalDependencies,
                numDimensions: {
                    dependencyType: "stateVariable",
                    variableName: "numDimensions",
                },
            };
            return dependencies;
        },
        arrayDefinitionByKey(args) {
            const result = values.arrayDefinitionByKey(args);
            const entries = result.setValue[arrayName];
            for (const arrayKey in entries) {
                entries[arrayKey] = withNumDimensions(
                    entries[arrayKey],
                    args.globalDependencyValues.numDimensions,
                );
            }
            return result;
        },
    };

    collected.entryChildren = {
        shadowVariable: true,
        stateVariablesDeterminingDependencies: ["collectedSources"],
        returnDependencies({ stateValues }) {
            const dependencies = {
                entryStructure: {
                    dependencyType: "stateVariable",
                    variableName: "entryStructure",
                },
                collectedSources: {
                    dependencyType: "stateVariable",
                    variableName: "collectedSources",
                },
            };
            for (const [
                ind,
                source,
            ] of stateValues.collectedSources.entries()) {
                dependencies[`source${ind}`] = {
                    dependencyType: "multipleStateVariables",
                    componentIdx: source.componentIdx,
                    variableNames:
                        source.listInd === undefined
                            ? [...childRendererVariables, "hide", "fixed"]
                            : [
                                  ...childRendererVariables.map(
                                      entryVariableName,
                                  ),
                                  "entryFixed",
                              ],
                    variablesOptional: true,
                };
            }
            return dependencies;
        },
        definition({ dependencyValues }) {
            const { entryStructure, collectedSources } = dependencyValues;
            const entryChildren = entryStructure.map(({ collectedInd }) => {
                const source = collectedSources[collectedInd];
                if (!source) {
                    return null;
                }
                const sourceValues =
                    dependencyValues[`source${collectedInd}`]?.stateValues ??
                    {};
                if (source.listInd === undefined) {
                    return {
                        componentIdx: source.componentIdx,
                        stateValues: { ...sourceValues },
                    };
                }
                // an entry of a list, as the list draws it
                const stateValues = {};
                for (const name of childRendererVariables) {
                    const value =
                        sourceValues[entryVariableName(name)]?.[source.listInd];
                    if (value !== undefined) {
                        stateValues[name] = value;
                    }
                }
                stateValues.fixed = sourceValues.entryFixed?.[source.listInd];
                return {
                    componentIdx: source.componentIdx,
                    listEntryIndex: source.listInd,
                    stateValues,
                };
            });
            return { setValue: { entryChildren } };
        },
    };

    if (isVector) {
        // A displacement written to an entry is written with its tail, to
        // its source (`entryChildEndpoints`), as a vector list writes one
        // from a `<vector>` child.
        collected[arrayName] = withDisplacementsWrittenWithTails(
            collected[arrayName],
            arrayName,
        );

        collected.entryChildEndpoints = {
            shadowVariable: true,
            stateVariablesDeterminingDependencies: ["collectedSources"],
            returnDependencies({ stateValues }) {
                const dependencies = {
                    entryStructure: {
                        dependencyType: "stateVariable",
                        variableName: "entryStructure",
                    },
                    collectedSources: {
                        dependencyType: "stateVariable",
                        variableName: "collectedSources",
                    },
                };
                for (const [
                    ind,
                    source,
                ] of stateValues.collectedSources.entries()) {
                    if (source.listInd === undefined) {
                        dependencies[`source${ind}`] = {
                            dependencyType: "multipleStateVariables",
                            componentIdx: source.componentIdx,
                            variableNames: [
                                "tail",
                                "head",
                                "displacement",
                                "basedOnHead",
                                "basedOnTail",
                                "basedOnDisplacement",
                            ],
                            variablesOptional: true,
                        };
                        // what a write goes to, by the index `writesToVector`
                        // gives each variable
                        for (const [
                            variableIndex,
                            variableName,
                        ] of VECTOR_WRITTEN_VARIABLES.entries()) {
                            dependencies[`write${ind}_${variableIndex}`] = {
                                dependencyType: "stateVariable",
                                componentIdx: source.componentIdx,
                                variableName,
                                variablesOptional: true,
                            };
                        }
                    } else {
                        // the entry of a vector list: its tail and its
                        // displacement
                        dependencies[`tail${ind}`] = {
                            dependencyType: "stateVariable",
                            componentIdx: source.componentIdx,
                            variableName: `entryTail${source.listInd + 1}`,
                            variablesOptional: true,
                        };
                        dependencies[`displacement${ind}`] = {
                            dependencyType: "stateVariable",
                            componentIdx: source.componentIdx,
                            variableName: source.entryVariable,
                            variablesOptional: true,
                        };
                    }
                }
                return dependencies;
            },
            definition({ dependencyValues }) {
                const { entryStructure, collectedSources } = dependencyValues;
                const entryChildEndpoints = entryStructure.map(
                    ({ collectedInd }) => {
                        const source = collectedSources[collectedInd];
                        if (!source) {
                            return null;
                        }
                        if (source.listInd !== undefined) {
                            const tail =
                                dependencyValues[`tail${collectedInd}`];
                            const displacement =
                                dependencyValues[`displacement${collectedInd}`];
                            if (tail == null || displacement == null) {
                                return null;
                            }
                            return {
                                tail: coordinatesValue(tail),
                                head: sumOf(
                                    coordinatesValue(tail),
                                    coordinatesValue(displacement),
                                ),
                            };
                        }
                        const stateValues =
                            dependencyValues[`source${collectedInd}`]
                                ?.stateValues;
                        if (stateValues?.tail === undefined) {
                            return null;
                        }
                        return {
                            tail: coordinatesValue(stateValues.tail),
                            head: coordinatesValue(stateValues.head),
                        };
                    },
                );
                return { setValue: { entryChildEndpoints } };
            },
            // A tail or displacement written to an entry
            // (`{ [index]: { tail, displacement } }`) is written to its
            // source: a `<vector>` as `writesToVector` writes one, the entry
            // of a vector list to its tail and its displacement.
            inverseDefinition({
                desiredStateVariableValues,
                dependencyValues,
                workspace,
            }) {
                if (!workspace.written) {
                    workspace.written = {};
                }
                const instructions = [];
                for (const [key, desired] of Object.entries(
                    desiredStateVariableValues.entryChildEndpoints,
                )) {
                    const written = (workspace.written[key] = {
                        ...workspace.written[key],
                        ...desired,
                    });
                    const collectedInd =
                        dependencyValues.entryStructure[Number(key)]
                            ?.collectedInd;
                    const source =
                        dependencyValues.collectedSources[collectedInd];
                    if (!source) {
                        continue;
                    }
                    if (source.listInd !== undefined) {
                        if (written.tail !== undefined) {
                            instructions.push({
                                setDependency: `tail${collectedInd}`,
                                desiredValue: written.tail,
                            });
                        }
                        if (written.displacement !== undefined) {
                            instructions.push({
                                setDependency: `displacement${collectedInd}`,
                                desiredValue: written.displacement,
                            });
                        }
                        continue;
                    }
                    const stateValues =
                        dependencyValues[`source${collectedInd}`]?.stateValues;
                    if (stateValues?.tail === undefined) {
                        continue;
                    }
                    for (const [variableIndex, value] of writesToVector(
                        written,
                        stateValues,
                    )) {
                        instructions.push({
                            setDependency: `write${collectedInd}_${variableIndex}`,
                            desiredValue: coordinatesOf(value),
                        });
                    }
                }
                return { success: true, instructions };
            },
        };
    }

    return collected;
}

/**
 * The registered class of the list form of `<collect>`, built on a list of
 * numbers, which the document's attributes and the schema checks see, and
 * which makes the class for the type collected
 * (`classForSerializedComponent`). It extends no authored list type, so
 * that a `<collect componentType="numberList">`, or a parent whose child
 * group names a list type, does not take it for one.
 */
const RegisteredCollectList = collectListClass(RegisteredNumberEntries);
export default RegisteredCollectList;
