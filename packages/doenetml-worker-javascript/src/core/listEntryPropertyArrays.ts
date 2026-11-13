/**
 * The arrays a list component (`listEntryComponentType`) is given when a
 * reference reads a property of its entries (`utils/listEntryReference.ts`).
 */
import me from "math-expressions";
import { getClassStateVariableDefinitions } from "./StateVariableDefinitionFactory";
import {
    addStateVariablePlaceholder,
    normalizeArrayStateVariableDefaults,
} from "./StateVariableInitializer";
import {
    LIST_ENTRY_ARRAY_PREFIX,
    LIST_ENTRY_PREFIX,
    listEntryDefaultValue,
    listEntryPropertyType,
} from "../utils/listEntryReference";

/**
 * Give the list `component` the array named `arrayName` that a path from
 * `listEntryPropertyPath` reads, if it is one made for an entry property and
 * the list does not have it yet.
 */
export function ensureListEntryPropertyArray({
    core,
    component,
    arrayName,
}: {
    core: any;
    component: any;
    arrayName: string;
}) {
    if (
        !arrayName.startsWith(LIST_ENTRY_ARRAY_PREFIX) ||
        arrayName in component.state
    ) {
        return;
    }
    const listClass = component.constructor;
    const entryProperty = arrayName.slice(LIST_ENTRY_ARRAY_PREFIX.length);
    // A derived property is computed, entry by entry, from the entry
    // property it derives from.
    const derived = listClass.derivedEntryProperty(entryProperty);
    const listVariable =
        listClass.listEntryStateVariables[derived?.from ?? entryProperty];
    const perEntry = listClass.listPerEntryVariables.includes(listVariable);
    // The list's variable when it is itself an array (the values), whose
    // entries are read one by one.
    const listArray = component.state[listVariable]?.isArray
        ? component.state[listVariable]
        : undefined;
    // A property the list does not provide is the default every entry has.
    const defaultValue =
        listVariable === undefined
            ? listEntryDefaultValue(
                  core.componentInfoObjects.allComponentClasses[
                      listClass.listEntryComponentType
                  ],
                  entryProperty,
              )
            : undefined;

    const propertyType = listEntryPropertyType(
        listClass,
        entryProperty,
        core.componentInfoObjects,
    );
    // A property the list computes from an entry's value is, for a blank
    // entry (`entriesMissing`, D40), the blank of its type, not what it
    // computes from the blank value: `$pl.y` of a `<pointList>` whose second
    // entry is blank is `6, ＿`, not `6, 0`. A reference to one entry's
    // property is missing then too (`valueMissingDefinition`).
    // So is the text or LaTeX of a blank entry: `$nl.text` of
    // `<numberList>1 $nothing 3</numberList>` is `1, ＿, 3`, not `1, NaN, 3`,
    // and of a `<booleanList>`, `＿`, not `false` (D40, #2460).
    const blankOfProperty =
        "entriesMissing" in component.state &&
        (derived || entryProperty === "text" || entryProperty === "latex")
            ? blankPropertyValue(
                  entryProperty === "latex" ? "latex" : propertyType,
              )
            : undefined;

    const definition = {
        isArray: true,
        entryPrefixes: [`${LIST_ENTRY_PREFIX}${entryProperty}_`],
        // A property of an entry is a value the entry holds, as the values
        // are (`recursiveDependencyBoundary` of the list's values array): an
        // answer that reads `$l[2].math` sees a change elsewhere in the list
        // (its length) as no change to it.
        recursiveDependencyBoundary: true,
        shadowingInstructions: {
            createComponentOfType: propertyType,
            ...withCopiedAttributes(
                entryCompanions(
                    core,
                    listClass,
                    derived ? derived.companionsOf : entryProperty,
                ),
                entryProperty === "value"
                    ? listClass.listEntryCopiedAttributes
                    : undefined,
            ),
        },
        returnArraySizeDependencies: () => ({
            numEntries: {
                dependencyType: "stateVariable",
                variableName: listClass.listEntryCountVariable,
            },
        }),
        returnArraySize({ dependencyValues }: any) {
            return [dependencyValues.numEntries];
        },
        // An entry of an array of the list is read by itself, so that the
        // entry depends on its own value alone.
        returnArrayDependenciesByKey: ({ arrayKeys }: any) => {
            if (listVariable === undefined) {
                return {};
            }
            // A property written through another variable of the list
            // (`writeThrough`), which gathers what one write sets of each
            // entry (the coordinates of a math read as a point).
            const globalDependencies: Record<string, any> =
                derived?.writeThrough
                    ? {
                          writeThrough: {
                              dependencyType: "stateVariable",
                              variableName: derived.writeThrough,
                          },
                      }
                    : {};
            const dependenciesByKey: Record<string, any> = {};
            for (const arrayKey of arrayKeys) {
                dependenciesByKey[arrayKey] = {
                    ...(listArray
                        ? {
                              value: {
                                  dependencyType: "stateVariable",
                                  variableName: `${listArray.entryPrefixes[0]}${Number(arrayKey) + 1}`,
                                  variablesOptional: true,
                              },
                          }
                        : {}),
                    ...(blankOfProperty === undefined
                        ? {}
                        : {
                              entryMissing: {
                                  dependencyType: "stateVariable",
                                  variableName: `entryMissing${Number(arrayKey) + 1}`,
                                  variablesOptional: true,
                              },
                          }),
                };
            }
            if (listArray) {
                return { globalDependencies, dependenciesByKey };
            }
            return {
                globalDependencies: {
                    ...globalDependencies,
                    value: {
                        dependencyType: "stateVariable",
                        variableName: listVariable,
                    },
                },
                dependenciesByKey,
            };
        },
        arrayDefinitionByKey({
            globalDependencyValues,
            dependencyValuesByKey,
            arrayKeys,
        }: any) {
            const values: Record<string, any> = {};
            for (const arrayKey of arrayKeys) {
                const value =
                    listVariable === undefined
                        ? defaultValue
                        : listArray
                          ? (dependencyValuesByKey[arrayKey]?.value ?? null)
                          : perEntry
                            ? (globalDependencyValues.value[arrayKey] ?? null)
                            : globalDependencyValues.value;
                values[arrayKey] = dependencyValuesByKey[arrayKey]?.entryMissing
                    ? blankOfProperty
                    : derived && value !== null
                      ? derived.compute(value)
                      : value;
            }
            return { setValue: { [arrayName]: values } };
        },
        // A write to an entry's property is a write to the list's variable
        // for it at that entry, or, for a derived property that can be
        // inverted (`invert`), to the entry property it derives from; one
        // shared by every entry, a default or another derived property is
        // not written through an entry.
        inverseArrayDefinitionByKey({
            desiredStateVariableValues,
            dependencyNamesByKey,
        }: any) {
            if (derived?.writeThrough) {
                const desired = desiredStateVariableValues[arrayName];
                const desiredValue: Record<string, any> = {};
                for (const arrayKey in desired) {
                    desiredValue[arrayKey] = derived.writeThroughValue(
                        desired[arrayKey],
                    );
                }
                return {
                    success: true,
                    instructions: [
                        { setDependency: "writeThrough", desiredValue },
                    ],
                };
            }
            if (
                listVariable === undefined ||
                !perEntry ||
                (derived && !(derived.invert && listArray))
            ) {
                return { success: false };
            }
            const desired = desiredStateVariableValues[arrayName];
            if (listArray) {
                // an entry past the end of the list takes no write
                const instructions = Object.keys(desired)
                    .filter((arrayKey) => dependencyNamesByKey[arrayKey])
                    .map((arrayKey) => ({
                        setDependency: dependencyNamesByKey[arrayKey].value,
                        desiredValue: derived
                            ? derived.invert(desired[arrayKey])
                            : desired[arrayKey],
                    }));
                return instructions.length > 0
                    ? { success: true, instructions }
                    : { success: false };
            }
            return {
                success: true,
                instructions: [
                    {
                        setDependency: "value",
                        desiredValue: { ...desired },
                    },
                ],
            };
        },
    };
    // An index into an entry that reaches a scalar names nothing and is
    // reported (`arrayEntryNamesFromPropIndex`), as one into a `<math>`
    // holding a scalar is: `$l[2][1]` of `<mathList>1 2</mathList>` as
    // `$m[1]` of `<math>2</math>`.
    if (derived?.indexIntoScalar && listArray) {
        (definition as any).indexIntoScalar = async (
            list: any,
            propIndex: number[],
        ) => {
            const values = await list.stateValues[listVariable];
            const value = values?.[propIndex[0] - 1];
            return value != null && derived.indexIntoScalar(value);
        };
    }

    // An entry that stands for a component (`listEntrySourcesVariable`) has
    // that component's value of a property the list does not hold entry by
    // entry, as the copy of the component a composite made had.
    const sourcesVariable = listClass.listEntrySourcesVariable;
    if (sourcesVariable !== undefined && !derived && !perEntry) {
        readFromSources(definition, sourcesVariable, entryProperty);
    }

    normalizeArrayStateVariableDefaults(definition, arrayName);

    addStateVariablePlaceholder({
        core,
        component,
        stateVariable: arrayName,
        definition: Object.create(definition),
    });
}

