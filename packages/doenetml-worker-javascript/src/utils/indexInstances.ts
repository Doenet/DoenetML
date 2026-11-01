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
 * The composites whose index selects among the instances they produce, as
 * opposed to a list (`listEntryComponentType`), whose entries are its
 * instances, with what a warning calls those instances.
 */
const INSTANCE_KINDS: Record<string, "iteration" | "pick"> = {
    repeat: "iteration",
    repeatForSequence: "iteration",
    select: "pick",
    selectFromSequence: "pick",
    shuffle: "pick",
    sort: "pick",
    collect: "pick",
};

/**
 * What a warning calls the instances of a composite of type `componentType`:
 * the `iteration`s of a repeat or the `pick`s of a select, or `undefined` for
 * any other type.
 */
export function instanceKindOf(
    componentType: string | undefined,
): "iteration" | "pick" | undefined {
    return componentType !== undefined &&
        Object.hasOwn(INSTANCE_KINDS, componentType)
        ? INSTANCE_KINDS[componentType]
        : undefined;
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
    return Object.keys(INSTANCE_KINDS).some((baseComponentType) =>
        componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: componentType,
            baseComponentType,
        }),
    );
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
        _instanceOf: {
            type: "primitive",
            primitive: { type: "string", value: instanceOf },
        },
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
