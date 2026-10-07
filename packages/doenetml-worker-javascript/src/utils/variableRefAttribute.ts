/**
 * An attribute held as a reference to a state variable of another component,
 * in place of an attribute component (Doenet/DoenetML#2129, step B3).
 *
 * A copy of a prop takes some attributes from its source
 * (`addAttributeComponentsShadowingStateVariables`): `<math extend="$P.x"/>`
 * shows `P`'s `displayDigits` and has `P`'s `fixed`. Those used to be
 * attribute components, each a whole component whose one job was to shadow
 * one state variable of the source. When the attribute's type holds one
 * value, the attribute slot now holds the reference itself, and the
 * `attributeComponent` dependency reads the source's variable directly
 * (`AttributeComponentDependency`). Nothing else changes: the copy's own
 * attributes are assigned over these, as over the components before, and
 * `isShadow` marks the attribute as taken from the source, as a shadowing
 * attribute component did.
 */
export type VariableRefAttribute = {
    type: "variableRef";
    name: string;
    /** The component whose state variable is the attribute's value. */
    componentIdx: number;
    stateVariable: string;
    /** The attribute's type, which a snapshot of the value is made as. */
    componentType: string;
    /** Taken from the source by a copy, rather than written by the author. */
    isShadow: boolean;
};

/**
 * The attribute types whose components a reference replaces: each holds one
 * value, in its `value` state variable, which is all a reader of the
 * attribute asks of it.
 */
const SINGLE_VALUE_ATTRIBUTE_TYPES = new Set([
    "boolean",
    "number",
    "integer",
    "text",
]);

/**
 * Whether a copy takes the attribute of type `attributeComponentType` that it
 * shadows from its source as a reference, rather than as a component.
 */
export function attributeShadowIsReference(
    attributeComponentType: string | undefined,
) {
    return (
        attributeComponentType !== undefined &&
        SINGLE_VALUE_ATTRIBUTE_TYPES.has(attributeComponentType)
    );
}

/**
 * The attribute `attrName` of a copy, of type `attributeComponentType`, that
 * shadows the state variable `stateVariableToShadow` of `target`.
 */
export function shadowAttributeReference({
    attrName,
    attributeComponentType,
    target,
    stateVariableToShadow,
}: {
    attrName: string;
    attributeComponentType: string;
    target: { componentIdx: number };
    stateVariableToShadow: string;
}): VariableRefAttribute {
    return {
        type: "variableRef",
        name: attrName,
        componentIdx: target.componentIdx,
        stateVariable: stateVariableToShadow,
        componentType: attributeComponentType,
        isShadow: true,
    };
}

/**
 * The variable of the referenced component that the variable
 * `variableName` of the attribute reads: an attribute component's `value` is
 * the referenced variable.
 */
export function variableRefVariableName(
    attribute: VariableRefAttribute,
    variableName: string,
) {
    return variableName === "value" ? attribute.stateVariable : variableName;
}

/**
 * The attribute an unlinked copy (`copyAll`) takes in place of `attribute`:
 * an attribute component of the attribute's type holding the referenced
 * variable's value as it is now, as the attribute component the reference
 * replaced was copied. `undefined` when the value cannot be read here, as when
 * the serializer was given no components to read it from; the copy then
 * shows the attribute's default, as for an attribute it does not have.
 */
export async function variableRefSnapshot({
    attribute,
    components,
}: {
    attribute: VariableRefAttribute;
    components?: Record<number, any>;
}) {
    const referenced = components?.[attribute.componentIdx];
    if (!referenced?.state[attribute.stateVariable]) {
        return undefined;
    }
    const value = await referenced.stateValues[attribute.stateVariable];
    return {
        type: "component",
        name: attribute.name,
        component: {
            type: "serialized",
            componentType: attribute.componentType,
            // a placeholder, which `createNewComponentIndices` replaces
            componentIdx: -1,
            attributes: {},
            doenetAttributes: {},
            state: { value },
            children: [],
        },
    };
}
