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
    const listVariable = listClass.listEntryStateVariables[entryProperty];
    const perEntry = listClass.listPerEntryVariables.includes(listVariable);
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
        shadowingInstructions: {
            createComponentOfType: listEntryPropertyType(
                listClass,
                entryProperty,
                core.componentInfoObjects,
            ),
            ...entryCompanions(core, listClass, entryProperty),
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
        returnArrayDependenciesByKey: () =>
            listVariable === undefined
                ? {}
                : {
                      globalDependencies: {
                          value: {
                              dependencyType: "stateVariable",
                              variableName: listVariable,
                          },
                      },
                  },
        arrayDefinitionByKey({ globalDependencyValues, arrayKeys }: any) {
            const values: Record<string, any> = {};
            for (const arrayKey of arrayKeys) {
                values[arrayKey] =
                    listVariable === undefined
                        ? defaultValue
                        : perEntry
                          ? (globalDependencyValues.value[arrayKey] ?? null)
                          : globalDependencyValues.value;
            }
            return { setValue: { [arrayName]: values } };
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
 * entries share.
 */
function entryCompanions(core: any, listClass: any, entryProperty: string) {
    const entryClass =
        core.componentInfoObjects.allComponentClasses[
            listClass.listEntryComponentType
        ];
    const instructions =
        getClassStateVariableDefinitions(core, entryClass).combined[
            entryProperty
        ]?.shadowingInstructions ?? {};
    const companions: Record<string, any> = {};
    for (const kind of [
        "addAttributeComponentsShadowingStateVariables",
        "addStateVariablesShadowingStateVariables",
    ]) {
        const shadowing: Record<string, any> = {};
        for (const name in instructions[kind] ?? {}) {
            const listVariable =
                listClass.listEntryStateVariables[
                    instructions[kind][name].stateVariableToShadow
                ];
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
