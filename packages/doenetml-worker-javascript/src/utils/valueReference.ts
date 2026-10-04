/**
 * Where a reference to one state variable can be a value reference (a `_ref`
 * component, see `components/abstract/ValueRef.js`) instead of a full
 * component shadowing the referent, and what it then stands in for. Part of
 * Doenet/DoenetML#2128.
 *
 * Two callers plan value references. `utils/dast/valueReferences.ts` plans
 * them when the document is converted, from the types the document declares,
 * and makes a `_ref` that resolves its own reference; `Copy.js` plans them
 * when a `_copy` expands, from the component it resolved to, for the
 * references whose target or type is only known then.
 */
import type { ComponentInfoObjects } from "./componentInfoObjects";
import { publicCaseInsensitiveAliasSubstitutions } from "../StateVariableNameResolver";
import { describeReferentVariable } from "./referentDescription";

/**
 * The component types a value reference can stand in for, with their
 * subclasses (`integer` for `number`, `latex` for `text`).
 */
const VALUE_COMPONENT_TYPES = ["number", "math", "text", "boolean"];

export type ValueReferencePlan = {
    /** The type the reference stands in for in its parent's child groups. */
    presentedComponentType: string;
    /**
     * Set when the reference presents as the type of one of the referenced
     * value's adapters: the referent's variable it reads instead of the
     * referenced one (`math` for `$n` in a `<math>`).
     */
    adapterVariable?: string;
};

/**
 * Decide whether a linked reference to one state variable of a component of
 * `targetComponentType` can be a value reference, and if so as what type
 * and reading which variable.
 *
 * It can when it stands where only a value is read: the parent that will
 * hold it is neither a composite nor a component that renders its children,
 * the variable's type is one of `VALUE_COMPONENT_TYPES`, the reference
 * carries no attributes of its own, and the parent accepts the type in a
 * child group. When the parent does not accept the type but would accept one
 * of the type's adapters (`$n` in a `<math>`: `number` adapts to `math`
 * through its `math` variable), the reference presents as the adapter's type
 * and reads the adapter's variable on the referent instead, which is what the
 * adapter component would have done. That re-pointing is only possible when
 * the reference is to the implicit prop of a referent of the value's own type
 * (`implicitPropReturnsSameType`): the adapter's variable, with its inverse,
 * lives on the referent only then. A `<booleanInput>`'s `text` is not a
 * `<boolean>`'s, and does not take a write.
 *
 * Returns `undefined` for everything else, which keeps today's component.
 */
export function planValueReference({
    parentClass,
    targetComponentType,
    valueComponentType,
    fromImplicitProp,
    hasAttributes,
    componentInfoObjects,
}: {
    parentClass: any;
    targetComponentType: string;
    valueComponentType: string | undefined;
    fromImplicitProp: boolean;
    hasAttributes: boolean;
    componentInfoObjects: ComponentInfoObjects;
}): ValueReferencePlan | undefined {
    if (hasAttributes || !parentClass || parentClass.renderChildren) {
        return undefined;
    }
    if (
        componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: parentClass.componentType,
            baseComponentType: "_composite",
        })
    ) {
        return undefined;
    }
    if (!isValueComponentType(valueComponentType, componentInfoObjects)) {
        return undefined;
    }

    if (
        childGroupAccepts(
            parentClass,
            valueComponentType!,
            componentInfoObjects,
        )
    ) {
        return { presentedComponentType: valueComponentType! };
    }

    const targetClass =
        componentInfoObjects.allComponentClasses[targetComponentType];

    if (fromImplicitProp && targetClass?.implicitPropReturnsSameType) {
        const valueClass =
            componentInfoObjects.allComponentClasses[valueComponentType!];
        const targetVariables =
            componentInfoObjects.publicStateVariableInfo[targetComponentType]
                .stateVariableDescriptions;
        for (let n = 0; n < valueClass.numAdapters; n++) {
            const adapter = valueClass.adapters[n];
            if (
                typeof adapter !== "string" &&
                adapter.substituteForPrimaryStateVariable
            ) {
                continue;
            }
            const adapterVariable =
                typeof adapter === "string" ? adapter : adapter.stateVariable;
            const adapterType = valueClass.getAdapterComponentType(
                n,
                componentInfoObjects.publicStateVariableInfo,
            );
            if (!isValueComponentType(adapterType, componentInfoObjects)) {
                continue;
            }
            const description = targetVariables[adapterVariable];
            if (
                !description ||
                description.isArray ||
                description.createComponentOfType !== adapterType
            ) {
                continue;
            }
            if (
                childGroupAccepts(
                    parentClass,
                    adapterType,
                    componentInfoObjects,
                )
            ) {
                return {
                    presentedComponentType: adapterType,
                    adapterVariable,
                };
            }
        }
    }

    if (
        childGroupAccepts(
            parentClass,
            valueComponentType!,
            componentInfoObjects,
            true,
        )
    ) {
        return { presentedComponentType: valueComponentType! };
    }

    return undefined;
}

