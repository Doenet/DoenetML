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
import { VALUE_ENTRY_PREFIX } from "./mathVectorMatrixStateVariables";

type PathPart = { name: string; index: any[]; [key: string]: any };

/** The prefix of the arrays made for entry properties. */
export const LIST_ENTRY_ARRAY_PREFIX = "__listEntries_";

/**
 * The prefix of the entries of those arrays, followed by the property
 * (`__listEntry_value_2`).
 */
export const LIST_ENTRY_PREFIX = "__listEntry_";

/** Whether `name` is an array made for an entry property, or one of its entries. */
export function isListEntryPropertyVariable(name: string): boolean {
    return (
        name.startsWith(LIST_ENTRY_ARRAY_PREFIX) ||
        name.startsWith(LIST_ENTRY_PREFIX)
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
 * (`coords[1]`), the property, ignoring the index. `undefined` otherwise.
 *
 * For that last case, the caller makes the index name nothing, as it does
 * for `$P.coords[1]` (`doenet-w0100`, #2407): `listEntryPropertyPath`
 * resolves `$l[2].coords[1]`, and an index below 1 (`$l[2].xs[0]`), before
 * asking this, and gives `$l.coords[1]` an index too many.
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
 * array for what index `j` reads of the entries (`__valueEntryj` of math
 * entries, coordinate `xj` of point entries), `.value[i]` the same as
 * `[i]`, and `.prop` the whole array. `undefined` when `listClass` is not a
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

    // A second index (`$l[2][3]`) reads what an index reads of the entry
    // (D27, "Values with entries"): an entry of the value of a math entry,
    // as `$m[3]` reads of a `<math>`, and a coordinate of a point entry, as
    // `$P[3]` reads of a `<point>`, also of a list that a repeat of points
    // became (`$r[2][1]`). Further indices index on in the value of a math
    // entry (`$l[2][1][2]`, as `$m[1][2]`), and name nothing in a coordinate
    // of a point entry, which is reported as `$P[1][1]` is: they are left on
    // the path, an index too many for the entry's array
    // (`arrayEntryNamesFromPropIndex`). An index below 1 names nothing, and
    // is reported as `$m[0]` is.
    if (
        unresolvedPath.length === 1 &&
        first.name === "" &&
        first.index.length >= 2
    ) {
        const indices = first.index
            .slice(1)
            .map((index: any) => Math.round(Number(index.value?.[0])));
        if (indices.some((index: number) => index < 1)) {
            return indexNamingNothing(listClass, first, componentInfoObjects);
        }
        // A `<math>` entry is indexed by its value's entries (a tuple's
        // entries, a matrix's rows); a point or vector entry by its
        // coordinates, which it has also in one dimension, where its value is
        // a single number.
        const numRead =
            listClass.listEntryComponentType === "math" ? indices.length : 1;
        const property =
            listClass.listEntryComponentType === "math"
                ? `${VALUE_ENTRY_PREFIX}${indices.slice(0, numRead).join("_")}`
                : `x${indices[0]}`;
        const entryProperty =
            listClass.derivedEntryProperty(property) !== undefined ||
            entryPropertyOf(listClass, property, componentInfoObjects) !==
                undefined
                ? property
                : undefined;
        if (indices.every(Number.isFinite) && entryProperty !== undefined) {
            return {
                path: [
                    {
                        ...first,
                        name: arrayForEntryProperty(
                            listClass,
                            entryProperty,
                            componentInfoObjects,
                        ),
                        index: [
                            first.index[0],
                            ...first.index.slice(1 + numRead),
                        ],
                    },
                ],
                entryProperty,
                isEntry: true,
            };
        }
        // An entry whose value has no entries (a number, a text) names
        // nothing at a second index, and is reported as `$n[1]` is, and as
        // `$l[2][1]` of a `<mathList>` holding a scalar is (D27, NAME-2,
        // #2478): the list's array of values is given an index too many
        // (`arrayEntryNamesFromPropIndex`). It used to be resolved as it
        // is, which named nothing silently.
        const entryClass =
            componentInfoObjects.allComponentClasses[
                listClass.listEntryComponentType
            ];
        if (
            indices.every(Number.isFinite) &&
            entryClass &&
            !(entryClass as any).variableForIndexAsProp
        ) {
            return indexNamingNothing(listClass, first, componentInfoObjects);
        }
    }

    // A property of an entry with an index into it (`$l[2].xs[1]`) reads
    // the entry property that names that entry of the property's array
    // (`x1`).
    if (
        unresolvedPath.length === 2 &&
        first.name === "" &&
        first.index.length === 1 &&
        second.index.length >= 1
    ) {
        const property = entryPropertyOf(
            listClass,
            second.name,
            componentInfoObjects,
        );
        // An index into the entry's value is an index into the entry, as
        // `$m.value[2]` is `$m[2]` (D27): `$l[1].value[2]` of a list of maths
        // or points is `$l[1][2]`, and `$l[1].value[2][1]` is `$l[1][2][1]`.
        // Where an index selects nothing in an entry (a list of numbers),
        // the value is not an array, and the index is reported as on one
        // below, as `$n.value[1]` is.
        // Recognized by the name written as well as the property it names,
        // since a point's `value` is an alias of its `coords`.
        const asIndex =
            property === "value" || second.name.toLowerCase() === "value"
                ? listEntryPropertyPath({
                      listClass,
                      unresolvedPath: [
                          {
                              ...first,
                              index: [...first.index, ...second.index],
                          },
                      ],
                      componentInfoObjects,
                  })
                : undefined;
        if (asIndex) {
            return asIndex;
        }
        // An index into the entry's value that is not a number written out
        // (`$l[1].value[$i]`, read before `$i` is) is an index into the
        // entry too, which is decided once the index is known, as for
        // `$l[1][$i]`. It is not the entry's value with an index too many,
        // which a value reference planned from it would read as a value of
        // the wrong type, naming nothing silently where `$l[1].value[1]`
        // names the coordinate (#2478).
        if (
            (property === "value" || second.name.toLowerCase() === "value") &&
            second.index.some(
                (index: any) => !Number.isFinite(Number(index.value?.[0])),
            )
        ) {
            return undefined;
        }
        if (property !== undefined) {
            // An index below 1 into a property of the entry names nothing,
            // and is reported as `$P.xs[0]` is.
            if (
                second.index.some(
                    (index: any) => Math.round(Number(index.value?.[0])) < 1,
                )
            ) {
                return indexNamingNothing(
                    listClass,
                    { ...second, index: [...first.index, ...second.index] },
                    componentInfoObjects,
                );
            }
            // An index into a property that is not an array names nothing,
            // and is reported as `$P.coords[1]` is: the entry's array for
            // the property is given an index too many
            // (`arrayEntryNamesFromPropIndex`).
            if (!isArrayProperty(listClass, property, componentInfoObjects)) {
                return {
                    path: [
                        {
                            ...second,
                            name: arrayForEntryProperty(
                                listClass,
                                property,
                                componentInfoObjects,
                            ),
                            index: [...first.index, ...second.index],
                        },
                    ],
                    entryProperty: property,
                    isEntry: true,
                };
            }
        }
        // The first index names the entry of the property's array (`x1`
        // for `xs[1]`); further indices are left on the path, an index too
        // many for the entry's array (`arrayEntryNamesFromPropIndex`), so
        // `$l[2].xs[1][1]` names nothing and is reported as `$P.xs[1][1]`
        // is (D27, NAME-2, #2478), where it was resolved as it is.
        const entryProperty = indexedEntryProperty(
            listClass,
            { ...second, index: second.index.slice(0, 1) },
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
                    index: [...first.index, ...second.index.slice(1)],
                },
            ],
            entryProperty,
            isEntry: true,
        };
    }

    // An index into the list's value is an index into the list, as
    // `$m.value[2]` is `$m[2]` (D27): `$l.value[2]` is entry 2, and
    // `$l.value[2].x` is `$l[2].x`.
    if (
        unresolvedPath.length <= 2 &&
        first.name.toLowerCase() === "value" &&
        first.index.length > 0
    ) {
        return listEntryPropertyPath({
            listClass,
            unresolvedPath: [
                { ...first, name: "" },
                ...unresolvedPath.slice(1),
            ],
            componentInfoObjects,
        });
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
        // An index into a property that is not an array names nothing, and
        // is reported, as `$P.coords[1]` is: the array of the property of
        // each entry is given an index too many, after one naming an entry
        // (`arrayEntryNamesFromPropIndex`). Not the property of every entry
        // with the index dropped, which `$l.coords[1]` used to read.
        if (
            entryProperty ===
                entryPropertyOf(listClass, first.name, componentInfoObjects) &&
            !isArrayProperty(listClass, entryProperty, componentInfoObjects)
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
                        index: [first.index[0], first.index[0]],
                    },
                ],
                entryProperty,
                isEntry: true,
            };
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
 * The path for an index into an entry that names nothing because part of it
 * is below 1 (`$l[1][0]`, `$l[1].xs[0]`), or because the entry's value has
 * no entries (`$l[1][1]` of a `<numberList>`): the list's array of values
 * with every index of `part`, which `arrayEntryNamesFromPropIndex` reports
 * as it reports `$m[0]` (`doenet-w0104`) or `$n[1]` (`doenet-w0100`).
 */
