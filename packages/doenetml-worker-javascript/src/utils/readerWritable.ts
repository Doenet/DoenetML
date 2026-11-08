/**
 * The pass that marks what a reader can change: the components a reader of
 * the document can write to, found once, from the serialized document, when
 * the document is loaded (`Core.generateDast`).
 *
 * It reads the serialized document rather than the components, so it sees
 * every component the DoenetML can make, including the content of a case
 * that isn't shown yet or of an option that isn't selected: a reader who
 * reaches it can write to it then.
 *
 * Where a reader writes:
 * - what an input's `bindValueTo` names;
 * - the `target` of an `<updateValue>`, an `<animateFromSequence>` or a
 *   `<callAction>`;
 * - every component inside a `<graph>` that is not fixed (`fixed` or
 *   `fixLocation` written as true on it, or on an ancestor when it doesn't
 *   write its own: `fixed="false"` in a fixed graph is not fixed), which a
 *   reader can drag, and what it references, which the drag writes to
 *   through it.
 *
 * A write to a component reaches its descendants and, through them, what
 * they reference (an inverse definition), until a fixed component stops it.
 *
 * Whether a value can change (`canChange` in `decidedByDoenetML.ts`) reads
 * this for a component named by a reference; what is written in place is
 * what the author wrote, even when a reader can drag it. A select's check
 * that its choices are feasible can read it too (D39, SEL-1).
 *
 * A component made after load from a serialized one keeps the index
 * current (`noteReaderWritable`, as each component is made): the index marks
 * each serialized component it finds (`readerWritable`), and a copy of one
 * with new indices, such as an iteration of a repeat, keeps the mark. A
 * component serialized from one the index holds (`originalIdx`), such as
 * an unlinked copy, is added too.
 *
 * It errs toward writable: a `fixed` that comes from a value (`fixed="$b"`)
 * counts as not fixed, and everything in a graph counts as draggable, a
 * label too.
 */

/** The components whose `target` a reader's click writes to. */
const ACTION_TYPES = new Set([
    "updateValue",
    "animateFromSequence",
    "callAction",
]);

/** Whether `value` is a reference: a serialized `refResolution`. */
function isReference(value: any): boolean {
    return (
        typeof value === "object" &&
        value !== null &&
        typeof value.nodeIdx === "number" &&
        "originalPath" in value
    );
}

/**
 * The component indices named by every reference anywhere in `value`, a
 * serialized component or part of one, appended to `found`.
 */
function referencesIn(value: any, found: number[] = []): number[] {
    if (Array.isArray(value)) {
        for (const item of value) {
            referencesIn(item, found);
        }
    } else if (typeof value === "object" && value !== null) {
        if (isReference(value)) {
            found.push(value.nodeIdx);
        }
        for (const [key, item] of Object.entries(value)) {
            if (key === "position" || key === "childrenPosition") {
                continue;
            }
            referencesIn(item, found);
        }
    }
    return found;
}

/**
 * Whether the serialized attribute `attribute` is written as true: present
 * with no value (`fixed`), or `true`. One that holds a reference is not.
 */
function writtenAsTrue(attribute: any): boolean {
    if (!attribute) {
        return false;
    }
    if (attribute.type === "primitive") {
        return attribute.primitive?.value === true;
    }
    if (attribute.type === "literal") {
        return attribute.value === true;
    }
    const component = attribute.component;
    if (!component) {
        return false;
    }
    if (component.state && "value" in component.state) {
        return component.state.value === true;
    }
    const children = component.children ?? [];
    if (!children.every((child: any) => typeof child === "string")) {
        return false;
    }
    const text = children.join("").trim().toLowerCase();
    return text === "" || text === "true";
}

/**
 * The serialized components directly under `node`: its children and the
 * components of its attributes.
 */
