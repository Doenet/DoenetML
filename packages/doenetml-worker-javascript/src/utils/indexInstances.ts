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
 * `IndexKind::PassThrough`). When its whole content is one reference
 * (`<option>$l</option>`), what the reference makes takes its place, and an
 * index selects among it when the reference names a list or a composite of
 * instances (`referencedIndexable`): the worker marks such a group with
 * `_indexReference` (Rust, `IndexKind::Reference`), and tells the resolver
 * what the reference names once it has expanded. An index after any other
 * `<group>` names nothing (D27): the resolver stops at the group, giving the
 * child the index would have selected (`childIndex`), and `_instanceOf`
 * tells the warning what the author wrote the group as.
 */
import type { ComponentInfoObjects } from "./componentInfoObjects";
import { refResolutionAt } from "./referenceSlot";

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
 * - `_indexReference`, if the whole content is one reference (a `_copy`)
 *   with nothing before it (`referenceContent`): how many children an index
 *   counts come after it. An index selects among what the reference makes,
 *   which takes its place, if it names a list or a composite of instances.
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
    } else {
        const reference = referenceContent(children);
        if (reference) {
            attributes._indexReference = {
                type: "primitive",
                primitive: { type: "number", value: reference.after },
            };
        }
    }

    return attributes;
}

/**
 * When the whole content of an iteration or a pick with children `children`
 * is one reference (a `_copy`) with nothing before it, that reference, with
 * how many of the children an index counts (all but blank strings) come after
 * it; `undefined` otherwise. A `<setup>` is not content, but one written
 * before the reference shifts what an index counts, so the reference's
 * replacements would not be what `[1]`, `[2]`, … select.
 */
export function referenceContent(
    children: any[],
): { reference: any; after: number } | undefined {
    const counted = (children ?? []).filter(
        (child: any) => typeof child !== "string" || child.trim() !== "",
    );
    const content = counted.filter(
        (child: any) =>
            typeof child === "string" || child.componentType !== "setup",
    );
    if (
        content.length !== 1 ||
        content[0].componentType !== "_copy" ||
        counted[0] !== content[0]
    ) {
        return undefined;
    }
    return { reference: content[0], after: counted.length - 1 };
}

/**
 * The component that the whole content of the `<group>` `containerIdx` (an
 * iteration or a pick) refers to, when that content is one reference
 * (`referenceContent`) to a whole component whose instances an index selects
 * (`indexSelectsInstances`): a list, or a repeat, select or other composite of
 * `INSTANCE_KINDS`. `null` when the content is one reference to anything else,
 * or to nothing yet, and `undefined` when the content is not one reference, or
 * the group is not an iteration or a pick.
 *
 * Such a group is marked `_indexReference` when it is made, since what the
 * reference names is not known then, and an index into it selects among the
 * reference's replacements, which are the referent's instances, as one into
 * `<option><mathList extend="$l"/></option>` passes to the list (#2428).
 *
 * Only an iteration or a pick, which would pass an index through to the
 * list written in place: after a `<group>` the author wrote, or what a
 * `<conditionalContent>` shows, an index names nothing, as it does after
 * `<group><mathList/></group>`, so it does for a reference too.
 */
export function referencedIndexable(
    components: Record<number, any>,
    containerIdx: number,
    componentInfoObjects: ComponentInfoObjects,
): any {
    const container = components[containerIdx];
    const instanceKind = instanceKindOf(
        container?.attributes?._instanceOf?.primitive?.value,
    );
    if (instanceKind !== "iteration" && instanceKind !== "pick") {
        return undefined;
    }
    const content = referenceContent(container?.serializedChildren ?? []);
    if (!content) {
        return undefined;
    }
    const resolution = refResolutionAt(
        components[content.reference.componentIdx],
    );
    if (!resolution || resolution.unresolvedPath !== null) {
        return null;
    }
    const referent = components[resolution.nodeIdx];
    return referent &&
        indexSelectsInstances(referent.componentType, componentInfoObjects)
        ? referent
        : null;
}
