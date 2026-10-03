/**
 * Where a prop reference can be a value reference (a `_ref` component, see
 * `components/abstract/ValueRef.js`) instead of a full component shadowing
 * the referent, and what it then stands in for. Part of Doenet/DoenetML#2128.
 */
import type { ComponentInfoObjects } from "./componentInfoObjects";

/**
 * The component types a value reference can stand in for, with their
 * subclasses (`integer` for `number`, `latex` for `text`).
 */
const VALUE_COMPONENT_TYPES = ["number", "math", "text", "boolean"];

export type ValueReferencePlan = {
    /** The type the reference stands in for in its parent's child groups. */
    presentedComponentType: string;
    /** The referent's state variable it reads. */
    refVariable: string;
};

/**
 * Decide whether a linked reference to one state variable of `target` can be
 * a value reference, and if so as what type and reading which variable.
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
    target,
    refVariable,
    valueComponentType,
    fromImplicitProp,
    hasAttributes,
    componentInfoObjects,
}: {
    parentClass: any;
    target: any;
    refVariable: string;
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
        return { presentedComponentType: valueComponentType!, refVariable };
    }

    if (fromImplicitProp && target.constructor.implicitPropReturnsSameType) {
        const valueClass =
            componentInfoObjects.allComponentClasses[valueComponentType!];
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
            const targetObj = target.state[adapterVariable];
            if (
                !targetObj?.public ||
                targetObj.isArray ||
                targetObj.shadowingInstructions?.createComponentOfType !==
                    adapterType
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
                    refVariable: adapterVariable,
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
        return { presentedComponentType: valueComponentType!, refVariable };
    }

    return undefined;
}

/**
 * The serialized form of a value reference to `refVariable` of `target`,
 * made by the copy `compositeIdx`. Its one `referenceShadow` dependency is
 * what makes `value` a shadow of the referent's variable when it is built.
 */
export function serializeValueReference({
    presentedComponentType,
    refVariable,
    referencedVariable,
    target,
    compositeIdx,
    componentIdx,
    stateId,
}: ValueReferencePlan & {
    /**
     * The referent's variable the author's reference resolved to, whose
     * shadowing instructions say which of the referent's settings travel
     * with it. It differs from `refVariable` when the reference presents as
     * an adapter's type.
     */
    referencedVariable: string;
    target: any;
    compositeIdx: number;
    componentIdx: number;
    stateId: string;
}) {
    return {
        type: "serialized",
        componentType: "_ref",
        componentIdx,
        stateId,
        attributes: {},
        doenetAttributes: {
            presentedComponentType,
            referencedVariable,
            refVariable,
        },
        state: {},
        children: [],
        downstreamDependencies: {
            [target.componentIdx]: [
                {
                    dependencyType: "referenceShadow",
                    compositeIdx,
                    propVariable: refVariable,
                },
            ],
        },
    };
}

function isValueComponentType(
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
