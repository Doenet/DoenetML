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
 * `name` that a reader's `variableName` of the attribute component reads,
 * or `undefined` for one it has no state variable for.
 */
export function expressionAttributeVariable(
    name: string,
    variableName: string,
) {
    if (variableName === "numComponents") {
        return `${expressionAttributePrefix(name)}numComponents`;
    }
    const match = /^math([1-9]\d*)$/.exec(variableName);
    if (match) {
        return `${expressionAttributePrefix(name)}math${match[1]}`;
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
    const { writes: _writes, ...rest } = attribute;
    const written =
        owner.essentialState?.[
            `${expressionAttributePrefix(attribute.name)}writes`
        ];
    return {
        ...structuredClone(rest),
        ...(written && Object.keys(written).length > 0
            ? { writes: structuredClone(written) }
            : {}),
    };
}
