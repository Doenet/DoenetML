import {
    blankValue,
    childDisplaySettings,
    ENTRY_PRESENTATION_ARRAYS,
    ENTRY_PRESENTATION_SOURCE_VARIABLES,
    restoredValue,
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

            // The component each entry stands for, or `null` for an entry of
            // a list.
            stateVariableDefinitions.entrySourceComponents = {
                shadowVariable: true,
                returnDependencies: () => ({
                    entryStructure: {
                        dependencyType: "stateVariable",
                        variableName: "entryStructure",
                    },
                    collectedSources: {
                        dependencyType: "stateVariable",
                        variableName: "collectedSources",
                    },
                }),
                definition: ({ dependencyValues }) => ({
                    setValue: {
                        entrySourceComponents:
                            dependencyValues.entryStructure.map(
                                ({ collectedInd }) => {
                                    const collected =
                                        dependencyValues.collectedSources[
                                            collectedInd
                                        ];
                                    return collected &&
                                        collected.listInd === undefined
                                        ? collected.componentIdx
                                        : null;
                                },
                            ),
                    },
                    checkForActualChange: { entrySourceComponents: true },
                }),
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

            return stateVariableDefinitions;
        }
    };
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
