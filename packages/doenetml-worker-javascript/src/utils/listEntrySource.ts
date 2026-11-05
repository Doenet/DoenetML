/**
 * How a component made from an entry of a list of points or vectors (`$c[1]`
 * in a graph, `<point extend="$c[1]"/>`) reads a variable of the entry's
 * source from the list. `Copy.js` records, on the component, the list, the
 * entry's index and the arrays of the list holding each such variable
 * (`listEntrySource`, from `listEntrySourceVariables`).
 */

type ListEntrySource = {
    componentIdx: number;
    index: number;
    variables: Record<string, string>;
};

/**
 * The dependencies by which `component` reads `variable` of its entry's
 * source from the list; none for a component not made from an entry, or for
 * a list that does not hold the variable.
 */
export function listEntrySourceDependencies(
    component: { doenetAttributes?: { listEntrySource?: ListEntrySource } },
    variable: string,
) {
    const listEntrySource = component?.doenetAttributes?.listEntrySource;
    const arrayName = listEntrySource?.variables[variable];
    if (!arrayName) {
        return {};
    }
    return {
        listEntryValues: {
            dependencyType: "stateVariable",
            componentIdx: listEntrySource.componentIdx,
            variableName: arrayName,
            variablesOptional: true,
        },
        listEntryIndex: {
            dependencyType: "value",
            value: listEntrySource.index,
        },
    };
}

/**
 * The value read by `listEntrySourceDependencies`: the source's, or `null`
 * where the source sets none or the component is not made from an entry.
 */
export function listEntrySourceValue(dependencyValues: {
    listEntryValues?: unknown[] | null;
    listEntryIndex?: number;
}) {
    if (dependencyValues.listEntryIndex === undefined) {
        return null;
    }
    return (
        dependencyValues.listEntryValues?.[dependencyValues.listEntryIndex] ??
        null
    );
}