/**
 * The value of an entry property of type `componentType` that a blank entry
 * has (as `blankValue` in `AuthoredValueList.js`): `＿` for a math or a
 * point's `coords`, `NaN` for a number, `""` for a text and `false` for a
 * boolean, and one blank for a `mathList` (a point's `xs`). `undefined`
 * for any other type, which is computed from the blank value.
 */
function blankPropertyValue(componentType: string | undefined) {
    switch (componentType) {
        case "math":
        case "coords":
            return me.fromAst("＿");
        case "number":
        case "integer":
            return NaN;
        case "text":
            // a missing text shows as a blank (D37)
            return "＿";
        case "latex":
            return "＿";
        case "boolean":
            return false;
        case "mathList":
            // one blank, as a list tag of an index that names nothing holds
            return [me.fromAst("＿")];
        case "numberList":
            // one blank, as for a `mathList`: `matrixSize` of a blank entry
            // is `＿`, not the `1, 1` of the blank value (D40, #2460)
            return [NaN];
        default:
            return undefined;
    }
}

/**
 * The variables that travel with `entryProperty` of an entry, as they do
 * with that property of a component of the entries' type (the display
 * settings with a `<math>`'s `number`), read from the list's variables the
 * entries share. None for a derived property that names no property to
 * travel with (`companionsOf`).
 */
