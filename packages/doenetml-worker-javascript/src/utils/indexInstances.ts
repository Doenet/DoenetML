/**
 * What an index selects (D27, NAME-2): an index selects among the instances a
 * component produces -- the entries of a list, the iterations of a
 * `<repeat>` or `<repeatForSequence>`, the picks of a `<select>`,
 * `<selectFromSequence>`, `<shuffle>`, `<sort>` or `<collect>` -- and never
 * among the children of a container.
 *
 * A `<group>` -- one the author wrote, an iteration or a pick (made as a
 * group), what a `<conditionalContent>` shows, or an extend or copy of any of
 * these -- whose whole content is one component stands for it, and passes an
 * index after it to that component, which decides what the index means: an
 * entry of a list or of a value, an instance, or nothing with a warning. "One
 * component" ignores blank text and a `<setup>`; any other text counts. The
 * resolver decides this from the group's children when the group is added
 * (Rust, `IndexKind::of_content`), so nothing here marks the group. When that
 * one component is a reference (`<group>$l</group>`), what the reference
 * makes takes its place, and the worker tells the resolver what an index
 * does with it once the reference has expanded (`referenceContentOf`). An
 * index after a group holding several components or none names nothing: the
 * resolver stops at the group, giving the child the index would have selected
 * (`childIndex`), and `_instanceOf` tells the warning what the author wrote
 * the group as.
 */
import type { ComponentInfoObjects } from "./componentInfoObjects";
import type { ReferenceContent } from "@doenet/doenetml-worker";
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
 * shows), which names the group in the warning for an index after it that
 * names nothing (`doenet-w0188`).
 */
export function instanceOfAttribute(instanceOf: string) {
    return {
        type: "primitive",
        primitive: { type: "string", value: instanceOf },
    };
}

/**
 * The one reference (a `_copy` that is not a tag written with `extend`) that
 * is the whole content of the `<group>` `group`, blank strings and `<setup>`s
 * aside, as the resolver finds it (`IndexKind::of_content`); `undefined` when
 * its content is anything else, or it is not a group.
 */
export function holderReference(group: any): any | undefined {
    if (group?.componentType !== "group") {
        return undefined;
    }
    const content = (group.replacements ?? []).filter((child: any) =>
        typeof child === "string"
            ? child.trim() !== ""
            : child?.componentType !== "setup",
    );
    if (content.length !== 1 || !isBareReference(content[0])) {
        return undefined;
    }
    return content[0];
}

/**
 * Whether `component`, serialized or not, is a reference written as `$x`,
 * rather than a tag written with `extend` (`_createComponentOfType`), which
 * is the component it makes.
 */
function isBareReference(component: any): boolean {
    return (
        typeof component === "object" &&
        component?.componentType === "_copy" &&
        component.attributes?._createComponentOfType === undefined
    );
}

/**
 * Whether an index after a reference to `referent`, resolved with
 * `unresolvedPath` left, selects among the instances of what it names: a
 * list, or a composite other than a `<group>` (a repeat, a select, a
 * `<conditionalContent>`, a `<collect>`, …). A reference to a group stands
 * for the group's content instead.
 */
function namesInstances(
    referent: any,
    unresolvedPath: unknown,
    componentInfoObjects: ComponentInfoObjects,
): boolean {
    if (!referent || unresolvedPath !== null) {
        return false;
    }
    const componentType = referent.componentType;
    return (
        indexSelectsInstances(componentType, componentInfoObjects) ||
        (componentType !== "group" &&
            componentType !== "_copy" &&
            componentInfoObjects.isCompositeComponent({
                componentType,
                includeNonStandard: true,
            }))
    );
}

/**
 * For a `<group>` whose whole content is the one reference `reference`
 * (`holderReference`), what an index after the group does with what that
 * reference made (`FlatFragment.indexParentReference`, Rust
 * `ReferenceContent`):
 * - `Instances`, when it names a list or a composite that makes instances
 *   (`namesInstances`), or made one list, whose entries take its place;
 * - `One`, when it made one component: an index passes to it;
 * - `Several`, when it made several components or none: an index names
 *   nothing;
 * - `Pending`, while a reference among what it made has not expanded.
 *
 * What a reference among what it made (`$g2` of a group holding `$m`) makes
 * takes its place in turn, unless that reference names instances itself
 * (`$x` of a group holding `$cc`): it then counts as one component, and is
 * `Instances` when it is the only one, as it would be for its own group.
 * `made` gives what `component`, being given its
 * replacements when it first expands, makes, which it does not hold yet;
 * without them, what each reference holds now.
 */
