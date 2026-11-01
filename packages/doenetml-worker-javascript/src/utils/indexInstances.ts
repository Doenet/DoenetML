/**
 * What an index selects (D27): an index selects among the instances a
 * component produces -- the entries of a list, the iterations of a
 * `<repeat>` or `<repeatForSequence>`, the picks of a `<select>`,
 * `<selectFromSequence>`, `<shuffle>`, `<sort>` or `<collect>` -- and never
 * among the children of a container.
 *
 * An iteration or a pick is made as a `<group>`. When its whole content is
 * one indexable component, an index after the iteration passes to that
 * component: in `<repeat name="r"><repeat>…</repeat></repeat>`, `$r[1][2]` is
 * iteration 2 of the inner repeat in iteration 1. The worker marks such a
 * group with `_indexPassThrough`, which the resolver reads (Rust,
 * `IndexKind::PassThrough`). An index into any other `<group>` still selects
 * its child, as a deprecated form the resolver reports (`childIndexes`), and
 * `_instanceOf` tells that warning what the author wrote the group as.
 */
import type { ComponentInfoObjects } from "./componentInfoObjects";

/**
 * What a warning calls the instances of a composite: the `iteration`s of a
 * repeat, the `pick`s of a select, or the `item`s of a component that
 * arranges or gathers what it is given rather than picking among it.
 */
export type InstanceKind = "iteration" | "pick" | "item";

/**
 * The composites whose index selects among the instances they produce, as
 * opposed to a list (`listEntryComponentType`), whose entries are its
 * instances, with what a warning calls those instances.
 */
const INSTANCE_KINDS = new Map<string, InstanceKind>([
    ["repeat", "iteration"],
    ["repeatForSequence", "iteration"],
    ["select", "pick"],
    ["selectFromSequence", "pick"],
    ["shuffle", "item"],
    ["sort", "item"],
    ["collect", "item"],
]);

/**
 * What a warning calls the instances of a composite of type `componentType`
 * (see `InstanceKind`), or `undefined` for a type that is not one of
 * `INSTANCE_KINDS`.
 */
export function instanceKindOf(
    componentType: string | undefined,
): InstanceKind | undefined {
    return componentType === undefined
        ? undefined
        : INSTANCE_KINDS.get(componentType);
}

/**
 * Whether an index after a component of type `componentType` selects among
 * instances it produces: it is a list, or one of `INSTANCE_KINDS`.
 */
export function indexSelectsInstances(
    componentType: string,
    componentInfoObjects: ComponentInfoObjects,
): boolean {
    const componentClass =
        componentInfoObjects.allComponentClasses[componentType];
    if (!componentClass) {
        return false;
    }
    if ((componentClass as any).listEntryComponentType !== undefined) {
        return true;
    }
    return Array.from(INSTANCE_KINDS.keys()).some((baseComponentType) =>
        componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: componentType,
            baseComponentType,
        }),
    );
}

/**
 * The `_instanceOf` attribute of a `<group>` made by a component of type
 * `instanceOf` (an iteration, a pick, or what a `<conditionalContent>`
 * shows), which names the group in the warning for an index that selects one
 * of its children.
 */
export function instanceOfAttribute(instanceOf: string) {
    return {
        type: "primitive",
        primitive: { type: "string", value: instanceOf },
    };
}

/**
 * The attributes of the `<group>` that is an iteration or a pick of a
 * component of type `instanceOf`, with content `children`:
 * - `_instanceOf`, the type of that component, which names the group in the
 *   warning for an index that selects one of its children;
 * - `_indexPassThrough`, if the whole content is one indexable component
 *   (`indexSelectsInstances`): that component's position among the children
 *   an index into the group counts, which are all but blank strings, from 1.
 *   A `<setup>` is not content, so it does not count against there being
 *   only one component.
 */
export function instanceGroupAttributes({
    children,
    instanceOf,
    componentInfoObjects,
}: {
    children: any[];
    instanceOf: string;
    componentInfoObjects: ComponentInfoObjects;
}): Record<string, any> {
    const attributes: Record<string, any> = {
        _instanceOf: instanceOfAttribute(instanceOf),
    };

    let position = 0;
    let numContent = 0;
    let indexablePosition: number | null = null;

    for (const child of children ?? []) {
        if (typeof child === "string") {
            if (child.trim() === "") {
                continue;
            }
            position++;
            numContent++;
            continue;
        }
        position++;
        if (child.componentType === "setup") {
            continue;
        }
        numContent++;
        if (indexSelectsInstances(child.componentType, componentInfoObjects)) {
            indexablePosition = position;
        }
    }

    if (numContent === 1 && indexablePosition !== null) {
        attributes._indexPassThrough = {
            type: "primitive",
            primitive: { type: "number", value: indexablePosition },
        };
    }

    return attributes;
}