function entryCompanions(
    core: any,
    listClass: any,
    entryProperty: string | undefined,
) {
    const entryClass =
        core.componentInfoObjects.allComponentClasses[
            listClass.listEntryComponentType
        ];
    const instructions =
        (entryProperty !== undefined &&
            getClassStateVariableDefinitions(core, entryClass).combined[
                entryProperty
            ]?.shadowingInstructions) ||
        {};
    const companions: Record<string, any> = {};
    for (const kind of [
        "addAttributeComponentsShadowingStateVariables",
        "addStateVariablesShadowingStateVariables",
    ]) {
        const shadowing: Record<string, any> = {};
        for (const name in instructions[kind] ?? {}) {
            const entryVariable =
                instructions[kind][name].stateVariableToShadow;
            // the entry's own value, when the list holds one per entry
            const ownArray = listClass.listEntryOwnArrays[entryVariable];
            if (ownArray !== undefined) {
                shadowing[name] = {
                    ...instructions[kind][name],
                    stateVariableToShadow: ownArray,
                };
                continue;
            }
            const listVariable =
                listClass.listEntryStateVariables[entryVariable];
            if (
                listVariable !== undefined &&
                !listClass.listPerEntryVariables.includes(listVariable)
            ) {
                shadowing[name] = {
                    ...instructions[kind][name],
                    stateVariableToShadow: listVariable,
                };
            }
        }
        if (Object.keys(shadowing).length > 0) {
            companions[kind] = shadowing;
        }
    }
    return companions;
}

