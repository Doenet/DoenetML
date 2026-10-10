/**
 * The names of the state variables a component has for an attribute it holds
 * as text and references, and what a copy of the component takes of it
 * (Doenet/DoenetML#2252; the definitions are `expressionAttribute.js`). Kept
 * apart from those definitions, which import the components, so that
 * `BaseComponent` and the dependencies can read them.
 */

/** The prefix of the state variables of the expression attribute `name`. */
export function expressionAttributePrefix(name: string) {
    return `__${name}_`;
}

/**
 * The state variable of the component holding the expression attribute
 * `attribute` that a reader's `variableName` of the attribute component
 * reads, or `undefined` for one it has no state variable for: of a `mathList`
 * (a point's `xs`), `numComponents` and `math1`, `math2`, …; of a `math` or
 * `boolean`, `value`; of a list of values (an `<indexOf>`'s `target`),
 * `values`.
 */
export function expressionAttributeVariable(
    attribute: { name: string; componentType: string },
    variableName: string,
) {
    const prefix = expressionAttributePrefix(attribute.name);
    if (attribute.componentType === "_componentListWithSelectableType") {
        return variableName === "values" ? `${prefix}values` : undefined;
    }
    if (attribute.componentType !== "mathList") {
        return variableName === "value" ? `${prefix}value` : undefined;
    }
    if (variableName === "numComponents") {
        return `${prefix}numComponents`;
    }
    const match = /^math([1-9]\d*)$/.exec(variableName);
    if (match) {
        return `${prefix}math${match[1]}`;
    }
    return undefined;
}

/**
 * The expression attribute an unlinked copy of `owner` takes in place of
 * `attribute`: its references, which the copy resolves from where it is,
 * and the text written to its nodes as it is now, as a copy of the
 * attribute component held its state.
 */
export function copyOfExpressionAttribute(attribute: any, owner: any) {
    const { writes, ...rest } = attribute;
    // what was written to it, or, while nothing has been, what it was made
    // with (an unlinked copy's, which is its default)
    const written =
        owner.essentialState?.[
            `${expressionAttributePrefix(attribute.name)}writes`
        ] ?? writes;
    return {
        ...structuredClone(rest),
        ...(written && Object.keys(written).length > 0
            ? { writes: structuredClone(written) }
            : {}),
    };
}
