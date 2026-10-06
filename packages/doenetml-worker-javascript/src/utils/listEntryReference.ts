/**
 * How a reference reads a property of the entries of a list component
 * (`listEntryComponentType`, see `BaseComponent`; Doenet/DoenetML#2157).
 *
 * `$l[2].text` reads the `text` of entry 2, and `$l.text` the `text` of
 * every entry, one value per entry, as a reference reads the property of
 * each component of the entries' type. An entry property is a public state
 * variable of the entries' type (with its aliases and in any case) that the
 * list provides for its entries (`listEntryStateVariables`), that the list
 * computes from another entry property (`listEntryDerivedProperties`,
 * `$l[2].numDimensions`), or that a component of that type takes from an
 * attribute with a default (`$l[2].simplify`), which an entry, written with
 * no attributes, has (`listEntryDefaultValue`). The list's own properties
 * (`listOwnProperties`) and its other variables are read from the list as
 * usual: `$l.styleNumber` is one value, as is `$l.numEntries`.
 *
 * The reference resolves such a path to an array of the list, with one value
 * per entry: the list's own array of values for `value`
 * (`variableForIndexAsProp`) and other per-entry variables that are arrays,
 * and otherwise an array made on the list when first asked for
 * (`ensureListEntryPropertyArray` in
 * `core/listEntryPropertyArrays.ts`), which reads the list's variable for the
 * property, entry by entry or, for a variable the entries share, the same
 * value for each, computes the property from the entry property it derives
 * from, or holds the default of every entry. The array's entries are made as
 * components of the type of the entries' property.
 */
import type { ComponentInfoObjects } from "./componentInfoObjects";
import { publicCaseInsensitiveAliasSubstitutions } from "../StateVariableNameResolver";

type PathPart = { name: string; index: any[]; [key: string]: any };

/** The prefix of the arrays made for entry properties. */
export const LIST_ENTRY_ARRAY_PREFIX = "__listEntries_";

/** Whether `name` is an array made for an entry property, or one of its entries. */
export function isListEntryPropertyVariable(name: string): boolean {
    return (
        name.startsWith(LIST_ENTRY_ARRAY_PREFIX) ||
        name.startsWith("__listEntry_")
    );
}

/**
 * Whether `name` is, on the list component `component`, an array holding a
 * value per entry (`listPerEntryVariables`, or one made for an entry
 * property) or an entry of one, which a reference reads through
 * `listEntryPropertyPath` rather than as one of the list's properties.
 */
export function isListEntryArrayVariable(
    component: any,
    name: string,
): boolean {
    const listClass = component?.constructor;
    if (listClass?.listEntryComponentType === undefined) {
        return false;
    }
    if (isListEntryPropertyVariable(name)) {
        return true;
    }
    let arrayName = name;
    const stateVarObj = component.state[name];
    if (stateVarObj?.isArrayEntry) {
        arrayName = stateVarObj.arrayStateVariable;
    } else if (!stateVarObj) {
        const prefix = Object.keys(component.arrayEntryPrefixes ?? {})
            .filter((prefix) => name.startsWith(prefix))
            .sort((a, b) => b.length - a.length)[0];
        if (prefix !== undefined) {
            arrayName = component.arrayEntryPrefixes[prefix];
        }
    }
    return (
        listClass.listPerEntryVariables.includes(arrayName) ||
        Object.values(listClass.listEntryOwnArrays).includes(arrayName)
    );
}

/**
 * The entry property of a list of class `listClass` that `name` designates,
 * or `undefined` when `name` is not one.
 */
function entryPropertyOf(
    listClass: any,
    name: string,
    componentInfoObjects: ComponentInfoObjects,
): string | undefined {
    const entryClass =
        componentInfoObjects.allComponentClasses[
            listClass.listEntryComponentType
        ];
    if (!entryClass || !name) {
        return undefined;
    }
    const [property] = publicCaseInsensitiveAliasSubstitutions({
        stateVariables: [name],
        componentClass: entryClass,
        componentInfoObjects,
    });
    if (
        property.startsWith("__not_public_") ||
        !(
            property in listClass.listEntryStateVariables ||
            listClass.derivedEntryProperty(property) !== undefined ||
            listEntryDefaultValue(entryClass, property) !== undefined
        )
    ) {
        return undefined;
    }
    return property;
}

/**
 * The entry property that `part`, a property of the entries with one index
 * (`xs[2]`), reads: for an array property with the index written as a
 * number, the entry of that array as an entry of the entries' type names it
 * (`x2`), when the list provides it; for a property that is not an array
 * (`coords[1]`), the property, as an index into it is ignored for a
 * component of the entries' type. `undefined` otherwise.
 */