/**
 * What a reference to a component of `targetComponentType` with the
 * remaining path `unresolvedPath` reads, worked out from the type alone:
 * the type of the component the value is read from (`referentComponentType`),
 * the type of a component holding the value, and whether the reference is to
 * the referent's implicit prop. `undefined` when that cannot be known from
 * the type, or when what is read is not one value.
 *
 * Known when the target is not a composite and the path is empty (the
 * implicit prop) or one part: a prop name, an array entry, a bare index into
 * `variableForIndexAsProp`, or a name with as many indices as the array or
 * entry has dimensions, so that one value comes out. Names are matched as
 * they are at run time (case, aliases, public variables only). The variable
 * must declare the type of its values; one whose type depends on its value
 * (a `<choiceInput>`'s `selectedValue`) is left to be resolved at run time.
 *
 * A composite's replacements are only known once it expands, except for a
 * composite whose class fixes their type (`replacementComponentType`): a
 * path that starts with one index into it (`$l[$i]` of a `<numberList>`)
 * reads one of its replacements, and the rest of the path is worked out on
 * that type.
 */
export function staticValueReferenceTarget({
    targetComponentType,
    unresolvedPath,
    componentInfoObjects,
}: {
    targetComponentType: string;
    unresolvedPath: { name: string; index: unknown[] }[] | null | undefined;
    componentInfoObjects: ComponentInfoObjects;
}):
    | {
          referentComponentType: string;
          valueComponentType: string;
          fromImplicitProp: boolean;
      }
    | undefined {
    const targetClass =
        componentInfoObjects.allComponentClasses[targetComponentType];
    if (!targetClass) {
        return undefined;
    }
    if (
        componentInfoObjects.isCompositeComponent({
            componentType: targetComponentType,
            includeNonStandard: true,
        })
    ) {
        const replacementType = targetClass.replacementComponentType;
        const [first, ...rest] = unresolvedPath ?? [];
        if (
            replacementType === undefined ||
            first?.name !== "" ||
            first.index.length !== 1
        ) {
            return undefined;
        }
        return staticValueReferenceTarget({
            targetComponentType: replacementType,
            unresolvedPath: rest.length > 0 ? rest : null,
            componentInfoObjects,
        });
    }

    let name: string | undefined;
    let indexCount = 0;
    let fromImplicitProp = false;

    if (unresolvedPath == null) {
        name = targetClass.variableForImplicitProp;
        fromImplicitProp = true;
    } else {
        if (unresolvedPath.length !== 1) {
            return undefined;
        }
        name = unresolvedPath[0].name;
        indexCount = unresolvedPath[0].index.length;
        if (name === "") {
            name = targetClass.variableForIndexAsProp;
        }
    }

    if (!name) {
        return undefined;
    }

    const [variableName] = publicCaseInsensitiveAliasSubstitutions({
        stateVariables: [name],
        componentClass: targetClass,
        componentInfoObjects,
    });
    if (variableName.startsWith("__not_public_")) {
        return undefined;
    }

    const info = componentInfoObjects.publicStateVariableInfo[
        targetComponentType
    ] as any;
    let description = info.stateVariableDescriptions[variableName];
    let entryDimensions: number;

    if (description) {
        entryDimensions = description.isArray
            ? (description.numDimensions ?? 1)
            : 0;
    } else {
        // the name of an array entry: find its array by the longest prefix
        // that yields a key
        const prefix = Object.keys(info.arrayEntryPrefixes)
            .sort((a, b) => b.length - a.length)
            .find((prefix) => {
                if (!variableName.startsWith(prefix)) {
                    return false;
                }
                const arrayDescription =
                    info.stateVariableDescriptions[
                        info.arrayEntryPrefixes[prefix].arrayVariableName
                    ];
                return (
                    arrayDescription?.getArrayKeysFromVarName?.({
                        arrayEntryPrefix: prefix,
                        varEnding: variableName.substring(prefix.length),
                        numDimensions: arrayDescription.numDimensions,
                    }).length > 0
                );
            });
        if (prefix === undefined) {
            return undefined;
        }
        const prefixDescription = info.arrayEntryPrefixes[prefix];
        description =
            info.stateVariableDescriptions[prefixDescription.arrayVariableName];
        entryDimensions = prefixDescription.numDimensions;
    }

    if (!description || indexCount !== entryDimensions) {
        return undefined;
    }

    const valueComponentType = description.createComponentOfType;
    if (typeof valueComponentType !== "string") {
        return undefined;
    }

    return {
        referentComponentType: targetComponentType,
        valueComponentType,
        fromImplicitProp,
    };
}

/**
 * The serialized form of the value reference a `_copy` makes when it
 * expands, to `referencedVariable` of `target`. Its referent is fixed
 * (`doenetAttributes.fixedReferent`, what the reference's `referentInfo`
 * would otherwise work out at run time): the copy resolved the reference,
 * and remakes the component when the target or the variable's type changes
 * (`calculateReplacementChanges`).
 */