/**
 * `companions` with the attributes that a component made from an entry
 * takes from the list (`listEntryCopiedAttributes`), for the entry itself.
 */
function withCopiedAttributes(
    companions: Record<string, any>,
    copiedAttributes: Record<string, any> | undefined,
) {
    if (!copiedAttributes || Object.keys(copiedAttributes).length === 0) {
        return companions;
    }
    return {
        ...companions,
        addAttributeComponentsShadowingStateVariables: {
            ...companions.addAttributeComponentsShadowingStateVariables,
            ...copiedAttributes,
        },
    };
}

/**
 * Make `definition`, the array of `entryProperty` of each entry of a list,
 * read that property of the component each entry stands for, by the list's
 * `sourcesVariable` (a component index, or `null`, for each entry), and
 * write it there; an entry that stands for no component, or whose component
 * lacks the property, keeps what `definition` gives it.
 */
function readFromSources(
    definition: any,
    sourcesVariable: string,
    entryProperty: string,
) {
    const {
        returnArrayDependenciesByKey,
        arrayDefinitionByKey,
        inverseArrayDefinitionByKey,
    } = definition;

    definition.stateVariablesDeterminingDependencies = [sourcesVariable];
    definition.returnArrayDependenciesByKey = (args: any) => {
        const dependencies = returnArrayDependenciesByKey(args) ?? {};
        const dependenciesByKey: Record<string, any> = {
            ...(dependencies.dependenciesByKey ?? {}),
        };
        for (const arrayKey of args.arrayKeys) {
            const sourceIdx = args.stateValues[sourcesVariable]?.[arrayKey];
            if (typeof sourceIdx === "number") {
                dependenciesByKey[arrayKey] = {
                    ...dependenciesByKey[arrayKey],
                    fromSource: {
                        dependencyType: "stateVariable",
                        componentIdx: sourceIdx,
                        variableName: entryProperty,
                        variablesOptional: true,
                    },
                };
            }
        }
        return { ...dependencies, dependenciesByKey };
    };
    definition.arrayDefinitionByKey = (args: any) => {
        const result = arrayDefinitionByKey(args);
        const [arrayName] = Object.keys(result.setValue);
        for (const arrayKey of args.arrayKeys) {
            const fromSource = args.dependencyValuesByKey[arrayKey]?.fromSource;
            if (fromSource !== undefined && fromSource !== null) {
                result.setValue[arrayName][arrayKey] = fromSource;
            }
        }
        return result;
    };
    definition.inverseArrayDefinitionByKey = (args: any) => {
        const [arrayName] = Object.keys(args.desiredStateVariableValues);
        const desired = args.desiredStateVariableValues[arrayName];
        const instructions = [];
        const rest: Record<string, any> = {};
        for (const arrayKey in desired) {
            const name = args.dependencyNamesByKey[arrayKey]?.fromSource;
            if (name !== undefined) {
                instructions.push({
                    setDependency: name,
                    desiredValue: desired[arrayKey],
                });
            } else {
                rest[arrayKey] = desired[arrayKey];
            }
        }
        if (Object.keys(rest).length > 0) {
            const result = inverseArrayDefinitionByKey({
                ...args,
                desiredStateVariableValues: { [arrayName]: rest },
            });
            if (!result.success) {
                return result;
            }
            instructions.push(...result.instructions);
        }
        return { success: true, instructions };
    };
}