function indexedEntryProperty(
    listClass: any,
    part: PathPart,
    componentInfoObjects: ComponentInfoObjects,
): string | undefined {
    const property = entryPropertyOf(
        listClass,
        part.name,
        componentInfoObjects,
    );
    if (
        property !== undefined &&
        !(
            componentInfoObjects.stateVariableInfo[
                listClass.listEntryComponentType
            ]?.stateVariableDescriptions[property] as any
        )?.isArray
    ) {
        return property;
    }
    const indexValue = part.index[0]?.value;
    if (
        !Array.isArray(indexValue) ||
        indexValue.length !== 1 ||
        typeof indexValue[0] !== "string"
    ) {
        return undefined;
    }
    const index = Number(indexValue[0]);
    if (!Number.isInteger(index) || index < 1) {
        return undefined;
    }
    const entryClass =
        componentInfoObjects.allComponentClasses[
            listClass.listEntryComponentType
        ];
    if (!entryClass) {
        return undefined;
    }
    const [arrayName] = publicCaseInsensitiveAliasSubstitutions({
        stateVariables: [part.name],
        componentClass: entryClass,
        componentInfoObjects,
    });
    const prefixes =
        componentInfoObjects.stateVariableInfo[listClass.listEntryComponentType]
            ?.arrayEntryPrefixes ?? {};
    const prefix = Object.keys(prefixes).find(
        (prefix) =>
            prefixes[prefix].arrayVariableName === arrayName &&
            // a prefix naming one entry, not a row of a matrix
            !prefixes[prefix].numDimensions,
    );
    if (prefix === undefined) {
        return undefined;
    }
    return entryPropertyOf(
        listClass,
        `${prefix}${index}`,
        componentInfoObjects,
    );
}

const attributeDefaultsByClass = new WeakMap<any, Record<string, unknown>>();

/**
 * The value that `property` of a component of class `entryClass` with no
 * attributes has, when it is taken from an attribute with a default;
 * `undefined` otherwise.
 */
export function listEntryDefaultValue(
    entryClass: any,
    property: string,
): unknown {
    let defaults = attributeDefaultsByClass.get(entryClass);
    if (!defaults) {
        defaults = {};
        const attributes = entryClass.createAttributesObject();
        for (const attrName in attributes) {
            const { createStateVariable, defaultValue } = attributes[attrName];
            if (createStateVariable && defaultValue !== undefined) {
                defaults[createStateVariable] = defaultValue;
            }
        }
        attributeDefaultsByClass.set(entryClass, defaults);
    }
    return defaults[property];
}

/**
 * The path that reads, on a list of class `listClass`, what `unresolvedPath`
 * reads of its entries: `[i]` becomes entry `i` of the array of values,
 * `[i].prop` entry `i` of the array for `prop`, `[i][j]` entry `i` of the
 * array for coordinate `xj` of math entries, and `.prop` the whole
 * array. `undefined` when `listClass` is not a
 * list component or the path names no entry property, so that the path is
 * resolved as it is.
 */