export async function referenceContentOf({
    reference,
    component,
    made = [],
    components,
    componentInfoObjects,
}: {
    reference: any;
    component?: any;
    made?: any[];
    components: Record<number, any>;
    componentInfoObjects: ComponentInfoObjects;
}): Promise<ReferenceContent> {
    // What the reference names as the worker resolved it, as when it names a
    // component through a composite (`$cc.x` of a name in a case of a
    // `<conditionalContent>`), which the resolution made when the reference
    // was created stops short of
    const referent = components[await reference.stateValues.extendIdx];
    if (
        namesInstances(
            referent,
            await reference.stateValues.unresolvedPath,
            componentInfoObjects,
        )
    ) {
        return "Instances";
    }

    let position = 0;
    let count = 0;
    let onePosition = 0;
    let oneComponent: any;
    // Whether the one component is a reference among what it made that
    // names instances (`$cc` in a group `$g` names), which then stand for
    // the group as they do for that reference's own group
    let oneNamesInstances = false;
    let pending = false;
    async function walk(items: any[]) {
        for (const item of items) {
            if (typeof item === "string") {
                if (item.trim() !== "") {
                    position++;
                    count++;
                    onePosition = position;
                    oneComponent = item;
                    oneNamesInstances = false;
                }
                continue;
            }
            if (isBareReference(item)) {
                if (item.componentIdx === component?.componentIdx) {
                    await walk(made);
                } else if (!item.isExpanded) {
                    pending = true;
                } else if (
                    item.stateValues &&
                    namesInstances(
                        components[await item.stateValues.extendIdx],
                        await item.stateValues.unresolvedPath,
                        componentInfoObjects,
                    )
                ) {
                    count++;
                    oneNamesInstances = true;
                } else {
                    await walk(item.replacements ?? []);
                }
                continue;
            }
            position++;
            if (item?.componentType === "setup") {
                continue;
            }
            count++;
            onePosition = position;
            oneComponent = item;
            oneNamesInstances = false;
        }
    }
    await walk(
        reference.componentIdx === component?.componentIdx
            ? made
            : (reference.replacements ?? []),
    );

    if (pending) {
        return "Pending";
    }
    if (count !== 1) {
        return { Several: { count } };
    }
    if (oneNamesInstances) {
        return "Instances";
    }
    // Text takes no index: as for a group holding only text, the resolver
    // stops at the group, and the warning says text takes no index
    if (typeof oneComponent === "string") {
        return { Several: { count } };
    }
    // A list a reference made is indexed by its entries, which take its
    // place (`listEntryResolverNodes.ts`)
    if (
        typeof oneComponent === "object" &&
        (
            componentInfoObjects.allComponentClasses[
                oneComponent.componentType
            ] as any
        )?.listEntryComponentType !== undefined
    ) {
        return "Instances";
    }
    return { One: { offset: onePosition } };
}

/**
 * The component that the whole content of the `<group>` `containerIdx`
 * refers to, when that content is one reference (`holderReference`) to a
 * whole component whose instances an index selects (`namesInstances`): a
 * list, or a repeat, select or other composite that makes instances. `null`
 * when the content is one reference to anything else, or to nothing yet, and
 * `undefined` when the content is not one reference.
 *
 * An index after such a group selects among the reference's replacements,
 * which are the referent's instances (`referenceContentOf`), so an index past
 * them is past the referent's instances, and is reported as such.
 *
 * This reads the resolution made when the reference was created, as it is
 * read while another reference resolves.
 */
export function referencedIndexable(
    components: Record<number, any>,
    containerIdx: number,
    componentInfoObjects: ComponentInfoObjects,
): any {
    const reference = holderReference(components[containerIdx]);
    if (!reference) {
        return undefined;
    }
    const resolution = refResolutionAt(components[reference.componentIdx]);
    if (!resolution || resolution.unresolvedPath !== null) {
        return null;
    }
    const referent = components[resolution.nodeIdx];
    if (namesInstances(referent, null, componentInfoObjects)) {
        return referent;
    }
    // A reference to a group whose whole content is one component stands for
    // it (NAME-2 pass-through), so through it an index is past the instances
    // of a composite it holds as it is past them on the composite itself
    // (`$g[3]` of `<group name="g">$g2</group>`, `g2` holding one repeat,
    // #2520 item 3).
    return groupContentIndexable(
        components,
        referent,
        componentInfoObjects,
        new Set([containerIdx]),
    );
}

/**
 * The component whose instances an index after the `<group>` `group`
 * selects among, when its whole content (blank strings and `<setup>`s aside)
 * is one such component (`namesInstances`), or one reference to one, or a
 * group whose content is, in turn; `null` otherwise.
 */
function groupContentIndexable(
    components: Record<number, any>,
    group: any,
    componentInfoObjects: ComponentInfoObjects,
    seen: Set<number>,
): any {
    if (group?.componentType !== "group" || seen.has(group.componentIdx)) {
        return null;
    }
    seen.add(group.componentIdx);
    const content = (group.replacements ?? []).filter((child: any) =>
        typeof child === "string"
            ? child.trim() !== ""
            : child?.componentType !== "setup",
    );
    if (content.length !== 1 || typeof content[0] !== "object") {
        return null;
    }
    const [one] = content;
    if (isBareReference(one)) {
        const resolution = refResolutionAt(components[one.componentIdx]);
        if (!resolution || resolution.unresolvedPath !== null) {
            return null;
        }
        const named = components[resolution.nodeIdx];
        return namesInstances(named, null, componentInfoObjects)
            ? named
            : groupContentIndexable(
                  components,
                  named,
                  componentInfoObjects,
                  seen,
              );
    }
    if (namesInstances(one, null, componentInfoObjects)) {
        return one;
    }
    return groupContentIndexable(components, one, componentInfoObjects, seen);
}