function componentsUnder(node: any): any[] {
    const under: any[] = [];
    for (const child of node.children ?? []) {
        if (typeof child === "object" && child !== null) {
            under.push(child);
        }
    }
    for (const attribute of Object.values(node.attributes ?? {}) as any[]) {
        if (attribute?.component) {
            under.push(attribute.component);
        }
        for (const reference of attribute?.references ?? []) {
            under.push(reference);
        }
        for (const child of attribute?.children ?? []) {
            if (typeof child === "object" && child !== null) {
                under.push(child);
            }
        }
    }
    return under;
}

/**
 * The indices of the components of the serialized document `root` that a
 * reader can write to (see the top of this file).
 */
export function buildReaderWritableIndex(root: any): Set<number> {
    const nodeByIdx = new Map<number, any>();
    const fixedIdx = new Set<number>();
    const seeds: number[] = [];

    // `fixed` and `fixLocation` are each inherited from where a component
    // sits, unless it writes its own (`fixed="false"` in a fixed graph),
    // as `contextAttribute.js` decides them
    function walk(
        node: any,
        inGraph: boolean,
        inherited: { fixed: boolean; fixLocation: boolean },
    ) {
        const own = {
            fixed: node.attributes?.fixed
                ? writtenAsTrue(node.attributes.fixed)
                : inherited.fixed,
            fixLocation: node.attributes?.fixLocation
                ? writtenAsTrue(node.attributes.fixLocation)
                : inherited.fixLocation,
        };
        const isFixed = own.fixed || own.fixLocation;
        const isGraph = node.componentType === "graph";
        if (typeof node.componentIdx === "number" && node.componentIdx >= 0) {
            nodeByIdx.set(node.componentIdx, node);
            if (isFixed) {
                fixedIdx.add(node.componentIdx);
            }
        }
        if (node.attributes?.bindValueTo) {
            referencesIn(node.attributes.bindValueTo, seeds);
        }
        if (ACTION_TYPES.has(node.componentType) && node.attributes?.target) {
            referencesIn(node.attributes.target, seeds);
        }
        if (inGraph && !isFixed) {
            // dragged, and so is what it references itself (an extend);
            // what its children and attributes reference is reached as
            // they are walked
            if (typeof node.componentIdx === "number") {
                seeds.push(node.componentIdx);
            }
            referencesIn(node.extending, seeds);
            for (const attribute of Object.values(
                node.attributes ?? {},
            ) as any[]) {
                if (attribute?.type === "expression") {
                    referencesIn(attribute.slots, seeds);
                }
            }
        }
        for (const under of componentsUnder(node)) {
            walk(under, inGraph || isGraph, own);
        }
    }
    walk(root, false, { fixed: false, fixLocation: false });

    const writable = new Set<number>();
    const queue = [...seeds];
    while (queue.length > 0) {
        const idx = queue.pop()!;
        if (writable.has(idx) || fixedIdx.has(idx)) {
            continue;
        }
        writable.add(idx);
        const node = nodeByIdx.get(idx);
        if (!node) {
            continue;
        }
        // what is made from it later is written to as it is
        node.readerWritable = true;
        // a write reaches its descendants, and what they reference
        referencesIn(node, queue);
        for (const under of componentsUnder(node)) {
            if (typeof under.componentIdx === "number") {
                queue.push(under.componentIdx);
            }
        }
    }
    return writable;
}

/**
 * Add the component `componentIdx`, being made from `serializedComponent`,
 * to `writable` (`Core.readerWritable`) when it is made from what a reader
 * can write to: a serialized component {@link buildReaderWritableIndex}
 * marked, or a copy of one with new indices (an iteration of a repeat), or
 * one serialized from a component in `writable` (`originalIdx`).
 */
export function noteReaderWritable(
    serializedComponent: any,
    componentIdx: number,
    writable: Set<number>,
) {
    if (
        serializedComponent.readerWritable ||
        (typeof serializedComponent.originalIdx === "number" &&
            writable.has(serializedComponent.originalIdx))
    ) {
        writable.add(componentIdx);
    }
}
