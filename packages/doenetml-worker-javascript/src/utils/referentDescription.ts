/**
 * What a value reference (`_ref`, see `components/abstract/ValueRef.js`)
 * needs to know about the state variable it reads on its referent. Part of
 * Doenet/DoenetML#2128.
 *
 * Computed from a live component by the `referent` dependency when a
 * reference resolves itself, and by `Copy.js` when a copy fixes a
 * reference's target as it expands.
 */

export type ReferentDescription = {
    componentIdx: number;
    componentType: string;
    /** The variable's name on the referent, aliases and indices resolved. */
    variableName: string;
    /** The type a component holding this variable's value is made as. */
    createComponentOfType?: string;
    /**
     * Whether the variable is the referent's own value (`value`, or its
     * implicit prop), so that what the referent says about its value holds
     * for the reference too.
     */
    isPrimaryValue: boolean;
    /**
     * The referent's variables that travel with the referenced one, by the
     * name a parent asks for: `fixed` and the display settings with a
     * number's `value`, through the variable's
     * `addStateVariablesShadowingStateVariables` and
     * `addAttributeComponentsShadowingStateVariables` (an array entry's are
     * its array's). Only variables the referent has, and no arrays.
     */
    companions: Record<string, string>;
};

/**
 * Describe `variableName` of `component` for a value reference, or `null`
 * when the component has no such variable or it is a whole array (not one
 * value).
 */
export function describeReferentVariable(
    component: any,
    variableName: string,
): ReferentDescription | null {
    const stateVarObj = component?.state[variableName];
    if (!stateVarObj || stateVarObj.isArray) {
        return null;
    }

    const arrayStateVarObj = stateVarObj.isArrayEntry
        ? component.state[stateVarObj.arrayStateVariable]
        : stateVarObj;
    const instructions = arrayStateVarObj?.shadowingInstructions ?? {};

    const companions: Record<string, string> = {};
    for (const shadowing of [
        instructions.addStateVariablesShadowingStateVariables,
        instructions.addAttributeComponentsShadowingStateVariables,
    ]) {
        for (const name in shadowing ?? {}) {
            const target = shadowing[name].stateVariableToShadow;
            // an entry's array companion would need the entry's own key
            if (
                !(name in companions) &&
                component.state[target] &&
                !component.state[target].isArray
            ) {
                companions[name] = target;
            }
        }
    }

    // An array entry's own `createComponentOfType` is per key (an array), so
    // the type of an entry is read from its array.
    const arrayType = instructions.createComponentOfType;
    const ownType = stateVarObj.shadowingInstructions?.createComponentOfType;
    const createComponentOfType =
        typeof arrayType === "string"
            ? arrayType
            : typeof ownType === "string"
              ? ownType
              : undefined;

    return {
        componentIdx: component.componentIdx,
        componentType: component.componentType,
        variableName,
        createComponentOfType,
        isPrimaryValue:
            variableName === "value" ||
            variableName === component.constructor.variableForImplicitProp,
        companions,
    };
}
