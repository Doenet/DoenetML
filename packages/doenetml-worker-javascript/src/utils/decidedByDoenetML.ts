/**
 * Whether part of a component is decided by the DoenetML alone, rather than
 * by values that can change (D35, D38).
 *
 * DIAG-2: a diagnostic's level follows where its condition comes from. A
 * condition caused by what the author wrote (literals, the structure of the
 * document) is a warning or an error; one caused by values that can change
 * (inputs, references, the active case, a random choice) is an info. A call
 * site whose check covers both asks this which it is.
 *
 * DIAG-7: an error depends only on the DoenetML, so a select's failure to
 * select is an error only when what decides it is written without a
 * reference (`selectErrors.ts`).
 */

/**
 * Whether the attribute `attribute` of a component is decided by the
 * DoenetML alone: not written (its default), a literal, a primitive, or an
 * attribute component that holds no reference. A reference anywhere in it
 * (`to="$a"`, `numToSelect="$n+1"`) makes it a value that can change.
 */
export function attributeDecidedByDoenetML(
    attribute: any,
    componentInfoObjects: any,
): boolean {
    if (!attribute) {
        return true;
    }
    if (attribute.type === "literal" || attribute.type === "primitive") {
        return true;
    }
    if (attribute.type === "expression") {
        return (attribute.slots ?? []).length === 0;
    }
    if (attribute.component) {
        return componentDecidedByDoenetML(
            attribute.component,
            componentInfoObjects,
        );
    }
    // a reference to a variable of another component
    return false;
}

/**
 * Whether the live component `component`, an attribute component or a
 * child, holds only what is written: no reference (a `_ref` read for its
 * value, or a composite, such as a `_copy`), no extend, no input, and the
 * same of its children and attributes.
 */
export function componentDecidedByDoenetML(
    component: any,
    componentInfoObjects: any,
): boolean {
    if (typeof component !== "object" || component === null) {
        return true;
    }
    if (
        component.shadows ||
        component.extending ||
        // a reference read for its value (`valueReferences.ts`)
        component.componentType === "_ref" ||
        // an input written in place, whose value the reader changes
        componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: component.componentType,
            baseComponentType: "_input",
        }) ||
        componentInfoObjects.isCompositeComponent({
            componentType: component.componentType,
            includeNonStandard: true,
        })
    ) {
        return false;
    }
    return (
        (component.definingChildren ?? []).every((child: any) =>
            componentDecidedByDoenetML(child, componentInfoObjects),
        ) &&
        Object.values(component.attributes ?? {}).every((attribute) =>
            attributeDecidedByDoenetML(attribute, componentInfoObjects),
        )
    );
}

/**
 * Whether the attributes `attributeNames` of the live component `component`,
 * and, with `children`, its children, are decided by the DoenetML alone
 * ({@link attributeDecidedByDoenetML}, {@link componentDecidedByDoenetML}).
 * What the `decidedByDoenetML` dependency gives.
 */
export function partsDecidedByDoenetML({
    component,
    attributeNames = [],
    children = false,
    componentInfoObjects,
}: {
    component: any;
    attributeNames?: string[];
    children?: boolean;
    componentInfoObjects: any;
}): boolean {
    return (
        attributeNames.every((name) =>
            attributeDecidedByDoenetML(
                component.attributes?.[name],
                componentInfoObjects,
            ),
        ) &&
        (!children ||
            (component.definingChildren ?? []).every((child: any) =>
                componentDecidedByDoenetML(child, componentInfoObjects),
            ))
    );
}

/**
 * The level of a diagnostic whose condition is a value of what
 * `decidedByDoenetML` describes (DIAG-2): a warning when the value is
 * written in the DoenetML, so the author should change it, and an info when
 * it comes from a value that can change, so the diagnostic only explains why
 * part of the document is missing or degenerate now.
 */
export function levelFromSource(
    decidedByDoenetML: boolean | undefined,
): "warning" | "info" {
    return decidedByDoenetML === false ? "info" : "warning";
}

/**
 * `diagnostics`, with the level of each whose code is in `decidedByCode` set
 * by whether what causes it is written in the DoenetML
 * ({@link levelFromSource}). The others are as they are.
 */
export function withLevelsFromSource<T extends { code?: string; type: string }>(
    diagnostics: T[],
    decidedByCode: Record<string, boolean | undefined>,
): T[] {
    return diagnostics.map((diagnostic) =>
        diagnostic.code !== undefined && diagnostic.code in decidedByCode
            ? {
                  ...diagnostic,
                  type: levelFromSource(decidedByCode[diagnostic.code]),
              }
            : diagnostic,
    );
}