function indexNamingNothing(
    listClass: any,
    part: PathPart,
    componentInfoObjects: ComponentInfoObjects,
): { path: [PathPart]; entryProperty: string; isEntry: boolean } {
    return {
        path: [
            {
                ...part,
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

/**
 * Whether `property` of the entries of a list of class `listClass` is an
 * array, so that an index into it selects one of its entries.
 */
function isArrayProperty(
    listClass: any,
    property: string,
    componentInfoObjects: ComponentInfoObjects,
): boolean {
    return Boolean(
        (
            componentInfoObjects.stateVariableInfo[
                listClass.listEntryComponentType
            ]?.stateVariableDescriptions[property] as any
        )?.isArray,
    );
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
    if (typeof type === "string") {
        return type;
    }
    // An entry's value is a component of the entries' type, also when that
    // type does not list `value` among its properties (a point).
    return entryProperty === "value"
        ? listClass.listEntryComponentType
        : undefined;
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
    // The values are an array whatever the class is registered as (a list
    // form of `<collect>` of vectors is registered as one of numbers).
    const description = (
        componentInfoObjects.stateVariableInfo[listClass.componentType]
            ?.stateVariableDescriptions as any
    )?.[listVariable];
    if (
        listClass.listPerEntryVariables.includes(listVariable) &&
        (description?.isArray || listVariable === listClass.listValuesArrayName)
    ) {
        return listVariable;
    }
    return LIST_ENTRY_ARRAY_PREFIX + entryProperty;
}

/**
 * The list component and the position (1 for the first) of the entry whose
 * value the value reference `component` (`_ref`) reads, when a copy made it
 * for one (`fixedReferent`, as for `$l[2]`): what a composite `<sort>` or
 * `<shuffle>` makes for an entry of a list among what it sorts
 * (`listEntryReplacement` in `Sort.js`). `undefined` otherwise, as for a
 * reference that reads another property of an entry (`$l[2].text`).
 *
 * A path on such a reference is read on the list as one on the entry
 * (`$l[2].hide` for `$s[1].hide`, #2480), since the reference stands for
 * the entry, which has the properties of its type, and the reference has
 * none of its own.
 */
export function listEntryOfValueReference(
    component: any,
    components: Record<number, any>,
    componentInfoObjects: ComponentInfoObjects,
): { list: any; position: number } | undefined {
    const fixedReferent = component?.doenetAttributes?.fixedReferent;
    const position = fixedReferent?.listEntryPosition;
    if (component?.componentType !== "_ref" || position === undefined) {
        return undefined;
    }
    const list = components[fixedReferent.componentIdx];
    const listClass = list?.constructor;
    if (listClass?.listEntryComponentType === undefined) {
        return undefined;
    }
    const valuesArray = arrayForEntryProperty(
        listClass,
        "value",
        componentInfoObjects,
    );
    if (
        list.state[fixedReferent.referencedVariable]?.arrayStateVariable !==
        valuesArray
    ) {
        return undefined;
    }
    return { list, position };
}
