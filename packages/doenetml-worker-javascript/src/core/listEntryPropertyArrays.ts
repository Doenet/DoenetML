/**
 * The arrays a list component (`listEntryComponentType`) is given when a
 * reference reads a property of its entries (`utils/listEntryReference.ts`).
 */
import { getClassStateVariableDefinitions } from "./StateVariableDefinitionFactory";
import {
    addStateVariablePlaceholder,
    normalizeArrayStateVariableDefaults,
} from "./StateVariableInitializer";
import {
    LIST_ENTRY_ARRAY_PREFIX,
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

    const definition = {
        isArray: true,
        entryPrefixes: [`__listEntry_${entryProperty}_`],
        // A property of an entry is a value the entry holds, as the values
        // are (`recursiveDependencyBoundary` of the list's values array): an
        // answer that reads `$l[2].math` sees a change elsewhere in the list
        // (its length) as no change to it.
        recursiveDependencyBoundary: true,
        shadowingInstructions: {
            createComponentOfType: listEntryPropertyType(
                listClass,
                entryProperty,
                core.componentInfoObjects,
            ),
            ...entryCompanions(
                core,
                listClass,
                derived ? derived.companionsOf : entryProperty,
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
            if (listArray) {
                const dependenciesByKey: Record<string, any> = {};
                for (const arrayKey of arrayKeys) {
                    dependenciesByKey[arrayKey] = {
                        value: {
                            dependencyType: "stateVariable",
                            variableName: `${listArray.entryPrefixes[0]}${Number(arrayKey) + 1}`,
                            variablesOptional: true,
                        },
                    };
                }
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
                values[arrayKey] =
                    derived && value !== null ? derived.compute(value) : value;
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
    normalizeArrayStateVariableDefaults(definition, arrayName);

    addStateVariablePlaceholder({
        core,
        component,
        stateVariable: arrayName,
        definition: Object.create(definition),
    });
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
