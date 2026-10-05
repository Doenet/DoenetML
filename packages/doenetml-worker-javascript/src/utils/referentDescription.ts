/**
 * What a value reference (`_ref`, see `components/abstract/ValueRef.js`)
 * needs to know about the state variable it reads on its referent. Part of
 * Doenet/DoenetML#2128.
 *
 * Computed from a live component by the `referent` dependency when a
 * reference resolves itself, and by `Copy.js` when a copy fixes a
 * reference's target as it expands.
 */

import { isListEntryArrayVariable } from "./listEntryReference";

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
    /**
     * For an entry of a list component (`number3` of a `<numberList>`,
     * `isListEntryArrayVariable`), its position in the list, 1 for the
     * first. The list holds the entry while its `listEntryCountVariable` is
     * at least that.
     */
    listEntryPosition?: number;
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
    // An entry of an array is made when first read, so one not read yet is
    // described by its array (`x1` of a `<point>` by `xs`).
    const arrayOfEntry = stateVarObj
        ? undefined
        : arrayOfUnmadeEntry(component, variableName);
    if ((!stateVarObj && !arrayOfEntry) || stateVarObj?.isArray) {
        return null;
    }

    const arrayStateVarObj = arrayOfEntry
        ? arrayOfEntry
        : stateVarObj.isArrayEntry
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
    const ownType = stateVarObj?.shadowingInstructions?.createComponentOfType;
    const createComponentOfType =
        typeof arrayType === "string"
            ? arrayType
            : typeof ownType === "string"
              ? ownType
              : undefined;

    const listEntryPosition = listEntryPositionOf(
        component,
        variableName,
        stateVarObj,
        arrayStateVarObj,
    );

    return {
        componentIdx: component.componentIdx,
        componentType: component.componentType,
        variableName,
        createComponentOfType,
        isPrimaryValue:
            variableName === "value" ||
            variableName === component.constructor.variableForImplicitProp,
        companions,
        ...(listEntryPosition === undefined ? {} : { listEntryPosition }),
    };
}

/**
 * The position of `variableName` among the entries of the list component
 * `component`, when it is an entry of one of the list's arrays with one
 * value per entry; `undefined` otherwise.
 */
function listEntryPositionOf(
    component: any,
    variableName: string,
    stateVarObj: any,
    arrayStateVarObj: any,
): number | undefined {
    if (
        component.constructor.listEntryCountVariable === undefined ||
        arrayStateVarObj === stateVarObj ||
        !isListEntryArrayVariable(component, variableName)
    ) {
        return undefined;
    }
    const prefix = [...(arrayStateVarObj.entryPrefixes ?? [])]
        .sort((a: string, b: string) => b.length - a.length)
        .find((prefix: string) => variableName.startsWith(prefix));
    const varEnding =
        prefix === undefined ? "" : variableName.slice(prefix.length);
    return /^[1-9]\d*$/.test(varEnding) ? Number(varEnding) : undefined;
}

/**
 * The array state variable of `component` that `variableName` names an
 * entry of, by the longest entry prefix it begins with, when that entry has
 * not been made yet; `undefined` otherwise.
 */
function arrayOfUnmadeEntry(component: any, variableName: string) {
    const prefixes: Record<string, string> =
        component?.arrayEntryPrefixes ?? {};
    const prefix = Object.keys(prefixes)
        .sort((a, b) => b.length - a.length)
        .find(
            (prefix) =>
                variableName.startsWith(prefix) &&
                variableName.length > prefix.length,
        );
    return prefix === undefined ? undefined : component.state[prefixes[prefix]];
}
