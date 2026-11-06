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
 * `values`; of a list of points (a `<polyline>`'s `vertices`), `numPoints`,
 * `numDimensions` and `pointX1_1`, `pointX1_2`, ….
 */
export function expressionAttributeVariable(
    attribute: { name: string; componentType: string },
    variableName: string,
) {
    const prefix = expressionAttributePrefix(attribute.name);
    if (attribute.componentType === "_componentListWithSelectableType") {
        return variableName === "values" ? `${prefix}values` : undefined;
    }
    if (attribute.componentType === "pointList") {
        return variableName === "numPoints" ||
            variableName === "numDimensions" ||
            /^pointX[1-9]\d*_[1-9]\d*$/.test(variableName)
            ? `${prefix}${variableName}`
            : undefined;
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
 * attribute component held its state. Without `withWrites`, as for a
 * `copy`, which carries no reader state (D33), it takes only what the
 * attribute was made with (`authoredWrites`): a copy with reader state
 * (`copyWithState`) is made with the writes it carried, and keeps what its
 * source was made with as `authoredWrites`, so that a `copy` of it starts
 * as its source was written.
 */
export function copyOfExpressionAttribute(
    attribute: any,
    owner: any,
    withWrites = true,
) {
    const { writes, authoredWrites, ...rest } = attribute;
    // what it was made with: a held value's, or an unlinked copy's, which is
    // its default, unless that copy carried a reader's writes
    const madeWith = authoredWrites ?? writes;
    // what was written to it, or, while nothing has been, what it was made
    // with
    const written = withWrites
        ? (owner.essentialState?.[
              `${expressionAttributePrefix(attribute.name)}writes`
          ] ?? writes)
        : madeWith;
    const nonEmpty = (value: any) =>
        value && Object.keys(value).length > 0 ? value : undefined;
    return {
        ...structuredClone(rest),
        ...(nonEmpty(written) ? { writes: structuredClone(written) } : {}),
        ...(withWrites && (nonEmpty(written) || nonEmpty(madeWith))
            ? { authoredWrites: structuredClone(madeWith ?? {}) }
            : {}),
    };
}