export function listEntryPropertyPath({
    listClass,
    unresolvedPath,
    componentInfoObjects,
}: {
    listClass: any;
    unresolvedPath: PathPart[] | null | undefined;
    componentInfoObjects: ComponentInfoObjects;
}):
    | {
          path: [PathPart];
          entryProperty: string;
          /** Set for `[i].prop`: what is read is one value. */
          isEntry: boolean;
      }
    | undefined {
    if (listClass?.listEntryComponentType === undefined || !unresolvedPath) {
        return undefined;
    }
    const [first, second] = unresolvedPath;

    // A bare index (`$l[2]`) reads the entry's value, from the list's array
    // of values, which is not one of the list's properties.
    if (
        unresolvedPath.length === 1 &&
        first.name === "" &&
        first.index.length === 1
    ) {
        return {
            path: [
                {
                    ...first,
                    name: arrayForEntryProperty(
                        listClass,
                        "value",
                        componentInfoObjects,
                    ),
                },
            ],
            entryProperty: "value",
            isEntry: true,
        };
    }

    // A second index (`$l[2][3]`) reads a coordinate of a math entry, as
    // `$m[3]` reads one of a `<math>`.
    if (
        unresolvedPath.length === 1 &&
        first.name === "" &&
        first.index.length === 2
    ) {
        const coordinate = Math.round(Number(first.index[1].value?.[0]));
        const entryProperty = `x${coordinate}`;
        if (
            Number.isFinite(coordinate) &&
            listClass.derivedEntryProperty(entryProperty) !== undefined
        ) {
            return {
                path: [
                    {
                        ...first,
                        name: arrayForEntryProperty(
                            listClass,
                            entryProperty,
                            componentInfoObjects,
                        ),
                        index: [first.index[0]],
                    },
                ],
                entryProperty,
                isEntry: true,
            };
        }
    }

    // A property of an entry with an index into it (`$l[2].xs[1]`) reads
    // the entry property that names that entry of the property's array
    // (`x1`).
    if (
        unresolvedPath.length === 2 &&
        first.name === "" &&
        first.index.length === 1 &&
        second.index.length === 1
    ) {
        const entryProperty = indexedEntryProperty(
            listClass,
            second,
            componentInfoObjects,
        );
        if (entryProperty === undefined) {
            return undefined;
        }
        return {
            path: [
                {
                    ...second,
                    name: arrayForEntryProperty(
                        listClass,
                        entryProperty,
                        componentInfoObjects,
                    ),
                    index: first.index,
                },
            ],
            entryProperty,
            isEntry: true,
        };
    }

    // The same of every entry (`$l.xs[1]`).
    if (
        unresolvedPath.length === 1 &&
        first.name !== "" &&
        first.index.length === 1
    ) {
        const entryProperty = indexedEntryProperty(
            listClass,
            first,
            componentInfoObjects,
        );
        if (
            entryProperty === undefined ||
            listClass.listOwnProperties.includes(entryProperty)
        ) {
            return undefined;
        }
        return {
            path: [
                {
                    ...first,
                    name: arrayForEntryProperty(
                        listClass,
                        entryProperty,
                        componentInfoObjects,
                    ),
                    index: [],
                },
            ],
            entryProperty,
            isEntry: false,
        };
    }

    if (
        unresolvedPath.length === 2 &&
        first.name === "" &&
        first.index.length === 1 &&
        second.index.length === 0
    ) {
        const entryProperty = entryPropertyOf(
            listClass,
            second.name,
            componentInfoObjects,
        );
        if (entryProperty === undefined) {
            return undefined;
        }
        return {
            path: [
                {
                    ...second,
                    name: arrayForEntryProperty(
                        listClass,
                        entryProperty,
                        componentInfoObjects,
                    ),
                    index: first.index,
                },
            ],
            entryProperty,
            isEntry: true,
        };
    }

    if (unresolvedPath.length === 1 && first.index.length === 0) {
        const entryProperty = entryPropertyOf(
            listClass,
            first.name,
            componentInfoObjects,
        );
        if (
            entryProperty === undefined ||
            listClass.listOwnProperties.includes(entryProperty)
        ) {
            return undefined;
        }
        return {
            path: [
                {
                    ...first,
                    name: arrayForEntryProperty(
                        listClass,
                        entryProperty,
                        componentInfoObjects,
                    ),
                },
            ],
            entryProperty,
            isEntry: false,
        };
    }

    return undefined;
}

/**
 * The type of a component holding the value of `entryProperty` of an entry
 * of a list of class `listClass`.
 */
export function listEntryPropertyType(
    listClass: any,
    entryProperty: string,
    componentInfoObjects: ComponentInfoObjects,
): string | undefined {
    const derived = listClass.derivedEntryProperty(entryProperty);
    if (derived) {
        return derived.componentType;
    }
    const type = (
        componentInfoObjects.publicStateVariableInfo[
            listClass.listEntryComponentType
        ]?.stateVariableDescriptions[entryProperty] as any
    )?.createComponentOfType;
    return typeof type === "string" ? type : undefined;
}

/**
 * The name of the array of the list holding `entryProperty` of each entry.
 */
function arrayForEntryProperty(
    listClass: any,
    entryProperty: string,
    componentInfoObjects: ComponentInfoObjects,
): string {
    const ownArray = listClass.listEntryOwnArrays[entryProperty];
    if (ownArray !== undefined) {
        return ownArray;
    }
    const listVariable = listClass.listEntryStateVariables[entryProperty];
    const description = (
        componentInfoObjects.stateVariableInfo[listClass.componentType]
            ?.stateVariableDescriptions as any
    )?.[listVariable];
    if (
        listClass.listPerEntryVariables.includes(listVariable) &&
        description?.isArray
    ) {
        return listVariable;
    }
    return LIST_ENTRY_ARRAY_PREFIX + entryProperty;
}
