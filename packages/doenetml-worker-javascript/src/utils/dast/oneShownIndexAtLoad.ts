/**
 * A `<conditionalContent>` and a `<select>` written to pick one are not
 * collections (D72, COLL-1, COLL-3): each stands for what it shows, so an
 * index after one reaches into what its case or pick holds, as after a
 * `<group>` of one. `$cc[2]` of a case holding `<math>(1,2)</math>` is `2`,
 * and `$cc[1]` never names the case itself.
 *
 * The resolver passes an index after one to what it shows once it has
 * expanded (`branch_kind` in Rust's `resolve`). Before that, as the document
 * loads, it stops at the container with the index left unresolved, and the
 * load-time checks read what is left as a path from the container, where an
 * index selected the case or the pick (`$cc[1]`, `$s[1][2]`). So that they
 * read the index as the resolver will, an index right after one is read
 * here as one after its shown case or pick: `[k]` as `[1][k]`. The `[1]`
 * added is marked `shown`, has no position, and is never quoted: what is
 * reported quotes the reference as written (`originalPath`).
 *
 * Which `<select>` picks one is read as the resolver reads it
 * (`branch_container_kind`): `numToSelect` left out or written as `1`, not
 * on a copy, which picks as many as the one it copies.
 *
 * Runs after sugar and before the type checks at load. The function it
 * returns puts each path back as the resolver left it, once those checks
 * have run, so that what runs with the document resolves the reference as
 * it was written.
 */
import type { SerializedComponent } from "./types";
import { unwrapSource } from "./convertNormalizedDast";

/** The index added before an index after a one-shown-thing. */
export const SHOWN_INDEX = { value: ["1"], shown: true };

/** Whether `index`, an index of a path, is {@link SHOWN_INDEX}. */
export function isShownIndex(index: any): boolean {
    return index?.shown === true;
}

/**
 * Whether the component `node` (or the one a `_copy` makes) is a
 * `<conditionalContent>` or a `<select>` that picks one, as the resolver
 * reads it.
 */
function showsOne(node: SerializedComponent): boolean {
    const createdType =
        node.componentType === "_copy"
            ? (node.attributes?._createComponentOfType as any)?.primitive?.value
            : undefined;
    const type = createdType ?? node.componentType;
    if (type === "conditionalContent") {
        return true;
    }
    if (type !== "select") {
        return false;
    }
    if (node.componentType === "_copy" || node.extending) {
        return false;
    }
    return node.doenetAttributes?.onePick === true;
}

/**
 * Read an index right after a `<conditionalContent>` or a one-pick
 * `<select>`, in each reference of `serializedComponents`, as one after
 * its shown case or pick (see the file's comment). Returns the function
 * that puts each path back.
 */
export function readIndexIntoWhatIsShownAtLoad(
    serializedComponents: (SerializedComponent | string)[],
): () => void {
    const byIdx = new Map<number, SerializedComponent>();
    const references: SerializedComponent[] = [];

    function collect(components: (SerializedComponent | string)[]) {
        for (const component of components) {
            if (typeof component !== "object" || component === null) {
                continue;
            }
            byIdx.set(component.componentIdx, component);
            const created = (component.attributes?._createComponentIdx as any)
                ?.primitive?.value;
            if (typeof created === "number" && !byIdx.has(created)) {
                byIdx.set(created, component);
            }
            if (component.extending) {
                references.push(component);
                for (const part of unwrapSource(component.extending as any)
                    ?.originalPath ?? []) {
                    for (const index of part.index ?? []) {
                        collect(index.value ?? []);
                    }
                }
            }
            for (const attribute of Object.values(component.attributes ?? {})) {
                const attr: any = attribute;
                if (attr.type === "component" && attr.component) {
                    collect([attr.component]);
                } else if (Array.isArray(attr.children)) {
                    collect(attr.children);
                }
            }
            collect(component.children ?? []);
        }
    }
    collect(serializedComponents);

    const restore: (() => void)[] = [];
    for (const reference of references) {
        const ref: any = unwrapSource(reference.extending as any);
        if (!ref || ref.nodeIdx < 0) {
            continue;
        }
        const [first, ...rest] = ref.unresolvedPath ?? [];
        if (
            first?.name !== "" ||
            !(first.index?.length > 0) ||
            isShownIndex(first.index[0])
        ) {
            continue;
        }
        const target = byIdx.get(ref.nodeIdx);
        if (!target || !showsOne(target)) {
            continue;
        }
        const unresolvedPath = ref.unresolvedPath;
        ref.unresolvedPath = [
            { ...first, index: [SHOWN_INDEX, ...first.index] },
            ...rest,
        ];
        restore.push(() => {
            ref.unresolvedPath = unresolvedPath;
        });
    }
    return () => {
        for (const undo of restore) {
            undo();
        }
    };
}