export function serializeValueReference({
    presentedComponentType,
    adapterVariable,
    referencedVariable,
    valueComponentType,
    target,
    componentIdx,
    stateId,
}: ValueReferencePlan & {
    /** The referent's variable the author's reference resolved to. */
    referencedVariable: string;
    /** The type of a component holding that variable's value. */
    valueComponentType: string;
    target: any;
    componentIdx: number;
    stateId: string;
}) {
    const description = describeReferentVariable(target, referencedVariable);
    const doenetAttributes: Record<string, any> = {
        presentedComponentType,
        referencedComponentType: valueComponentType,
        fixedReferent: {
            componentIdx: target.componentIdx,
            componentType: target.componentType,
            variableName: adapterVariable ?? referencedVariable,
            referencedVariable,
            referencedPrimaryValue: description?.isPrimaryValue ?? false,
            companions: description?.companions ?? {},
        },
    };
    if (adapterVariable !== undefined) {
        doenetAttributes.adapterVariable = adapterVariable;
    }
    return {
        type: "serialized",
        componentType: "_ref",
        componentIdx,
        stateId,
        attributes: {},
        doenetAttributes,
        state: {},
        children: [],
    };
}

/**
 * Whether `serialized`, about to take the place of the live replacement
 * `current`, is a value reference that stands in for a different type,
 * reads a different variable or reads a different component than `current`
 * does. `Copy.js` otherwise tells a replacement that must be remade by its
 * `componentType`, and two value references share `_ref`: the referenced
 * variable can change type while the referent stays (a `<choiceInput>`'s
 * `selectedValue` is a `math` until a text choice appears), and the
 * reference then has to be remade as the new type.
 */
export function valueReferenceDiffers(current: any, serialized: any): boolean {
    if (
        current.componentType !== "_ref" ||
        serialized.componentType !== "_ref"
    ) {
        return false;
    }
    const now = current.doenetAttributes;
    const next = serialized.doenetAttributes;
    return (
        now.presentedComponentType !== next.presentedComponentType ||
        now.fixedReferent?.componentIdx !== next.fixedReferent?.componentIdx ||
        now.fixedReferent?.variableName !== next.fixedReferent?.variableName ||
        now.fixedReferent?.referencedVariable !==
            next.fixedReferent?.referencedVariable
    );
}

export function isValueComponentType(
    componentType: string | undefined,
    componentInfoObjects: ComponentInfoObjects,
): boolean {
    return (
        typeof componentType === "string" &&
        VALUE_COMPONENT_TYPES.some((baseComponentType) =>
            componentInfoObjects.isInheritedComponentType({
                inheritedComponentType: componentType,
                baseComponentType,
            }),
        )
    );
}

/**
 * Whether one of `parentClass`'s child groups takes a component of
 * `componentType`: the test `findChildGroupNoAdapters` in `ChildMatcher`
 * applies, without recording the match. Groups that match only after
 * adapters are consulted only when `afterAdapters` is set.
 */
function childGroupAccepts(
    parentClass: any,
    componentType: string,
    componentInfoObjects: ComponentInfoObjects,
    afterAdapters = false,
): boolean {
    for (const group of parentClass.childGroups) {
        if (group.matchAfterAdapters && !afterAdapters) {
            continue;
        }
        for (const typeFromGroup of group.componentTypes) {
            if (
                componentInfoObjects.isInheritedComponentType({
                    inheritedComponentType: componentType,
                    baseComponentType: typeFromGroup,
                })
            ) {
                return true;
            }
        }
    }
    return false;
}

/**
 * The prefix of the names under which a value reference (`_ref`) exposes
 * the state variables of its referent as they are on the referent. The
 * reference's own `value` is what it presents (`n.text` for `$n` standing
 * in a `<text>`); `referentVariableName("value")` is `n.value`, the number.
 * `ValueRef.createOnDemandStateVariableDefinitions` makes such a variable
 * when asked for it, and the adapter-source dependencies
 * (`core/dependencies/adapterDependencies.ts`) ask: a reference presenting
 * as an adapter's type has no adapter component, and its referent is what
 * the adapter would have been made from.
 */
const REFERENT_VARIABLE_PREFIX = "__referent_";

/** The name under which a `_ref` exposes `variableName` of its referent. */
export function referentVariableName(variableName: string): string {
    return REFERENT_VARIABLE_PREFIX + variableName;
}

/**
 * The referent's variable that `name` exposes, when `name` was made by
 * `referentVariableName`; `undefined` otherwise.
 */
export function variableOfReferentVariable(name: string): string | undefined {
    return name.startsWith(REFERENT_VARIABLE_PREFIX)
        ? name.slice(REFERENT_VARIABLE_PREFIX.length)
        : undefined;
}
